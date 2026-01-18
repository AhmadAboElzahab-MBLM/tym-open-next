import fs from 'fs';
import path from 'path';

const lang = process.env.NEXT_PUBLIC_LANG || 'no-lang';
const workerName = `tym-open-next-${lang}`;
const bucketName = `tym-open-next-cache-${lang}`;
const customDomain = process.env.CUSTOM_DOMAIN || '';

console.log(`Using NEXT_PUBLIC_LANG: ${lang}`);

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

  // Add migrations for the Durable Object
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
  vars: customDomain ? { OPEN_NEXT_ORIGIN: customDomain } : {},
};

fs.writeFileSync(
  path.join(process.cwd(), 'wrangler.jsonc'),
  JSON.stringify(wranglerConfig, null, 2),
);
console.log(`worker created: ${workerName}`);
