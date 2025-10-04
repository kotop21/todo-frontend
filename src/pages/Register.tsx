import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Navbar from '../components/Navbar';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || `Ошибка сервера: ${response.statusText}`);
      } else {
        alert('Регистрация успешна!');
        setEmail('');
        setPassword('');
      }

    } catch (err: any) {
      // Это уже чисто сетевые ошибки или CORS
      alert(`Сетевая ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Navbar />
      <h1>Регистрация</h1>

      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Пароль"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Отправка...' : 'Зарегистрироваться'}
      </Button>
    </Box>
  );
}
