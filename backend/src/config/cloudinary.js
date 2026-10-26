import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, folder = 'nestro') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const getPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null;
  }

  let url;

  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }

  if (url.hostname !== 'res.cloudinary.com') {
    return null;
  }

  const uploadPathIndex = url.pathname.indexOf('/upload/');

  if (uploadPathIndex === -1) {
    return null;
  }

  let publicId = url.pathname.slice(uploadPathIndex + '/upload/'.length);
  const segments = publicId.split('/');
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));

  if (versionIndex !== -1) {
    publicId = segments.slice(versionIndex + 1).join('/');
  }

  publicId = publicId.replace(/\.[^/.]+$/, '');

  return publicId || null;
};

export const deleteFromCloudinary = async (imageUrls) => {
  const urls = (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).filter(Boolean);
  const publicIds = [...new Set(urls.map(getPublicIdFromUrl).filter(Boolean))];

  if (publicIds.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
    )
  );

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `Failed to delete Cloudinary asset "${publicIds[index]}":`,
        result.reason?.message || result.reason
      );
    }
  });

  return results;
};

export default cloudinary;
