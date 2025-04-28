
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({})

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>test1</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style='position: relative; min-height: 100vh; padding: 20px'>
        
        
        <button style={{"position":"absolute","left":"299.970703125px","top":"467.5573425292969px"}} onClick={() => alert("Clicked!")}>Click Me</button>
        
      </main>
    </ThemeProvider>
  )
}