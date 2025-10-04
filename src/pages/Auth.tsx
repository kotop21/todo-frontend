import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = await response.json().catch(() => ({}));

      if (response.status === 409) {
        response = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        data = await response.json().catch(() => ({}));
      }
      if (!response.ok) {
        alert(data.message || `Ошибка сервера: ${response.statusText}`);
      } else {
        alert('Успешно!');
        setEmail('');
        setPassword('');
        navigate('/todo');
        if (data.userID) {
          localStorage.setItem('userId', data.userID.toString());
          console.log('userId сохранён:', data.userID);
        }
      }

    } catch (err: any) {
      alert(`Сетевая ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <Box
        sx={{
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <h1 style={{ textAlign: 'center', width: '100%' }}>Регистрация/Логин</h1>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Авторизироваться'}
        </Button>
      </Box>
    </Box>
  );
}
