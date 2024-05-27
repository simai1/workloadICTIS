import React, { useState } from "react";
import styles from "./PopUpFile.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";
import { SubmitFileXLSX } from "../../api/services/ApiRequest";
export function PopUpFile(props) {
  const { appData } = React.useContext(DataContext);

  const closeMenuPopFile = () =>{
    props.handleFileClear();
    appData.setFileData(null)
  }
  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>Ваш файл : <span style={{color:"#0040e5"}}>{appData.fileData.name}</span></p>
        <p>Вы уверены что хотите обновить все данные в таблице, данное действие <span style={{color:"red"}}>нельзя будет отменить!</span></p>
        <Button
          onClick={closeMenuPopFile}
          text="Закрыть"
          Bg="#0040e5"
          textColot="#fff"
          className={styles.buttonConfirm}
        />
       <Button
            onClick={()=>{SubmitFileXLSX(appData.fileData)}}
            text="Подтвердить"
            Bg="red"
            textColot="#fff"
            className={styles.buttonConfirm}
        />
      </div>
    </div>
  );
}
