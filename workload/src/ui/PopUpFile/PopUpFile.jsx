import React from "react";
import styles from "./PopUpFile.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";
import { SubmitFileXLSX } from "../../api/services/ApiRequest";
export function PopUpFile(props) {
  const { appData } = React.useContext(DataContext);

  const closeMenuPopFile = () =>{
    props.handleFileClear();
    appData.setFileData(null);
    props.setfilePopUp(false);
  }
  const UpdateTable = () =>{
    console.log("fileData", appData?.fileData)
    // SubmitFileXLSX(appData?.fileData)
  }
  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>Ваш файл : <span style={{color:"#0040e5"}}>{appData.fileData?.name}</span></p>
        <div>
          <p>Выберите кафедру:</p>
          <select>
            <option value="1">Кафедра 1</option>
            <option value="2">Кафедра 2</option>
            <option value="3">Кафедра 3</option>
            <option value="4">Кафедра 4</option>
          </select>
        </div>
        <p>Вы уверены что хотите обновить все данные в таблице, данное действие <span style={{color:"red"}}>нельзя будет отменить!</span></p>
        <Button
          onClick={closeMenuPopFile}
          text="Закрыть"
          Bg="#0040e5"
          textColot="#fff"
          className={styles.buttonConfirm}
        />
       <Button
            onClick={UpdateTable}
            text="Подтвердить"
            Bg="red"
            textColot="#fff"
            className={styles.buttonConfirm}
        />
      </div>
    </div>
  );
}
