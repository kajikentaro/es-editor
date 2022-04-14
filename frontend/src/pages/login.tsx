import { NextPage } from "next";
import Link from "next/link";
import styles from "styles/Login.module.scss";
import useSWR from "swr";
import { backup } from "utils/verify";

const fetcherJson = async (url: string, param: object) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    credentials: "include",
    body: JSON.stringify(param),
  });
  return await res.text();
};
const fetcherText = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  return await res.text();
};

const Login: NextPage = () => {
  const { data: isLogin, error: isLoginError } = useSWR(
    "http://localhost:5000/test/is_login",
    fetcherText
  );
  const { data: isMerge, error: isMergeError } = useSWR(
    ["http://localhost:5000/merge/", { latestUuid: "hogehoge" }],
    fetcherJson
  );
  const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
  const REST_URL = process.env.NEXT_PUBLIC_REST_URL;
  if (!LOGIN_URL || !REST_URL) {
    throw new Error("環境変数が定義されていません");
  }

  const handleDownload = async () => {
    const param = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Hoge" }),
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
      <div className={styles.container}>
        <p>
          ログイン状態: {isLogin}
          {isLoginError && isLoginError.toString()}
        </p>
        <p>
          マージ状態: {isMerge}
          {isMergeError && isMergeError.toString()}
        </p>
        <Link href={LOGIN_URL}>
          <a>ログイン</a>
        </Link>
        <button onClick={handleUpload}>sync</button>
        <button onClick={handleDownload}>ダウンロード</button>
      </div>
    </>
  );
};

export default Login;
