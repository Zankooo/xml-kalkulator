import express from "express";
import "dotenv/config";
import izracuni from './routes/izracuni.js';
import cors from "cors";

const app = express();

// ----------------

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use('/api/izracuni', izracuni);

app.get('/', function (request, response) {
    response.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Backend status</title>
        </head>
        <body>
            <h1>✅ Backend is ready</h1>
            <p>Express server is running.</p>
        </body>
        </html>
    `);
});


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log("--------")
  console.log(`Server laufa na portu ${PORT}`);
  console.log(`Prva stran na voljo na http://localhost:${PORT}`) 
});
