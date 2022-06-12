import Footer from "components/Footer";
import Header from "components/Header";
import { Company, Document, Tag } from "interfaces/interfaces";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import "styles/globals.css";
import "styles/reset.css";
import { GA_TRACKING_ID } from "utils/gtag";
import { RESTCompany, RESTDocument, RESTTag } from "utils/REST";
import { usePageView } from "utils/usePageView";

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

  usePageView();

  return (
    <>
      <Head>
        <title>就活生のためのエントリーシートエディター</title>
      </Head>
      <Header />
      <Component {...pageProps} {...props} />
      <Footer />
    </>
  );
}

export default MyApp;
