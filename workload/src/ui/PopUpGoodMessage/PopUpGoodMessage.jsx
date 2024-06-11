import React from "react";
import styles from "./PopUpGoodMessage.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";
const PopUpGoodMessage = (props) => {
    const { appData} = React.useContext(DataContext);

    return (
      <div className={styles.mainPopGood}>
        <div className={styles.mainPop__inner}>
          <p>Данные успешно изменены!</p>
          <div className={styles.buttonBlock}>
            <Button
                onClick={() => appData.setgodPopUp(false)}
                text="Закрыть"
                Bg="#3b28cc"
                textColot="#fff"
            />
          </div>
       
        </div>
      </div>
    );
};

export default PopUpGoodMessage;
