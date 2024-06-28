import React, { useEffect, useRef, useState } from "react";
import styles from "./ErrorHelper.module.scss";

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
          {/* <p>Инструкция</p> */}
        </div>
      )}
    </div>
  );
}

export default ErrorHelper;
