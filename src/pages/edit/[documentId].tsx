import { faHistory, faList, faRedo, faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TermCreateSelect from "components/TermCreateSelect";
import { defaultDocument } from "consts/default-value";
import { Company, Document, Tag } from "interfaces/interfaces";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "styles/Edit.module.scss";
import { RESTCompany, RESTDocument, RESTTag } from "utils/REST";

let document = defaultDocument;

let preEditUnix = 0;
let viewingHistoryIdx = 0;
let editHistory: string[] = [""];

type OptionType<T> = {
  item: T;
  value: string;
  label: string;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { documentId } = router.query;
  const [documentText, setDocumentText] = useState<string>("");
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [tag, setTag] = useState<Tag | undefined>(undefined);
  const [isHistoryActive, setIsHistoryActive] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    if (!documentId) return;
    document = RESTDocument.get(documentId as string) || document;
    if (document.documentId) {
      //console.log("存在した", document);
      // 存在した場合
      editHistory[viewingHistoryIdx] = document.text;
      setCompany(RESTCompany.get(document.companyId));
      setTag(RESTTag.get(document.tagId));
      setDocumentText(document.text);
    } else {
      // 存在しない場合
      //console.log("存在しない", document);
      document.documentId = documentId as string;
    }
  }, [documentId]);

  // タグ一覧と企業一覧を取得する
  useEffect(() => {
    setCompanyList(RESTCompany.getList());
    setTagList(RESTTag.getList());
    setDocumentList(RESTDocument.getList());
  }, []);

  const onClickDelete = () => {
    if (!confirm("削除しますか")) return;
    RESTDocument.delete_(document.documentId);
    router.push("/list");
  };

  const onClickSave = () => {
    document.text = editHistory[viewingHistoryIdx];
    document.wordCount = editHistory[viewingHistoryIdx].length;
    RESTDocument.put(document.documentId, document);
    // TODO: アラートではなくメッセージを出す
    if (!company) {
      alert("企業名を入力してください");
      return;
    }
    if (!tag) {
      alert("項目名を入力してください");
      return;
    }
    RESTCompany.put(document.companyId, company);
    RESTTag.put(document.tagId, tag);
    alert("保存しました");
    router.reload();
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
            <h2>項目</h2>
            <div className={styles.row}>
              <TermCreateSelect
                item={tag}
                itemList={tagList}
                onDefineItem={(item) => {
                  RESTTag.put(item.id, item);
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
                  RESTCompany.put(item.id, item);
                }}
              />
            </div>
          </div>
          <div className={styles.section + " " + styles.file_list}>
            <h2>目次</h2>
            <div className={styles.files}>
              {documentList
                .filter((v) => {
                  return v.companyId === document.companyId;
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
                  const removeLen = Math.min(editHistory.length - viewingHistoryIdx - 1, editHistory.length - 1);
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
