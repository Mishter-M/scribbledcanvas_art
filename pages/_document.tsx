import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="ARTFORGE - Digital Art Portfolio. Where creativity meets technology." />
          <meta name="keywords" content="digital art, portfolio, gallery, contemporary art, artwork" />
          <meta name="author" content="ARTFORGE" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="ARTFORGE - Digital Art Portfolio" />
          <meta property="og:description" content="Where creativity meets technology. Experience a curated collection of digital masterpieces and contemporary art." />
          <meta property="og:image" content="/og-image.jpg" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content="ARTFORGE - Digital Art Portfolio" />
          <meta property="twitter:description" content="Where creativity meets technology. Experience a curated collection of digital masterpieces and contemporary art." />
          <meta property="twitter:image" content="/og-image.jpg" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
