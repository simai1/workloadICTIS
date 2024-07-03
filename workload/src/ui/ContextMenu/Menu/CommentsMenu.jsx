import React, { useState } from "react";
import styles from "./../ContextMenu.module.scss";
import DataContext from "../../../context";
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
  return (
    <div
      style={
        tabPar.contextPosition.x + 280 + 180 > window.innerWidth
          ? {
              position: "fixed",
              top: tabPar.contextPosition.y - 5,
              left: tabPar.contextPosition.x - 150,
            }
          : {
              position: "fixed",
              top: tabPar.contextPosition.y - 5,
              left: tabPar.contextPosition.x + 280,
            }
      }
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
