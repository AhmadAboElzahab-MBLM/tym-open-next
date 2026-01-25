import fs from 'fs';
import path from 'path';

const lang = process.env.NEXT_PUBLIC_LANG || 'no-lang';

// Use WORKER_NAME and BUCKET_NAME from env if provided (for production/staging deploys)
// Otherwise fall back to default naming convention
const workerName = process.env.WORKER_NAME || `tym-open-next-${lang}`;
const bucketName = process.env.BUCKET_NAME || `tym-open-next-cache-${lang}`;
const customDomain = process.env.CUSTOM_DOMAIN || '';

// Generate unique build ID
const buildId = Date.now().toString();
const cachePrefix = `cache-${buildId}`;

console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`🔧 Wrangler Config Generator`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`   NEXT_PUBLIC_LANG: ${lang}`);
console.log(`   WORKER_NAME:      ${workerName}`);
console.log(`   BUCKET_NAME:      ${bucketName}`);
console.log(`   Cache Prefix:     ${cachePrefix}`);
if (customDomain) {
  console.log(`   Custom Domain:    ${customDomain}`);
}
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

const wranglerConfig = {
  $schema: 'node_modules/wrangler/config-schema.json',
  name: workerName,
  main: '.open-next/worker.js',
  compatibility_date: '2025-12-01',
  compatibility_flags: ['nodejs_compat', 'global_fetch_strictly_public'],
  r2_buckets: [{ bucket_name: bucketName, binding: 'NEXT_INC_CACHE_R2_BUCKET' }],

  // Add Durable Objects for tag cache
  durable_objects: {
    bindings: [{ name: 'NEXT_TAG_CACHE_DO_SHARDED', class_name: 'DOShardedTagCache' }],
  },
  migrations: [
    {
      tag: 'v1',
      new_sqlite_classes: ['DOShardedTagCache'],
    },
  ],
  assets: { binding: 'ASSETS', directory: '.open-next/assets' },
  images: { binding: 'IMAGES' },
  services: [{ binding: 'WORKER_SELF_REFERENCE', service: workerName }],
  observability: { enabled: true },
  vars: {
    ...(customDomain ? { OPEN_NEXT_ORIGIN: customDomain } : {}),
    NEXT_INC_CACHE_R2_PREFIX: cachePrefix,
  },
};

fs.writeFileSync(
  path.join(process.cwd(), 'wrangler.jsonc'),
  JSON.stringify(wranglerConfig, null, 2),
);

console.log(`✅ wrangler.jsonc created for: ${workerName}\n`);
