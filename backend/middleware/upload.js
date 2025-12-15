import multer from "multer";
import path from "path";
import fs from "fs";

// pot do uploads mape (samo ena mapa)
const uploadDir = path.resolve("uploads");

// če mapa obstaja → pobrišemo VSE (datoteke in podmape)
if (fs.existsSync(uploadDir)) {
  fs.rmSync(uploadDir, { recursive: true, force: true });
}

// vedno ustvarimo svežo uploads mapo
fs.mkdirSync(uploadDir, { recursive: true });

// konfiguracija shranjevanja za multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // shrani direktno v uploads/
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// multer middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

export default upload;
