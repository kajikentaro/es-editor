import { faFile, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditItemList from "components/EditItemList";
import TermSelect from "components/TermSelect";
import { Company, Document, PageProps, Tag } from "interfaces/interfaces";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "styles/List.module.scss";
import { RESTCompany, RESTTag } from "utils/REST";
import { genRandomId } from "utils/utils";
const Select = dynamic(import("react-select"), { ssr: false });

const DocumentTile: React.VFC<{
  document: Document;
  companyList: Company[];
  tagList: Tag[];
}> = (props) => {
  return (
    <a className={styles.document} href={"/edit/" + props.document.id}>
      <p className={styles.tec}>
        {RESTCompany.get(props.document.companyId, props.companyList)?.name}
      </p>
      <p className={styles.tec}>
        {RESTTag.get(props.document.tagId, props.tagList)?.name}
      </p>
      <p>{props.document.text}</p>
    </a>
  );
};

let searchInputText = "";
let selectTagId = "";
let selectCompanyId = "";

const Home: NextPage<PageProps> = (props) => {
  const {
    companyList,
    tagList,
    documentList,
    updateTagList,
    updateCompanyList,
    updateDocumentList,
  } = props;
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filterdDocList, setfilterdDocList] = useState<Document[]>([]);

  useEffect(() => {
    setfilterdDocList(documentList);
  }, [documentList]);

  const search = () => {
    let tmpDocList = documentList;
    console.log(searchInputText);
    if (searchInputText) {
      tmpDocList = tmpDocList.filter((v) => {
        return v.text.indexOf(searchInputText) !== -1;
      });
    }
    if (selectCompanyId) {
      tmpDocList = tmpDocList.filter((v) => {
        return v.companyId === selectCompanyId;
      });
    }
    if (selectTagId) {
      tmpDocList = tmpDocList.filter((v) => {
        return v.tagId === selectTagId;
      });
    }
    setfilterdDocList(tmpDocList);
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
              search();
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
                  searchInputText = "";
                  search();
                }}
              >
                <FontAwesomeIcon
                  className={styles.icon}
                  icon={faTimes}
                  color="hsl(0, 0%, 80%)"
                />
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
            <TermSelect
              item={undefined}
              itemList={companyList}
              onDefineItem={(item) => {
                selectCompanyId = item?.id || "";
                search();
              }}
            />
          </div>
          <div className={styles.tag_wrapper}>
            <h2>項目から選ぶ</h2>
            <TermSelect
              item={undefined}
              itemList={tagList}
              onDefineItem={(item) => {
                selectTagId = item?.id || "";
                search();
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.document_list}>
        <button
          className={styles.new_document}
          onClick={() => {
            const randomId = genRandomId();
            router.push("/edit/" + randomId);
          }}
        >
          <div className={styles.font_awesome_btn}>
            <FontAwesomeIcon className={styles.icon} icon={faFile} />
            新規作成
          </div>
        </button>
        {filterdDocList.map((v, idx) => {
          return (
            <DocumentTile
              document={v}
              key={v.id}
              tagList={tagList}
              companyList={companyList}
            />
          );
        })}
      </div>

      <div className={styles.edit_item}>
        {tagList.length > 0 && (
          <div className={styles.first}>
            <h2>企業名前編集</h2>
            <EditItemList
              items={tagList}
              rest={RESTTag}
              onUpdate={() => {
                updateTagList();
              }}
            />
          </div>
        )}
        {companyList.length > 0 && (
          <div className={styles.second}>
            <h2>項目名編集</h2>
            <EditItemList
              items={companyList}
              rest={RESTCompany}
              onUpdate={() => {
                updateCompanyList();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
