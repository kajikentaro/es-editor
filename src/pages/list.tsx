import { faFile, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Company, Document, Tag } from "interfaces/interfaces";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import styles from "styles/List.module.scss";
import { RESTCompany, RESTDocument, RESTTag } from "utils/REST";
import { genRandomId } from "utils/utils";
const Select = dynamic(import("react-select"), { ssr: false });

const DocumentTile: React.VFC<{ document: Document }> = (props) => {
  return (
    <a className={styles.document} href={"/edit/" + props.document.documentId}>
      <p className={styles.tec}>{RESTCompany.get(props.document.companyId, cacheCompany)?.name}</p>
      <p className={styles.tec}>{RESTTag.get(props.document.tagId, cacheTag)?.name}</p>
      <p>{props.document.text}</p>
    </a>
  );
};

let searchInputText = "";
let documentList: Document[] = [];
let cacheTag: undefined | Tag[] = undefined;
let cacheCompany: undefined | Company[] = undefined;

const Home: NextPage = () => {
  const router = useRouter();
  const [filterdDocList, setfilterdDocList] = useState<Document[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    documentList = RESTDocument.getList();
    setfilterdDocList(documentList);
    cacheCompany = RESTCompany.getList();
    cacheTag = RESTTag.getList();
  }, []);

  const handleSearchDocument = (strip: string) => {
    console.log(strip, !strip || strip === "");
    console.log(documentList);
    if (!strip || strip === "") {
      setfilterdDocList(documentList);
      return;
    }
    const filterdDocList = documentList.filter((v) => {
      return v.text.indexOf(strip) !== -1;
    });
    setfilterdDocList(filterdDocList);
  };

  const handleChange = (newValue: OnChangeValue<unknown, false>, actionMeta: ActionMeta<unknown>) => {
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
      <div className={styles.content_search}>
        <div className={styles.first}>
          <h2>文から検索</h2>
          <form
            className={styles.input_wrapper}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchDocument(searchInputText);
            }}
          >
            <div className={styles.base_input}>
              <input
                type="text"
                ref={searchInputRef}
                onChange={(e) => {
                  searchInputText = e.target.value;
                }}
              />

              <button
                className={styles.reset_btn}
                type="reset"
                onClick={(e) => {
                  e.preventDefault();
                  if (searchInputRef && searchInputRef.current) {
                    searchInputText = "";
                    searchInputRef.current.value = "";
                  }
                  setfilterdDocList(documentList);
                }}
              >
                <FontAwesomeIcon className={styles.icon} icon={faTimes} color="hsl(0, 0%, 80%)" />
              </button>
            </div>
            <button className={styles.search_btn}>
              <FontAwesomeIcon className={styles.icon} icon={faSearch} />
              検索
            </button>
          </form>
        </div>
        <div className={styles.second}>
          <div className={styles.company_wrapper}>
            <h2>企業から選ぶ</h2>
            <Select
              onChange={handleChange}
              isClearable
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
              isClearable
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
      </div>

      <div className={styles.document_list}>
        <button
          className={styles.new_document}
          onClick={() => {
            const N = 50;
            const randomId = genRandomId();
            router.push("/edit/" + randomId);
          }}
        >
          <div className={styles.font_awesome_btn}>
            <FontAwesomeIcon className={styles.icon} icon={faFile} />
            新規作成
          </div>
        </button>
        {filterdDocList &&
          cacheCompany &&
          filterdDocList.map((v, idx) => {
            return <DocumentTile document={v} key={v.documentId} />;
          })}
      </div>
    </div>
  );
};

export default Home;
