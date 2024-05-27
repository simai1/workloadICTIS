import React from "react";
import styles from "./PopUpError.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";

export function PopUpError() { 
  const { appData} = React.useContext(DataContext);

  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>Извините, данную операцию невозможно выполнить</p>
        <Button
          onClick={() => appData.seterrorPopUp(false)}
          text="Закрыть"
          Bg="#3b28cc"
          textColot="#fff"
        />
      </div>
    </div>
  );
}
