import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Make sure to set these in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImages() {
  const imgDir = path.join(process.cwd(), 'public', 'img');
  
  if (!fs.existsSync(imgDir)) {
    console.error(`Directory not found: ${imgDir}`);
    return;
  }

  const files = fs.readdirSync(imgDir);
  const bucketName = 'svarga-images';

  console.log(`Uploading ${files.length} images to Supabase bucket '${bucketName}'...`);

  for (const file of files) {
    const filePath = path.join(imgDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      const fileExt = path.extname(file).toLowerCase();
      let contentType = 'image/jpeg';
      if (fileExt === '.png') contentType = 'image/png';
      else if (fileExt === '.svg') contentType = 'image/svg+xml';
      else if (fileExt === '.webp') contentType = 'image/webp';

      const fileBuffer = fs.readFileSync(filePath);
      
      console.log(`Uploading ${file}...`);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(file, fileBuffer, {
          contentType: contentType,
          upsert: true,
        });

      if (error) {
        console.error(`❌ Failed to upload ${file}:`, error.message);
      } else {
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file).data.publicUrl;
        console.log(`✅ Uploaded ${file} successfully: ${publicUrl}`);
      }
    }
  }

  console.log('Done!');
}

uploadImages();
