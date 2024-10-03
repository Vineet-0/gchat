// /pages/api/chat/messages.ts
import { messages } from '@/data/message';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    const { message, sender } = req.body;
    const newMessage = { id: Date.now(), message, sender };

    messages.push(newMessage);
    res.status(201).json(newMessage);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
