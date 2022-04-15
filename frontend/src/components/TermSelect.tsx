import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "interfaces/interfaces";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import styles from "styles/TermSelect.module.scss";

type Props<T> = {
  item: T | undefined;
  itemList: T[];
  onDefineItem: (item: T | undefined) => void;
};

let skipBlur = false;

const TermSelect = <T extends Item>(props: Props<T>) => {
  const { item, onDefineItem, itemList } = props;
  const [filterdItemList, setFilterdItemList] = useState<T[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [inputState, setInputState] = useState<"focus" | "blur" | "define">("blur");
  const [focusCandidateIdx, setFocusCandidateIdx] = useState<number>(-1);
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

  const trapKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusCandidateIdx((focusCandidateIdx + 1) % filterdItemList.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (focusCandidateIdx === -1) {
          setFocusCandidateIdx(filterdItemList.length - 1);
        } else {
          setFocusCandidateIdx(
            (focusCandidateIdx - 1 + filterdItemList.length) % filterdItemList.length
          );
        }
        break;
      case "Enter":
        if (filterdItemList[focusCandidateIdx]) {
          e.preventDefault();
          setInputState("define");
          setInputText(filterdItemList[focusCandidateIdx].name);
          onDefineItem(filterdItemList[focusCandidateIdx]);
        }
        break;
    }
  };

  return (
    <form
      className={styles.term_select + " " + styles[inputState]}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className={styles.define_text + " " + styles[inputState]}>
        <p>{inputText}</p>
      </div>
      <input
        className={styles[inputState]}
        placeholder="クリックして選択"
        onFocus={() => {
          setInputState("focus");
        }}
        onBlur={() => {
          if (skipBlur) {
            skipBlur = false;
            return;
          }
          setInputState("blur");
          setInputText("");
        }}
        onChange={(e) => {
          e.preventDefault();
          if (inputState !== "focus") {
            return;
          }
          setInputText(e.target.value);
        }}
        onKeyDown={trapKeyDown}
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
        onMouseDown={(e) => e.preventDefault()}
      >
        <FontAwesomeIcon icon={faTimes} color="hsl(0, 0%, 80%)" />
      </button>
      {filterdItemList.length > 0 && (
        <ul className={styles.candidate + " " + styles[inputState]}>
          {filterdItemList.map((v, idx) => {
            return (
              <li key={v.id} className={styles.candidate_item}>
                {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                <button
                  className={idx === focusCandidateIdx ? styles.focus : undefined}
                  tabIndex={-1}
                  onMouseOver={() => {
                    setFocusCandidateIdx(idx);
                  }}
                  onMouseLeave={() => {
                    setFocusCandidateIdx(-1);
                  }}
                  onClick={() => {
                    setInputState("define");
                    setInputText(v.name);
                    onDefineItem(v);

                    skipBlur = true;
                    inputRef.current && inputRef.current.blur();
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {v.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
};
export default TermSelect;
