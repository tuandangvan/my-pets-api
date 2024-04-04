const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
import { env } from "../config/environment.js";


cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.API_KEY,
  api_secret: env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'some-folder-name',
    resource_type: 'auto', // automatically detect the resource type
  },
  allowedFormats: ['jpg', 'png', 'mp4', 'mov', 'avi'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;