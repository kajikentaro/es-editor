import logo from "img/logo.png";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "styles/Header.module.scss";

const Header: NextPage = () => {
  const router = useRouter();

  const injectClassName = () => {
    let className = styles.content;
    if (router.pathname === "/") {
      className += " " + styles.reverse;
    }
    return className;
  };

  return (
    <header className={styles.header}>
      <div className={injectClassName()}>
        {router.pathname !== "/" && (
          <Link href="/">
            <div className={styles.icon}>
              <Image src={logo} height={60} width={271} />
            </div>
          </Link>
        )}
        <div className={styles.operation_btn}>
          <Link href="/">サイトトップ</Link>
          <Link href="/list">一覧</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
