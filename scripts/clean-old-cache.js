import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const { CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, NEXT_PUBLIC_LANG } =
  process.env;

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const BUCKET = `tym-open-next-cache-${NEXT_PUBLIC_LANG || 'no-lang'}`;
const KEEP_BUILDS = 2;

async function cleanOldCache() {
  console.log(`Cleaning old cache from: ${BUCKET}`);

  const prefixes = new Set();
  let token;

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

  console.log(`Found ${sorted.length} builds, keeping ${KEEP_BUILDS}, deleting ${toDelete.length}`);

  for (const prefix of toDelete) {
    await deletePrefix(prefix);
  }

  console.log('Cleanup complete!');
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

  console.log(`Deleted ${prefix}: ${deleted} files`);
}

cleanOldCache().catch((e) => {
  console.error(e);
  process.exit(1);
});
