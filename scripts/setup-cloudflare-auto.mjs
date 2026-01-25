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
    branch: ENV.PRODUCTION_BRANCH || 'main',
    umbracoBaseUrl: ENV.PRODUCTION_UMBRACO_BASE_IMAGE_URL,
    umbracoEndpoint: ENV.PRODUCTION_UMBRACO_ENDPOINT,
  },
  staging: {
    prefix: 'staging-tym',
    branch: ENV.STAGING_BRANCH || 'staging',
    umbracoBaseUrl: ENV.STAGING_UMBRACO_BASE_IMAGE_URL,
    umbracoEndpoint: ENV.STAGING_UMBRACO_ENDPOINT,
  },
};

const SHARED_ENV_VARS = {
  NEXT_PUBLIC_HUBSPOT_API_KEY: ENV.NEXT_PUBLIC_HUBSPOT_API_KEY,
  HUBSPOT_TOKEN: ENV.HUBSPOT_TOKEN,
  NEXT_PUBLIC_UMBRACO_API_KEY: ENV.NEXT_PUBLIC_UMBRACO_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_HUBSPOT_DEALERS_URL: ENV.NEXT_PUBLIC_HUBSPOT_DEALERS_URL,
  NEXT_PUBLIC_UMBRACO_SEARCH_API: ENV.NEXT_PUBLIC_UMBRACO_SEARCH_API,
};

const CONFIG = {
  CLOUDFLARE_ACCOUNT_ID: ENV.CLOUDFLARE_ACCOUNT_ID || '',
  CLOUDFLARE_API_TOKEN: ENV.CLOUDFLARE_API_TOKEN || '',
  R2_ACCESS_KEY_ID: ENV.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: ENV.R2_SECRET_ACCESS_KEY || '',
};

const GITHUB_OWNER = ENV.GITHUB_OWNER || '';
const GITHUB_REPO = ENV.GITHUB_REPO || '';

/* ======================================================
   HELPERS
====================================================== */

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

const runSilent = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', env: { ...process.env, ...CONFIG } });
  } catch {
    return null;
  }
};

async function cfApi(endpoint, method = 'GET', body = null) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CONFIG.CLOUDFLARE_ACCOUNT_ID}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${CONFIG.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function printBanner() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀  TYM OpenNext - Cloudflare Auto Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁  Config:     .env.setup
🌐  Languages:  ${LANGUAGES.join(', ')}
📦  GitHub:     ${GITHUB_OWNER}/${GITHUB_REPO}

This script will:
  1. Create R2 buckets
  2. Create Workers (as Pages projects for GitHub integration)
  3. Connect to GitHub automatically
  4. Set build environment variables

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

/* ======================================================
   SETUP FUNCTIONS
====================================================== */

async function ensureWranglerAuth() {
  console.log('\n[1/4] 🔐 Checking Wrangler authentication...');

  const whoami = runSilent('npx wrangler whoami');
  if (!whoami || whoami.includes('Not authenticated')) {
    console.log('   Logging in to Cloudflare...\n');
    execSync('npx wrangler login', { stdio: 'inherit' });
  }
  console.log('   ✅ Authenticated\n');
}

async function createR2Buckets(env) {
  const { prefix } = ENVIRONMENTS[env];
  console.log(`\n[2/4] 📦 Creating R2 Buckets (${env.toUpperCase()})...\n`);

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
}

async function createPagesProject(workerName, env, lang) {
  const { branch, umbracoBaseUrl, umbracoEndpoint, prefix } = ENVIRONMENTS[env];
  const bucketName = `${prefix}-cache-${lang}`;

  console.log(`\n   📄 Creating Pages project: ${workerName}`);

  // Check if project exists
  const checkResult = await cfApi(`/pages/projects/${workerName}`);
  
  if (checkResult.ok) {
    console.log(`      ✅ Project exists`);
    return { exists: true, name: workerName };
  }

  // Create new Pages project with GitHub connection
  const projectConfig = {
    name: workerName,
    production_branch: branch,
    build_config: {
      build_command: 'npm run deploy',
      destination_dir: '.open-next',
      root_dir: '',
    },
    source: {
      type: 'github',
      config: {
        owner: GITHUB_OWNER,
        repo_name: GITHUB_REPO,
        production_branch: branch,
        pr_comments_enabled: true,
        deployments_enabled: true,
      },
    },
    deployment_configs: {
      production: {
        env_vars: buildEnvVars(env, lang, bucketName, umbracoBaseUrl, umbracoEndpoint),
      },
      preview: {
        env_vars: buildEnvVars(env, lang, bucketName, umbracoBaseUrl, umbracoEndpoint),
      },
    },
  };

  const createResult = await cfApi('/pages/projects', 'POST', projectConfig);

  if (createResult.ok) {
    console.log(`      ✅ Project created & connected to GitHub`);
    return { exists: false, created: true, name: workerName };
  } else {
    console.log(`      ❌ Failed: ${JSON.stringify(createResult.data?.errors || createResult.error)}`);
    return { exists: false, created: false, error: createResult.data?.errors };
  }
}

function buildEnvVars(env, lang, bucketName, umbracoBaseUrl, umbracoEndpoint) {
  const { prefix } = ENVIRONMENTS[env];
  const workerName = `${prefix}-${lang}`;

  const vars = {
    NEXT_PUBLIC_LANG: { value: lang },
    WORKER_NAME: { value: workerName },
    BUCKET_NAME: { value: bucketName },
    NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL: { value: umbracoBaseUrl || '' },
    NEXT_PUBLIC_UMBRACO_ENDPOINT: { value: umbracoEndpoint || '' },
  };

  // Add shared env vars
  for (const [key, value] of Object.entries(SHARED_ENV_VARS)) {
    if (value) {
      vars[key] = { value };
    }
  }

  // Add secrets (marked as secret type)
  if (CONFIG.R2_ACCESS_KEY_ID) {
    vars.R2_ACCESS_KEY_ID = { value: CONFIG.R2_ACCESS_KEY_ID, type: 'secret_text' };
  }
  if (CONFIG.R2_SECRET_ACCESS_KEY) {
    vars.R2_SECRET_ACCESS_KEY = { value: CONFIG.R2_SECRET_ACCESS_KEY, type: 'secret_text' };
  }
  if (CONFIG.CLOUDFLARE_ACCOUNT_ID) {
    vars.CLOUDFLARE_ACCOUNT_ID = { value: CONFIG.CLOUDFLARE_ACCOUNT_ID };
  }

  return vars;
}

async function updateProjectEnvVars(workerName, env, lang) {
  const { prefix, umbracoBaseUrl, umbracoEndpoint } = ENVIRONMENTS[env];
  const bucketName = `${prefix}-cache-${lang}`;

  console.log(`      🔧 Updating environment variables...`);

  const envVars = buildEnvVars(env, lang, bucketName, umbracoBaseUrl, umbracoEndpoint);

  const updateResult = await cfApi(`/pages/projects/${workerName}`, 'PATCH', {
    deployment_configs: {
      production: { env_vars: envVars },
      preview: { env_vars: envVars },
    },
  });

  if (updateResult.ok) {
    console.log(`      ✅ Environment variables set`);
  } else {
    console.log(`      ⚠️  Could not update env vars: ${JSON.stringify(updateResult.data?.errors || updateResult.error)}`);
  }
}

async function setupWorkersAsPages(env) {
  const { prefix, branch } = ENVIRONMENTS[env];
  console.log(`\n[3/4] 🚀 Creating Pages Projects with GitHub (${env.toUpperCase()})...\n`);
  console.log(`   GitHub: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`   Branch: ${branch}\n`);

  const results = [];

  for (const lang of LANGUAGES) {
    const workerName = `${prefix}-${lang}`;
    const result = await createPagesProject(workerName, env, lang);
    
    // If project exists, update env vars
    if (result.exists) {
      await updateProjectEnvVars(workerName, env, lang);
    }
    
    results.push({ lang, workerName, ...result });
  }

  return results;
}

async function printSummary(env, results) {
  const { prefix, branch } = ENVIRONMENTS[env];

  console.log(`\n[4/4] 📋 Summary (${env.toUpperCase()})\n`);
  console.log('━'.repeat(70));

  console.log(`\n   📦 R2 Buckets:`);
  for (const lang of LANGUAGES) {
    console.log(`      • ${prefix}-cache-${lang}`);
  }

  console.log(`\n   🌐 Pages Projects:`);
  for (const r of results) {
    const status = r.created ? '✅ Created' : r.exists ? '✅ Exists' : '❌ Failed';
    console.log(`      • ${r.workerName} - ${status}`);
  }

  console.log(`\n   🔗 GitHub: ${GITHUB_OWNER}/${GITHUB_REPO} (branch: ${branch})`);

  console.log(`\n   🌍 URLs (after first deploy):`);
  for (const lang of LANGUAGES) {
    console.log(`      • https://${prefix}-${lang}.pages.dev`);
  }

  console.log('\n' + '━'.repeat(70));
}

async function selectEnvironment() {
  console.log(`\nSelect environment:\n`);
  console.log(`  1. production  → ${ENVIRONMENTS.production.prefix}-{lang}`);
  console.log(`  2. staging     → ${ENVIRONMENTS.staging.prefix}-{lang}`);
  console.log(`  3. all         → Both environments\n`);

  const choice = await ask('Enter choice (1/2/3): ');

  switch (choice.trim()) {
    case '1': return ['production'];
    case '2': return ['staging'];
    case '3': return ['production', 'staging'];
    default:
      console.log('\n❌ Invalid choice.\n');
      process.exit(1);
  }
}

/* ======================================================
   ALTERNATIVE: Workers with Build Settings (not Pages)
====================================================== */

async function createWorkerWithBuildSettings(workerName, env, lang) {
  const { branch, prefix, umbracoBaseUrl, umbracoEndpoint } = ENVIRONMENTS[env];
  const bucketName = `${prefix}-cache-${lang}`;

  console.log(`\n   ⚙️  Setting up Worker: ${workerName}`);

  // Step 1: Check/Create the worker script (minimal placeholder)
  const scriptCheck = await cfApi(`/workers/services/${workerName}`);
  
  if (!scriptCheck.ok) {
    console.log(`      📝 Worker doesn't exist yet (will be created on first deploy)`);
  } else {
    console.log(`      ✅ Worker exists`);
  }

  // Step 2: Set up build settings with GitHub connection
  console.log(`      🔗 Connecting to GitHub...`);
  
  const buildSettings = {
    build_config: {
      build_command: 'npm run deploy',
      destination_dir: '.open-next',
      root_dir: '',
    },
    source: {
      type: 'github',
      config: {
        owner: GITHUB_OWNER,
        repo_name: GITHUB_REPO,
        production_branch: branch,
      },
    },
  };

  const buildResult = await cfApi(`/workers/services/${workerName}/builds`, 'PUT', buildSettings);

  if (buildResult.ok) {
    console.log(`      ✅ GitHub connected`);
  } else {
    // Try alternative endpoint
    const altResult = await cfApi(`/workers/scripts/${workerName}/builds/config`, 'PUT', buildSettings);
    if (altResult.ok) {
      console.log(`      ✅ GitHub connected`);
    } else {
      console.log(`      ⚠️  GitHub connection may need manual setup`);
      console.log(`         Go to: dash.cloudflare.com → Workers → ${workerName} → Settings → Build`);
    }
  }

  // Step 3: Set environment variables
  console.log(`      🔧 Setting environment variables...`);
  
  const envVars = {
    NEXT_PUBLIC_LANG: lang,
    WORKER_NAME: workerName,
    BUCKET_NAME: bucketName,
    NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL: umbracoBaseUrl || '',
    NEXT_PUBLIC_UMBRACO_ENDPOINT: umbracoEndpoint || '',
    ...Object.fromEntries(
      Object.entries(SHARED_ENV_VARS).filter(([_, v]) => v)
    ),
  };

  // Set vars via settings API
  const varsResult = await cfApi(`/workers/services/${workerName}/environments/production/settings`, 'PATCH', {
    settings: {
      bindings: Object.entries(envVars).map(([name, value]) => ({
        type: 'plain_text',
        name,
        text: value,
      })),
    },
  });

  if (varsResult.ok) {
    console.log(`      ✅ Environment variables set`);
  } else {
    console.log(`      ⚠️  Env vars may need manual setup`);
  }

  // Step 4: Set secrets
  console.log(`      🔐 Setting secrets...`);
  
  const secrets = {
    R2_ACCESS_KEY_ID: CONFIG.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: CONFIG.R2_SECRET_ACCESS_KEY,
  };

  for (const [name, value] of Object.entries(secrets)) {
    if (!value) continue;
    
    try {
      execSync(`echo "${value}" | npx wrangler secret put ${name} --name ${workerName}`, {
        stdio: 'pipe',
        env: { ...process.env, CLOUDFLARE_API_TOKEN: CONFIG.CLOUDFLARE_API_TOKEN },
      });
      console.log(`      ✅ ${name}`);
    } catch {
      console.log(`      ⚠️  ${name} (may already exist or need manual setup)`);
    }
  }

  return { workerName, success: true };
}

async function setupWorkers(env) {
  const { prefix, branch } = ENVIRONMENTS[env];
  console.log(`\n[3/4] 🚀 Setting up Workers with GitHub (${env.toUpperCase()})...\n`);
  console.log(`   GitHub: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`   Branch: ${branch}`);

  const results = [];

  for (const lang of LANGUAGES) {
    const workerName = `${prefix}-${lang}`;
    const result = await createWorkerWithBuildSettings(workerName, env, lang);
    results.push(result);
  }

  return results;
}

/* ======================================================
   MAIN
====================================================== */

async function main() {
  printBanner();

  // Validate config
  if (!CONFIG.CLOUDFLARE_ACCOUNT_ID || !CONFIG.CLOUDFLARE_API_TOKEN) {
    console.log('❌ Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in .env.setup\n');
    process.exit(1);
  }

  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.log('❌ Missing GITHUB_OWNER or GITHUB_REPO in .env.setup\n');
    process.exit(1);
  }

  console.log(`\nSelect setup method:\n`);
  console.log(`  1. Pages Projects  → Full GitHub integration (recommended)`);
  console.log(`  2. Workers         → Traditional workers with build settings\n`);

  const methodChoice = await ask('Enter choice (1/2): ');
  const usePages = methodChoice.trim() === '1';

  const envs = await selectEnvironment();

  console.log(`\n🎯 Setting up: ${envs.map((e) => e.toUpperCase()).join(' + ')}`);
  console.log(`📦 Method: ${usePages ? 'Cloudflare Pages' : 'Cloudflare Workers'}\n`);
  
  const ok = await ask('Continue? (y/n): ');
  if (ok.toLowerCase() !== 'y') {
    console.log('\n👋 Cancelled.\n');
    rl.close();
    return;
  }

  await ensureWranglerAuth();

  for (const env of envs) {
    console.log('\n' + '═'.repeat(70));
    console.log(`   📍 ${env.toUpperCase()}`);
    console.log('═'.repeat(70));

    await createR2Buckets(env);
    
    let results;
    if (usePages) {
      results = await setupWorkersAsPages(env);
    } else {
      results = await setupWorkers(env);
    }
    
    await printSummary(env, results);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  SETUP COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:

  1. Go to Cloudflare Dashboard → Workers & Pages
  2. For each project, verify:
     • GitHub is connected (Settings → Build)
     • Environment variables are set (Settings → Variables)
  3. Push to ${ENVIRONMENTS.production.branch} or ${ENVIRONMENTS.staging.branch} to trigger deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  rl.close();
}

main().catch((e) => {
  console.error('\n❌ Error:', e.message);
  rl.close();
  process.exit(1);
});
