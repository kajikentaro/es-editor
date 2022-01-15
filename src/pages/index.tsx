import type { NextPage } from "next";
import Link from "next/link";
import styles from "styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.content}>
      <div className={styles.title_wrapper}>
        <div className={styles.first}>
          <h2>就活生のための</h2>
          <h1>ESエディター</h1>
          <Link href="/list">始める</Link>
        </div>
        <div className={styles.second}>
          <div className={styles.image} />
        </div>
      </div>

      <div className={styles.feature}>
        <h2>特徴</h2>
        <ul>
          <li>
            <p>文字数カウント</p>
          </li>
          <li>
            <p>バージョン管理</p>
            <p>変更履歴をすべて保存</p>
          </li>
          <li>
            <p>バージョン管理</p>
            <p>変更履歴をすべて保存。いつでも戻せる</p>
          </li>
          <li>
            <p>タグ管理</p>
            <p>「自己PR」「」</p>
          </li>
          <li>
            <p>バージョン管理</p>
            <p>変更履歴をすべて保存。いつでも戻せる</p>
          </li>
          <li>タグ管理</li>
          <li>コピペ支援</li>
          <li>検索機能</li>
          <li>コメントアウト機能</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
