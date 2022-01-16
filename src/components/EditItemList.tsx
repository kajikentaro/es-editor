import { faBan, faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item, REST } from "interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import styles from "styles/EditItemList.module.scss";

// リスト内要素
const EditItem = <T extends Item>(props: {
  item: T;
  isEdit: boolean;
  rest: REST<T>;
  onEditOver: () => void;
  onEditStart: () => void;
}) => {
  const { item, isEdit, onEditStart, rest, onEditOver } = props;
  const [inputText, setInputText] = useState<string>(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleUpdate = () => {
    const newItem = { name: inputText, id: item.id };
    rest.put(item.id, newItem as T);
    onEditOver();
  };

  return (
    <li key={item.id}>
      <div className={styles.input_wrapper}>
        <input
          className={isEdit ? styles.edit : styles.noedit}
          ref={inputRef}
          value={inputText}
          onClick={onEditStart}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onBlur={() => {
            // 何も無い所をクリックしたとき
            handleUpdate();
          }}
        />
      </div>
      {isEdit ? (
        // 編集モード時表示
        <div className={styles.right}>
          {/* 適用ボタン */}
          <button
            onClick={() => {
              handleUpdate();
            }}
          >
            <FontAwesomeIcon className={styles.icon} icon={faCheck} />
          </button>
          {/* キャンセルボタン */}
          <button
            onClick={() => {
              setInputText(item.name);
              onEditOver();
            }}
          >
            <FontAwesomeIcon className={styles.icon} icon={faBan} />
          </button>
        </div>
      ) : (
        // 表示モード時表示
        <div className={styles.right}>
          {/* 編集ボタン */}
          <button onClick={onEditStart}>
            <FontAwesomeIcon className={styles.icon} icon={faEdit} />
          </button>
          {/* 削除ボタン */}
          <button
            onClick={() => {
              rest.delete_(item.id);
              onEditOver();
            }}
          >
            <FontAwesomeIcon className={styles.icon} icon={faTrash} />
          </button>
        </div>
      )}
    </li>
  );
};

// 編集ボタン、削除ボタン等の機能がついたリスト
const EditItemList = <T extends Item>(props: {
  items: T[];
  rest: REST<T>;
  onUpdate: () => void;
}) => {
  const { items, rest, onUpdate } = props;

  // 編集中の要素のインデックス
  const [editingIdx, setEditingIdx] = useState<number>(-1);

  // 編集ボタンが押されたときにeditingIdxを変更する
  const onEditStart = (idx: number) => {
    return () => {
      setEditingIdx(idx);
    };
  };

  // 編集が終わったとき
  const onEditOver = () => {
    setEditingIdx(-1);
    onUpdate();
  };

  // 要素に渡すprops
  const handOverProps = {
    onEditOver,
    rest,
  };

  return (
    <ul className={styles.edit_item_list}>
      {items.map((v, idx) => {
        return (
          <EditItem
            item={v}
            key={v.id}
            isEdit={editingIdx === idx}
            onEditStart={onEditStart(idx)}
            {...handOverProps}
          />
        );
      })}
    </ul>
  );
};
export default EditItemList;
