// api/saveData.js
// Fungsi untuk menyimpan data ke KV storage Vercel

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Validasi struktur data
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Validasi bahwa data memiliki key yang dibutuhkan
    const requiredKeys = ['palingMurah', 'hematMingguIni', 'tebusHeboh'];
    const hasAllKeys = requiredKeys.every(key => Array.isArray(data[key]));

    if (!hasAllKeys) {
      return res.status(400).json({ error: 'Missing required promo data' });
    }

    // Menggunakan Vercel KV (Redis)
    const { kv } = await import('@vercel/kv');
    
    // Simpan data dengan key 'salesMonitorData'
    await kv.set('salesMonitorData', data);

    return res.status(200).json({ 
      success: true, 
      message: 'Data saved successfully' 
    });
    
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ 
      error: 'Failed to save data',
      message: error.message 
    });
  }
}
