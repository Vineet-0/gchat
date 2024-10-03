// /pages/404.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Custom404: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // Initialize countdown at 5 seconds

  useEffect(() => {
    // Timer to handle countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Clear the interval when countdown reaches 0
          router.push('/'); // Redirect to index.tsx
          return 0; // Set countdown to 0
        }
        return prev - 1; // Decrease countdown by 1
      });
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold">404</h1>
        <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
        <p className="mt-4">
          You will be redirected to the homepage in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default Custom404;
