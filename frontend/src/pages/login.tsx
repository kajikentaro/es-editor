import { NextPage } from "next";
import Link from "next/link";
import { backup } from "utils/verify";

const Login: NextPage = () => {
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
    const param = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: backup(),
    };
    const res = await fetch(REST_URL, param);
    const status = await res.json();
    alert(status);
  };

  return (
    <>
      <Link href={LOGIN_URL}>
        <a>ログイン</a>
      </Link>
      <button onClick={handleUpload}>アップロード</button>
      <button onClick={handleDownload}>ダウンロード</button>
    </>
  );
};

export default Login;
