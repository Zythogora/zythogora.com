"server only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { config } from "@/lib/config";

const s3 = new S3Client({
  forcePathStyle: true,
  region: config.s3.region,
  endpoint: `${config.supabase.storageUrl}/s3`,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
});

interface UploadFileOptions {
  bucketName: string;
  fileName: string;
  fileBody: Blob | Buffer | string;
  contentType: string;
}

export const uploadFile = async ({
  bucketName,
  fileName,
  fileBody,
  contentType,
}: UploadFileOptions) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBody,
      ContentType: contentType,
    }),
  );
};
