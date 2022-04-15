import { NextPage } from "next";
import styles from "styles/Login.module.scss";
import useSWR from "swr";
import { backup } from "utils/verify";

interface Answer {
  isConnectionOK: boolean;
  isLogin?: boolean;
  mergeStatusMessage?: string;
  userId?: string;
  hoge?: string;
  serverLatestUuid?: string;
  localLatestUuid?: string;
}

export const fetchBackendAnaswer = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  const isLoginRes = await fetch("http://localhost:5000/test/is_login", {
    credentials: "include",
  });

  const ans: Answer = { isConnectionOK: isLoginRes.status === 200 };
  if (ans.isConnectionOK === false) {
    return ans;
  }

  const isLoginJson = await isLoginRes.json();
  ans.isLogin = isLoginJson.is_login;
  if (ans.isLogin === false) {
    return ans;
  }
  ans.userId = isLoginJson.user_id;

  const mustMergeRes = await fetch("http://localhost:5000/merge/", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ latestUuid: "hogehoge" }),
  });
  const mustMergeJson = await mustMergeRes.json();
  ans.mergeStatusMessage = mustMergeJson.must_merge
    ? "別のクライアントからの更新があります"
    : "最終データはこのPCによる更新です";
  ans.serverLatestUuid = mustMergeJson.latest_uuid;

  const cloudData = await fetch("http://localhost:5000/merge/get-all", {
    credentials: "include",
  });
  ans.hoge = await cloudData.text();

  return ans;
};

const Login: NextPage = () => {
  const { data: backendAns, error: backendError } = useSWR("fill", fetchBackendAnaswer);

  if (typeof backendAns === "undefined") {
    return (
      <div className={styles.container}>
        <p>ロード中</p>
        <p>{backendError && backendError.toString()}</p>
      </div>
    );
  }

  if (backendAns.isConnectionOK === false) {
    return (
      <div className={styles.container}>
        <p>通信エラー</p>
      </div>
    );
  }

  if (backendAns.isLogin === false) {
    return (
      <div className={styles.container}>
        <p>ログイン状態: 未ログイン</p>
        <Operation />
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div>
          <p>ログイン状態: ログイン中</p>
        </div>
        <div>
          <p>ユーザーID: {backendAns.userId}</p>
        </div>
        <div>
          <p>マージ状態: {backendAns.mergeStatusMessage}</p>
          <p>クラウドの最終更新識別用ID: {backendAns.serverLatestUuid}</p>
          <p>ローカルの最終更新識別用ID: {backendAns.localLatestUuid}</p>
        </div>
        <div>
          <p>クラウドのデータ:</p>
          <code>{backendAns.hoge}</code>
        </div>
        <div>
          <p>ローカルのデータ:</p>
          <code>{backup()}</code>
        </div>
        <Operation />
      </div>
    </>
  );
};

const Operation = () => {
  const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
  const LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URL;
  const REST_URL = process.env.NEXT_PUBLIC_REST_URL;

  if (!REST_URL) {
    throw new Error("環境変数が定義されていません");
  }

  const handleDownload = async () => {
    const param = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "mergeStatusMessage" }),
    };
    const res = await fetch(REST_URL, param);
    const status = await res.json();
    alert(status);
  };

  const handleUpload = async () => {
    const res = await fetch("http://localhost:5000/merge/sync", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: backup(),
    });
    console.log(await res.text());
  };
  return (
    <>
      <a href={LOGIN_URL}>ログイン</a>
      <a href={LOGOUT_URL}>ログアウト</a>
      <button onClick={handleUpload}>sync</button>
      <button onClick={handleDownload}>ダウンロード</button>
    </>
  );
};

export default Login;
