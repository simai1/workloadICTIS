import React, { useEffect, useRef, useState } from "react";
import styles from "./../ContextMenu.module.scss";
import DataContext from "../../../context";
import { getStylePosition } from "../Function";
function CommentsMenu(props) {
  const { appData, tabPar } = React.useContext(DataContext);
  const [isError, setError] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  const buttonClick = () => {
    if (textAreaValue.trim() === "") {
      setError(true);
    } else {
      const data = {
        educatorId: appData.myProfile.id,
        workloadId: tabPar.selectedTr[0],
        text: textAreaValue,
      };
      props.setPopupCommentAction(data);
      setError(false);
      props.setPopupComment(true);
      props.setMenuShow("");
      setTextAreaValue("");
    }
  };

  const textAreaChange = (e) => {
    setTextAreaValue(e.target.value);
    setError(false);
  };

  //! переменная которая хранит ширину данного меню
  const [menuWidth, setMenuWidth] = useState(230);
  const menuRef = useRef(null);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth);
    }
  }, [menuRef.current]);
  return (
    <div
      ref={menuRef}
      style={getStylePosition(
        tabPar.contextPosition,
        window.innerWidth,
        menuWidth,
        props.conxextMenuRefBlock
      )}
      className={styles.CommentsMenu}
    >
      <div className={styles.textAreaBox}>
        <textarea
          style={isError ? { border: "1px solid red" } : null}
          onChange={textAreaChange}
          className={styles.textArea}
        ></textarea>
        {isError && <span>Заполните текстовое поле!</span>}
        <button onClick={buttonClick}>Отправить</button>
      </div>
    </div>
  );
}

export default CommentsMenu;
