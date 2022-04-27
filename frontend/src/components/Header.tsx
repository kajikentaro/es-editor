import { LOGIN_URL, LOGOUT_URL } from "consts/url";
import logo from "img/logo.png";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "styles/Header.module.scss";
import { isBackendLogin } from "utils/cloud";

const Header: NextPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const injectClassName = () => {
    let className = styles.content;
    if (router.pathname === "/") {
      className += " " + styles.reverse;
    }
    return className;
  };

  useEffect(() => {
    (async () => {
      setIsLogin(await isBackendLogin());
    })();
  }, [router.asPath]);

  return (
    <header className={styles.header}>
      <div className={injectClassName()}>
        {router.pathname !== "/" && (
          <Link href="/" passHref>
            <div className={styles.icon}>
              <Image src={logo} height={60} width={271} alt="ロゴ" />
            </div>
          </Link>
        )}
        <div className={styles.operation_btn}>
          {isLogin && <a href={LOGOUT_URL}>ログアウト</a>}
          {!isLogin && <a href={LOGIN_URL}>ログイン</a>}
          <Link href="/">サイトトップ</Link>
          <Link href="/list">一覧</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
