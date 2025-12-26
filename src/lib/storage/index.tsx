"server only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { config } from "@/lib/config";

import type { StorageBuckets } from "@/lib/storage/constants";

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
  bucketName: StorageBuckets;
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

interface DeleteFileOptions {
  bucketName: StorageBuckets;
  fileName: string;
}

export const deleteFile = async ({
  bucketName,
  fileName,
}: DeleteFileOptions) => {
  await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: fileName }));
};
