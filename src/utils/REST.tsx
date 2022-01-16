import { COMPANY_KEY, DOCUMENT_KEY, HISTORY_KEY, TAG_KEY } from "consts/key";
import {
  Company,
  Document,
  DocumentHistory,
  Item,
  REST,
  Tag,
} from "interfaces/interfaces";
import { getLocalStorage } from "utils/storage";
import { setLocalStorage } from "./storage";

// ストレージとのデータのやり取りはすべてこのクラスを介して行う。
class RESTMother<T extends Item> implements REST<T> {
  KEY: string;
  constructor(KEY: string) {
    this.KEY = KEY;
  }
  // リスト取得
  getList() {
    let res = getLocalStorage(this.KEY) as T[];
    res = res.sort((a: T, b: T) => {
      const aTime = a.updateDate || 0;
      const bTime = a.updateDate || 0;
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
    setLocalStorage(this.KEY, body);
  }
  // 更新. なかったら新規作成
  put(id: string, body: T) {
    let list = this.delete_(id);
    body.updateDate = new Date().getTime();
    list.push(body);
    setLocalStorage(this.KEY, list);
  }
  // 削除(削除後のデータ返す)
  delete_ = (id: string) => {
    let list = this.getList().filter((v) => {
      return v.id !== id;
    });
    this.putList(list);
    return list;
  };
}

export const RESTCompany = new RESTMother<Company>(COMPANY_KEY);
export const RESTTag = new RESTMother<Tag>(TAG_KEY);
export const RESTDocument = new RESTMother<Document>(DOCUMENT_KEY);
export const RESTHistory = new RESTMother<DocumentHistory>(HISTORY_KEY);
