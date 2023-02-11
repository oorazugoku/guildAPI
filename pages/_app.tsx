import '../styles/globals.css';
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      light: '#DFE3E8',
      main: '#003655',
      dark: '#003655',
      contrastText: 'white'
    },
    secondary: {
      main: '#DFE3E8'
    },
    background: {
      default: '#FFFFFF'
    }
  },
  shape: {
    borderRadius: 7
  },
})


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
