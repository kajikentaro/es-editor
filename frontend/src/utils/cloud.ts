import { LATEST_UUID } from "consts/key";
import { DOWNLOAD_URL, DROP_ALL_URL, LOGIN_CHECK_URL, SYNC_URL } from "consts/url";
import { getLocalStorage, setLocalStorage } from "./storage";
import { backup, restore } from "./verify";

type PutCloud = <T>(entrypointUrl: string, body: T) => Promise<void>;
export const putCloud: PutCloud = async (entrypointUrl, body) => {
  if (!(await isBackendLogin())) {
    console.log("未ログイン");
    return;
  }

  const res = await fetch(entrypointUrl, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res.status !== 200) {
    console.log("通信エラー");
  }
  const resJson = await res.json();
  console.log(resJson);
  if (resJson && resJson.uuid) {
    setLocalStorage(LATEST_UUID, resJson.uuid);
    console.log("クラウドアップデートに成功");
  } else {
    console.error("保存エラー");
  }
};

export const isBackendLogin: () => Promise<boolean> = async () => {
  const res = await fetch(LOGIN_CHECK_URL, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ latestUuid: getLocalStorage(LATEST_UUID) }),
  });

  if (res.status !== 200) {
    return false;
  }
  return true;

  const resJson = await res.json();
  if (resJson.isLogin) {
    if (resJson.mustMerge) {
      syncCloudEntry();
    }
    return true;
  }
  return false;
};

export const syncCloudEntry = async () => {
  const isSuccess = await updateCloudEntry();
  if (isSuccess) {
    await replaceLocalFromCloud();
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
