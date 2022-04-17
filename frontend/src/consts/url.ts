export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("環境変数が読み込まれていません");
}

export const DOCUMENT_ENTRYPOINT_URL = BACKEND_URL + "/document/";
export const TAG_ENTRYPOINT_URL = BACKEND_URL + "/tag/";
export const COMPANY_ENTRYPOINT_URL = BACKEND_URL + "/company/";

export const LOGIN_URL = BACKEND_URL + "/login";
export const LOGOUT_URL = BACKEND_URL + "/logout";

export const LOGIN_CHECK_URL = BACKEND_URL + "/test/is_login";
export const MERGE_URL = BACKEND_URL + "/merge/";
export const DOWNLOAD_URL = BACKEND_URL + "/merge/download";
export const SYNC_URL = BACKEND_URL + "/merge/sync";
export const DROP_ALL_URL = BACKEND_URL + "/test/drop_all";
