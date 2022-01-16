import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import styles from "styles/TermSelect.module.scss";

type Props<T> = {
  item: T | undefined;
  itemList: T[];
  onDefineItem: (item: T | undefined) => void;
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
        placeholder="クリックして選択"
        onFocus={() => {
          setInputState("focus");
        }}
        onBlur={() => {
          if (isHoverCandidate) {
            return;
          }
          setInputState("blur");
          setInputText("");
        }}
        onChange={(v) => {
          v.preventDefault();
          setInputText(v.target.value);
        }}
        value={inputText}
        ref={inputRef}
      />
      <button
        type="reset"
        onClick={() => {
          setInputState("blur");
          onDefineItem(undefined);
          setInputText("");
        }}
        className={styles.check_btn}
        style={{ display: inputText.length > 0 ? "inherit" : "none" }}
      >
        <FontAwesomeIcon icon={faTimes} color="hsl(0, 0%, 80%)" />
      </button>
      {filterdItemList.length > 0 && (
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
      )}
    </form>
  );
};
export default TermSelect;
