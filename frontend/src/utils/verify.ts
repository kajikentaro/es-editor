import { COMPANY_KEY, DOCUMENT_KEY, HISTORY_KEY, TAG_KEY } from "consts/key";
import { Document, DocumentHistory, Item } from "interfaces/interfaces";
import { RESTCompany, RESTDocument, RESTHistory, RESTTag } from "utils/REST";
import { genRandomId } from "./utils";

function isHaveSameKeys(a: object, b: object) {
  const keyListA = Object.keys(a).sort();
  const keyListB = Object.keys(b).sort();
  if (keyListA.toString() === keyListB.toString()) {
    return true;
  } else {
    return false;
  }
}

export function isItemList(arg: any) {
  if (!Array.isArray(arg)) {
    return false;
  }

  const sampleItem: Item = {
    id: "sample",
    name: "sample",
    updateDate: 123,
  };

  for (let i of arg) {
    if (typeof i !== "object") {
      return false;
    }
    if (!isHaveSameKeys(sampleItem, i)) {
      return false;
    }
  }
  return true;
}

export function isDocumentHistoryList(arg: any) {
  if (!Array.isArray(arg)) {
    return false;
  }

  const sampleItem: DocumentHistory = {
    id: "sample",
    documentId: "sample",
    name: "sample",
    companyId: "sample",
    tagId: "sample",
    text: "sample",
    wordCount: 123,
    updateDate: 123,
  };

  for (let i of arg) {
    if (typeof i !== "object") {
      return false;
    }
    if (!isHaveSameKeys(sampleItem, i)) {
      return false;
    }
  }
  return true;
}

export function isDocumentList(arg: any) {
  if (!Array.isArray(arg)) {
    return false;
  }

  const sampleItem: Document = {
    id: "sample",
    historyId: "sample",
    name: "sample",
    companyId: "sample",
    tagId: "sample",
    text: "sample",
    wordCount: 123,
    updateDate: 123,
  };

  for (let i of arg) {
    if (typeof i !== "object") {
      return false;
    }
    if (!isHaveSameKeys(sampleItem, i)) {
      return false;
    }
  }
  return true;
}

export const isValidityBackup = (backupData: any) => {
  return (
    backupData[COMPANY_KEY] &&
    isItemList(backupData[COMPANY_KEY]) &&
    backupData[TAG_KEY] &&
    isItemList(backupData[TAG_KEY]) &&
    backupData[DOCUMENT_KEY] &&
    isDocumentList(backupData[DOCUMENT_KEY]) &&
    backupData[HISTORY_KEY] &&
    isDocumentHistoryList(backupData[HISTORY_KEY])
  );
};

export const restore = (jsonStr: string, mustBeConfirm: boolean = true) => {
  const backupData = JSON.parse(jsonStr);

  // 前バージョンとの整合性保持
  for (let i of backupData[DOCUMENT_KEY]) {
    if (typeof i.historyId === "undefined") {
      i.historyId = genRandomId();
    }
  }
  // 前バージョンとの整合性保持
  for (let i of backupData[HISTORY_KEY]) {
    if (typeof i.documentId === "undefined" && typeof i.id === "string") {
      i.documentId = i.id;
      i.id = genRandomId();
    }
  }
  if (isValidityBackup(backupData)) {
    if (
      mustBeConfirm &&
      !confirm("今あるデータは削除され、上書きされます。復元しますか？")
    ) {
      return "cancel";
    }
    RESTCompany.putList(backupData[COMPANY_KEY]);
    RESTTag.putList(backupData[TAG_KEY]);
    RESTDocument.putList(backupData[DOCUMENT_KEY]);
    RESTHistory.putList(backupData[HISTORY_KEY]);
    return "success";
  } else {
    return "failure";
  }
};

export const backup = () => {
  let backupData: any = {};
  backupData[COMPANY_KEY] = RESTCompany.getList();
  backupData[TAG_KEY] = RESTTag.getList();
  backupData[DOCUMENT_KEY] = RESTDocument.getList();
  backupData[HISTORY_KEY] = RESTHistory.getList();

  // 前バージョンとの整合性保持
  for (let i of backupData[DOCUMENT_KEY]) {
    if (typeof i.historyId === "undefined") {
      i.historyId = genRandomId();
    }
  }
  // 前バージョンとの整合性保持
  for (let i of backupData[HISTORY_KEY]) {
    if (typeof i.documentId === "undefined" && typeof i.id === "string") {
      i.documentId = i.id;
      i.id = genRandomId();
    }
  }
  if (!isValidityBackup(backupData)) {
    alert("バックアップに失敗しました");
    throw new Error("バックアップに失敗しました");
  }
  return JSON.stringify(backupData);
};
