import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'careerflow_resumes',
      resource_type: 'auto',
      public_id: `${file.fieldname}-${Date.now()}`,
      format: file.originalname.split('.').pop(),
    };
  },
});

function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype || file.originalname.match(/\.(pdf|doc|docx)$/i)) {
    return cb(null, true);
  } else {
    cb('Error: Resumes only (PDF, DOC, DOCX)!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
