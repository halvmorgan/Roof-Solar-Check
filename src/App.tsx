/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LiveBanner } from './components/LiveBanner';
import { HeroScreen } from './components/HeroScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { ReportScreen } from './components/ReportScreen';
import { BookedScreen } from './components/BookedScreen';
import { processRoofPhoto } from './utils/photoProcessing';
import { SolarAnalysisReport } from './server/analyzeService';
import { SampleRoofOption } from './utils/sampleRoofs';

type ScreenState = 'Hero' | 'Analyzing' | 'Report' | 'Booked';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('Hero');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [report, setReport] = useState<SolarAnalysisReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadInfo, setLeadInfo] = useState<{ name: string; phone: string; email: string }>({
    name: '',
    phone: '',
    email: '',
  });

  const handlePhotoUpload = async (file: File) => {
    setErrorMessage(null);

    let processed;
    try {
      processed = await processRoofPhoto(file);
    } catch (err: any) {
      setErrorMessage(err.message || 'Photo processing failed. Please try another image.');
      setScreen('Hero');
      return;
    }

    setPhotoPreviewUrl(processed.previewUrl);
    setScreen('Analyzing');

    try {
      const response = await fetch('/api/analyze-roof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: processed.base64Data,
          mimeType: processed.mimeType,
        }),
      });

      if (!response.ok) {
        let errorText = `Server responded with status ${response.status}`;
        try {
          const errorJson = await response.json();
          if (errorJson.error) {
            errorText = errorJson.error;
          }
        } catch {
          // ignore json parse failure
        }
        throw new Error(errorText);
      }

      const reportData: SolarAnalysisReport = await response.json();
      setReport(reportData);
      setScreen('Report');
    } catch (err: any) {
      console.error('Analysis error:', err);
      // If the API returns an error or parsing fails, go back to the Hero screen
      // and DISPLAY the real error message in a visible red box
      setErrorMessage(err.message || 'Unable to complete solar roof analysis.');
      setScreen('Hero');
    }
  };

  const handleSampleSelected = async (sample: SampleRoofOption) => {
    setErrorMessage(null);

    // Convert SVG data URL to an image, render on canvas to create JPEG, and process
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 800;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not initialize image canvas context.');
          ctx.drawImage(img, 0, 0, 1200, 800);
          
          canvas.toBlob(async (blob) => {
            if (!blob) {
              setErrorMessage('Failed to convert sample roof into image file.');
              return;
            }
            const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
            await handlePhotoUpload(file);
          }, 'image/jpeg', 0.85);
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to load sample roof photo.');
          setScreen('Hero');
        }
      };
      img.onerror = () => {
        setErrorMessage('Failed to render sample roof preview.');
        setScreen('Hero');
      };
      img.src = sample.dataUrl;
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing sample image.');
      setScreen('Hero');
    }
  };

  const handleBookAssessment = (lead: { name: string; phone: string; email: string }) => {
    setLeadInfo(lead);
    setScreen('Booked');
  };

  const handleReset = () => {
    setScreen('Hero');
    setPhotoPreviewUrl('');
    setReport(null);
    setErrorMessage(null);
    setLeadInfo({ name: '', phone: '', email: '' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between text-slate-800">
      {/* 1) Top Banner */}
      <LiveBanner />

      {/* Main Content Area based on current screen */}
      <main className="flex-1 flex flex-col justify-center">
        {screen === 'Hero' && (
          <HeroScreen
            onPhotoSelected={handlePhotoUpload}
            onSampleSelected={handleSampleSelected}
            errorMessage={errorMessage}
          />
        )}

        {screen === 'Analyzing' && (
          <AnalyzingScreen photoPreviewUrl={photoPreviewUrl} />
        )}

        {screen === 'Report' && report && (
          <ReportScreen
            report={report}
            photoPreviewUrl={photoPreviewUrl}
            onBookAssessment={handleBookAssessment}
          />
        )}

        {screen === 'Booked' && (
          <BookedScreen
            leadInfo={leadInfo}
            report={report}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer Branding for Sales Demo Context */}
      <footer className="w-full border-t border-slate-200/80 bg-white/60 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Built as a turnkey client acquisition engine for solar contractors</span>
          <span>© Ecentra Concierge Demo · Confidential</span>
        </div>
      </footer>
    </div>
  );
}
