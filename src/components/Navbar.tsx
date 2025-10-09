import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navbar() {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // пространство между центром и GitHub
        p: 2,
        backdropFilter: 'blur(15px)',
        backgroundColor: 'rgba(18, 18, 18, 0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000,
      }}
    >
      {/* Пустой блок слева, чтобы центрирование было точным */}
      <Box sx={{ width: '100px' }} />

      {/* Центрированные кнопки */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Button
          component={Link}
          to="/"
          sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffffff' }}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/get-token"
          sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffffff' }}
        >
          Auth
        </Button>
      </Box>

      {/* GitHub справа */}
      <IconButton
        sx={{ color: '#ffffff' }}
        onClick={() => window.open('https://github.com/kotop21/', '_blank')}
      >
        <GitHubIcon />
      </IconButton>
    </Box>
  );
}
