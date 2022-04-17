import { LATEST_UUID } from "consts/key";
import {
  DOWNLOAD_URL,
  DROP_ALL_URL,
  LOGIN_CHECK_URL,
  LOGIN_URL,
  LOGOUT_URL,
  MERGE_URL,
  SYNC_URL,
} from "consts/url";
import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "styles/Login.module.scss";
import useSWR from "swr";
import { getLocalStorage, setLocalStorage } from "utils/storage";
import { backup, restore } from "utils/verify";

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
  const isLoginRes = await fetch(LOGIN_CHECK_URL, {
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
  ans.serverLatestUuid = mustMergeJson.latest_uuid;

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
            <code>{backup()}</code>
          </div>
        </div>
      </div>
    </>
  );
};

const Operation = () => {
  const router = useRouter();

  const handleReplaceLocal = async () => {
    const res = await fetch(DOWNLOAD_URL, {
      credentials: "include",
    });
    const resJson = await res.json();
    if (!resJson) {
      console.error("データダウンロードに失敗しました");
    }
    const result = restore(JSON.stringify(resJson), false);
    if (result === "success") {
      router.reload();
    } else {
      console.error("データインストールに失敗しました");
    }
  };

  const handlePushCloud = async () => {
    const res = await fetch(SYNC_URL, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: backup(),
    });
    const resJson = await res.json();
    if (resJson && resJson.uuid) {
      setLocalStorage(LATEST_UUID, resJson.uuid);
      router.reload();
    } else {
      console.error("クラウドへのデータプッシュに失敗しました");
    }
  };

  const handleDropAll = async () => {
    const res = await fetch(DROP_ALL_URL, {
      credentials: "include",
    });
    const resJson = await res.json();
    if (resJson && resJson.uuid) {
      setLocalStorage(LATEST_UUID, resJson.uuid);
      router.reload();
    } else {
      console.error("全データ削除に失敗しました");
    }
  };

  return (
    <div className={styles.operations}>
      <a href={LOGIN_URL}>ログイン</a>
      <a href={LOGOUT_URL}>ログアウト</a>
      <button onClick={handlePushCloud}>クラウドにプッシュする</button>
      <button onClick={handleReplaceLocal}>ローカルをクラウドのデータに置き換える</button>
      <button onClick={handleDropAll}>このユーザーのクラウドの全データを削除する </button>
    </div>
  );
};

export default Login;
