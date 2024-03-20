import React, { useEffect, useRef, useState } from "react";
import styles from "./Warnings.module.scss";
import arrow from "./../../img/arrow.svg";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
import socketConnect from "../../api/services/socket";
import DataContext from "../../context";
function Warnings() {
  const { appData } = React.useContext(DataContext);

  const [isListOpen, setListOpen] = useState(false);
  const [arrMessage, setMessage] = useState(appData.allWarningMessage);
  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  useEffect(() => {
    socketConnect().then((data) => {
      data && setMessage(data.existingNotification); //!!! исправить
      console.log("socketConnect", data);
    });
  }, []);

  // закрытие модального окна при нажатии вне него
  const refLO = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (refLO.current && !refLO.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);
  return (
    <div ref={refLO} className={styles.Warnings}>
      {!isListOpen && (
        <div onClick={toggleList} className={styles.WarningsButton}>
          <p className={styles.circlesbuttonWarn}>
            <span className={styles.span_length}>
              {appData.allWarningMessage?.length}
            </span>
          </p>
          <p>Предупреждения</p>
          <img src={arrow} alt="arrow"></img>
        </div>
      )}
      {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div onClick={toggleList} className={styles.WarningsButtonOpen}>
            <p className={styles.circlesbuttonWarn}>
              <span className={styles.span_length}>
                {appData.allWarningMessage?.length}
              </span>
            </p>
            <p>Предупреждения</p>
            <img
              src={arrow}
              alt="arrow"
              style={{
                padding: "11px",
                transform: " rotate(180deg)",
                transition: "transform 0.4s",
              }}
            ></img>
          </div>
          <div className={styles.WarningsList}>
            <ul>
              {appData.allWarningMessage?.map((el, index) => {
                return (
                  <WarningMessage key={el.id} arrMessage={el} id={index + 1} />
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warnings;
