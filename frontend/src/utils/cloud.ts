import { LATEST_UUID } from "consts/key";
import { CHECK_LOGIN_URL, DOWNLOAD_URL, DROP_ALL_URL, SYNC_URL } from "consts/url";
import { getLocalStorage, setLocalStorage } from "./storage";
import { backup, restore } from "./verify";

type putCloudItem = <T>(entrypointUrl: string, body: T) => Promise<void>;
export const putCloudItem: putCloudItem = async (entrypointUrl, body) => {
  if (!(await isBackendLogin())) {
    console.debug("未ログイン");
    return;
  }

  const res = await fetch(entrypointUrl, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res.status !== 200) {
    console.error("バックエンドとの通信に失敗しました");
  }
  const resJson = await res.json();
  if (resJson && resJson.uuid) {
    setLocalStorage(LATEST_UUID, resJson.uuid);
    console.debug("クラウドアップデートに成功");
  } else {
    console.error("サーバーDBまたはローカルストレージの保存に失敗しました");
  }
};

type DeleteCloudItem = <T>(entrypointUrl: string, id: string) => Promise<void>;
export const deleteCloudItem: DeleteCloudItem = async (entrypointUrl, id) => {
  if (!(await isBackendLogin())) {
    console.debug("未ログイン");
    return;
  }

  const res = await fetch(entrypointUrl + encodeURIComponent(id), {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "DELETE",
  });
  if (res.status !== 200) {
    console.error("バックエンドとの通信に失敗しました");
  }
  const resJson = await res.json();
  if (resJson && resJson.uuid) {
    setLocalStorage(LATEST_UUID, resJson.uuid);
    console.debug("クラウドアップデートに成功");
  } else {
    console.error("サーバーDBまたはローカルストレージの保存に失敗しました");
  }
};

export const isBackendLogin: () => Promise<boolean> = async () => {
  const res = await fetch(CHECK_LOGIN_URL, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ latestUuid: getLocalStorage(LATEST_UUID) }),
  });

  if (res.status !== 200) {
    return false;
  }

  const resJson = await res.json();
  if (resJson.isLogin) {
    if (resJson.mustMerge) {
      console.debug("ログイン中: 同期を開始します");
      syncCloudEntry();
    } else {
      console.debug("ログイン中: 同期は不要です");
    }
    return true;
  }
  console.debug("未ログイン");
  return false;
};

export const syncCloudEntry = async () => {
  if ((await updateCloudEntry()) && (await replaceLocalFromCloud())) {
    console.debug("クラウドとのデータ同期に成功");
    window.location.reload();
  } else {
    console.error("クラウドとのデータリンクに失敗");
  }
};

export const updateCloudEntry = async () => {
  const res = await fetch(SYNC_URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    credentials: "include",
    body: backup(),
  });
  const resJson = await res.json();
  if (resJson && resJson.uuid) {
    setLocalStorage(LATEST_UUID, resJson.uuid);
    return true;
  } else {
    console.error("クラウドへのデータプッシュに失敗しました");
  }
  return false;
};

export const dropCloudAllEntry = async () => {
  const res = await fetch(DROP_ALL_URL, {
    credentials: "include",
  });
  const resJson = await res.json();
  if (resJson && resJson.uuid) {
    setLocalStorage(LATEST_UUID, resJson.uuid);
    return true;
  } else {
    console.error("全データ削除に失敗しました");
  }
  return false;
};

export const replaceLocalFromCloud = async () => {
  const res = await fetch(DOWNLOAD_URL, {
    credentials: "include",
  });
  const resJson = await res.json();
  if (!resJson) {
    console.error("データダウンロードに失敗しました");
  }
  const result = restore(JSON.stringify(resJson), false);
  if (result === "success") {
    return true;
  } else {
    console.error("データインストールに失敗しました");
  }
  return false;
};
