import { Document } from "interfaces/interfaces";
import { genRandomId } from "utils/utils";

export const getDefaultDocument = (documentId: string): Document => {
  return {
    id: documentId,
    historyId: genRandomId(),
    name: "",
    companyId: "",
    tagId: "",
    text: "",
    wordCount: 0,
  };
};
