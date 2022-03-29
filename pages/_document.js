import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    // console.log(initialProps);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link prefetch="true" rel="stylesheet" href="/styles/antd.min.css" />
          <link rel="stylesheet" href="/styles/quill.css" />
          <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
