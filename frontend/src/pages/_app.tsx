import Footer from "components/Footer";
import Header from "components/Header";
import { Company, Document, Tag } from "interfaces/interfaces";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import "styles/globals.css";
import "styles/reset.css";
import { RESTCompany, RESTDocument, RESTTag } from "utils/REST";

function MyApp({ Component, pageProps }: AppProps) {
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [documentList, setDocumentList] = useState<Document[]>([]);

  // タグ一覧と企業一覧を取得する
  useEffect(() => {
    setCompanyList(RESTCompany.getList());
    setTagList(RESTTag.getList());
    setDocumentList(RESTDocument.getList());
  }, []);

  const updateCompanyList = () => {
    setCompanyList(RESTCompany.getList());
  };
  const updateTagList = () => {
    setTagList(RESTTag.getList());
  };
  const updateDocumentList = () => {
    setDocumentList(RESTDocument.getList());
  };

  const props = {
    companyList,
    tagList,
    documentList,
    updateCompanyList,
    updateTagList,
    updateDocumentList,
  };

  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "";

  return (
    <>
      <Head>
        <title>ESエディター</title>
        <meta name="description" content="就活生のためのエントリーシートエディター" />
        <link rel="icon" href="/favicon.ico" />
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        {GA_TRACKING_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            ></Script>

            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}');
                `,
              }}
            ></script>
          </>
        )}
      </Head>
      <Header />
      <main>
        <Component {...pageProps} {...props} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
