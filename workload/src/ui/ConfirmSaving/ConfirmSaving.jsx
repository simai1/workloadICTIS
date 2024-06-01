import React from "react";
import styles from "./ConfirmSaving.module.scss";

function ConfirmSaving(props) {
  return (
    <div className={styles.ConfirmSaving}>
      <div className={styles.trangle}></div>
      <div>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.btnBox}>
          <button onClick={() => props.confirmClick(false)}>Нет</button>
          <button onClick={() => props.confirmClick(true)}>Да</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSaving;
