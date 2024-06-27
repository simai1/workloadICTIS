import React from "react";
import styles from "./Popup.module.scss";
import { tableHeader } from "../AdminData";
function Popup(props) {
  console.log(props.data);

  return (
    <div className={styles.Popup}>
      <div className={styles.PopupBox}>
        <div>
          {tableHeader.map((keys) => (
            <div key={keys.key} className={styles.PopupBody}>
              <div className={styles.left}>{keys.key}</div>
              <div className={styles.rigth}>{props.data[keys.key]}</div>
            </div>
          ))}
        </div>
        <div className={styles.buttonBox}>
          <button onClick={props.closeClick}>Сохранить</button>
        </div>
      </div>
      <div className={styles.PopupBack}></div>
    </div>
  );
}

export default Popup;
