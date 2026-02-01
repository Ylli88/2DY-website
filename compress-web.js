const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// More aggressive compression for faster web loading
async function compressForWeb() {
  const imageDir = path.join(__dirname, 'assets', 'images', 'hekur');
  const folders = ['konstruksione metalike', 'rrethoje metalike', 'dyer metalike'];
  
  let totalBefore = 0;
  let totalAfter = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(imageDir, folder);
    if (!fs.existsSync(folderPath)) continue;
    
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png') && !f.endsWith('.backup'));
    
    console.log(`\nProcessing ${folder}...`);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      const before = stats.size;
      totalBefore += before;
      
      console.log(`  Optimizing ${file} (${(before / 1024).toFixed(0)} KB)...`);
      
      // More aggressive compression
      await sharp(filePath)
        .resize(900, 1125, {  // Smaller than 4:5 ratio (1382x1728)
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({  // Convert to WebP for much better compression
          quality: 80,
          effort: 6
        })
        .toFile(filePath.replace('.png', '.webp'));
      
      // Also keep optimized PNG for fallback
      await sharp(filePath)
        .resize(900, 1125, {
          fit: 'inside',
          withoutEnlargement: true 
        })
        .png({ 
          quality: 75,
          compressionLevel: 9,
          palette: true
        })
        .toFile(filePath + '.tmp');
      
      fs.unlinkSync(filePath);
      fs.renameSync(filePath + '.tmp', filePath);
      
      const newStats = fs.statSync(filePath);
      const after = newStats.size;
      totalAfter += after;
      
      const webpStats = fs.statSync(filePath.replace('.png', '.webp'));
      
      console.log(`    PNG: ${(after / 1024).toFixed(0)} KB | WebP: ${(webpStats.size / 1024).toFixed(0)} KB`);
    }
  }
  
  console.log('\n=== Web Optimization Complete ===');
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`After (PNG): ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)}%`);
}

compressForWeb().catch(console.error);
