import { sleep } from "workflow";

/**
 * Durable workflow that deletes a flagged image from the flagged-images bucket
 * after 40 days (30-day log retention + 10-day buffer).
 *
 * The workflow suspends at sleep() — consuming zero resources — and resumes
 * automatically when the timer fires.
 */
export async function deleteFlaggedImageAfter40Days(
  fileName: string,
): Promise<void> {
  "use workflow";
  await sleep("40d");
  await deleteFlaggedImage(fileName);
}

async function deleteFlaggedImage(fileName: string): Promise<void> {
  "use step";
  const { DeleteObjectCommand, S3Client } = await import(
    "@aws-sdk/client-s3"
  );

  const s3 = new S3Client({
    forcePathStyle: true,
    region: process.env.S3_REGION,
    endpoint: `${process.env.SUPABASE_STORAGE_URL}/s3`,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? "",
      secretAccessKey: process.env.S3_SECRET_KEY ?? "",
    },
  });

  await s3.send(
    new DeleteObjectCommand({ Bucket: "flagged-images", Key: fileName }),
  );
}
