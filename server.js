import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable JSON body parsing
app.use(express.json());

// If you run frontend and API on different origins, CORS is required.
// For local dev it is convenient to allow all origins.
app.use(cors());

// --- API: Gallery ---
// GET /images -> returns an array of { url, title }
app.get("/images", (req, res) => {
  res.json([
    { url: "https://picsum.photos/800/600?random=1", title: "Изображение 1" },
    { url: "https://picsum.photos/800/600?random=2", title: "Изображение 2" },
    { url: "https://picsum.photos/800/600?random=3", title: "Изображение 3" },
    { url: "https://picsum.photos/800/600?random=4", title: "Изображение 4" },
    { url: "https://picsum.photos/800/600?random=5", title: "Изображение 5" },
    { url: "https://picsum.photos/800/600?random=6", title: "Изображение 6" },
    { url: "https://picsum.photos/800/600?random=7", title: "Изображение 7" },
    { url: "https://picsum.photos/800/600?random=8", title: "Изображение 8" }
  ]);
});

// --- API: Temperature ---
// POST /temperature -> accepts { room: string, temperature: number }
app.post("/temperature", (req, res) => {
  const { room, temperature } = req.body ?? {};

  const roomOk = typeof room === "string" && room.trim().length > 0;
  const tempOk = typeof temperature === "number" && Number.isFinite(temperature);

  if (!roomOk || !tempOk) {
    return res.status(400).json({
      message: "Неверные данные. Ожидается JSON: { room: string, temperature: number }"
    });
  }

  return res.json({
    message: `Принято: аудитория ${room.trim()}, температура ${temperature}`
  });
});

// Optional: serve frontend files from project root (one service for both frontend + API)
// This is useful on Render if you want to avoid CORS completely.
const publicDir = path.resolve(__dirname, "..");
app.use(express.static(publicDir));

// Fallback to index.html for convenience (optional)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
