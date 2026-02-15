import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📍 API route hit");

  if (req.method === 'POST') {
    console.log("✅ Inside POST handler");

    res.status(200).json({ message: 'POST received' });
  } else {
    console.log("❌ Unsupported method:", req.method);

    res.status(405).json({ message: 'Method Not Allowed' });
  }
}