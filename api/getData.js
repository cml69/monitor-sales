// api/getData.js
// Fungsi untuk mengambil data dari KV storage Vercel

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Menggunakan Vercel KV (Redis)
    // Pastikan sudah setup @vercel/kv di project
    const { kv } = await import('@vercel/kv');
    
    const data = await kv.get('salesMonitorData');
    
    if (!data) {
      // Return default structure jika belum ada data
      return res.status(200).json({
        palingMurah: [],
        hematMingguIni: [],
        tebusHeboh: []
      });
    }

    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return default structure on error
    return res.status(200).json({
      palingMurah: [],
      hematMingguIni: [],
      tebusHeboh: []
    });
  }
}
