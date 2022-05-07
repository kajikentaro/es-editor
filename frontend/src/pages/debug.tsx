import { LATEST_UUID } from "consts/key";
import { DOWNLOAD_URL, IS_LOGIN_URL, MERGE_URL } from "consts/url";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "styles/Debug.module.scss";
import useSWR from "swr";
import {
  dropCloudAllEntry,
  loginES,
  logoutES,
  replaceLocalFromCloud,
  updateCloudEntry,
} from "utils/cloud";
import { getLocalStorage } from "utils/storage";
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
  const isLoginRes = await fetch(IS_LOGIN_URL, {
    credentials: "include",
  });

  const ans: Answer = { isConnectionOK: isLoginRes.status === 200 };
  if (ans.isConnectionOK === false) {
    return ans;
  }

  const isLoginJson = await isLoginRes.json();
  ans.isLogin = isLoginJson.isLogin;
  if (ans.isLogin === false) {
    return ans;
  }
  ans.userId = isLoginJson.userId;

  const mustMergeRes = await fetch(MERGE_URL, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ latestUuid: getLocalStorage(LATEST_UUID) }),
  });
  const mustMergeJson = await mustMergeRes.json();
  ans.mergeStatusMessage = mustMergeJson.must_merge
    ? "別のクライアントからの更新があります"
    : "最終データはこのPCによる更新です";
  ans.serverLatestUuid = mustMergeJson.latestUuid;

  const cloudData = await fetch(DOWNLOAD_URL, {
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
        <p>ローカルの最終更新識別用ID: {getLocalStorage(LATEST_UUID)}</p>
        <Operation />
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
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
          <p>ローカルの最終更新識別用ID: {getLocalStorage(LATEST_UUID)}</p>
        </div>
        <Operation />
      </div>
      <div className={styles.block}>
        <div>
          <p>クラウドのデータ:</p>
          <div className={styles.code_wrapper}>
            <code>{backendAns.hoge}</code>
          </div>
        </div>
        <div>
          <p>ローカルのデータ:</p>
          <div className={styles.code_wrapper}>
            <code>{backup(true)}</code>
          </div>
        </div>
      </div>
    </>
  );
};

const Operation = () => {
  const router = useRouter();

  const handleReplaceLocal = async () => {
    if (await updateCloudEntry()) {
      router.reload();
    }
  };

  const handlePushCloud = async () => {
    if (await replaceLocalFromCloud()) {
      router.reload();
    }
  };

  const handleDropAll = async () => {
    if (await dropCloudAllEntry()) {
      router.reload();
    }
  };

  return (
    <div className={styles.operations}>
      <button onClick={loginES}>ログイン</button>
      <button onClick={logoutES}>ログアウト</button>
      <button onClick={handlePushCloud}>クラウドにプッシュする</button>
      <button onClick={handleReplaceLocal}>ローカルをクラウドのデータに置き換える</button>
      <button onClick={handleDropAll}>このユーザーのクラウドの全データを削除する </button>
    </div>
  );
};

export default Login;
