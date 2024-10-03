// /pages/login.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const loginTime = localStorage.getItem('login-time');

    if (token && loginTime) {
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;

      if (now - Number(loginTime) < fifteenMinutes) {
        router.push('/chat');
      } else {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('login-time');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loader

    // Simulate a delay of at least 3 seconds
    const timeout = new Promise(resolve => setTimeout(resolve, 2000));

    // Use Promise.race to show the loader for at least 3 seconds
    const res:any = await Promise.race([
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }),
      timeout,
    ]);

    if (res.ok) {
      const { token } = await res.json();
      const currentTime = Date.now();
      localStorage.setItem('auth-token', token);
      localStorage.setItem('login-time', String(currentTime));
      router.push('/chat');
    } else {
      setError('Invalid username or password');
    }
    
    setLoading(false); // End loader
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg w-96 transition-transform transform hover:scale-105">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">Welcome to gChat</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && ( // Show loader
          <div className="flex justify-center mb-4">
            <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-blue-500 rounded-full"></div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent text-white focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent text-white focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-400 text-sm text-center">
          Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
