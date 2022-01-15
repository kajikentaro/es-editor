export interface Document {
  companyId: string;
  tagId: string;
  documentId: string;
  text: string;
  wordCount: number;
}

export interface Tag {
  id: string;
  name: string;
}
export interface Company {
  id: string;
  name: string;
}
