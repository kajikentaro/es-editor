import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, faIcons, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Link from "next/link";
import styles from "styles/Footer.module.scss";

const Header: NextPage = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section_list}>
          <div className={styles.section}>
            <p className={styles.section_title}>Author</p>
            <Link href="https://kajindowsxp.com">
              <a className={styles.link}>
                <FontAwesomeIcon icon={faGlobe} />
                Kajindows XP
              </a>
            </Link>
            <Link href="https://twitter.com/mybiboroku">
              <a className={styles.link}>
                <FontAwesomeIcon icon={faTwitter} />
                かじくん
              </a>
            </Link>
            <Link href="https://github.com/kajikentaro">
              <a className={styles.link}>
                <FontAwesomeIcon icon={faGithub} />
                kajikentaro
              </a>
            </Link>
          </div>

          <div className={styles.section}>
            <p className={styles.section_title}>Powerd by</p>
            <Link href="https://www.freepik.com/vectors/background">
              <a className={styles.link}>
                <FontAwesomeIcon icon={faImage} />
                freepik
              </a>
            </Link>
            <Link href="https://fontawesome.com/">
              <a className={styles.link}>
                <FontAwesomeIcon icon={faIcons} />
                Font Awesome
              </a>
            </Link>
          </div>

          <div className={styles.section}>
            <p className={styles.section_title}>Source</p>
            <Link href="https://github.com/kajikentaro/timetablemanager">
              <a className={styles.link}>
                <FontAwesomeIcon icon={faGithub} />
                GitHub
              </a>
            </Link>
          </div>

          <div className={styles.section}>
            <p className={styles.section_title}>Technology used</p>
            <Link href="https://rubyonrails.org/">
              <a className={styles.link}>Ruby on Rails</a>
            </Link>
            <Link href="https://www.docker.com/">
              <a className={styles.link}>Docker</a>
            </Link>
            <Link href="https://aws.amazon.com/">
              <a className={styles.link}>Amazon Web Services</a>
            </Link>
          </div>
        </div>
        <div className={styles.footer_message}>
          <p>就活ESエディター</p>
          <p>Copyright © 2022 就活ESエディター All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Header;
