import mockup from "img/mockup.png";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "styles/Home.module.scss";

const feature_str = [
  {
    title: "バージョン管理",
    desc: "変更履歴をすべて保存し、好きなバージョンにロールバック",
  },
  {
    title: "検索機能",
    desc: "文章中の文字、企業名、項目名を併せて検索",
  },
  {
    title: "企業、項目別管理",
    desc: "「ガクチカ」「長所」「志望動機」などの項目ラベルを付けて、まとめて管理",
  },
  {
    title: "文字数カウント",
    desc: "一文字入力するごとにリアルタイム表示。(準備中)更に指定文字数の目安となる目印を表示",
  },
  {
    title: "ローカル保存 | クラウド保存",
    desc: "端末内かクラウド、またはその両方に書いたデータを保存。(準備中)更にword形式でダウンロードすることも可能",
  },
  {
    title: "コメントアウト機能(準備中)",
    desc: "一瞬思いついた語彙を逃さず保存。コメントとして記入することで、ダウンロードやまとめてコピー時にはその部分を無視して取得できます。",
  },
];

const Home: NextPage = () => {
  return (
    <>
      <div className={styles.title_bg}>
        <div className={styles.title_wrapper}>
          <div className={styles.first}>
            <div className={styles.title}>
              <h1>
                <span className={styles.a}>就活</span>
                生のための
                <br />
                <span className={styles.b}>ESエディター</span>
              </h1>
              <p>Syukatsu ES Editor</p>
            </div>
            <Link href="/list">
              <a className={styles.start_btn}>始める</a>
            </Link>
          </div>
          <div className={styles.mockup_img}>
            <Image src={mockup} alt="モックアップ画像" />
          </div>
        </div>
      </div>
      <div className={styles.content_bg}>
        <div className={styles.content}>
          <div className={styles.feature}>
            <h2 className={styles.title}>Feature</h2>
            <ul>
              {feature_str.map((v, idx) => {
                return (
                  <li key={idx}>
                    <h2 className={styles.feature_title}>
                      <span className={styles.character_large}>{v.title[0]}</span>
                      {v.title.slice(1)}
                    </h2>
                    <p className={styles.desc}>{v.desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
