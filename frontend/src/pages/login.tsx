import { NextPage } from "next";
import Link from "next/link";

const Login: NextPage = () => {
  if(!process.env.NEXT_PUBLIC_BACKEND_URL)throw new Error("環境変数が定義されていません")
  return (
    <>
    <Link href={process.env.NEXT_PUBLIC_BACKEND_URL}>
      <a>ログイン</a>
    </Link>
    </>
  );
};

export default Login;
