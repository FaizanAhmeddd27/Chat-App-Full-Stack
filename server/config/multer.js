// middlewares/multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "chatApp/avatars", 
      allowed_formats: ["jpg", "jpeg", "png"], 
      public_id: file.originalname.split(".")[0] + "-" + Date.now(), 
    };
  },
});

// ✅ Initialize multer with Cloudinary storage
const upload = multer({ storage });

export default upload;
