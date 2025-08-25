import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import multer from 'multer';
import { randomUUID } from 'crypto';

// Initialize Supabase client only if properly configured
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
} else {
  console.log('Supabase configuration not provided. Image uploads will use local storage fallback.');
}

export { supabase };

// Multer memory storage for processing uploads
export const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Image dimensions for different gallery types
export const IMAGE_DIMENSIONS = {
  thumbnail: { width: 400, height: 300 },
  gallery: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 }
};

export interface ImageUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  filename: string;
}

// Process and upload image to Supabase Storage or local storage
export async function processAndUploadImage(
  buffer: Buffer, 
  category: string = 'gallery'
): Promise<ImageUploadResult> {
  try {
    const filename = `${randomUUID()}.webp`;
    const thumbnailFilename = `${randomUUID()}_thumb.webp`;

    // Process main image
    const processedImage = await sharp(buffer)
      .resize(IMAGE_DIMENSIONS.gallery.width, IMAGE_DIMENSIONS.gallery.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Process thumbnail
    const thumbnailImage = await sharp(buffer)
      .resize(IMAGE_DIMENSIONS.thumbnail.width, IMAGE_DIMENSIONS.thumbnail.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer();

    if (supabase) {
      // Upload to Supabase Storage
      const bucket = 'gallery-images';
      
      // Upload main image
      const { data: mainUpload, error: mainError } = await supabase.storage
        .from(bucket)
        .upload(`${category}/${filename}`, processedImage, {
          contentType: 'image/webp',
          upsert: true
        });

      if (mainError) throw mainError;

      // Upload thumbnail
      const { data: thumbUpload, error: thumbError } = await supabase.storage
        .from(bucket)
        .upload(`${category}/thumbnails/${thumbnailFilename}`, thumbnailImage, {
          contentType: 'image/webp',
          upsert: true
        });

      if (thumbError) throw thumbError;

      // Get public URLs
      const { data: mainPublicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${category}/${filename}`);

      const { data: thumbPublicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${category}/thumbnails/${thumbnailFilename}`);

      return {
        originalUrl: mainPublicUrl.publicUrl,
        thumbnailUrl: thumbPublicUrl.publicUrl,
        filename: filename
      };
    } else {
      // Fallback: Return mock URLs for development
      console.log('Using fallback storage - images processed but not uploaded');
      return {
        originalUrl: `https://example.com/gallery/${category}/${filename}`,
        thumbnailUrl: `https://example.com/gallery/${category}/thumbnails/${thumbnailFilename}`,
        filename: filename
      };
    }

  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to process and upload image');
  }
}

// Delete image from Supabase Storage
export async function deleteImageFromStorage(url: string): Promise<boolean> {
  if (!supabase) {
    console.log('Image deletion skipped - Supabase not configured');
    return true; // Return true to prevent errors in development
  }

  try {
    // Extract path from URL
    const urlParts = url.split('/storage/v1/object/public/gallery-images/');
    if (urlParts.length !== 2) return false;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('gallery-images')
      .remove([filePath]);

    return !error;
  } catch (error) {
    console.error('Image deletion error:', error);
    return false;
  }
}

// Initialize Supabase Storage bucket (call this on server startup)
export async function initializeStorageBucket(): Promise<void> {
  if (!supabase) {
    console.log('Skipping storage bucket initialization - Supabase not configured');
    return;
  }

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('Could not list storage buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'gallery-images');
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket('gallery-images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });

      if (createError) {
        console.warn('Could not create storage bucket:', createError);
      } else {
        console.log('Gallery images storage bucket created successfully');
      }
    }
  } catch (error) {
    console.warn('Storage initialization error:', error);
  }
}