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
import {
  Company,
  Document,
  DocumentHistory,
  PageProps,
  Tag,
} from "interfaces/interfaces";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "styles/Edit.module.scss";
import { RESTCompany, RESTDocument, RESTHistory, RESTTag } from "utils/REST";
import { genRandomId } from "utils/utils";

let preEditUnix = 0;
let viewingHistoryIdx = 0;
// 「戻る」「進む」ボタンで使う履歴
let editHistory: string[] = [""];
// 「変更履歴」で使う履歴
let documentHistory: DocumentHistory[] = [];

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
  const [otherDocumentIs, setOtherDocumentIs] = useState<"history" | "tagList">(
    "tagList"
  );
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [document, setDocument] = useState<Document>({ ...defaultDocument });

  // 文書読み込み
  useEffect(() => {
    if (!documentId) return;
    const documentToLoad = RESTDocument.get(documentId as string) || document;
    if (documentToLoad.id) {
      // 存在した場合
      editHistory[viewingHistoryIdx] = documentToLoad.text;
      setCompany(RESTCompany.get(documentToLoad.companyId));
      setTag(RESTTag.get(documentToLoad.tagId));
      setDocumentText(documentToLoad.text);
      documentHistory = RESTHistory.getList().filter(
        (v) => v.documentId === documentToLoad.id
      );
    } else {
      // 存在しない場合
      documentToLoad.id = documentId as string;
    }
    setDocument(documentToLoad);
  }, [documentId]);

  const onClickDelete = () => {
    if (!confirm("削除しますか")) return;
    RESTDocument.delete_(document.id);
    router.push("/list");
  };

  const onClickSave = () => {
    // バックアップ(変更履歴)を作成
    const oldDocument: DocumentHistory = {
      ...document,
      documentId: document.id,
    };
    oldDocument.id = genRandomId();
    RESTHistory.put(oldDocument.id, oldDocument);

    // 保存
    document.text = editHistory[viewingHistoryIdx];
    document.wordCount = editHistory[viewingHistoryIdx].length;
    document.companyId = company?.id || "";
    document.tagId = tag?.id || "";
    RESTDocument.put(document.id, document);

    // 親の持つドキュメント情報をアップデート
    updateDocumentList();
    // TODO: アラートではなくメッセージを出す
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
            <h2 className={styles.section_title}>企業名</h2>
            <div className={styles.section_content}>
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
          <div className={styles.section}>
            <h2 className={styles.section_title}>項目名</h2>
            <div className={styles.section_content}>
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
          {otherDocumentIs === "tagList" && (
            // 目次を表示
            <>
              <div className={styles.section + " " + styles.related_document}>
                <h2 className={styles.section_title}>同じ企業の他の文章</h2>
                <ul className={styles.list_wrapper}>
                  {documentList
                    .filter((v) => {
                      return v.companyId === company?.id && v.id !== document.id;
                    })
                    .map((v) => {
                      return (
                        <li
                          key={v.id}
                          className={styles.tag}
                          onMouseOver={() => {
                            setDocumentText(v.text);
                            setCanEdit(false);
                          }}
                          onMouseLeave={() => {
                            setDocumentText(editHistory[viewingHistoryIdx]);
                            setCanEdit(true);
                          }}
                        >
                          {RESTTag.get(v.tagId, tagList)?.name || "項目未設定"}
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className={styles.section + " " + styles.related_document}>
                <h2 className={styles.section_title}>同じ項目の他の文章</h2>
                <ul className={styles.list_wrapper}>
                  {documentList
                    .filter((v) => {
                      return v.companyId === company?.id && v.id !== document.id;
                    })
                    .map((v) => {
                      return (
                        <li
                          key={v.id}
                          className={styles.tag}
                          onMouseOver={() => {
                            setDocumentText(v.text);
                            setCanEdit(false);
                          }}
                          onMouseLeave={() => {
                            setDocumentText(editHistory[viewingHistoryIdx]);
                            setCanEdit(true);
                          }}
                        >
                          {RESTTag.get(v.tagId, tagList)?.name || "項目未設定"}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </>
          )}
          {otherDocumentIs === "history" && (
            // 変更履歴を表示
            <div className={styles.section + " " + styles.related_document}>
              <h2>この文書の変更履歴</h2>
              <ul className={styles.list_wrapper}>
                {documentHistory
                  .filter((v) => {
                    return v.companyId === company?.id && v.id !== document.id;
                  })
                  .map((v) => {
                    const updateDate = new Date(v.updateDate || 0);
                    const weekday = ["日", "月", "火", "水", "木", "金", "土"];
                    let updateText = "";
                    updateText += updateDate.getMonth() + 1 + "月";
                    updateText += updateDate.getDate() + "日(";
                    updateText += weekday[updateDate.getDay()] + ") ";
                    updateText += updateDate.getHours() + "時";
                    updateText += updateDate.getMinutes() + "分";
                    return (
                      <li
                        key={v.id}
                        className={styles.tag}
                        onMouseOver={() => {
                          setDocumentText(v.text);
                          setCanEdit(false);
                        }}
                        onMouseLeave={() => {
                          setDocumentText(editHistory[viewingHistoryIdx]);
                          setCanEdit(true);
                        }}
                      >
                        {v.updateDate ? updateText : "変更履歴不明"}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
          <div className={styles.section + " " + styles.toggle_btn_wrapper}>
            <button
              className={otherDocumentIs === "tagList" ? styles.active : styles.disable}
              onClick={() => {
                setOtherDocumentIs("tagList");
              }}
            >
              <FontAwesomeIcon className={styles.icon} icon={faList} />
              目次
            </button>
            <button
              className={otherDocumentIs === "history" ? styles.active : styles.disable}
              onClick={() => {
                documentHistory = RESTHistory.getList().filter(
                  (v) => v.documentId === document.id
                );
                setOtherDocumentIs("history");
              }}
            >
              <FontAwesomeIcon className={styles.icon} icon={faHistory} />
              変更履歴
            </button>
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
