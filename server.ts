import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WhatsAppBroadcast {
  id: string;
  title: string;
  audioUrl: string;
  preacher: string;
  postedAt: string;
  timestamp: number;
  isLive: boolean;
  caption?: string;
}

// In-memory store for the latest synced WhatsApp voice broadcast
let latestWhatsAppAudio: WhatsAppBroadcast | null = {
  id: 'wa-demo-1',
  title: 'Prophetic Daily Audio Voice Note',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  preacher: 'Pastor Eghosa Best IGBINOVIA',
  postedAt: 'Just now via WhatsApp Channel',
  timestamp: Date.now(),
  isLive: true,
  caption: 'Commanding your morning with prophetic declarations.'
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Ministry Portal Server' });
  });

  // 1. WhatsApp Webhook Verification Endpoint (Meta / WhatsApp Cloud API)
  app.get('/api/whatsapp/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'pst_best_eghosa_wa_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WhatsApp Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else {
      console.warn('⚠️ WhatsApp Webhook verification failed.');
      return res.sendStatus(403);
    }
  });

  // 2. Incoming WhatsApp Webhook Handler (Meta Webhook / Zapier / Direct post)
  app.post('/api/whatsapp/webhook', (req, res) => {
    try {
      const body = req.body;

      let extractedAudioUrl = '';
      let extractedCaption = 'Prophetic Voice Note via WhatsApp';

      // Standard WhatsApp Cloud API Webhook Payload Parsing
      if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        if (message.type === 'audio' || message.type === 'voice') {
          extractedAudioUrl = message.audio?.link || message.voice?.link || message.audio?.id || '';
          extractedCaption = message.caption || 'WhatsApp Voice Note Broadcast';
        }
      } else if (body.audio_url || body.media_url || body.audioUrl) {
        // Direct Webhook payload (Zapier/Make/Custom HTTP POST)
        extractedAudioUrl = body.audio_url || body.media_url || body.audioUrl;
        extractedCaption = body.caption || body.title || 'Prophetic Voice Note via WhatsApp';
      }

      if (extractedAudioUrl) {
        latestWhatsAppAudio = {
          id: `wa-${Date.now()}`,
          title: body.title || 'WhatsApp Prophetic Voice Note',
          audioUrl: extractedAudioUrl,
          preacher: body.preacher || 'Pastor Eghosa Best IGBINOVIA',
          postedAt: 'Just now via WhatsApp Channel',
          timestamp: Date.now(),
          isLive: true,
          caption: extractedCaption
        };

        console.log('📢 New WhatsApp Audio Broadcast synced:', latestWhatsAppAudio);
        return res.json({ success: true, message: 'WhatsApp Audio synced successfully', broadcast: latestWhatsAppAudio });
      }

      return res.json({ success: true, message: 'Webhook received (no audio payload found)', bodyReceived: body });
    } catch (err: any) {
      console.error('Error handling WhatsApp webhook:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. API endpoint for website client to poll latest WhatsApp audio
  app.get('/api/whatsapp/latest-audio', (_req, res) => {
    res.json({
      success: true,
      broadcast: latestWhatsAppAudio,
      serverTime: new Date().toISOString()
    });
  });

  // 4. API endpoint to simulate or post new WhatsApp Voice Note from Admin Portal
  app.post('/api/whatsapp/simulate-broadcast', (req, res) => {
    const { title, audioUrl, preacher, caption } = req.body;
    if (!audioUrl) {
      return res.status(400).json({ success: false, message: 'Audio URL is required' });
    }

    latestWhatsAppAudio = {
      id: `wa-${Date.now()}`,
      title: title || 'Prophetic Voice Note from WhatsApp Channel',
      audioUrl: audioUrl.trim(),
      preacher: preacher || 'Pastor Eghosa Best IGBINOVIA',
      postedAt: 'Just now via WhatsApp Channel',
      timestamp: Date.now(),
      isLive: true,
      caption: caption || 'Commanding your morning with prophetic voice note.'
    };

    console.log('✨ Admin Simulated WhatsApp Audio Broadcast:', latestWhatsAppAudio);
    res.json({ success: true, broadcast: latestWhatsAppAudio });
  });

  // 5. Audio Proxy API (Bypasses Google Drive CORS & Virus Scan Confirmation Pages)
  app.get('/api/audio-proxy', async (req, res) => {
    try {
      const rawUrl = req.query.url as string;
      if (!rawUrl) {
        return res.status(400).send('Missing audio url query parameter');
      }

      let targetUrl = rawUrl.trim();

      // If Google Drive link, convert to direct download URL
      if (targetUrl.includes('drive.google.com') || targetUrl.includes('docs.google.com')) {
        const fileIdMatch = targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || targetUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      } else if (targetUrl.includes('dropbox.com')) {
        targetUrl = targetUrl.replace('dl=0', 'dl=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      }

      console.log('🔊 Fetching audio proxy target:', targetUrl);

      let response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      });

      // Handle Google Drive virus scan warning HTML page if returned
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        const htmlText = await response.text();
        const confirmMatch = htmlText.match(/confirm=([a-zA-Z0-9_-]+)/) || htmlText.match(/download_warning[a-zA-Z0-9_]*=([a-zA-Z0-9_-]+)/);
        if (confirmMatch && confirmMatch[1]) {
          const confirmToken = confirmMatch[1];
          const fileIdMatch = targetUrl.match(/id=([a-zA-Z0-9_-]+)/);
          if (fileIdMatch && fileIdMatch[1]) {
            const fileId = fileIdMatch[1];
            const confirmUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmToken}`;
            console.log('🔄 Google Drive virus warning confirmation bypass:', confirmUrl);
            response = await fetch(confirmUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              redirect: 'follow'
            });
          }
        }
      }

      if (!response.ok) {
        console.error(`Audio proxy fetch failed with status ${response.status}`);
        return res.status(response.status).send(`Failed to fetch audio: ${response.statusText}`);
      }

      const finalContentType = response.headers.get('content-type');
      if (finalContentType && !finalContentType.includes('html')) {
        res.setHeader('Content-Type', finalContentType);
      } else {
        res.setHeader('Content-Type', 'audio/mpeg');
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Accept-Ranges', 'bytes');

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.send(buffer);
    } catch (err: any) {
      console.error('Audio Proxy Error:', err);
      return res.status(500).send('Error proxying audio');
    }
  });

  // Vite Middleware for Development Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ministry Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
