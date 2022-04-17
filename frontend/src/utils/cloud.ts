import { LATEST_UUID } from "consts/key";
import { LOGIN_CHECK_URL } from "consts/url";
import { setLocalStorage } from "./storage";

type PutCloud = <T>(entrypointUrl: string, body: T) => Promise<void>;
export const putCloud: PutCloud = async (entrypointUrl, body) => {
  if (!(await isLogin())) {
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

export const isLogin = async () => {
  const res = await fetch(LOGIN_CHECK_URL, {
    credentials: "include",
  });

  if (res.status !== 200) {
    return false;
  }

  const resJson = await res.json();
  return resJson.isLogin;
};
