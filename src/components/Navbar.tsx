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
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogin = () => {
    navigate('/get-token');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');

    try {
      await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Failed to logout:', err);
    }

    setUserEmail(null);
    window.location.reload();
  };

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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          Todo List
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!userEmail ? (
            <>
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/todo"
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Go to Todo
              </Button>
            </>
          ) : (
            <>
              <IconButton sx={{ color: '#fff' }} onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>

              <Button
                component={Link}
                to="/todo"
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Go to Todo
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#121212',
                    color: '#fff',
                    mt: 1,
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem disabled>{userEmail}</MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: 'red', '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Мобильное меню */}
        {isMobile && (
          <IconButton sx={{ color: '#fff' }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>

  );
}
