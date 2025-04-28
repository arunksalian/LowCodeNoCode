
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>test1</title>
        <meta name="description" content="" />
      </Head>

      <main style='position: relative; min-height: 100vh'>
      
      
      <button style={`position: absolute; left: 299.970703125px; top: 467.5573425292969px`} onClick={() => alert('Clicked!')}>Click Me</button>
      
      </main>
    </div>
  )
}