// /components/ChatBox.tsx
import { useEffect, useState } from 'react';

interface Message {
  id: number;
  message: string;
  sender: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newMessage, sender: 'user1' }),
    });

    const newMsg = await res.json();
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div>
      <div className="border p-4 h-64 overflow-y-scroll mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 border-b">
            <strong>{msg.sender}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 w-full"
          placeholder="Type a message..."
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2 w-full">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
