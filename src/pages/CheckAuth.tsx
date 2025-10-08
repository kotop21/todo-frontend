import { useEffect } from 'react';

export default function GetToken() {
  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_TOKEN) {
      document.cookie = `accessToken=${import.meta.env.VITE_DEV_TOKEN}; path=/`;
    }
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/user/get-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data = await response.json();

        // if (response.status === 401) {
        //   console.log(data.message)
        // } else {
        //   console.log('Token received:', data);
        // }

        if (data.message === "User doesn't have refreshToken") {
          window.location.replace('/auth');
        } else if (data.userID) {
          localStorage.setItem('userId', data.userID.toString());
          console.log('userId сохранён:', data.userID);
          window.location.replace('/todo');
        }
        if (data.message === "User has an accessToken") window.location.href = '/todo'
        if (data.message === "User not found") window.location.href = '/auth'
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchToken();
  }, []);
  return null;
}
