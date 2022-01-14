//import Creatable from "react-select/creatable";
import {
  faHistory,
  faRedo,
  faSave,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DOCUMENT_KEY } from "consts/local-storage";
import { Document } from "interfaces/interfaces";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import styles from "styles/Edit.module.scss";
const Creatable = dynamic(import("react-select/creatable"), { ssr: false });

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

let preEditUnix = 0;
let viewingHistoryIdx = 0;
let editHistory: string[] = [""];

const Home: NextPage = () => {
  const router = useRouter();
  const { documentId } = router.query;
  //console.log(company, section);
  const [document, setDocument] = useState<Document>(initialDocument);
  const [documentText, setDocumentText] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("〇〇株式会社");
  const [tagName, setTagName] = useState<string>("志望動機");
  const [isEditTag, setIsEditTag] = useState<boolean>(false);

  useEffect(() => {
    if (!documentId) return;
    const savedDocListStr = window.localStorage.getItem(DOCUMENT_KEY);
    const savedDocList = JSON.parse(savedDocListStr || "[]") as Document[];
    console.log(savedDocList);
    const editedDoc = savedDocList.find((v) => {
      console.log(
        v.documentId,
        documentId,
        v.documentId === (documentId as string)
      );
      return v.documentId === (documentId as string);
    });
    console.log(editedDoc);
    if (editedDoc) {
      editHistory[viewingHistoryIdx] = editedDoc.text as string;
      setDocumentText(editedDoc.text as string);
    }
  }, [documentId]);

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
  const onClickDelete = () => {
    if (!confirm("削除しますか")) return;
    const savedDocListStr = window.localStorage.getItem(DOCUMENT_KEY);
    let savedDocList = JSON.parse(savedDocListStr || "[]") as Document[];
    savedDocList = savedDocList.filter((v) => {
      return v.documentId !== documentId;
    });
    window.localStorage.setItem(DOCUMENT_KEY, JSON.stringify(savedDocList));
    router.push("/list");
  };
  const onClickSave = () => {
    const savedDocListStr = window.localStorage.getItem(DOCUMENT_KEY);
    let savedDocList = JSON.parse(savedDocListStr || "[]") as Document[];
    savedDocList = savedDocList.filter((v) => {
      return v.documentId !== documentId;
    });
    const editedDoc: Document = {
      companyId: "test",
      tagId: "test",
      documentId: documentId as string,
      text: editHistory[viewingHistoryIdx],
      wordCount: editHistory[viewingHistoryIdx].length,
    };
    savedDocList.push(editedDoc);
    window.localStorage.setItem(DOCUMENT_KEY, JSON.stringify(savedDocList));
    console.log("保存しました");
  };

  const rollBackText = (distance: number) => {
    const newIdx = viewingHistoryIdx + distance;
    const canRollBack = 0 <= newIdx && newIdx <= editHistory.length - 1;
    if (canRollBack) {
      viewingHistoryIdx = newIdx;
      setDocumentText(editHistory[viewingHistoryIdx]);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.first}>
        <div className={styles.section}>
          <h2>題名</h2>
          <div className={styles.row}>
            <Creatable
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
        <div className={styles.section}>
          <h2>企業名</h2>
          <div className={styles.row}>
            <Creatable
              onChange={handleChange}
              onInputChange={handleInputChange}
              defaultValue={{ value: "default-0", label: "ここに企業名を入力" }}
              options={[]}
              className={styles.creatable}
            />
          </div>
        </div>
        <div className={styles.section}>
          <h2>目次</h2>
          <div className={styles.row}>
            <input />
          </div>
          <div className={styles.row}>
            <input />
          </div>
          <div className={styles.row}>
            <input />
          </div>
        </div>
      </div>
      <div className={styles.second}>
        <div className={styles.row}>
          <div className={styles.left}>
            <button
              onClick={() => {
                rollBackText(-1);
              }}
            >
              <FontAwesomeIcon className={styles.icon} icon={faUndo} />
              戻る
            </button>
            <button
              onClick={() => {
                rollBackText(+1);
              }}
            >
              <FontAwesomeIcon className={styles.icon} icon={faRedo} />
              進む
            </button>
            <p>{documentText.length}文字</p>
          </div>
          <div className={styles.right}></div>
          <div className={styles.right}>
            <button onClick={onClickDelete}>
              <FontAwesomeIcon className={styles.icon} icon={faTrash} />
              削除
            </button>
            <button onClick={onClickSave}>
              <FontAwesomeIcon className={styles.icon} icon={faSave} />
              保存
            </button>
            <button>
              <FontAwesomeIcon className={styles.icon} icon={faHistory} />
              変更履歴
            </button>
          </div>
        </div>
        <div className={styles.edit}>
          <textarea
            value={documentText}
            onChange={(e) => {
              const nowUnix = new Date().getTime();
              if (viewingHistoryIdx !== editHistory.length - 1) {
                // UNDO後に編集した場合
                const removeLen = Math.min(
                  editHistory.length - viewingHistoryIdx - 1,
                  editHistory.length - 1
                );
                for (let i = 0; i < removeLen; i++) {
                  editHistory.pop();
                }
                preEditUnix = 0;
              }
              if (nowUnix - preEditUnix >= 2000) {
                // 前回の編集から2秒以上経過した場合は履歴に保存する
                editHistory.push(e.target.value);
                viewingHistoryIdx = editHistory.length - 1;
              } else {
                editHistory[viewingHistoryIdx] = e.target.value;
              }
              preEditUnix = nowUnix;
              setDocumentText(e.target.value);
            }}
          />
        </div>
        {viewingHistoryIdx}/{editHistory.length}
      </div>
      <div className={styles.third}></div>
    </div>
  );
};

export default Home;
