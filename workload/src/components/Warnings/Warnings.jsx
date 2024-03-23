import React, { useEffect, useRef, useState } from "react";
import styles from "./Warnings.module.scss";
import arrow from "./../../img/arrow.svg";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
import socketConnect from "../../api/services/socket";
import DataContext from "../../context";
import { Educator } from "../../api/services/ApiGetData";
import { ReactComponent as SvgNotification } from "./../../img/notification.svg";
function Warnings(props) {
  const { appData } = React.useContext(DataContext);

  const [isListOpen, setListOpen] = useState(false);
  const [arrMessage, setMessage] = useState(appData.allWarningMessage);
  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  //! клина на предупреждение
  const directLks = (index) => {
    //получаем преподавателей с бд
    Educator().then((data) => {
      console.log("teatcher ", data);
      console.log("переход", appData.allWarningMessage[index - 1].EducatorId);
      props.setSelectedComponent("Teachers"); // переходим к компоненту с преподавателями
      props.handleNameChange(
        "Алексеев Кирилл Николаевич",
        "postTeacher",
        "betTeacher"
      ); //!!! исправить
      console.log(
        data.filter(
          (el) => el.id === appData.allWarningMessage[index - 1].EducatorId
        )
      );
      props.setEducatorData(
        data.filter(
          (el) => el.id === appData.allWarningMessage[index - 1].EducatorId
        )[0]
      );
    });
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
      <div onClick={toggleList} className={styles.WarningsButton}>
        {appData.allWarningMessage.length > 0 && (
          <div className={styles.red_circle}></div>
        )}
        <SvgNotification className={styles.svg_notice} />
      </div>
      {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div className={styles.triangle}></div>
          <div className={styles.WarningsButtonOpen}>
            <p className={styles.circlesbuttonWarn}>
              <span className={styles.span_length}>
                {appData.allWarningMessage?.length}
              </span>
            </p>
            <p>Предупреждения</p>
          </div>
          <div className={styles.WarningsList}>
            <ul>
              {appData.allWarningMessage?.map((el, index) => {
                return (
                  <WarningMessage
                    key={el.id}
                    arrMessage={el}
                    id={index + 1}
                    directLks={directLks}
                  />
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
