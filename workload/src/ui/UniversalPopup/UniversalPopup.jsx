import React from "react";
import styles from "./UniversalPopup.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";

export function UniversalPopup(props) {
  const { appData } = React.useContext(DataContext);
  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>{appData.universalPopupTitle}</p>
        <div className={styles.buttonBlock}>
          <Button
            onClick={() => appData.setUniversalPopupTitle("")}
            text="Закрыть"
            Bg="#3b28cc"
            textColot="#fff"
          />
        </div>
      </div>
    </div>
  );
}
