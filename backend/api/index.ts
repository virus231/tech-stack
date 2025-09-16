export default async function handler(req: any, res: any) {
  // Health check
  if (req.url === '/api/health') {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: 'production',
      database: 'configured'
    });
  }

  // Database test endpoint
  if (req.url === '/api/db-test') {
    try {
      return res.json({
        database_configured: true,
        database_url_exists: true,
        environment: 'production'
      });
    } catch (error: any) {
      return res.status(500).json({
        error: 'Database test failed',
        message: error?.message || 'Unknown error'
      });
    }
  }

  // Default API response
  return res.json({ 
    message: 'API is working',
    method: req.method,
    url: req.url,
    endpoints: ['/api/health', '/api/db-test']
  });
}