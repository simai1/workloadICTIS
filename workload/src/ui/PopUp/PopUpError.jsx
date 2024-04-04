import React from "react";
import styles from "./PopUpError.module.scss";
import Button from "../Button/Button";

export function PopUpError(props) {
  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>Извините, данную операцию невозможно выполнить</p>
        <Button
          onClick={() => props.setIsPopUpMenu(false)}
          text="Закрыть"
          Bg="#3b28cc"
          textColot="#fff"
        />
      </div>
    </div>
  );
}
