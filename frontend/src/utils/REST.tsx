import { COMPANY_KEY, DOCUMENT_KEY, HISTORY_KEY, TAG_KEY } from "consts/key";
import {
  COMPANY_ENTRYPOINT_URL,
  DOCUMENT_ENTRYPOINT_URL,
  TAG_ENTRYPOINT_URL,
} from "consts/url";
import {
  Company,
  Document,
  DocumentHistory,
  Item,
  REST,
  Tag,
} from "interfaces/interfaces";
import { getLocalStorage } from "utils/storage";
import { deleteCloudItem, putCloudItem } from "./cloud";
import { setLocalStorage } from "./storage";

// ストレージとのデータのやり取りはすべてこのクラスを介して行う。
class RESTMother<T extends Item> implements REST<T> {
  STORAGE_KEY: string;
  ENTRYPOINT_URL?: string;
  constructor(STORAGE_KEY: string, ENTRYPOINT_URL?: string) {
    this.STORAGE_KEY = STORAGE_KEY;
    this.ENTRYPOINT_URL = ENTRYPOINT_URL;
  }
  // リスト取得
  getList() {
    let res = getLocalStorage(this.STORAGE_KEY) as T[];
    res = res.sort((a: T, b: T) => {
      const aTime = a.updateDate || 0;
      const bTime = b.updateDate || 0;
      if (aTime < bTime) {
        return 1;
      } else {
        return -1;
      }
    });
    return res;
  }
  // 取得
  get(id: string, cache: T[] | undefined = undefined) {
    const res = (cache || this.getList()).find((v) => {
      return v.id === id;
    });
    return res;
  }
  // リスト更新する。
  putList(body: T[]) {
    setLocalStorage(this.STORAGE_KEY, body);
  }
  // 更新. なかったら新規作成
  put(id: string, body: T) {
    let list = this.delete_(id, true);
    body.updateDate = new Date().getTime();
    list.push(body);
    setLocalStorage(this.STORAGE_KEY, list);
    if (this.ENTRYPOINT_URL) {
      putCloudItem(this.ENTRYPOINT_URL, body);
    }
  }
  // 削除(削除後のデータ返す)
  delete_ = (id: string, isUpdate?: boolean) => {
    let list = this.getList().filter((v) => {
      return v.id !== id;
    });
    this.putList(list);
    if (this.ENTRYPOINT_URL && !isUpdate) {
      deleteCloudItem(this.ENTRYPOINT_URL, id);
    }
    return list;
  };
}

class RestHistoryClass extends RESTMother<DocumentHistory> {
  getSpecificList(documentId: string): DocumentHistory[] {
    let res = super.getList();
    res = res.filter((v) => v.documentId === documentId);
    res.sort;
    res = res.sort((a, b) => {
      const aTime = a.updateDate || 0;
      const bTime = b.updateDate || 0;
      if (aTime < bTime) {
        return 1;
      } else {
        return -1;
      }
    });
    return res;
  }
}

export const RESTCompany = new RESTMother<Company>(COMPANY_KEY, COMPANY_ENTRYPOINT_URL);
export const RESTTag = new RESTMother<Tag>(TAG_KEY, TAG_ENTRYPOINT_URL);
export const RESTDocument = new RESTMother<Document>(
  DOCUMENT_KEY,
  DOCUMENT_ENTRYPOINT_URL
);
export const RESTHistory = new RestHistoryClass(HISTORY_KEY);
