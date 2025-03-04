const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // Library for image conversion

/**
 * Upload middleware with automatic WebP conversion for images
 * - Saves images in `/public/assets/img/`
 * - Saves videos in `/public/assets/video/`
 * - Converts images to WebP for better compression
 */

const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isVideo = file.mimetype.startsWith('video/');
      const uploadDir = isVideo 
        ? path.join(__dirname, '../../public/assets/video/')
        : path.join(__dirname, '../../public/assets/img/');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = path.extname(file.originalname);

      // Change file extension to .webp for images
      const finalName = file.mimetype.startsWith('image/') ? `${uniqueName}.webp` : `${uniqueName}${ext}`;
      cb(null, finalName);
    }
  });

  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv']
  };

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB
    fileFilter: (req, file, cb) => {
      const isImage = allowedTypes.image.includes(file.mimetype);
      const isVideo = allowedTypes.video.includes(file.mimetype);

      // Reject files that are neither images nor videos
      if (!isImage && !isVideo) {
        return cb(new Error('Invalid file format. Only images and videos are allowed.'));
      }

      // Additional size validation: max 5MB for images, 50MB for videos
      if (isImage && file.size > 5 * 1024 * 1024) {
        return cb(new Error('Images must not exceed 5MB.'));
      }
      if (isVideo && file.size > 50 * 1024 * 1024) {
        return cb(new Error('Videos must not exceed 50MB.'));
      }

      cb(null, true);
    }
  });

  return (req, res, next) => {
    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).send({ error: err.message });

      // Convert image to WebP if it's an image file
      if (req.file && req.file.mimetype.startsWith('image/')) {
        const filePath = req.file.path;
        const webpPath = filePath.replace(/\.[^.]+$/, '.webp'); // Replace extension with .webp

        try {
          await sharp(filePath)
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .toFile(webpPath);

          fs.unlinkSync(filePath); // Delete the original image file
          req.file.path = webpPath;
          req.file.filename = path.basename(webpPath);
        } catch (error) {
          return res.status(500).send({ error: 'Error processing image' });
        }
      }
      
      next();
    });
  };
};

module.exports = uploadFile;
