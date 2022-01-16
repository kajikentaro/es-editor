import { faBan, faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item, REST } from "interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import styles from "styles/EditItemList.module.scss";

const EditItem = <T extends Item>(props: { item: T; isEdit: boolean; onEditCancel: () => void; onEditClick: () => void; rest: REST<T> }) => {
  const { item, isEdit, onEditClick, rest, onEditCancel } = props;
  const [inputText, setInputText] = useState<string>(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <li key={item.id}>
      <div className={styles.input_wrapper}>
        <input
          className={isEdit ? styles.edit : styles.noedit}
          ref={inputRef}
          value={inputText}
          onClick={onEditClick}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onBlur={() => {
            setInputText(item.name);
            onEditCancel();
          }}
        />
      </div>
      {isEdit ? (
        // 編集モード
        <div className={styles.right}>
          <button
            onClick={() => {
              const newItem = { name: inputText, id: item.id };
              rest.put(item.id, newItem as T);
              onEditCancel();
            }}
          >
            <FontAwesomeIcon className={styles.icon} icon={faCheck} />
          </button>
          <button
            onClick={() => {
              console.log(item.name);
              setInputText(item.name);
              onEditCancel();
            }}
          >
            <FontAwesomeIcon className={styles.icon} icon={faBan} />
          </button>
        </div>
      ) : (
        // 表示モード
        <div className={styles.right}>
          <button onClick={onEditClick}>
            <FontAwesomeIcon className={styles.icon} icon={faEdit} />
          </button>
          <button
            onClick={() => {
              rest.delete_(item.id);
            }}
          >
            <FontAwesomeIcon className={styles.icon} icon={faTrash} />
          </button>
        </div>
      )}
    </li>
  );
};

const EditItemList = <T extends Item>(props: { items: T[]; rest: REST<T> }) => {
  const [editingIdx, setEditingIdx] = useState<number>(-1);
  const { items, rest } = props;
  const onEditClick = (idx: number) => {
    return () => {
      setEditingIdx(idx);
    };
  };
  const onEditCancel = () => {
    setEditingIdx(-1);
  };
  if (items.length === 0) {
    return <></>;
  }
  return (
    <ul className={styles.edit_item_list}>
      {items.map((v, idx) => {
        return <EditItem item={v} key={v.id} isEdit={editingIdx === idx} onEditCancel={onEditCancel} onEditClick={onEditClick(idx)} rest={rest} />;
      })}
    </ul>
  );
};
export default EditItemList;
