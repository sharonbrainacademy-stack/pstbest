import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for directly uploaded audio files
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'audio_uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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

  // Support up to 100MB audio payload for high quality sermon recordings
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Serve directly uploaded audio files with byte-range streaming support
  app.use('/audio-uploads', express.static(UPLOADS_DIR, {
    setHeaders: (res) => {
      res.set('Accept-Ranges', 'bytes');
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cache-Control', 'public, max-age=86400');
    }
  }));

  // Direct Audio File Upload Endpoint
  app.post('/api/upload-audio', async (req, res) => {
    try {
      const { fileName, fileData, mimeType } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ ok: false, message: 'Missing fileName or fileData' });
      }

      // fileData can be raw base64 or data URL (e.g. data:audio/mp3;base64,...)
      const base64Content = fileData.includes(';base64,')
        ? fileData.split(';base64,')[1]
        : fileData;

      const buffer = Buffer.from(base64Content, 'base64');
      const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFileName = `${Date.now()}_${cleanName}`;
      const targetPath = path.join(UPLOADS_DIR, uniqueFileName);

      await fs.promises.writeFile(targetPath, buffer);
      const publicUrl = `/audio-uploads/${uniqueFileName}`;

      console.log(`✅ Audio uploaded successfully: ${uniqueFileName} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
      return res.json({
        ok: true,
        url: publicUrl,
        fileName: uniqueFileName,
        sizeBytes: buffer.length,
        sizeMb: (buffer.length / (1024 * 1024)).toFixed(2)
      });
    } catch (err: any) {
      console.error('Audio upload error:', err);
      return res.status(500).json({ ok: false, message: err.message });
    }
  });

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
      const rawUrl = (req.query.url as string) || '';
      const queryFileId = req.query.fileId as string;
      if (!rawUrl && !queryFileId) {
        return res.status(400).send('Missing audio url or fileId query parameter');
      }

      let targetUrl = rawUrl.trim();
      let fileId: string | null = queryFileId || null;

      // Extract Google Drive File ID if applicable
      if (!fileId && (targetUrl.includes('drive.google.com') || targetUrl.includes('docs.google.com'))) {
        const fileIdMatch = targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                            targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                            targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                            targetUrl.match(/open\?id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          fileId = fileIdMatch[1];
        }
      }

      const forwardHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*'
      };

      if (req.headers.range) {
        forwardHeaders['Range'] = req.headers.range;
      }

      // If Google Drive, try Google's content download endpoints
      if (fileId) {
        const candidateUrls = [
          `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`,
          `https://docs.google.com/uc?export=download&id=${fileId}`,
          `https://drive.google.com/uc?export=download&id=${fileId}`
        ];

        let driveSuccess = false;
        for (const candidate of candidateUrls) {
          try {
            const resp = await fetch(candidate, {
              headers: forwardHeaders,
              redirect: 'follow'
            });

            const ct = resp.headers.get('content-type') || '';
            
            // If it's a virus scan warning HTML page, attempt confirmation token bypass
            if (ct.includes('text/html')) {
              const htmlText = await resp.text();
              const confirmMatch = htmlText.match(/confirm=([a-zA-Z0-9_-]+)/) || 
                                   htmlText.match(/download_warning[a-zA-Z0-9_]*=([a-zA-Z0-9_-]+)/);
              if (confirmMatch && confirmMatch[1]) {
                const bypassUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=${confirmMatch[1]}`;
                const bypassResp = await fetch(bypassUrl, { headers: forwardHeaders, redirect: 'follow' });
                const bypassCt = bypassResp.headers.get('content-type') || '';
                if (!bypassCt.includes('text/html') && bypassResp.ok) {
                  pipeAudioResponse(bypassResp, req, res);
                  driveSuccess = true;
                  break;
                }
              }
              // If it's an HTML page (like Google Drive login or permission denied), skip to next candidate
              continue;
            }

            if (resp.ok && !ct.includes('text/html')) {
              pipeAudioResponse(resp, req, res);
              driveSuccess = true;
              break;
            }
          } catch (e) {
            console.warn(`Drive candidate ${candidate} failed:`, e);
          }
        }

        if (driveSuccess) return;

        // If Google Drive direct streaming fails due to Google 2024 cookie/hotlink blocks or private permissions:
        return res.status(422).json({
          error: 'google_drive_streaming_blocked',
          fileId,
          embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          message: 'Google Drive blocked direct streaming for this file. Either the file permissions are Restricted (must be set to "Anyone with the link can view"), or Google is blocking hotlinked streaming. Please use the built-in Google Drive Player toggle or Dropbox.'
        });
      }

      // Handle Dropbox links
      if (targetUrl.includes('dropbox.com')) {
        targetUrl = targetUrl
          .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
          .replace('?dl=0', '?raw=1')
          .replace('&dl=0', '&raw=1');
      }

      console.log('🔊 Fetching audio proxy target:', targetUrl);

      const response = await fetch(targetUrl, {
        headers: forwardHeaders,
        redirect: 'follow'
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        return res.status(422).json({
          error: 'invalid_audio_stream',
          message: 'The provided URL returned a webpage (HTML) instead of an audio stream. Please provide a direct link to an MP3 file, or use Dropbox/Google Drive embed.'
        });
      }

      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch audio: ${response.statusText}`);
      }

      pipeAudioResponse(response, req, res);
    } catch (err: any) {
      console.error('Audio Proxy Error:', err);
      return res.status(500).json({ error: 'internal_error', message: err.message });
    }
  });

  // Helper to pipe audio stream with Range & 206 Partial Content support
  async function pipeAudioResponse(upstreamResp: any, req: express.Request, res: express.Response) {
    const contentType = upstreamResp.headers.get('content-type') || 'audio/mpeg';
    const contentLength = upstreamResp.headers.get('content-length');
    const contentRange = upstreamResp.headers.get('content-range');
    const acceptRanges = upstreamResp.headers.get('accept-ranges') || 'bytes';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', acceptRanges);
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
      res.status(206);
    } else if (upstreamResp.status === 206) {
      res.status(206);
    } else {
      res.status(200);
    }

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    if (upstreamResp.body) {
      // Node 18+ Web Streams to Node Readable
      const reader = upstreamResp.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (res.writableEnded) break;
            res.write(value);
          }
          res.end();
        } catch (err) {
          console.warn('Stream pump ended with err/abort:', err);
          res.end();
        }
      };
      req.on('close', () => {
        reader.cancel().catch(() => {});
      });
      await pump();
    } else {
      const buf = Buffer.from(await upstreamResp.arrayBuffer());
      res.send(buf);
    }
  }

  // 6. Audio Link Diagnostic API
  app.get('/api/audio-check', async (req, res) => {
    try {
      const url = (req.query.url as string || '').trim();
      if (!url) {
        return res.status(400).json({ ok: false, message: 'URL parameter required' });
      }

      let fileId: string | null = null;
      if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
      }

      if (fileId) {
        return res.json({
          ok: true,
          provider: 'google_drive',
          fileId,
          embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          proxyUrl: `/api/audio-proxy?url=${encodeURIComponent(url)}&fileId=${fileId}`,
          message: 'Google Drive link recognized! Ensure sharing is set to "Anyone with the link can view".',
          recommendation: 'Both direct streaming and Google Drive Native Player embed are supported.'
        });
      }

      if (url.includes('dropbox.com')) {
        const directDropbox = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '?raw=1');
        return res.json({
          ok: true,
          provider: 'dropbox',
          directUrl: directDropbox,
          message: 'Dropbox link recognized! Automatically converts to direct audio streaming format.',
          recommendation: 'Ideal for fast, seeking-friendly playback on all devices.'
        });
      }

      return res.json({
        ok: true,
        provider: 'direct',
        url,
        message: 'Direct audio URL received.'
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, message: err.message });
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
