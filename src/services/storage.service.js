import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import path from 'path';

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const R2 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToR2 = async (body, format, directory) => {
  const filename = crypto.randomUUID() + '.' + format;

  await R2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: directory + '/' + filename,
      Body: body,
      ContentType: 'image/' + format,
    }),
  );

  return filename;
};

export const getFileFromR2 = async (directory, imgKey) => {
  return R2.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: directory + '/' + imgKey,
    }),
  );
};

export const deleteFileFromR2 = async (directory, imgKey) => {
  return R2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: directory + '/' + imgKey,
    }),
  );
};
