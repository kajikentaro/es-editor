import type { NextPage } from "next";
import Image from "next/image";
import styles from "styles/Edit.module.scss";
import {
  faEdit,
  faUndo,
  faRedo,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Document } from "interfaces/interfaces";
import { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const { company, section } = router.query;
  //const { document, setDocument } = useState<Document>({});
  console.log(company, section);
  return (
    <div className={styles.content}>
      <div className={styles.first}>
        <div className={styles.section}>
          <h2>題名</h2>
          <div className={styles.row}>
            <input />
            <button>
              <FontAwesomeIcon className={styles.icon} icon={faEdit} />
              編集
            </button>
          </div>
        </div>
        <div className={styles.section}>
          <h2>企業名</h2>
          <div className={styles.row}>
            <input />
          </div>
        </div>
        <div className={styles.section}>
          <h2>他の項目</h2>
          <div className={styles.row}>
            <input />
          </div>
          <div className={styles.row}>
            <input />
          </div>
          <div className={styles.row}>
            <input />
          </div>
        </div>
      </div>
      <div className={styles.second}>
        <div className={styles.row}>
          <div className={styles.left}>
            <button>
              <FontAwesomeIcon className={styles.icon} icon={faUndo} />
              戻る
            </button>
            <button>
              <FontAwesomeIcon className={styles.icon} icon={faRedo} />
              進む
            </button>
            <p>○○文字</p>
          </div>
          <div className={styles.right}>
            <button>
              <FontAwesomeIcon className={styles.icon} icon={faHistory} />
              変更履歴
            </button>
          </div>
        </div>
        <div className={styles.edit}>
          <textarea />
        </div>
      </div>
      <div className={styles.third}></div>
    </div>
  );
};

export default Home;
