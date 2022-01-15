export interface Document {
  companyId: string;
  tagId: string;
  documentId: string;
  text: string;
  wordCount: number;
}

export interface Tag {
  tagId: string;
  tagName: string;
}
export interface Company {
  companyId: string;
  companyName: string;
}
