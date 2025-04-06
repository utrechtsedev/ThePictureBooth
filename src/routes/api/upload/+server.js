import { json } from '@sveltejs/kit';
import { uploadFile } from '$lib/server/utils/s3Client';

// File size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export async function POST({ request }) {
  try {
    // Check if the request contains multipart form data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return json({
        success: false,
        message: 'Multipart form data is required'
      }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    // Validate file existence
    if (!file) {
      return json({
        success: false,
        message: 'No file uploaded'
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json({
        success: false,
        message: 'Invalid file type. Allowed types: JPEG, PNG, WEBP, PDF'
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return json({
        success: false,
        message: 'File is too large. Maximum size is 5MB'
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to S3
    const fileUrl = await uploadFile(buffer, file.name, file.type);

    // Return the file URL
    return json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    }, { status: 500 });
  }
}
