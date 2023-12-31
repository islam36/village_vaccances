import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./main.css";

const theme = createTheme()


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
