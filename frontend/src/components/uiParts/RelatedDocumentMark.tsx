import { MouseEventHandler } from "react";
import styles from "./RelatedDocumentMark.module.scss";

interface Props {
  label: string;
  isPined: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const RelatedDocumentMark: React.VFC<Props> = (props) => {
  const injectClassName = () => {
    const classNameList = [styles.element];
    if (props.isPined) {
      classNameList.push(styles.is_pined);
    }
    return classNameList.join(" ");
  };
  return (
    <button onClick={props.onClick} className={injectClassName()}>
      {props.label}
    </button>
  );
};

export default RelatedDocumentMark;
