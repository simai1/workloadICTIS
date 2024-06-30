import React from "react";
import styles from "./Styles.module.scss";

function ContextMenu(props) {
  return (
    <div className={styles.ContextMenu}>
      <div
        className={styles.context}
        style={{
          top: props.position?.y,
          left: props.position?.x,
        }}
      >
        <p onClick={props.editClick}>Редактировать</p>
      </div>
    </div>
  );
}

export default ContextMenu;
