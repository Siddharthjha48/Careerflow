import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload("data:text/plain;base64,SGVsbG8gV29ybGQ=", { resource_type: "auto" }, (error, result) => {
  if (error) {
    console.error("ERROR:", JSON.stringify(error, null, 2));
  } else {
    console.log("SUCCESS:", result.secure_url);
  }
});
