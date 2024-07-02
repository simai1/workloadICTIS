import React from "react";
import styles from "./PopUpError.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";

export function PopUpError() {
  const { appData } = React.useContext(DataContext);

  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>
          {appData.popupErrorText !== ""
            ? appData.popupErrorText
            : "Извините, данную операцию невозможно выполнить"}
        </p>
        <div className={styles.buttonBlock}>
          <Button
            onClick={() => {
              appData.seterrorPopUp(false);
              appData.setPopupErrorText("");
            }}
            text="Закрыть"
            Bg="#3b28cc"
            textColot="#fff"
          />
        </div>
      </div>
    </div>
  );
}
