import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Pages from './pages/index'
import { useEffect } from 'react'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function DevTokenProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_TOKEN) {
      document.cookie = `accessToken=${import.meta.env.VITE_DEV_TOKEN}; path=/`
    }
  }, [])

  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DevTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Pages.Home />} />
            <Route path="/auth" element={<Pages.Auth />} />
            <Route path="/get-token" element={<Pages.GetToken />} />
            <Route path="/todo" element={<Pages.ToDo />} />
          </Routes>
        </BrowserRouter>
      </DevTokenProvider>
    </ThemeProvider>
  )
}
