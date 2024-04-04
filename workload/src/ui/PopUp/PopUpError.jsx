import React, { useState } from "react";
import styles from "./PopUpError.module.scss";
import Button from "../Button/Button";

export function PopUpError(props) {
  const [isPopUpMenu, setIsPopUpMenu] = useState(false); // флаг открытия PopUp меню
  
  return (
   <div className={styles.mainPop}>
    <div className={styles.mainPop__inner}>
        <p>Извините, данную операцию невозможно выполнить</p>
        {/* <Button text="Закрыть" Bg="#3b28cc" textColot="#fff"  onClick={setIsPopUpMenu(!isPopUpMenu)}/> */}
        <Button text="Закрыть" Bg="#3b28cc" textColot="#fff"/>
    </div>
   </div>
  );
}
