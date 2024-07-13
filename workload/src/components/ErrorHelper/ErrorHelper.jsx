import React, { useEffect, useRef, useState } from "react";
import styles from "./ErrorHelper.module.scss";
import fileUrl from "./ruc.pdf";
function ErrorHelper(props) {
  const [isListOpen, setListOpen] = useState(false);

  const toggleList = () => {
    setListOpen(!isListOpen);
  };

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

  const downloadFile = (fileUrl, fileName) => {
    // Создаем ссылку для скачивания файла
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    // Добавляем ссылку в документ
    document.body.appendChild(link);
    // Кликаем по ссылке, чтобы начать скачивание
    link.click();
    // Удаляем ссылку из документа
    document.body.removeChild(link);
  };

  //! скачивнаие инструкции
  const handleDownload = () => {
    const fileName = "Руководство нагрузки ИТА ЮФУ.pdf";
    downloadFile(fileUrl, fileName);
  };

  return (
    <div ref={refLO} className={styles.ErrorHelper}>
      <div onClick={toggleList} className={styles.WarningsButton}>
        <img src="./img/errorHelper.svg" alt="e" />
      </div>
      {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div className={styles.triangle}></div>
          <p>
            Если у вас возникла ошибка, сообщите на почту:
            <a href="mailto:example@example.com">alis@sfedu.ru</a>
          </p>
          <div className={styles.instruction}>
            <img src="./img/doc.svg" />
            <span onClick={handleDownload}>
              Инструкция пользования продуктом
            </span>
          </div>
          {/* <p>Инструкция</p> */}
        </div>
      )}
    </div>
  );
}

export default ErrorHelper;
