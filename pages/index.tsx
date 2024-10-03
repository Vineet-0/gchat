// /pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";

const Chat: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const loginTime = localStorage.getItem("login-time");

    // Check if the user is not logged in
    if (!token || !loginTime) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }
    
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    
    // Check if the token has expired
    if (now - Number(loginTime) >= fifteenMinutes) {
      // Clear local storage if expired and redirect to login
      localStorage.removeItem("auth-token");
      localStorage.removeItem("login-time");
      router.push("/login");
    }
    else {
      router.push("/chat");

    }
  }, [router]);

  return <div></div>;
};

export default Chat;
