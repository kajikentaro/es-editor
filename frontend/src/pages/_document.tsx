import Document, { Head, Html, Main, NextScript } from "next/document";
import { GA_TRACKING_ID } from "utils/gtag";
import Script from "next/script";
import Header from "components/Header";
import Footer from "components/Footer";

class MyDocument extends Document {
  render() {
    return (
      <Html lang={"ja"} dir={"ltr"}>
        <Head>
          <meta
            name="description"
            content="バージョン管理、検索機能、企業・項目タグ別管理、文字数カウント、クラウド同期。豊富な機能がWebサイトで実現。就活ESエディター"
          />
          <link rel="icon" href="/favicon.ico" />
          {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });`,
                }}
              />
            </>
          )}
          {/* Google Adsense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9049003923441273"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <body>
          <main>
            <Main />
            <NextScript />
          </main>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
