import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import styles from "styles/TermSelect.module.scss";
import { genRandomId } from "utils/utils";

type Props<T> = {
  item: T | undefined;
  itemList: T[];
  onDefineItem: (item: T) => void;
};

let isHoverCandidate = false;

const TermSelect = <T extends Item>(props: Props<T>) => {
  const { item, onDefineItem, itemList } = props;
  const [filterdItemList, setFilterdItemList] = useState<T[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [inputState, setInputState] = useState<"focus" | "blur" | "define">("blur");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setInputState("define");
      setInputText(item.name);
    }
  }, [item]);

  useEffect(() => {
    if (inputText.length > 0) {
      setFilterdItemList(
        itemList.filter((v) => {
          return v.name.indexOf(inputText) !== -1;
        })
      );
    } else {
      setFilterdItemList(itemList);
    }
  }, [inputText, itemList]);

  return (
    <form
      className={styles.term_select + " " + styles[inputState]}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div
        className={styles.define_text + " " + styles[inputState]}
        onClick={() => {
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          setInputState("focus");
        }}
      >
        <p>{inputText}</p>
      </div>
      <input
        className={styles[inputState]}
        placeholder="ここに入力"
        onFocus={() => {
          setInputState("focus");
        }}
        onBlur={() => {
          if (isHoverCandidate) {
            return;
          }
          if (inputText.length === 0) {
            setInputState("blur");
          } else {
            setInputState("define");
          }
        }}
        onChange={(v) => {
          v.preventDefault();
          setInputText(v.target.value);
        }}
        value={inputText}
        ref={inputRef}
      />
      <button
        onClick={() => {
          if (inputText.length === 0) return;
          setInputState("define");
          const newItem: Item = { name: inputText, id: genRandomId() };
          onDefineItem(newItem as T);
        }}
        className={styles.check_btn}
        style={{ display: inputText.length > 0 && inputState === "focus" ? "inherit" : "none" }}
      >
        <FontAwesomeIcon icon={faCheck} color="#228B22" />
      </button>
      <ul className={styles.candidate + " " + styles[inputState]}>
        {filterdItemList.map((v) => {
          return (
            <li
              key={v.id}
              onMouseOver={() => {
                isHoverCandidate = true;
              }}
              onMouseLeave={() => {
                isHoverCandidate = false;
              }}
              onClick={() => {
                setInputState("define");
                setInputText(v.name);
                onDefineItem(v);
              }}
            >
              {v.name}
            </li>
          );
        })}
      </ul>
    </form>
  );
};
export default TermSelect;
