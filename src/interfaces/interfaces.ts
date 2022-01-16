export interface Document {
  companyId: string;
  tagId: string;
  documentId: string;
  text: string;
  wordCount: number;
}

export interface Item {
  id: string;
  name: string;
}

export interface Tag extends Item {
  id: string;
  name: string;
}
export interface Company extends Item {
  id: string;
  name: string;
}
