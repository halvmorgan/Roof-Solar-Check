import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import dotenv from 'dotenv';
import { analyzeRoofImage } from './src/server/analyzeService';

dotenv.config();

function solarAnalysisPlugin() {
  return {
    name: 'solar-analysis-api',
    configureServer(server: any) {
      server.middlewares.use('/api/analyze-roof', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          return next();
        }
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        req.on('end', async () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const { imageBase64, mimeType } = JSON.parse(raw);
            if (!imageBase64) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'No image data provided in upload.' }));
              return;
            }
            const report = await analyzeRoofImage(imageBase64, mimeType);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(report));
          } catch (err: any) {
            console.error('Solar analysis error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Roof analysis encountered an unexpected error.' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), solarAnalysisPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

