import React from "react";
import styles from "./NoSaveData.module.scss";
import Button from "../Button/Button";

export function NoSaveData(props) {
  return (
    <div className={styles.NoSaveData}>
        <div className={styles.NoSaveData__inner}>
            <div><p>Есть несохраненные изменения!</p></div>
            <div>
                <Button text="Отменить" w="113px" h="42px" textColot="#5A5A5A" border="1px solid #5A5A5A" handleClick={props.onSaveClick}/>
                <Button text="Сохранить" w="113px" h="42px" Bg="#0040e5" textColot="#fff"/>
            </div>
        </div>
    </div>
  );
}
