import React from "react";
import styles from "./WarningMessage.module.scss";
import arrow from "./../../img/arrow.svg";
const WarningMessage = (props) => {
  return (
    <li>
      <div className={styles.nameWarnName}>
        <p className={styles.circlesbuttonWarn}>
          <span>{props.id}</span>
        </p>
        {/* <p>{props.arrMessage.name}</p> */}
        <p>Бабуленко И В</p>
      </div>
      <div className={styles.buttonWarnBlock}>
        <p>
          {/* Перегрузка - <span>{props.arrMessage.hours}</span> ч */}
          {props.arrMessage.message}
        </p>
        <img className={styles.arrowButton} src={arrow} alt="arrow" />
      </div>
    </li>
  );
};

export default WarningMessage;
