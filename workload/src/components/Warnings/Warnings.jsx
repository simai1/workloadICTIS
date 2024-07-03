import React, { useEffect, useRef, useState } from "react";
import styles from "./Warnings.module.scss";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
import socketConnect from "../../api/services/socket";
import DataContext from "../../context";
import { ReactComponent as SvgNotification } from "./../../img/notification.svg";
import { Educator } from "../../api/services/ApiRequest";
import { getAllWarnin } from "../../api/services/AssignApiData";
import Input from "../../ui/UniversalInput/Input";
function Warnings(props) {
  const { appData } = React.useContext(DataContext);
  const [filteredData, setFilteredData] = useState([]);
  const [isListOpen, setListOpen] = useState(false);

  useEffect(() => {
    setFilteredData([...appData.allWarningMessage]);
  }, [appData.allWarningMessage]);

  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  //! клина на предупреждение
  const directLks = (id) => {
    props.setSelectedComponent("Teachers"); // переходим к компоненту с преподавателями
    props.setEducatorIdforLk(id);
  };
  useEffect(() => {
    socketConnect().then((data) => {
      getAllWarnin(appData.setAllWarningMessage);
    });
  }, [appData.allWarningMessage]);

  //! закрытие модального окна при нажатии вне него
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

  //! орагнизация поиска
  function funFiltered(data, text) {
    const fd = [...data];
    return fd.filter((row) => {
      return Object.values({ ...row, educator: row.educator?.name }).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(text.toLowerCase())
      );
    });
  }

  const [inpValue, setInpValue] = useState("");
  const funOnChange = (el) => {
    setInpValue(el.target.value);
    const fd = funFiltered(appData.allWarningMessage, el.target.value);
    setFilteredData(fd);
  };

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
            <div className={styles.circlesbuttonWarn}>
              <div className={styles.span_length}>
                {appData.allWarningMessage?.length}
              </div>
            </div>
            <p>Предупреждения</p>
          </div>
          {appData.allWarningMessage?.length > 0 && (
            <div className={styles.seach}>
              <Input
                type="text"
                placeholder={"Поиск..."}
                value={inpValue}
                funOnChange={funOnChange}
              />
            </div>
          )}
          <div className={styles.WarningsList}>
            <ul>
              {appData.allWarningMessage?.length > 0 ? (
                filteredData?.map((item, index) => {
                  return (
                    <WarningMessage
                      item={item}
                      key={item.id}
                      index={index}
                      directLks={directLks}
                    />
                  );
                })
              ) : (
                <div className={styles.noWarning}>Предупреждений нет</div>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warnings;
