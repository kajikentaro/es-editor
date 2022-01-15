import { COMPANY_KEY, DOCUMENT_KEY, TAG_KEY } from "consts/key";
import { Company, Document, Tag } from "interfaces/interfaces";
import { getLocalStorage } from "utils/storage";
import { setLocalStorage } from "./storage";

export namespace RESTDocument {
  const KEY = DOCUMENT_KEY;
  // リスト取得
  export const getList = () => {
    const res = getLocalStorage(KEY) as Document[];
    return res;
  };
  // 取得
  export const get = (id: string) => {
    const res = getList().find((v) => {
      return v.documentId === id;
    });
    return res;
  };
  // リスト更新する。
  const putList = (body: Document[]) => {
    setLocalStorage(KEY, body);
  };
  // 更新. なかったら新規作成
  export const put = (id: string, body: Document) => {
    let list = delete_(id);
    list.push(body);
    setLocalStorage(KEY, list);
  };
  // 削除(削除後のデータ返す)
  export const delete_ = (id: string) => {
    let list = getList().filter((v) => {
      return v.documentId !== id;
    });
    putList(list);
    return list;
  };
}
export namespace RESTTag {
  const KEY = TAG_KEY;
  // リスト取得
  export const getList = () => {
    const res = getLocalStorage(KEY) as Tag[];
    return res;
  };
  // 取得
  export const get = (id: string, cache: Tag[] | undefined = undefined) => {
    const res = (cache || getList()).find((v) => {
      return v.id === id;
    });
    return res;
  };
  // リスト更新する。
  const putList = (body: Tag[]) => {
    setLocalStorage(KEY, body);
  };
  // 更新. なかったら新規作成
  export const put = (id: string, body: Tag) => {
    let list = delete_(id);
    list.push(body);
    setLocalStorage(KEY, list);
  };
  // 削除(削除後のデータ返す)
  export const delete_ = (id: string) => {
    let list = getList().filter((v) => {
      return v.id !== id;
    });
    putList(list);
    return list;
  };
}
export namespace RESTCompany {
  const KEY = COMPANY_KEY;
  // リスト取得
  export const getList = () => {
    const res = getLocalStorage(KEY) as Company[];
    return res;
  };
  // 取得
  export const get = (id: string, cache: Company[] | undefined = undefined) => {
    const res = (cache || getList()).find((v) => {
      return v.id === id;
    });
    return res;
  };
  // リスト更新する。
  const putList = (body: Company[]) => {
    setLocalStorage(KEY, body);
  };
  // 更新. なかったら新規作成
  export const put = (id: string, body: Company) => {
    let list = delete_(id);
    list.push(body);
    setLocalStorage(KEY, list);
  };
  // 削除(削除後のデータ返す)
  export const delete_ = (id: string) => {
    let list = getList().filter((v) => {
      return v.id !== id;
    });
    putList(list);
    return list;
  };
}
