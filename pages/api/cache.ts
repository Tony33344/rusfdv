import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  
  if (req.method === 'GET') {
    return res.status(200).json({
      totalFiles: 0,
      totalSize: 0,
      files: []
    });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({
      message: 'Cache cleared successfully',
      deletedFiles: 0
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
