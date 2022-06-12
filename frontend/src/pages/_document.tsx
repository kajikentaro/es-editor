import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { GA_TRACKING_ID } from "utils/gtag";

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
          {/* Google Tag Manager */}
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-5D8PJ49');`,
            }}
          />
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5D8PJ49"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
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
