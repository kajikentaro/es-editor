import logo from "img/logo.png";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "styles/Header.module.scss";

const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <div className={styles.icon}>
            <Image src={logo} height={60} width={271} />
          </div>
        </Link>
        <div className={styles.operation_btn}>
          <Link href="/">サイトトップ</Link>
          <Link href="/list">一覧</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
