import type { NextPage } from "next";
import Image from "next/image";
import styles from "styles/Select.module.scss";
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
      <div className={styles.section}>
        <h2>企業</h2>
      </div>
    </div>
  );
};

export default Home;
