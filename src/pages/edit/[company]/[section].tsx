import type { NextPage } from "next";
import Image from "next/image";
import styles from "styles/Edit.module.scss";
import Creatable from "react-select/creatable";
import {
  faEdit,
  faUndo,
  faRedo,
  faHistory,
  faCheckCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Document } from "interfaces/interfaces";
import { useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";

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
let preEditText = "";
let editHistory: string[] = [];

const Home: NextPage = () => {
  const router = useRouter();
  const { company, section } = router.query;
  //console.log(company, section);
  const [document, setDocument] = useState<Document>(initialDocument);
  const [documentText, setDocumentText] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("〇〇株式会社");
  const [tagName, setTagName] = useState<string>("志望動機");
  const [isEditTag, setIsEditTag] = useState<boolean>(false);

  const handleChange = (
    newValue: OnChangeValue<creatableOption, false>,
    actionMeta: ActionMeta<creatableOption>
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

  const rollBackText = (distance: number) => {
    const newIdx = viewingHistoryIdx + distance;
    const canRollBack = 0 <= newIdx && newIdx <= editHistory.length - 1;
    if (!canRollBack) return;
    if (viewingHistoryIdx === editHistory.length) {
      editHistory.push(preEditText);
    }
    viewingHistoryIdx = newIdx;
    setDocumentText(editHistory[viewingHistoryIdx]);
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
              //defaultValue="ここに項目名を入力"
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
            <input
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
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
          <div className={styles.right}>
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
              if (viewingHistoryIdx !== editHistory.length) {
                // UNDO後に編集した場合
                const removeLen = Math.min(
                  editHistory.length - viewingHistoryIdx - 1,
                  editHistory.length
                );
                for (let i = 0; i < removeLen; i++) {
                  editHistory.pop();
                }
                viewingHistoryIdx = editHistory.length;
              } else if (nowUnix - preEditUnix >= 2000) {
                // 前回の編集から2秒以上経過した場合は履歴に保存する
                editHistory.push(preEditText);
                viewingHistoryIdx = editHistory.length;
              }
              preEditUnix = nowUnix;
              preEditText = e.target.value;
              setDocumentText(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.third}></div>
    </div>
  );
};

export default Home;
