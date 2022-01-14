//import Creatable from "react-select/creatable";
import { DOCUMENT_KEY } from "consts/local-storage";
import cryptoRandomString from "crypto-random-string";
import { Document } from "interfaces/interfaces";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import styles from "styles/List.module.scss";
const Select = dynamic(import("react-select"), { ssr: false });

const initialDocument: Document = {
  companyId: "",
  tagId: "",
  documentId: "",
  text: "",
  wordCount: 0,
};

interface creatableOption {
  value: string;
  label: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const [savedDocList, setSavedDocList] = useState<Document[]>([]);

  useEffect(() => {
    const savedDocListStr = window.localStorage.getItem(DOCUMENT_KEY);
    setSavedDocList(JSON.parse(savedDocListStr || "[]") as Document[]);
  }, []);
  console.log(savedDocList);

  const handleChange = (
    newValue: OnChangeValue<unknown, false>,
    actionMeta: ActionMeta<unknown>
  ) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  const handleInputChange = (inputValue: any, actionMeta: any) => {
    console.group("Input Changed");
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  return (
    <div className={styles.content}>
      <div className={styles.search_wrapper}>
        <h2>文から検索</h2>
        <input />
      </div>
      <div className={styles.select_wrapper}>
        <div className={styles.company_wrapper}>
          <h2>企業から選ぶ</h2>
          <Select
            onChange={handleChange}
            onInputChange={handleInputChange}
            defaultValue={{ value: "default-0", label: "ここに項目を入力" }}
            options={[
              { value: "default-1", label: "志望動機" },
              { value: "default-2", label: "ガクチカ(勉強)" },
              { value: "default-3", label: "長所" },
              { value: "default-4", label: "自己PR" },
            ]}
            className={styles.creatable}
          />
        </div>
        <div className={styles.tag_wrapper}>
          <h2>項目から選ぶ</h2>
          <Select
            onChange={handleChange}
            onInputChange={handleInputChange}
            defaultValue={{ value: "default-0", label: "ここに項目を入力" }}
            options={[
              { value: "default-1", label: "志望動機" },
              { value: "default-2", label: "ガクチカ(勉強)" },
              { value: "default-3", label: "長所" },
              { value: "default-4", label: "自己PR" },
            ]}
            className={styles.creatable}
          />
        </div>
      </div>
      <div className={styles.document_list}>
        <button
          className={styles.new_document}
          onClick={() => {
            const N = 50;
            const randomId = cryptoRandomString({
              length: 100,
              type: "url-safe",
            });
            router.push("/edit/" + randomId);
          }}
        >
          新規作成
        </button>
        {savedDocList &&
          savedDocList.map((v, idx) => {
            return (
              <a
                className={styles.document}
                key={idx}
                href={"/edit/" + v.documentId}
              >
                <p>{v.text}</p>
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
