import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  BUCKET_NAME, // Use BUCKET_NAME env var instead of constructing it
} = process.env;

// Fallback for local development
const BUCKET = BUCKET_NAME || `tym-open-next-cache-${process.env.NEXT_PUBLIC_LANG || 'no-lang'}`;

if (!CLOUDFLARE_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  process.exit(1);
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const KEEP_BUILDS = 2;

async function cleanOldCache() {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🧹 Cleaning old cache from: ${BUCKET}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const prefixes = new Set();
  let token;

  // Collect all cache prefixes
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const obj of res.Contents || []) {
      const match = obj.Key.match(/^(cache-\d+)/);
      if (match) prefixes.add(match[1]);
    }
    token = res.NextContinuationToken;
  } while (token);

  const sorted = Array.from(prefixes).sort().reverse();
  const toDelete = sorted.slice(KEEP_BUILDS);

  console.log(`   Found: ${sorted.length} builds`);
  console.log(`   Keeping: ${KEEP_BUILDS} most recent`);
  console.log(`   Deleting: ${toDelete.length} old builds\n`);

  if (toDelete.length === 0) {
    console.log('   ✅ No old cache to clean\n');
    return;
  }

  for (const prefix of toDelete) {
    await deletePrefix(prefix);
  }

  console.log(`\n✅ Cleanup complete!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

async function deletePrefix(prefix) {
  let token,
    deleted = 0;

  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: token }),
    );
    const objects = (res.Contents || []).map((o) => ({ Key: o.Key }));

    if (objects.length) {
      await client.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: objects } }));
      deleted += objects.length;
    }
    token = res.NextContinuationToken;
  } while (token);

  console.log(`   🗑️  Deleted ${prefix}: ${deleted} files`);
}

cleanOldCache().catch((e) => {
  console.error('\n❌ Error during cleanup:', e.message);
  process.exit(1);
});
