import { COMPANY_KEY, DOCUMENT_KEY, HISTORY_KEY, TAG_KEY } from "consts/key";
import { Document, DocumentHistory, Item } from "interfaces/interfaces";
import { RESTCompany, RESTDocument, RESTHistory, RESTTag } from "utils/REST";

export function isItemList(arg: any): arg is Item[] {
  if (Array.isArray(arg)) {
    arg.forEach((v) => {
      if (isItem(v) === false) {
        return false;
      }
    });
    return true;
  } else {
    return false;
  }
}

export function isDocumentHistoryList(arg: any): arg is DocumentHistory[] {
  if (Array.isArray(arg)) {
    arg.forEach((v) => {
      if (isDocumentHistory(v) === false) {
        return false;
      }
    });
    return true;
  } else {
    return false;
  }
}

export function isDocumentList(arg: any): arg is Document[] {
  if (Array.isArray(arg)) {
    arg.forEach((v) => {
      if (isDocument(v) === false) {
        return false;
      }
    });
    return true;
  } else {
    return false;
  }
}

export function isDocument(arg: any): arg is Document {
  return (
    typeof arg.companyId === "string" &&
    typeof arg.tagId === "string" &&
    typeof arg.text === "string" &&
    typeof arg.wordCount === "number" &&
    isItem(arg)
  );
}

export function isDocumentHistory(arg: any): arg is DocumentHistory {
  return typeof arg.documentId === "string" && isDocument(arg);
}

export function isItem(arg: any): arg is Item {
  return (
    typeof arg.id === "string" &&
    typeof arg.name === "string" &&
    typeof arg.updateDate === "number"
  );
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

export const restore = (jsonStr: string) => {
  const backupData = JSON.parse(jsonStr);
  if (isValidityBackup(backupData)) {
    if (!confirm("今あるデータは削除され、上書きされます。復元しますか？")) {
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
  backupData[HISTORY_KEY] = RESTDocument.getList();
  return JSON.stringify(backupData);
};
