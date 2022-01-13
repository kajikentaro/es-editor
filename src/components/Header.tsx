import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "styles/Header.module.scss";

const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.icon} />
      </div>
    </header>
  );
};

export default Header;
