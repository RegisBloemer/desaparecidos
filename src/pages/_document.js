import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt">
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
        <meta name="description" content="Desaparecidos" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta name="description" content="Desaparecidos" />
        <meta
          property="og:url"
          content="https://github.com/RegisBloemer/desaparecidos"
        />
        <meta property="og:site_name" content="Desaparecidos" />
        <meta property="og:title" content="Desaparecidos" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:description" content="Desaparecidos" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site_name" content="Desaparecidos" />
        <meta name="twitter:title" content="Desaparecidos" />
        <meta name="twitter:card" content="Desaparecidos" />
        <meta name="twitter:description" content="Desaparecidos" />
        <meta name="twitter:image" content="/favicon.ico" />
        <meta name="image" content="/favicon.ico" />
        <meta name="algolia-site-verification"  content="30E5665362A50A80" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
