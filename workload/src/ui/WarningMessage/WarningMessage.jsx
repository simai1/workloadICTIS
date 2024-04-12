import React from "react";
import styles from "./WarningMessage.module.scss";
import arrow from "./../../img/arrow.svg";
const WarningMessage = (props) => {
  console.log(props.item);
  return (
    <li>
      <div className={styles.nameWarnName}>
        <p className={styles.circlesbuttonWarn}>
          <span>{props.index + 1}</span>
        </p>
        <p className={styles.name}>{props.item.educator.name}</p>
      </div>
      <div
        className={styles.buttonWarnBlock}
        onClick={() => props.directLks(props.item.educator.id)}
      >
        <p>{props.item.message}</p>
        <img className={styles.arrowButton} src={arrow} alt="arrow" />
      </div>
    </li>
  );
};

export default WarningMessage;
