import { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Navbar from '../components/navbar';

export default function Home() {
  const [count, setCount] = useState(0)
  return (
    <Box sx={{ p: 4 }}>
      <Navbar />
      <h1>Home pages</h1>
      <Button variant="contained" onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
    </Box>
  )
}


