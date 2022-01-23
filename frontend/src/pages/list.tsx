import {
  faDownload,
  faFile,
  faFileImport,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditItemList from "components/EditItemList";
import TermSelect from "components/TermSelect";
import { Company, Document, PageProps, Tag } from "interfaces/interfaces";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "styles/List.module.scss";
import { RESTCompany, RESTTag } from "utils/REST";
import { genRandomId } from "utils/utils";
import { backup, restore } from "utils/verify";

// 文書のタイル
const DocumentTile: React.VFC<{
  document: Document;
  companyList: Company[];
  tagList: Tag[];
}> = (props) => {
  const attachedCompany = RESTCompany.get(props.document.companyId, props.companyList);
  const attachedTag = RESTTag.get(props.document.tagId, props.tagList);

  return (
    <li className={styles.document_li}>
      <Link href={{ pathname: "/edit", query: { documentId: props.document.id } }}>
        <a className={styles.document}>
          <p className={styles.tec}>{attachedCompany?.name || "企業未選択"}</p>
          <p className={styles.tec}>{attachedTag?.name || "項目未選択"}</p>
          <p className={styles.document_text}>{props.document.text}</p>
        </a>
      </Link>
    </li>
  );
};

const List: NextPage<PageProps> = (props) => {
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

  /* 再レンダリングを必要としない変数 */
  // 選択中のアイテムと検索中の文字列
  const [searchInputText, setSearchInputText] = useState<string>("");
  const [selectTagId, setSelectTagId] = useState<string>("");
  const [selectCompanyId, setSelectCompanyId] = useState<string>("");

  useEffect(() => {
    setfilterdDocList(documentList);
  }, [documentList]);

  useEffect(() => {
    search();
  }, [selectTagId, selectCompanyId]);

  const search = () => {
    let tmpDocList = documentList;
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

  const onClickBackup = () => {
    const a = document.createElement("a");
    const blob = new Blob([backup()], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "es-editor-backup.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const onClickImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      alert("ファイルが選択されていません");
      return;
    }
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = () => {
      try {
        if (typeof reader.result === "string" && reader.result) {
          const restoreStatus = restore(reader.result);
          if (restoreStatus === "cancel") return;
          if (restoreStatus === "failure") alert("ファイルの中身が異なります");
          if (restoreStatus === "success") {
            alert("復元しました");
            router.reload();
          }
        } else {
          alert("ファイルの形式が異なります");
        }
      } catch {
        alert("エラーが発生しました");
      }
    };
  };

  return (
    <div className={styles.content}>
      <div className={styles.section + " " + styles.content_search}>
        <div className={styles.first}>
          <h2 className={styles.section_title}>文から検索</h2>
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
                placeholder="ここに入力"
                onChange={(e) => {
                  setSearchInputText(e.target.value);
                }}
              />

              <button
                className={styles.reset_btn}
                type="reset"
                onClick={(e) => {
                  setSearchInputText("");
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
            <h2 className={styles.section_title}>企業から選ぶ</h2>
            <TermSelect
              item={undefined}
              itemList={companyList}
              onDefineItem={(item) => {
                setSelectCompanyId(item?.id || "");
              }}
            />
          </div>
          <div className={styles.tag_wrapper}>
            <h2 className={styles.section_title}>項目から選ぶ</h2>
            <TermSelect
              item={undefined}
              itemList={tagList}
              onDefineItem={(item) => {
                setSelectTagId(item?.id || "");
              }}
            />
          </div>
        </div>
      </div>

      <ul className={styles.section + " " + styles.document_list}>
        <li className={styles.document_li + " " + styles.new_document}>
          <button
            className={styles.document}
            onClick={() => {
              const randomId = genRandomId();
              router.push({ pathname: "/edit", query: { documentId: randomId } });
            }}
          >
            <div className={styles.font_awesome_btn}>
              <FontAwesomeIcon className={styles.icon} icon={faFile} />
              <p>新規作成</p>
            </div>
          </button>
        </li>
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
      </ul>

      {tagList.length + companyList.length > 0 && (
        <div className={styles.section + " " + styles.edit_item}>
          {companyList.length > 0 && (
            <div className={styles.first}>
              <h2 className={styles.section_title}>企業名編集</h2>
              <EditItemList
                items={companyList}
                rest={RESTCompany}
                onUpdate={() => {
                  updateCompanyList();
                }}
              />
            </div>
          )}
          {tagList.length > 0 && (
            <div className={styles.second}>
              <h2 className={styles.section_title}>項目名編集</h2>
              <EditItemList
                items={tagList}
                rest={RESTTag}
                onUpdate={() => {
                  updateTagList();
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className={styles.section + " " + styles.backup}>
        <h2 className={styles.section_title}>バックアップ・インポート</h2>
        <div className={styles.operation_btn}>
          <button onClick={onClickBackup}>
            <FontAwesomeIcon className={styles.icon} icon={faDownload} />
            バックアップ
          </button>
          <label>
            <FontAwesomeIcon className={styles.icon} icon={faFileImport} />
            インポート
            <input type="file" accept=".json" onChange={onClickImport} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default List;
