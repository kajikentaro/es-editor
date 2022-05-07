import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import styles from "styles/Sidebar.module.scss";
import { loginES, logoutES } from "utils/cloud";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isLogin: boolean;
}

const Sidebar: NextPage<Props> = (props) => {
  const injectClassName = () => {
    const classNameList = [styles.sidebar];
    if (props.isOpen) {
      classNameList.push(styles.is_open);
    } else {
      classNameList.push(styles.is_close);
    }
    return classNameList.join(" ");
  };

  return (
    <nav className={injectClassName()}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className={styles.background}
        onClick={() => {
          props.setIsOpen(false);
        }}
      ></div>
      <div className={styles.content}>
        <button
          className={styles.close_btn}
          onClick={() => {
            props.setIsOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faXmark} className={styles.icon} />
        </button>
        <div className={styles.operation_btn}>
          {props.isLogin && <button onClick={logoutES}>ログアウト</button>}
          {!props.isLogin && <button onClick={loginES}>ログイン</button>}
          <Link href="/">サイトトップ</Link>
          <Link href="/list">一覧</Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
