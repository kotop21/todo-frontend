import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Pages from './pages/index'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pages.Home />} />
          <Route path="/auth" element={<Pages.Auth />} />
          <Route path="/get-token" element={<Pages.GetToken />} />
          <Route path="/todo" element={<Pages.ToDo />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
