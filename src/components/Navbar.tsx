import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleLogin = () => navigate('/get-token');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');

    try {
      await fetch('/api/user/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Failed to logout:', err);
    }

    setUserEmail(null);
    window.location.reload();
  };

  const showTodoButton = location.pathname !== '/todo';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(15px)',
        backgroundColor: 'rgba(18,18,18,0.7)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? 1 : 0,
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}
        >
          Todo List
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: isMobile ? 'flex-end' : 'flex-start', width: isMobile ? '100%' : 'auto' }}>
          {!userEmail ? (
            <>
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  textTransform: 'none',
                  '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>

              {showTodoButton && (
                <Button component={Link} to="/todo" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                  Go to Todo
                </Button>
              )}
            </>
          ) : (
            <>
              <IconButton sx={{ color: '#fff' }} onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>

              {showTodoButton && (
                <Button component={Link} to="/todo" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                  Go to Todo
                </Button>
              )}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { backgroundColor: '#121212', color: '#fff', mt: 1, minWidth: 180 } }}
              >
                <MenuItem disabled>{userEmail}</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'red', '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
