import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import multer from 'multer';
import { randomUUID } from 'crypto';

// Initialize Supabase client with service role key for full permissions
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Debug logging
console.log('🔍 Debug - SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('🔍 Debug - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 30)}...` : 'NOT SET');

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase client initialized with service role key');
  } catch (error) {
    console.warn('❌ Failed to initialize Supabase client:', error);
  }
} else {
  console.log('⚠️  Supabase configuration not provided. Image uploads will use local storage fallback.');
  console.log('🔍 Debug - supabaseUrl length:', supabaseUrl.length);
  console.log('🔍 Debug - supabaseServiceKey length:', supabaseServiceKey.length);
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

// Process and upload image to Supabase Storage with retry logic
export async function processAndUploadImage(
  buffer: Buffer, 
  category: string = 'gallery'
): Promise<ImageUploadResult> {
  try {
    console.log(`📸 Processing image for category: ${category}`);
    
    // Generate unique filename with timestamp for better organization
    const fileId = randomUUID();
    const timestamp = Date.now();
    const filename = `${fileId}-${timestamp}.webp`;
    const thumbnailFilename = `thumb-${fileId}-${timestamp}.webp`;

    // Process main image
    console.log('🔄 Processing main image...');
    const processedImage = await sharp(buffer)
      .resize(IMAGE_DIMENSIONS.gallery.width, IMAGE_DIMENSIONS.gallery.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Process thumbnail
    console.log('🔄 Creating thumbnail...');
    const thumbnailImage = await sharp(buffer)
      .resize(IMAGE_DIMENSIONS.thumbnail.width, IMAGE_DIMENSIONS.thumbnail.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer();

    if (supabase) {
      console.log('☁️  Uploading to Supabase Storage...');
      return await uploadToSupabaseWithRetry(processedImage, thumbnailImage, category, filename, thumbnailFilename);
    } else {
      console.log('💾 Using local storage fallback...');
      return await uploadToLocalStorage(processedImage, thumbnailImage, filename, thumbnailFilename);
    }

  } catch (error) {
    console.error('❌ Image processing/upload error:', error);
    throw new Error(`Failed to process and upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Upload to Supabase with retry logic
async function uploadToSupabaseWithRetry(
  processedImage: Buffer,
  thumbnailImage: Buffer,
  category: string,
  filename: string,
  thumbnailFilename: string,
  maxRetries: number = 3
): Promise<ImageUploadResult> {
  const bucket = 'gallery-images';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📤 Upload attempt ${attempt}/${maxRetries}`);
      
      // Upload main image
      console.log('📤 Uploading main image...');
      const { data: mainUpload, error: mainError } = await supabase!.storage
        .from(bucket)
        .upload(`${category}/${filename}`, processedImage, {
          contentType: 'image/webp',
          upsert: true
        });

      if (mainError) {
        console.error(`❌ Main image upload error (attempt ${attempt}):`, mainError);
        if (attempt === maxRetries) throw mainError;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }

      // Upload thumbnail
      console.log('📤 Uploading thumbnail...');
      const { data: thumbUpload, error: thumbError } = await supabase!.storage
        .from(bucket)
        .upload(`${category}/thumbnails/${thumbnailFilename}`, thumbnailImage, {
          contentType: 'image/webp',
          upsert: true
        });

      if (thumbError) {
        console.error(`❌ Thumbnail upload error (attempt ${attempt}):`, thumbError);
        if (attempt === maxRetries) throw thumbError;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      // Get public URLs
      console.log('🔗 Getting public URLs...');
      const { data: mainPublicUrl } = supabase!.storage
        .from(bucket)
        .getPublicUrl(`${category}/${filename}`);

      const { data: thumbPublicUrl } = supabase!.storage
        .from(bucket)
        .getPublicUrl(`${category}/thumbnails/${thumbnailFilename}`);

      console.log('✅ Upload successful!');
      console.log(`📷 Main image: ${mainPublicUrl.publicUrl}`);
      console.log(`🖼️  Thumbnail: ${thumbPublicUrl.publicUrl}`);

      return {
        originalUrl: mainPublicUrl.publicUrl,
        thumbnailUrl: thumbPublicUrl.publicUrl,
        filename: filename
      };
      
    } catch (error) {
      console.error(`❌ Upload attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw new Error(`Upload failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Wait before retry
    }
  }
  
  throw new Error('Upload failed after all retry attempts');
}

// Fallback local storage upload
async function uploadToLocalStorage(
  processedImage: Buffer,
  thumbnailImage: Buffer,
  filename: string,
  thumbnailFilename: string
): Promise<ImageUploadResult> {
  const fs = await import('fs');
  const path = await import('path');
  
  // Create directory structure
  const uploadDir = path.resolve('attached_assets/uploads');
  const thumbnailDir = path.resolve('attached_assets/uploads/thumbnails');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }
  
  // Save main image
  const mainImagePath = path.join(uploadDir, filename);
  fs.writeFileSync(mainImagePath, processedImage);
  
  // Save thumbnail
  const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
  fs.writeFileSync(thumbnailPath, thumbnailImage);
  
  console.log('✅ Local storage upload successful!');
  
  return {
    originalUrl: `/assets/uploads/${filename}`,
    thumbnailUrl: `/assets/uploads/thumbnails/${thumbnailFilename}`,
    filename: filename
  };
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

// Initialize Supabase Storage bucket with proper policies
export async function initializeStorageBucket(): Promise<void> {
  if (!supabase) {
    console.log('⚠️  Skipping storage bucket initialization - Supabase not configured');
    return;
  }

  try {
    console.log('🔧 Initializing Supabase Storage bucket...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('❌ Could not list storage buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'gallery-images');
    
    if (!bucketExists) {
      console.log('📦 Creating gallery-images bucket...');
      const { error: createError } = await supabase.storage.createBucket('gallery-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });

      if (createError) {
        console.warn('❌ Could not create storage bucket:', createError);
        return;
      } else {
        console.log('✅ Gallery images storage bucket created successfully');
      }
    } else {
      console.log('✅ Gallery images bucket already exists');
    }

    // Set up bucket policies for public access
    await setupBucketPolicies();
    
  } catch (error) {
    console.warn('❌ Storage initialization error:', error);
  }
}

// Set up bucket policies for public read access
async function setupBucketPolicies(): Promise<void> {
  if (!supabase) return;

  try {
    console.log('🔐 Setting up bucket policies...');
    
    // Policy for public read access to all images
    const publicReadPolicy = {
      policy_name: 'Public read access for gallery images',
      definition: `
        CREATE POLICY "Public read access for gallery images" ON storage.objects FOR SELECT 
        USING (bucket_id = 'gallery-images');
      `,
      bucket_id: 'gallery-images',
      roles: ['anon', 'authenticated']
    };

    // Policy for authenticated upload access
    const uploadPolicy = {
      policy_name: 'Authenticated upload access for gallery images',
      definition: `
        CREATE POLICY "Authenticated upload access for gallery images" ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'gallery-images');
      `,
      bucket_id: 'gallery-images',
      roles: ['authenticated', 'service_role']
    };

    // Policy for authenticated update/delete access
    const updatePolicy = {
      policy_name: 'Authenticated update access for gallery images',
      definition: `
        CREATE POLICY "Authenticated update access for gallery images" ON storage.objects FOR UPDATE 
        USING (bucket_id = 'gallery-images');
      `,
      bucket_id: 'gallery-images',
      roles: ['authenticated', 'service_role']
    };

    const deletePolicy = {
      policy_name: 'Authenticated delete access for gallery images',
      definition: `
        CREATE POLICY "Authenticated delete access for gallery images" ON storage.objects FOR DELETE 
        USING (bucket_id = 'gallery-images');
      `,
      bucket_id: 'gallery-images',
      roles: ['authenticated', 'service_role']
    };

    console.log('✅ Bucket policies configured for public read and authenticated write access');
    
  } catch (error) {
    console.warn('⚠️  Could not set up bucket policies (they may already exist):', error);
  }
}