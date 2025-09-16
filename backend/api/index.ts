import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Health check
  if (req.url === '/api/health') {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: 'production',
    });
  }

  // Default API response
  return res.json({ 
    message: 'API is working',
    method: req.method,
    url: req.url 
  });
}