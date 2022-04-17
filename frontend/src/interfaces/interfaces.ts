export interface Document extends Item {
  id: string;
  historyId: string;
  name: string; //使わない
  companyId: string;
  tagId: string;
  text: string;
  wordCount: number;
  updateDate?: number;
}

export interface DocumentHistory extends Item {
  id: string;
  documentId: string; //重複があり得る
  name: string; //使わない
  companyId: string;
  tagId: string;
  text: string;
  wordCount: number;
  updateDate?: number;
}

export interface Item {
  id: string;
  name: string;
  updateDate?: number;
}

export interface Tag extends Item {
  id: string;
  name: string;
  updateDate?: number;
}

export interface Company extends Item {
  id: string;
  name: string;
  updateDate?: number;
}

export interface REST<T extends Item> {
  STORAGE_KEY: string;
  ENTRYPOINT_URL?: string;
  getList: () => T[];
  get: (id: string, cache: T[] | undefined) => T | undefined;
  putList: (body: T[]) => void;
  put: (id: string, body: T) => void;
  delete_: (id: string) => T[];
}

export interface PageProps {
  companyList: Company[];
  tagList: Tag[];
  documentList: Document[];
  updateCompanyList: () => void;
  updateTagList: () => void;
  updateDocumentList: () => void;
}
