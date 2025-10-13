import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ pt: 15, flex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          {/* Main Title with Gradient */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Your To-Do Universe
          </Typography>

          {/* Subtitle / Description */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Organize your tasks, boost your productivity, and never miss a deadline.
            Your personalized to-do list helps you stay on top of everything in a beautiful and intuitive interface.
          </Typography>

          {/* Feature Highlights */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              mt: 8,
              gap: 3,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  background: 'linear-gradient(90deg, #ff9a76, #ffcc9a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Organize Tasks
              </Typography>
              <Typography variant="body1">
                Create, edit, and manage your tasks easily with our intuitive interface.
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  background: 'linear-gradient(90deg, #f7a1f7, #e5b3f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Track Progress
              </Typography>
              <Typography variant="body1">
                Keep track of your completed tasks and see your productivity grow.
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  background: 'linear-gradient(90deg, #76e7a6, #a3f7c4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Stay Motivated
              </Typography>
              <Typography variant="body1">
                Enjoy a clean and colorful layout that keeps you engaged and motivated.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 3,
          mt: 'auto',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Made with ❤️ by <strong>kotop21</strong> |{' '}
          <Link href="https://github.com/kotop21/todo-frontend" target="_blank" rel="noopener">
            Frontend
          </Link>{' '}
          |{' '}
          <Link href="https://github.com/kotop21/todo-backend" target="_blank" rel="noopener">
            Backend
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
