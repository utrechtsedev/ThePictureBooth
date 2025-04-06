import * as Minio from 'minio';
import { env } from '$env/dynamic/private';
import { randomUUID } from 'crypto';

// Create a MinIO client
const minioClient = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: parseInt(env.S3_PORT),
  useSSL: env.S3_USE_SSL === 'true',
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY
});

/**
 * Uploads a file to MinIO S3
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - Original file name
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - URL of the uploaded file
 */
export async function uploadFile(fileBuffer, fileName, contentType) {
  const bucket = env.S3_BUCKET;

  // Generate a unique file name to prevent collisions
  const fileExtension = fileName.split('.').pop();
  const uniqueFileName = `expenses/${randomUUID()}.${fileExtension}`;

  // Upload the file to MinIO
  await minioClient.putObject(
    bucket,
    uniqueFileName,
    fileBuffer,
    fileBuffer.length,
    { 'Content-Type': contentType }
  );

  // Return the URL to the file
  return `https://${env.S3_ENDPOINT}/${bucket}/${uniqueFileName}`;
}

/**
 * Deletes a file from MinIO S3
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteFile(fileUrl) {
  if (!fileUrl) return;

  const bucket = env.S3_BUCKET;

  // Extract the object name from the URL
  const urlObj = new URL(fileUrl);
  const objectName = urlObj.pathname.substring(bucket.length + 2); // +2 for the leading and trailing slashes

  // Delete the object
  await minioClient.removeObject(bucket, objectName);
}
