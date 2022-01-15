import { faHistory, faRedo, faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { defaultDocument } from "consts/default-value";
import { Company, Tag } from "interfaces/interfaces";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ActionMeta, GroupBase } from "react-select";
import styles from "styles/Edit.module.scss";
import { RESTCompany, RESTDocument, RESTTag } from "utils/REST";
const Creatable = dynamic(import("react-select/creatable"), { ssr: false });

let document = defaultDocument;

let preEditUnix = 0;
let viewingHistoryIdx = 0;
let editHistory: string[] = [""];

type OptionType<T> = {
  item: T;
  value: string;
  label: string;
};
type JSXType<T> = {
  item: T | undefined;
  onSelectItem: (option: OptionType<T> | null, actionMeta: ActionMeta<OptionType<T>>) => void;
  itemList: T[];
};

const CompanyJSX: React.VFC<JSXType<Company>> = (props) => {
  const { item, onSelectItem, itemList } = props;

  const Select = <CompanyOption, IsMulti extends boolean = false, Group extends GroupBase<CompanyOption> = GroupBase<CompanyOption>>(
    props: CompanyOption | IsMulti | Group
  ) => {
    return <Creatable {...props} className={styles.creatable} theme={(theme) => ({ ...theme, borderRadius: 0 })} />;
  };
  const SelectProps = {
    onChange: onSelectItem,
    defaultValue: { value: "default-0", label: "ここに項目を入力" },
    formatCreateLabel: (inputValue: string) => {
      if (item) {
        return inputValue + " に名前変更";
      } else {
        return inputValue + " を新規作成";
      }
    },
    options: itemList.map((v) => {
      return {
        value: v.companyName,
        label: v.companyName,
        item: v,
      };
    }),
  };
  return Select(SelectProps);
};

const Home: NextPage = () => {
  const router = useRouter();
  const { documentId } = router.query;
  const [documentText, setDocumentText] = useState<string>("");
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [tag, setTag] = useState<Tag | undefined>(undefined);

  useEffect(() => {
    if (!documentId) return;
    document = RESTDocument.get(documentId as string) || document;
    if (document.documentId) {
      // 存在した場合
      editHistory[viewingHistoryIdx] = document.text;
      setCompany(RESTCompany.get(document.companyId));
      setTag(RESTTag.get(document.tagId));
      setDocumentText(document.text);
    } else {
      // 存在しない場合
      document.documentId = documentId as string;
    }
    console.log(document);
  }, [documentId]);
  useEffect(() => {
    setCompanyList(RESTCompany.getList());
    setTagList(RESTTag.getList());
  }, []);

  const onSelectCompany = (option: OptionType<Company> | null, actionMeta: ActionMeta<OptionType<Company>>) => {
    if (!option || !option.value) return;
    if (actionMeta.action === "create-option") {
      setCompany({
        companyName: option.value,
        companyId: document.companyId,
      });
    }
    if (actionMeta.action === "select-option") {
      console.log("!!!", option);
      setCompany({
        companyName: option.item.companyName,
        companyId: option.item.companyId,
      });
    }
  };

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
            <CompanyJSX item={company} onSelectItem={onSelectCompany} itemList={companyList} />
          </div>
        </div>
        <div className={styles.section}>
          <h2>企業名</h2>
          <div className={styles.row}>
            <CompanyJSX item={company} onSelectItem={onSelectCompany} itemList={companyList} />
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
        {company?.companyId}/{company?.companyName}
      </div>
      <div className={styles.third}></div>
    </div>
  );
};

export default Home;
