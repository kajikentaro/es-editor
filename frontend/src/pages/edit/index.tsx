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
import {
  Company,
  Document,
  DocumentHistory,
  PageProps,
  Tag,
} from "interfaces/interfaces";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "styles/Edit.module.scss";
import { RESTCompany, RESTDocument, RESTHistory, RESTTag } from "utils/REST";
import { genRandomId } from "utils/utils";
import { getDefaultDocument } from "../../consts/default-value";

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
  const [relatedDocumentType, setRelatedDocumentType] = useState<"history" | "tagList">(
    "tagList"
  );
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [document, setDocument] = useState<Document>(
    getDefaultDocument(typeof documentId === "string" ? documentId : genRandomId())
  );
  const [message, setMessage] = useState<string>("");
  const [selectionLength, setSelectionLength] = useState<number>(0);

  /* TODO:再レンダリングを必要としない変数 */
  const [preEditUnix, setPreEditUnix] = useState<number>(0);
  const [viewingHistoryIdx, setViewingHistoryIdx] = useState<number>(0);
  // 戻る進むボタンで使う履歴
  const [editHistory, setEditHistory] = useState<string[]>([""]);
  // 編集履歴
  const [documentHistory, setDocumentHistory] = useState<DocumentHistory[]>([]);

  // 文書読み込み
  useEffect(() => {
    if (!documentId) return;
    const documentToLoad = RESTDocument.get(documentId as string) || document;
    if (documentToLoad.id) {
      // 存在した場合
      const newEditHistory = [...editHistory];
      newEditHistory[viewingHistoryIdx] = documentToLoad.text;
      documentToLoad.historyId = genRandomId();
      setEditHistory(newEditHistory);
      setCompany(RESTCompany.get(documentToLoad.companyId));
      setTag(RESTTag.get(documentToLoad.tagId));
      setDocumentText(documentToLoad.text);
      setDocument(documentToLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const onClickDelete = () => {
    if (!confirm("削除しますか")) return;
    RESTDocument.delete_(document.id);
    updateDocumentList();
    router.push("/list");
  };

  const onClickSave = (saveMessage = "保存しました") => {
    // 保存
    document.text = editHistory[viewingHistoryIdx];
    document.wordCount = editHistory[viewingHistoryIdx].length;
    document.companyId = company?.id || "";
    document.tagId = tag?.id || "";
    RESTDocument.put(document.id, document);

    // バックアップを保存
    const new_history: DocumentHistory = {
      id: document.historyId,
      documentId: document.id,
      name: document.name,
      companyId: document.companyId,
      tagId: document.tagId,
      text: document.text,
      wordCount: document.wordCount,
      updateDate: document.updateDate,
    };
    RESTHistory.put(document.historyId, new_history);

    // documentのhistoryIdを更新
    setDocument({ ...document, historyId: genRandomId() });

    // 親の持つドキュメント情報をアップデート
    updateDocumentList();
    showMessage(saveMessage);
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  // 過去のバージョンに戻す
  const rollBackText = (newIdx: number) => {
    const canRollBack = 0 <= newIdx && newIdx <= editHistory.length - 1;
    if (canRollBack) {
      setViewingHistoryIdx(newIdx);
      setDocumentText(editHistory[newIdx]);
    }
  };

  const documentTextUpdate = (text: string) => {
    const nowUnix = new Date().getTime();
    let forceSave = false;
    if (viewingHistoryIdx !== editHistory.length - 1) {
      // UNDO後に編集した場合
      const removeLen = Math.min(
        editHistory.length - viewingHistoryIdx - 1,
        editHistory.length - 1
      );
      for (let i = 0; i < removeLen; i++) {
        editHistory.pop();
      }
      forceSave = true;
    }
    const newEditHistory = [...editHistory];
    if (nowUnix - preEditUnix >= 2000 || forceSave) {
      // 前回の編集から2秒以上経過した場合は履歴に保存する
      newEditHistory.push(text);
      setViewingHistoryIdx(newEditHistory.length - 1);
    } else {
      newEditHistory[viewingHistoryIdx] = text;
    }
    setEditHistory(newEditHistory);
    setPreEditUnix(nowUnix);
    setDocumentText(text);
  };

  const relatedDocumentProps = (liDocument: Document | DocumentHistory) => {
    return {
      onMouseOver: () => {
        setDocumentText(liDocument.text);
        setCanEdit(false);
      },
      onMouseLeave: () => {
        setDocumentText(editHistory[viewingHistoryIdx]);
        setCanEdit(true);
      },
      onClick: () => {
        const message = "読み込みますか？現在編集している文章は変更履歴に保存されます";
        if (!confirm(message)) return;
        onClickSave("読み込み完了");
        documentTextUpdate(liDocument.text);
      },
    };
  };

  return (
    <div className={styles.content}>
      <Head>
        <title>
          {company ? company.name : "企業未設定"} - {tag ? tag.name : "項目未設定"}
        </title>
      </Head>
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
          {relatedDocumentType === "tagList" && (
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
                        <li key={v.id} {...relatedDocumentProps(v)}>
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
                      return v.tagId === tag?.id && v.id !== document.id;
                    })
                    .map((v) => {
                      return (
                        <li key={v.id} {...relatedDocumentProps(v)}>
                          {RESTCompany.get(v.companyId, companyList)?.name ||
                            "企業未設定"}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </>
          )}
          {relatedDocumentType === "history" && (
            // 変更履歴を表示
            <div className={styles.section + " " + styles.related_document}>
              <h2 className={styles.section_title}>この文章の変更履歴</h2>
              <ul className={styles.list_wrapper}>
                {documentHistory
                  .filter((v) => {
                    return v.documentId === document.id;
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
                      <li key={v.id} {...relatedDocumentProps(v)}>
                        {v.updateDate ? updateText : "変更履歴不明"}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
          <div className={styles.section + " " + styles.toggle_btn_wrapper}>
            <button
              className={
                relatedDocumentType === "tagList" ? styles.active : styles.disable
              }
              onClick={() => {
                setRelatedDocumentType("tagList");
              }}
            >
              <FontAwesomeIcon className={styles.icon} icon={faList} />
              目次
            </button>
            <button
              className={
                relatedDocumentType === "history" ? styles.active : styles.disable
              }
              onClick={() => {
                setDocumentHistory(RESTHistory.getSpecificList(document.id));
                setRelatedDocumentType("history");
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
            {message && <p>{message}</p>}
            {!message && (
              <p>
                {selectionLength === 0 ? "" : selectionLength + "/"}
                {documentText.length}
                文字
              </p>
            )}
            <div className={styles.right}>
              <button className={styles.operation_btn} onClick={onClickDelete}>
                <FontAwesomeIcon className={styles.icon} icon={faTrash} />
                削除
              </button>
              <button
                className={styles.operation_btn}
                onClick={() => {
                  onClickSave();
                }}
              >
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
                documentTextUpdate(e.target.value);
              }}
              onSelect={() => {
                const selection = window.getSelection();
                if (selection && selection.type === "Range") {
                  setSelectionLength(selection.toString().length);
                } else {
                  setSelectionLength(0);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
