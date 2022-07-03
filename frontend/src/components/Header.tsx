import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "img/logo.png";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "styles/Header.module.scss";
import { isBackendLogin, loginES, logoutES } from "utils/cloud";
import Sidebar from "./Sidebar";

const Header: NextPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<"login" | "logout" | "loading">("loading");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const injectClassName = () => {
    let className = styles.content;
    if (router.pathname === "/") {
      className += " " + styles.reverse;
    }
    return className;
  };

  useEffect(() => {
    (async () => {
      setIsLogin((await isBackendLogin()) ? "login" : "logout");
    })();
  }, [router.asPath]);

  return (
    <>
      <header className={styles.header}>
        <div className={injectClassName()}>
          {router.pathname !== "/" && (
            <Link href="/" passHref>
              <div className={styles.logo}>
                <Image src={logo} height={60} width={271} alt="ロゴ" />
              </div>
            </Link>
          )}
          <div className={styles.operation_btn}>
            {isLogin === "login" && <button onClick={logoutES}>ログアウト</button>}
            {isLogin === "logout" && (
              <button onClick={loginES} className={styles.login_button}>
                ログイン
              </button>
            )}
            <Link href="/">サイトトップ</Link>
            <Link href="/list">一覧</Link>
          </div>
          <button
            className={styles.hamberger_btn}
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            <FontAwesomeIcon icon={faBars} className={styles.icon} />
          </button>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isLogin={isLogin} />
    </>
  );
};

export default Header;
