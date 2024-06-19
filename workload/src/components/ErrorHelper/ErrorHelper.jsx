import React, { useEffect, useRef, useState } from "react";
import styles from "./ErrorHelper.module.scss";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
import socketConnect from "../../api/services/socket";
import DataContext from "../../context";
import { ReactComponent as SvgNotification } from "./../../img/notification.svg";
import { Educator } from "../../api/services/ApiRequest";
import { getAllWarnin } from "../../api/services/AssignApiData";
import Input from "../../ui/UniversalInput/Input";
function ErrorHelper(props) {
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
      console.log("socketConnect", data);
      getAllWarnin(appData.setAllWarningMessage);
    });
    console.log("allWarningMessage", appData.allWarningMessage);
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
    <div ref={refLO} className={styles.ErrorHelper}>
      <div onClick={toggleList} className={styles.WarningsButton}>
        {/* <SvgNotification className={styles.svg_notice} /> */}
        <img src="./img/errorHelper.svg" alt="e" />
      </div>
      {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div className={styles.triangle}></div>
          <p>Сообщите об ошибке на почту</p>
          <span>alis@sfedu.ru</span>
        </div>
      )}
    </div>
  );
}

export default ErrorHelper;
