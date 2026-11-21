// middleware/upload.js// 

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // IT IS HERE! [1]
import cloudinary from '../config/cloudinary.js'; // Imports the connection from above [1]

// Setup storage engine using the imported class [1]//

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'plant-store',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage: storage });

export default upload;