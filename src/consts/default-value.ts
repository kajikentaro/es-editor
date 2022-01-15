import { Document } from "interfaces/interfaces";
import { genRandomId } from "utils/utils";

export const defaultDocument: Document = {
  documentId: "",
  companyId: genRandomId(),
  tagId: genRandomId(),
  text: "",
  wordCount: 0,
};
