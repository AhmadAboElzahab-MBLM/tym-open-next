#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import os from 'os';

// ============================================
// LOAD CONFIG
// ============================================

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) {
    console.error(`\n❌ Config file not found: ${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key) env[key.trim()] = values.join('=').trim();
    }
  });
  return env;
}

const ENV = loadEnvFile(path.join(process.cwd(), '.env.setup'));

const CONFIG = {
  CLOUDFLARE_ACCOUNT_ID: ENV.CLOUDFLARE_ACCOUNT_ID || '',
  R2_ACCESS_KEY_ID: ENV.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: ENV.R2_SECRET_ACCESS_KEY || '',
};

const R2_ENDPOINT = `https://${CONFIG.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// ============================================
// GET OAUTH TOKEN FROM WRANGLER
// ============================================

function getOAuthToken() {
  const configPath = path.join(
    os.homedir(),
    'Library',
    'Preferences',
    '.wrangler',
    'config',
    'default.toml',
  );

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf-8');
    const match = content.match(/oauth_token\s*=\s*"([^"]+)"/);
    if (match) return match[1];
  }
  return null;
}

// ============================================
// HELPERS
// ============================================

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  BLUE = '\x1b[34m',
  NC = '\x1b[0m';

async function cfApi(method, endpoint, token, body = null) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
  });
  return res.json();
}

const runOutput = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
  } catch {
    return '';
  }
};

// ============================================
// SETUP R2
// ============================================

function setupR2() {
  const awsDir = path.join(os.homedir(), '.aws');
  if (!fs.existsSync(awsDir)) fs.mkdirSync(awsDir, { recursive: true });
  fs.writeFileSync(
    path.join(awsDir, 'credentials'),
    `[r2]\naws_access_key_id = ${CONFIG.R2_ACCESS_KEY_ID}\naws_secret_access_key = ${CONFIG.R2_SECRET_ACCESS_KEY}\n`,
  );
  fs.writeFileSync(path.join(awsDir, 'config'), `[profile r2]\nregion = auto\noutput = json\n`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log(`
${RED}╔════════════════════════════════════════════════════════════════╗
║                    ⚠️  DANGER ZONE ⚠️                            ║
║  This will DELETE all Workers, Pages, and R2 buckets!          ║
╚════════════════════════════════════════════════════════════════╝${NC}
`);

  // Get OAuth token
  const token = getOAuthToken();
  if (!token) {
    console.log(`${RED}❌ OAuth token not found. Run 'npx wrangler login' first.${NC}`);
    process.exit(1);
  }
  console.log(`${GREEN}✓ OAuth token found${NC}\n`);

  // Setup R2
  setupR2();
  console.log(`${GREEN}✓ R2 profile configured${NC}\n`);

  // Fetch Workers
  console.log(`${YELLOW}Workers:${NC}`);
  const workersRes = await cfApi(
    'GET',
    `/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}/workers/scripts`,
    token,
  );
  const workers = workersRes.success ? workersRes.result.map((w) => w.id) : [];
  workers.forEach((w) => console.log(`  - ${w}`));
  if (!workers.length) console.log('  (none)');

  // Fetch Pages
  console.log(`\n${YELLOW}Pages Projects:${NC}`);
  const pagesRes = await cfApi(
    'GET',
    `/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
    token,
  );
  const pages = pagesRes.success ? pagesRes.result.map((p) => p.name) : [];
  pages.forEach((p) => console.log(`  - ${p}`));
  if (!pages.length) console.log('  (none)');

  // Fetch R2 Buckets
  console.log(`\n${YELLOW}R2 Buckets:${NC}`);
  const r2Res = await cfApi('GET', `/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}/r2/buckets`, token);
  const buckets =
    r2Res.success && r2Res.result?.buckets ? r2Res.result.buckets.map((b) => b.name) : [];
  buckets.forEach((b) => console.log(`  - ${b}`));
  if (!buckets.length) console.log('  (none)');

  // Summary
  const total = workers.length + pages.length + buckets.length;
  console.log(`\n${YELLOW}Total: ${total} resources${NC}\n`);

  if (total === 0) {
    console.log(`${GREEN}Nothing to delete.${NC}`);
    rl.close();
    return;
  }

  // Confirm
  const confirm = await ask(`${RED}Type 'DELETE EVERYTHING' to confirm: ${NC}`);
  if (confirm !== 'DELETE EVERYTHING') {
    console.log(`\n${GREEN}Aborted.${NC}`);
    rl.close();
    return;
  }

  console.log(`\n${RED}Deleting in 3 seconds...${NC}`);
  await new Promise((r) => setTimeout(r, 3000));

  // Delete R2 Buckets
  for (const name of buckets) {
    console.log(`\n${YELLOW}R2: ${name}${NC}`);
    process.stdout.write('  Emptying... ');
    try {
      execSync(`aws s3 rm s3://${name} --recursive --endpoint-url ${R2_ENDPOINT} --profile r2`, {
        stdio: 'pipe',
      });
      console.log(`${GREEN}✓${NC}`);
    } catch {
      console.log(`${YELLOW}(empty)${NC}`);
    }

    process.stdout.write('  Deleting... ');
    const del = await cfApi(
      'DELETE',
      `/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${name}`,
      token,
    );
    console.log(del.success ? `${GREEN}✓${NC}` : `${RED}✗${NC}`);
  }

  // Delete Workers
  for (const name of workers) {
    process.stdout.write(`${YELLOW}Worker: ${name}${NC} ... `);
    const del = await cfApi(
      'DELETE',
      `/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${name}`,
      token,
    );
    console.log(del.success ? `${GREEN}✓${NC}` : `${RED}✗${NC}`);
  }

  // Delete Pages
  for (const name of pages) {
    process.stdout.write(`${YELLOW}Pages: ${name}${NC} ... `);
    const del = await cfApi(
      'DELETE',
      `/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${name}`,
      token,
    );
    console.log(del.success ? `${GREEN}✓${NC}` : `${RED}✗${NC}`);
  }

  console.log(`\n${GREEN}✅ Cleanup complete!${NC}\n`);
  rl.close();
}

main().catch((e) => {
  console.error(`${RED}Error: ${e.message}${NC}`);
  process.exit(1);
});
