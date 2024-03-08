import React, { useEffect, useRef, useState } from "react";
import styles from "./Warnings.module.scss";
import arrow from "./../../img/arrow.svg";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
import socket from "../../api/services/socket";
function Warnings() {
  const handleSoket = () => {
    socket.on("connect", console.log("Socket connected"));
    console.log(socket);
    socket.on("notificationCreated", (data) => {
      console.log("Notification created:", data);
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("notificationCreated", (data) => {
      console.log("Notification created:", data);
    });
    return () => {
      // Очистка обработчиков событий при размонтировании компонента
      socket.off("connect");
      socket.off("notificationCreated");
    };
  }, []);
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
      <button onClick={handleSoket}>Сокет</button>
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
                return (
                  <WarningMessage key={index} arrMessage={el} id={index + 1} />
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
