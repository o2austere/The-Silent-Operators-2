import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Silent Operators — Intelligence System</title>
        <meta name="description" content="The system sees what you refuse to." />
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            background: #050505;
            color: #b0b0b0;
            font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
            -webkit-font-smoothing: antialiased;
          }
          * { box-sizing: border-box; }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
