import React, { useEffect, useRef } from "react";
import styles from "./ConfirmSaving.module.scss";

function ConfirmSaving(props) {

  const refSave = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refSave.current && !refSave.current.contains(event.target)) {
        props.setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.ConfirmSaving} ref={refSave}>
      <div className={styles.trangle}></div>
      <div>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.btnBox}>
          <button onClick={() => props.confirmClick(false)}>Нет</button>
          <button onClick={() => props.confirmClick(true)}>Да</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSaving;
