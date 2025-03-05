const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFile = (subfolder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isVideo = file.mimetype.startsWith('video/');
      const basePath = isVideo ? 'public/assets/video' : 'public/assets/img';
      
      // 📌 Création du chemin complet en fonction du type de fichier
      const uploadDir = path.join(__dirname, `../../${basePath}/${subfolder}`);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueName}${ext}`);
    }
  });

  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv']
  };

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (req, file, cb) => {
      if (![...allowedTypes.image, ...allowedTypes.video].includes(file.mimetype)) {
        return cb(new Error('Invalid file format. Only images and videos are allowed.'));
      }
      cb(null, true);
    }
  });

  return (req, res, next) => {
    upload.array('files', 1000)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ error: `Server error: ${err.message}` });
      }

      next();
    });
  };
};

module.exports = uploadFile;
