import React, { useState } from "react";
import styles from "./Warnings.module.scss";
import arrow from "./../../img/arrow.svg";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
function Warnings() {
  const [isListOpen, setListOpen] = useState(false);
  const toggleList = () => {
    setListOpen(!isListOpen);
  };
  const [arrMessage, setMessage] = useState([
    { id: "1", name: "Бабулинко А А", hours: "98" },
    { id: "2", name: "Бабулинко А А", hours: "98" },
    { id: "3", name: "Бабулинко А А", hours: "98" },
    { id: "4", name: "Бабулинко А А", hours: "98" },
    { id: "5", name: "Бабулинко А А", hours: "98" },
  ]);
  return (
    <div className={styles.Warnings}>
      {!isListOpen && (
        <div onClick={toggleList} className={styles.WarningsButton}>
          <p className={styles.circlesbuttonWarn}>
            <span>{arrMessage.length}</span>
          </p>
          <p>Предупреждения</p>
          <img src={arrow} alt="arrow"></img>
        </div>
      )}
      {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div onClick={toggleList} className={styles.WarningsButtonOpen}>
            <p className={styles.circlesbuttonWarn}>
              <span>{arrMessage.length}</span>
            </p>
            <p>Предупреждения</p>
            <img src={arrow} alt="arrow"></img>
          </div>
          <div className={styles.WarningsList}>
            <ul>
              {arrMessage.map((el, index) => {
                return <WarningMessage arrMessage={el} id={index + 1} />;
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warnings;
