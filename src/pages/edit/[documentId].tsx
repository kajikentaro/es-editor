import {
  faHistory,
  faList,
  faRedo,
  faSave,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TermCreateSelect from "components/TermCreateSelect";
import { defaultDocument } from "consts/default-value";
import { Company, PageProps, Tag } from "interfaces/interfaces";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "styles/Edit.module.scss";
import { RESTCompany, RESTDocument, RESTTag } from "utils/REST";

let document = defaultDocument;

let preEditUnix = 0;
let viewingHistoryIdx = 0;
let editHistory: string[] = [""];

const Home: NextPage<PageProps> = (props) => {
  const router = useRouter();
  const {
    companyList,
    tagList,
    documentList,
    updateTagList,
    updateCompanyList,
    updateDocumentList,
  } = props;
  const { documentId } = router.query;
  const [documentText, setDocumentText] = useState<string>("");
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [tag, setTag] = useState<Tag | undefined>(undefined);
  const [isHistoryActive, setIsHistoryActive] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    if (!documentId) return;
    document = RESTDocument.get(documentId as string) || document;
    if (document.id) {
      // 存在した場合
      editHistory[viewingHistoryIdx] = document.text;
      setCompany(RESTCompany.get(document.companyId));
      setTag(RESTTag.get(document.tagId));
      setDocumentText(document.text);
    } else {
      // 存在しない場合
      document.id = documentId as string;
    }
  }, [documentId]);

  const onClickDelete = () => {
    if (!confirm("削除しますか")) return;
    RESTDocument.delete_(document.id);
    router.push("/list");
  };

  const onClickSave = () => {
    document.text = editHistory[viewingHistoryIdx];
    document.wordCount = editHistory[viewingHistoryIdx].length;
    // TODO: アラートではなくメッセージを出す
    if (!company) {
      alert("企業名を入力してください");
      return;
    }
    if (!tag) {
      alert("項目名を入力してください");
      return;
    }
    document.companyId = company.id;
    document.tagId = tag.id;
    RESTDocument.put(document.id, document);
    updateDocumentList();
    alert("保存しました");
  };

  // 過去のバージョンに戻す
  const rollBackText = (newIdx: number) => {
    const canRollBack = 0 <= newIdx && newIdx <= editHistory.length - 1;
    if (canRollBack) {
      viewingHistoryIdx = newIdx;
      setDocumentText(editHistory[viewingHistoryIdx]);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.content_editor}>
        <div className={styles.first}>
          <div className={styles.section}>
            <h2>この企業の他の項目</h2>
            <div className={styles.row}>
              <TermCreateSelect
                item={tag}
                itemList={tagList}
                onDefineItem={(item) => {
                  setTag(item);
                  RESTTag.put(item.id, item);
                  updateTagList();
                }}
              />
            </div>
          </div>
          <div className={styles.section}>
            <h2>企業名</h2>
            <div className={styles.row}>
              <TermCreateSelect
                item={company}
                itemList={companyList}
                onDefineItem={(item) => {
                  setCompany(item);
                  RESTCompany.put(item.id, item);
                  updateCompanyList();
                }}
              />
            </div>
          </div>
          <div className={styles.section + " " + styles.file_list}>
            <h2>目次</h2>
            <div className={styles.files}>
              {documentList
                .filter((v) => {
                  return v.companyId === company?.id && v.id !== document.id;
                })
                .map((v) => {
                  return (
                    <button
                      className={styles.tag}
                      key={v.tagId}
                      onMouseOver={() => {
                        setDocumentText(v.text);
                        setCanEdit(false);
                      }}
                      onMouseLeave={() => {
                        setDocumentText(editHistory[viewingHistoryIdx]);
                        setCanEdit(true);
                      }}
                    >
                      {RESTTag.get(v.tagId, tagList)?.name}
                    </button>
                  );
                })}
            </div>
            <div className={styles.button}>
              <button
                className={!isHistoryActive ? styles.active : styles.disable}
                onClick={() => {
                  setIsHistoryActive(false);
                }}
              >
                <FontAwesomeIcon className={styles.icon} icon={faList} />
                目次
              </button>
              <button
                className={isHistoryActive ? styles.active : styles.disable}
                onClick={() => {
                  setIsHistoryActive(true);
                }}
              >
                <FontAwesomeIcon className={styles.icon} icon={faHistory} />
                変更履歴
              </button>
            </div>
          </div>
        </div>
        <div className={styles.second}>
          <div className={styles.row}>
            <div className={styles.left}>
              <button
                className={styles.operation_btn}
                onClick={() => {
                  rollBackText(viewingHistoryIdx - 1);
                }}
              >
                <FontAwesomeIcon className={styles.icon} icon={faUndo} />
                戻る
              </button>
              <button
                className={styles.operation_btn}
                onClick={() => {
                  rollBackText(viewingHistoryIdx + 1);
                }}
              >
                <FontAwesomeIcon className={styles.icon} icon={faRedo} />
                進む
              </button>
            </div>
            <p>{documentText.length}文字</p>
            <div className={styles.right}>
              <button className={styles.operation_btn} onClick={onClickDelete}>
                <FontAwesomeIcon className={styles.icon} icon={faTrash} />
                削除
              </button>
              <button className={styles.operation_btn} onClick={onClickSave}>
                <FontAwesomeIcon className={styles.icon} icon={faSave} />
                保存
              </button>
            </div>
          </div>
          <div className={styles.edit}>
            <textarea
              {...(!canEdit && { readOnly: true, style: { backgroundColor: "#ccc" } })}
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
        </div>
      </div>
    </div>
  );
};

export default Home;
