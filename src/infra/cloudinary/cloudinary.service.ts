import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload a buffer to a specific Cloudinary folder.
   * @param buffer  - File buffer from multer
   * @param folder  - Cloudinary folder path (e.g. 'loop-tani/avatars/userId')
   * @param publicId - Optional explicit public_id override
   */
  async upload(
    buffer: Buffer,
    folder: string,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const options: Record<string, unknown> = {
        folder,
        resource_type: 'image',
        ...(publicId ? { public_id: publicId } : {}),
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error || !result) {
            reject(
              new InternalServerErrorException(
                error?.message ?? 'Cloudinary upload failed',
              ),
            );
            return;
          }
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Delete an asset from Cloudinary using its public_id.
   */
  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch {
      // Non-fatal: log and continue even if deletion fails
      console.error(`[Cloudinary] Failed to delete asset: ${publicId}`);
    }
  }

  /**
   * Upload a video buffer to a specific Cloudinary folder.
   */
  async uploadVideo(
    buffer: Buffer,
    folder: string,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const options: Record<string, unknown> = {
        folder,
        resource_type: 'video',
        ...(publicId ? { public_id: publicId } : {}),
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error || !result) {
            reject(
              new InternalServerErrorException(
                error?.message ?? 'Cloudinary video upload failed',
              ),
            );
            return;
          }
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Delete a video asset from Cloudinary using its public_id.
   */
  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } catch {
      console.error(`[Cloudinary] Failed to delete video asset: ${publicId}`);
    }
  }
}
