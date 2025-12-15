// Uvoz Routerja iz Expressa – omogoča definiranje endpointov (npr. POST /)
import { Router } from "express";

// fs – za branje XML datotek iz diska
import fs from "fs";

// XMLParser iz fast-xml-parser – za pretvorbo XML → JavaScript objekt
import { XMLParser } from "fast-xml-parser";

// Multer upload middleware – skrbi za sprejem in shranjevanje datotek
import upload from "../middleware/upload.js";

// Ustvarimo nov router (npr. /api/izracuni)
const router = Router();

/*
  Inicializacija XML parserja.
  - ignoreAttributes: ignorira XML atribute (teh ne rabiš)
  - removeNSPrefix: odstrani namespace prefix (npr. X003B_/G02R),
    da dostopaš do Document.Report... brez komplikacij
*/
const parser = new XMLParser({
  ignoreAttributes: true,
  removeNSPrefix: true,
});

/*
  Helper funkcija:
  XML parser včasih vrne objekt, včasih array (če je samo en element).
  Ta funkcija poskrbi, da vedno delamo z array-jem.
*/
function asArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

/*
  Helper funkcija:
  Pretvori vrednost v število.
  Če pretvorba ni možna → vrne 0.
*/
function toNumber(x) {
  const n = Number(String(x).trim());
  return Number.isFinite(n) ? n : 0;
}

/*
  POST endpoint:
  - upload.array("xml_files") poskrbi, da multer:
    - sprejme več XML datotek
    - jih shrani na disk
    - napolni request.files
*/
router.post("/", upload.array("xml_files"), async (request, response) => {

  // Če ni nobene datoteke, vrnemo napako, filter pač
  if (!request.files || request.files.length === 0) {
    return response.status(400).json({
      ok: false,
      error: "Ni poslanih XML datotek"
    });
  }

  /*
    Objekt za seštevanje TotalFeeCalc po BIC-u.
    Primer:
    {
      HDELSI22XXXX: 123.45,
      KBMASI22XXXX: 98.32
    }
  */
  const totalsByBic = {};

  try {
    // Gremo čez VSE naložene XML datoteke
    for (const file of request.files) {

      // Preberemo XML datoteko iz diska kot string
      const xmlString = fs.readFileSync(file.path, "utf-8");

      // Parsamo XML → JavaScript objekt
      const data = parser.parse(xmlString);

      /*
        Dostop do <Bank> elementov.
        Struktura glede na tvoj XML:
        Document → Report → Details → Bank
      */
      const banks = asArray(
        data?.Document?.Report?.Details?.Bank
      );

      // Gremo čez vse banke v tem XML-ju
      for (const bank of banks) {

        // Preberemo BIC banke
        const bic = String(bank?.BIC || "").trim();
        if (!bic) continue; // če BIC manjka, preskočimo

        // Preberemo TotalFeeCalc in ga pretvorimo v number
        const fee = toNumber(bank?.TotalFeeCalc);

        // Seštevanje po BIC ključu
        totalsByBic[bic] = (totalsByBic[bic] || 0) + fee;
      }
    }

    /*
      (Opcijsko)
      Zaokrožimo vse vrednosti na 2 decimalni mesti,
      da dobimo lep finančni izpis.
    */
    for (const bic of Object.keys(totalsByBic)) {
      totalsByBic[bic] =
        Math.round(totalsByBic[bic] * 100) / 100;
    }

    // Uspešen odgovor klientu
    return response.json({
      ok: true,
      message: "Izračun uspešen",
      filesProcessed: request.files.length,
      totalsByBic
    });

  } catch (err) {
    // Če pride do napake pri branju, parsiranju ali izračunu
    console.error(err);

    return response.status(500).json({
      ok: false,
      error: "Napaka pri parsiranju XML ali izračunu"
    });
  }
});

// Router izvozimo za uporabo v server.js
export default router;
