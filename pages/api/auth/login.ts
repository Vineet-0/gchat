// /pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Hardcoded credentials for demonstration
    const validUsername = 'vineet5';
    const validPassword = 'Sharp@12345';

    if (username === validUsername && password === validPassword) {
      // Mock token; in a real app, generate a JWT token or similar
      const token = 'mock-token';
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  }

  return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
