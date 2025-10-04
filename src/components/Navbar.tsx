import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
      <Button component={Link} to="/">Home</Button>
      <Button component={Link} to="/get-token">Register</Button>
    </nav>
  );
}

