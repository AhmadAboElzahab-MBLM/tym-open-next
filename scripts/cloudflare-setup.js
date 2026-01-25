#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

/* ======================================================
   ENV LOADER (.env.setup)
====================================================== */

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing ${filePath}`);
    process.exit(1);
  }

  const env = {};
  fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const l = line.trim();
      if (!l || l.startsWith('#')) return;
      const [k, ...v] = l.split('=');
      env[k.trim()] = v.join('=').trim();
    });

  return env;
}

const ENV_FILE = path.join(process.cwd(), '.env.setup');
const ENV = loadEnvFile(ENV_FILE);

/* ======================================================
   CONFIG
====================================================== */

const LANGUAGES = ENV.LANGUAGES?.split(',').map((l) => l.trim()) || ['en'];

const ENVIRONMENTS = {
  production: {
    prefix: 'production-tym',
    branch: 'main',
    umbracoBaseUrl: ENV.PRODUCTION_UMBRACO_BASE_IMAGE_URL,
    umbracoEndpoint: ENV.PRODUCTION_UMBRACO_ENDPOINT,
  },
  staging: {
    prefix: 'staging-tym',
    branch: 'staging',
    umbracoBaseUrl: ENV.STAGING_UMBRACO_BASE_IMAGE_URL,
    umbracoEndpoint: ENV.STAGING_UMBRACO_ENDPOINT,
  },
};

const SHARED_SECRETS = {
  NEXT_PUBLIC_HUBSPOT_API_KEY: ENV.NEXT_PUBLIC_HUBSPOT_API_KEY,
  HUBSPOT_TOKEN: ENV.HUBSPOT_TOKEN,
  NEXT_PUBLIC_UMBRACO_API_KEY: ENV.NEXT_PUBLIC_UMBRACO_API_KEY,
};

let CONFIG = {
  CLOUDFLARE_ACCOUNT_ID: ENV.CLOUDFLARE_ACCOUNT_ID || '',
  CLOUDFLARE_API_TOKEN: ENV.CLOUDFLARE_API_TOKEN || '',
  R2_ACCESS_KEY_ID: ENV.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: ENV.R2_SECRET_ACCESS_KEY || '',
};

/* ======================================================
   HELPERS
====================================================== */

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

const run = (cmd, silent = false) => {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
      env: { ...process.env, ...CONFIG },
    });
  } catch {
    return null;
  }
};

const runSilent = (cmd) => run(cmd, true);

function saveEnv() {
  let content = fs.readFileSync(ENV_FILE, 'utf8');

  Object.entries(CONFIG).forEach(([k, v]) => {
    if (content.match(new RegExp(`^${k}=`, 'm'))) {
      content = content.replace(new RegExp(`^${k}=.*$`, 'm'), `${k}=${v}`);
    } else {
      content += `\n${k}=${v}`;
    }
  });

  fs.writeFileSync(ENV_FILE, content);
  console.log('   📄 Credentials saved to .env.setup\n');
}

function printBanner() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀  TYM OpenNext - Cloudflare Workers Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁  Config:     .env.setup
🌐  Languages:  ${LANGUAGES.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

/* ======================================================
   SETUP STEPS
====================================================== */

async function ensureWranglerAuth() {
  console.log('[1/5] 🔐 Checking Wrangler authentication...\n');

  const whoami = runSilent('npx wrangler whoami');
  if (!whoami || whoami.includes('Not authenticated')) {
    console.log('   Logging in to Cloudflare...\n');
    run('npx wrangler login');
  }
  console.log('   ✅ Authenticated\n');
}

async function ensureCredentials() {
  console.log('[2/5] 🔑 Cloudflare Credentials\n');

  if (!CONFIG.CLOUDFLARE_ACCOUNT_ID) {
    console.log('   📌 https://dash.cloudflare.com → Account ID in sidebar\n');
    CONFIG.CLOUDFLARE_ACCOUNT_ID = await ask('   CLOUDFLARE_ACCOUNT_ID: ');
  } else {
    console.log(`   ✅ CLOUDFLARE_ACCOUNT_ID: ${CONFIG.CLOUDFLARE_ACCOUNT_ID.slice(0, 10)}...`);
  }

  if (!CONFIG.CLOUDFLARE_API_TOKEN) {
    console.log('\n   📌 https://dash.cloudflare.com/profile/api-tokens');
    console.log('      → Create Custom Token');
    console.log('      → Workers Scripts: Edit');
    console.log('      → Workers R2 Storage: Edit\n');
    CONFIG.CLOUDFLARE_API_TOKEN = await ask('   CLOUDFLARE_API_TOKEN: ');
  } else {
    console.log(`   ✅ CLOUDFLARE_API_TOKEN: ${CONFIG.CLOUDFLARE_API_TOKEN.slice(0, 10)}...`);
  }

  if (!CONFIG.R2_ACCESS_KEY_ID) {
    console.log('\n   📌 https://dash.cloudflare.com → R2 → Manage R2 API Tokens\n');
    CONFIG.R2_ACCESS_KEY_ID = await ask('   R2_ACCESS_KEY_ID: ');
  } else {
    console.log(`   ✅ R2_ACCESS_KEY_ID: ${CONFIG.R2_ACCESS_KEY_ID.slice(0, 10)}...`);
  }

  if (!CONFIG.R2_SECRET_ACCESS_KEY) {
    CONFIG.R2_SECRET_ACCESS_KEY = await ask('   R2_SECRET_ACCESS_KEY: ');
  } else {
    console.log(`   ✅ R2_SECRET_ACCESS_KEY: ********`);
  }

  console.log('');
  saveEnv();
}

function createR2Buckets(env) {
  const { prefix } = ENVIRONMENTS[env];
  console.log(`[3/5] 📦 Creating R2 Buckets (${env.toUpperCase()})\n`);

  const existing = runSilent('npx wrangler r2 bucket list') || '';

  for (const lang of LANGUAGES) {
    const bucket = `${prefix}-cache-${lang}`;
    if (existing.includes(bucket)) {
      console.log(`   ✅ ${bucket} (exists)`);
    } else {
      const result = runSilent(`npx wrangler r2 bucket create ${bucket}`);
      console.log(result !== null ? `   ✅ ${bucket} (created)` : `   ❌ ${bucket} (failed)`);
    }
  }
  console.log('');
}

function buildAndDeploy(env) {
  const { prefix, umbracoBaseUrl, umbracoEndpoint } = ENVIRONMENTS[env];
  console.log(`[4/5] 🚀 Building & Deploying Workers (${env.toUpperCase()})\n`);

  for (const lang of LANGUAGES) {
    const workerName = `${prefix}-${lang}`;
    const bucketName = `${prefix}-cache-${lang}`;

    console.log(`\n   📦 ${workerName}`);
    console.log(`   ├─ Building...`);

    // Set env vars for build
    const buildEnv = {
      ...process.env,
      ...CONFIG,
      NEXT_PUBLIC_LANG: lang,
      NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL: umbracoBaseUrl,
      NEXT_PUBLIC_UMBRACO_ENDPOINT: umbracoEndpoint,
      WORKER_NAME: workerName,
      BUCKET_NAME: bucketName,
    };

    try {
      execSync('npm run build', { stdio: 'inherit', env: buildEnv });
      console.log(`   ├─ Deploying...`);
      execSync(`npx wrangler deploy --name ${workerName}`, { stdio: 'inherit', env: buildEnv });
      console.log(`   └─ ✅ Done`);
    } catch (e) {
      console.log(`   └─ ❌ Failed: ${e.message}`);
    }
  }
  console.log('');
}

function setWorkerSecrets(env) {
  const { prefix } = ENVIRONMENTS[env];
  console.log(`[5/5] 🔐 Setting Worker Secrets (${env.toUpperCase()})\n`);

  const secrets = {
    R2_ACCESS_KEY_ID: CONFIG.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: CONFIG.R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_ACCOUNT_ID: CONFIG.CLOUDFLARE_ACCOUNT_ID,
    ...SHARED_SECRETS,
  };

  for (const lang of LANGUAGES) {
    const workerName = `${prefix}-${lang}`;
    console.log(`   ${workerName}:`);

    for (const [key, value] of Object.entries(secrets)) {
      if (!value) continue;

      try {
        execSync(`echo "${value}" | npx wrangler secret put ${key} --name ${workerName}`, {
          stdio: 'pipe',
          env: { ...process.env, CLOUDFLARE_API_TOKEN: CONFIG.CLOUDFLARE_API_TOKEN },
        });
        console.log(`   ├─ ✅ ${key}`);
      } catch {
        console.log(`   ├─ ⚠️  ${key} (may already exist)`);
      }
    }
    console.log(`   └─ Done\n`);
  }
}

function printSummary(env) {
  const { prefix, branch, umbracoBaseUrl } = ENVIRONMENTS[env];

  console.log('━'.repeat(60));
  console.log(`\n✅ ${env.toUpperCase()} Setup Complete!\n`);

  console.log('📦 R2 Buckets:');
  LANGUAGES.forEach((l) => console.log(`   • ${prefix}-cache-${l}`));

  console.log('\n⚙️  Workers:');
  LANGUAGES.forEach((l) => console.log(`   • https://${prefix}-${l}.workers.dev`));

  console.log(`\n🔗 Umbraco: ${umbracoBaseUrl}`);
  console.log(`🌿 Branch: ${branch}`);

  console.log('\n━'.repeat(60));
}

/* ======================================================
   CLOUDFLARE "CONNECT TO GIT" GUIDE
====================================================== */

function printCloudflareConnectionGuide(env) {
  const { prefix, branch, umbracoBaseUrl, umbracoEndpoint } = ENVIRONMENTS[env];

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌  CLOUDFLARE "CONNECT TO GIT" SETUP (${env.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each worker below, go to:

   Cloudflare Dashboard → Workers & Pages → [Worker Name]
   → Settings → Build → Connect to Git

Git Settings (same for all):
   ┌─────────────────────────────────────────────────────────────────────────────
   │ Repository:      AhmadAboElzahab-MBLM/tym-open-next
   │ Branch:          ${branch}
   │ Build command:   npm run build
   │ Deploy command:  npx wrangler deploy
   └─────────────────────────────────────────────────────────────────────────────
`);

  console.log('━'.repeat(80));
  console.log('\n🔐 SHARED ENVIRONMENT VARIABLES (copy to EACH worker)\n');
  console.log('   ┌─────────────────────────────────────────────────────────────────────────────');
  console.log(
    `   │ NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL = ${umbracoBaseUrl || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ NEXT_PUBLIC_UMBRACO_ENDPOINT       = ${umbracoEndpoint || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ NEXT_PUBLIC_HUBSPOT_API_KEY        = ${SHARED_SECRETS.NEXT_PUBLIC_HUBSPOT_API_KEY || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ HUBSPOT_TOKEN                      = ${SHARED_SECRETS.HUBSPOT_TOKEN || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ NEXT_PUBLIC_UMBRACO_API_KEY        = ${SHARED_SECRETS.NEXT_PUBLIC_UMBRACO_API_KEY || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ R2_ACCESS_KEY_ID                   = ${CONFIG.R2_ACCESS_KEY_ID || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ R2_SECRET_ACCESS_KEY               = ${CONFIG.R2_SECRET_ACCESS_KEY ? '********' : '[SET_IN_.env.setup]'}`,
  );
  console.log(
    `   │ CLOUDFLARE_ACCOUNT_ID              = ${CONFIG.CLOUDFLARE_ACCOUNT_ID || '[SET_IN_.env.setup]'}`,
  );
  console.log(
    '   └─────────────────────────────────────────────────────────────────────────────\n',
  );

  console.log('━'.repeat(80));
  console.log('\n🌐 LANGUAGE-SPECIFIC ENVIRONMENT VARIABLES\n');
  console.log('   Each worker needs these UNIQUE values:\n');

  for (const lang of LANGUAGES) {
    const workerName = `${prefix}-${lang}`;
    const bucketName = `${prefix}-cache-${lang}`;

    console.log(`   ╔${'═'.repeat(76)}╗`);
    console.log(`   ║  WORKER: ${workerName}${' '.repeat(Math.max(0, 65 - workerName.length))}║`);
    console.log(`   ╠${'═'.repeat(76)}╣`);
    console.log(
      `   ║                                                                            ║`,
    );
    console.log(`   ║  NEXT_PUBLIC_LANG = ${lang}${' '.repeat(Math.max(0, 54 - lang.length))}║`);
    console.log(
      `   ║  WORKER_NAME      = ${workerName}${' '.repeat(Math.max(0, 54 - workerName.length))}║`,
    );
    console.log(
      `   ║  BUCKET_NAME      = ${bucketName}${' '.repeat(Math.max(0, 54 - bucketName.length))}║`,
    );
    console.log(
      `   ║                                                                            ║`,
    );
    console.log(
      `   ║  🔗 Dashboard: dash.cloudflare.com → Workers → ${workerName}${' '.repeat(Math.max(0, 25 - workerName.length))}║`,
    );
    console.log(`   ╚${'═'.repeat(76)}╝\n`);
  }

  console.log('━'.repeat(80));
}

function printCopyPasteEnvVars(env) {
  const { prefix, umbracoBaseUrl, umbracoEndpoint } = ENVIRONMENTS[env];

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  COPY-PASTE READY ENV VARS (${env.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  for (const lang of LANGUAGES) {
    const workerName = `${prefix}-${lang}`;
    const bucketName = `${prefix}-cache-${lang}`;

    console.log(`\n┌─── ${workerName} ───────────────────────────────────────────────────────────`);
    console.log(`│`);
    console.log(`│  # Copy all lines below into Cloudflare Dashboard:`);
    console.log(`│  # Workers & Pages → ${workerName} → Settings → Variables`);
    console.log(`│`);
    console.log(`│  NEXT_PUBLIC_LANG=${lang}`);
    console.log(`│  WORKER_NAME=${workerName}`);
    console.log(`│  BUCKET_NAME=${bucketName}`);
    console.log(
      `│  NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL=${umbracoBaseUrl || 'YOUR_UMBRACO_BASE_URL'}`,
    );
    console.log(`│  NEXT_PUBLIC_UMBRACO_ENDPOINT=${umbracoEndpoint || 'YOUR_UMBRACO_ENDPOINT'}`);
    console.log(
      `│  NEXT_PUBLIC_HUBSPOT_API_KEY=${SHARED_SECRETS.NEXT_PUBLIC_HUBSPOT_API_KEY || 'YOUR_HUBSPOT_API_KEY'}`,
    );
    console.log(`│  HUBSPOT_TOKEN=${SHARED_SECRETS.HUBSPOT_TOKEN || 'YOUR_HUBSPOT_TOKEN'}`);
    console.log(
      `│  NEXT_PUBLIC_UMBRACO_API_KEY=${SHARED_SECRETS.NEXT_PUBLIC_UMBRACO_API_KEY || 'YOUR_UMBRACO_API_KEY'}`,
    );
    console.log(`│  R2_ACCESS_KEY_ID=${CONFIG.R2_ACCESS_KEY_ID || 'YOUR_R2_ACCESS_KEY'}`);
    console.log(`│  R2_SECRET_ACCESS_KEY=${CONFIG.R2_SECRET_ACCESS_KEY || 'YOUR_R2_SECRET'}`);
    console.log(`│  CLOUDFLARE_ACCOUNT_ID=${CONFIG.CLOUDFLARE_ACCOUNT_ID || 'YOUR_ACCOUNT_ID'}`);
    console.log(`│`);
    console.log(`└${'─'.repeat(78)}`);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

function printGitHubActionsInfo() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌  ALTERNATIVE: GitHub Actions Auto-Deploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you prefer GitHub Actions instead of Cloudflare's "Connect to Git":

   Repository → Settings → Secrets → Actions → New secret

   CLOUDFLARE_API_TOKEN   = ${CONFIG.CLOUDFLARE_API_TOKEN?.slice(0, 10) || 'YOUR_TOKEN'}...
   CLOUDFLARE_ACCOUNT_ID  = ${CONFIG.CLOUDFLARE_ACCOUNT_ID?.slice(0, 10) || 'YOUR_ID'}...
   R2_ACCESS_KEY_ID       = ${CONFIG.R2_ACCESS_KEY_ID?.slice(0, 10) || 'YOUR_KEY'}...
   R2_SECRET_ACCESS_KEY   = ********

Then create: .github/workflows/deploy.yml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

async function selectEnvironment() {
  console.log(`Select environment:

  1. production  → production-tym-{lang}.workers.dev
  2. staging     → staging-tym-{lang}.workers.dev
  3. all         → Both environments
`);

  const choice = await ask('Enter choice (1/2/3): ');

  switch (choice.trim()) {
    case '1':
      return ['production'];
    case '2':
      return ['staging'];
    case '3':
      return ['production', 'staging'];
    default:
      console.log('\n❌ Invalid choice.\n');
      process.exit(1);
  }
}

async function selectAction() {
  console.log(`
What would you like to do?

  1. Full Setup     → Create buckets, build, deploy, set secrets
  2. Show Env Vars  → Print env vars for Cloudflare "Connect to Git" setup
  3. Both           → Full setup + print env vars guide
`);

  const choice = await ask('Enter choice (1/2/3): ');

  switch (choice.trim()) {
    case '1':
      return 'setup';
    case '2':
      return 'env-vars';
    case '3':
      return 'both';
    default:
      console.log('\n❌ Invalid choice.\n');
      process.exit(1);
  }
}

/* ======================================================
   MAIN
====================================================== */

async function main() {
  printBanner();

  const action = await selectAction();
  const envs = await selectEnvironment();

  console.log(`\n🎯 Setting up: ${envs.map((e) => e.toUpperCase()).join(' + ')}\n`);
  const ok = await ask('Continue? (y/n): ');

  if (ok.toLowerCase() !== 'y') {
    console.log('\n👋 Cancelled.\n');
    rl.close();
    return;
  }

  console.log('\n');

  if (action === 'setup' || action === 'both') {
    await ensureWranglerAuth();
    await ensureCredentials();

    for (const env of envs) {
      console.log('═'.repeat(60));
      console.log(`   📍 ${env.toUpperCase()}`);
      console.log('═'.repeat(60) + '\n');

      createR2Buckets(env);
      buildAndDeploy(env);
      setWorkerSecrets(env);
      printSummary(env);
    }
  }

  if (action === 'env-vars' || action === 'both') {
    // Still need credentials for env vars output
    if (action === 'env-vars') {
      await ensureCredentials();
    }

    for (const env of envs) {
      printCloudflareConnectionGuide(env);
      printCopyPasteEnvVars(env);
    }
  }

  printGitHubActionsInfo();

  console.log('\n🎉 All done!\n');
  rl.close();
}

main().catch((e) => {
  console.error('\n❌ Error:', e.message);
  rl.close();
  process.exit(1);
});
