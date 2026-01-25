#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/* ======================================================
   LOAD CONFIG FROM .env.setup
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
const CLOUDFLARE_API_TOKEN = ENV.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = ENV.CLOUDFLARE_ACCOUNT_ID;

if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
  console.error('❌ Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID in .env.setup');
  process.exit(1);
}

const ENVIRONMENTS = [
  { name: 'production', prefix: 'production-tym' },
  { name: 'staging', prefix: 'staging-tym' },
];

/* ======================================================
   CREATE R2 BUCKETS
====================================================== */

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦  Creating R2 Buckets
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Languages: ${LANGUAGES.join(', ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Get existing buckets
let existingBuckets = [];
try {
  const result = execSync('npx wrangler r2 bucket list', {
    encoding: 'utf8',
    stdio: 'pipe',
    env: {
      ...process.env,
      CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ACCOUNT_ID,
    },
  });
  existingBuckets = result.split('\n');
} catch (e) {
  console.log('⚠️  Could not list existing buckets, will try to create all\n');
}

// Create buckets for each environment
for (const env of ENVIRONMENTS) {
  console.log(`\n${env.name.toUpperCase()}:`);
  console.log('─'.repeat(60));

  for (const lang of LANGUAGES) {
    const bucketName = `${env.prefix}-cache-${lang}`;

    // Check if bucket exists
    if (existingBuckets.some((line) => line.includes(bucketName))) {
      console.log(`   ✅ ${bucketName.padEnd(35)} (already exists)`);
      continue;
    }

    // Create bucket
    try {
      execSync(`npx wrangler r2 bucket create ${bucketName}`, {
        stdio: 'pipe',
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN,
          CLOUDFLARE_ACCOUNT_ID,
        },
      });
      console.log(`   ✅ ${bucketName.padEnd(35)} (created)`);
    } catch (e) {
      console.log(`   ❌ ${bucketName.padEnd(35)} (failed)`);
    }
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  R2 Bucket Creation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total buckets: ${LANGUAGES.length * ENVIRONMENTS.length}

Production buckets:
${LANGUAGES.map((lang) => `  • production-tym-cache-${lang}`).join('\n')}

Staging buckets:
${LANGUAGES.map((lang) => `  • staging-tym-cache-${lang}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
