import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { analyzeRoofImage } from './src/server/analyzeService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

app.post('/api/analyze-roof', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'No image data provided in upload.' });
      return;
    }
    const report = await analyzeRoofImage(imageBase64, mimeType);
    res.status(200).json(report);
  } catch (err: any) {
    console.error('Server solar analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis encountered an unexpected failure.' });
  }
});

// Serve static assets from dist in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SolarScope server running on port ${PORT}`);
});
