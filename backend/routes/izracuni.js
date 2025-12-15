// Uvoz Routerja iz Expressa (za definiranje endpointov)
import { Router } from "express";
// Multer je middleware za obdelavo multipart/form-data (file upload)
import multer from "multer";
// path uporabljamo za pravilno sestavljanje poti (OS-agnostic)
import path from "path";
// fs omogoča delo z datotečnim sistemom (ustvarjanje map, brisanje, ipd.)
import fs from "fs";
// Ustvarimo nov router (npr. /api/izracuni)
const router = Router();
// Absolutna pot do mape, kamor bomo shranjevali XML datoteke
const uploadDir = path.resolve("uploads");

// Če mapa uploads/xml še ne obstaja, jo ustvarimo
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Multer je “sprejemnik pošte” za datoteke, ki jih frontend pošlje
// Konfiguracija shranjevanja za multer
// Express ne zna brati datotek.
// Request pride na server 
// Multer ga prestreže 
// Multer se vpraša:
// - vkam naj shranim datoteko?
// - kako naj jo poimenujem?
// - ali jo sploh smem sprejeti?

// tukaj sedaj kam shranimo file
const storage = multer.diskStorage({
  // destination določa mapo, kamor se datoteka shrani
  destination: (req, file, cb) => {
    // v upload dir torej uploads
    cb(null, uploadDir); // null = brez napake, uploadDir = ciljna mapa
  },

  // filename določa ime datoteke na disku
  filename: (req, file, cb) => {
    
// ime datoteke obrdzimo isto kot je uporabnik 
// uploadal na frontendu
    const uniqueName = `${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Ustvarimo multer middleware z nastavitvami
// uporabimo zgoraj definirano diskStorage konfiguracijo
const upload = multer({
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 },
  // filter dovoljuje samo XML datoteke
    fileFilter: (req, file, cb) => {
    // preverimo končnico datoteke
    if (!file.originalname.endsWith(".xml")) {
      // če ni XML → zavrnemo
      return cb(new Error("Dovoljene so samo XML datoteke"));
    }
    // sicer dovolimo upload
    cb(null, true);
  }
});

// POST endpoint na /api/izracuni
// multer middleware:
  // pričakuje več datotek z imenom fielda "xml_files"
router.post("/", upload.array("xml_files"), function (request, response) {

    if (!request.files || request.files.length === 0) {
        return response.status(400).json({
            ok: false,
            error: "Ni poslanih XML datotek"
        });
    }

    // klele je treba napisat zdj logiko za izračun xml
    const savedFiles = request.files.map(file => ({
        originalName: file.originalname,
        savedAs: file.filename,
        path: file.path,
        size: file.size
    }));

    response.json({
        ok: true,
        message: "XML datoteke uspešno prejete",
        count: request.files.length,
        files: savedFiles
    });
});



// Router izvozimo kot default export
export default router;
