import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';

export default function ToDo() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) window.location.href = '/auth';

    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/table/${userId}`);
        const data = await response.json();
        setUsers(data);

        if (data.message === "Invalid or missing access token") {
          window.location.href = '/get-token'
        }

      } catch (err: any) {
        console.error('Ошибка при запросе:', err);
        setError('Не удалось получить данные');
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Navbar />
      <h1>ToDo Pages</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users ? (
        <pre>{JSON.stringify(users, null, 2)}</pre>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </Box>
  );
}
