import React, { useEffect, useState } from "react";
import styles from "./PopUpFile.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";
import { SubmitFileXLSX } from "../../api/services/ApiRequest";
import arrow from "./../../img/arrow_down.svg";

export function PopUpFile(props) {
  const { appData, basicTabData } = React.useContext(DataContext);
  const [valueCafedra, setvalueCafedra] = useState("");
  const [openListFlag, setopenListFlag] = useState(false);
  const cafData = [
    { name: "БИТ", id: 1 },
    { name: "ВМ", id: 2 },
    { name: "ВТ", id: 3 },
    { name: "ИАСБ", id: 4 },
    { name: "ИБТКС", id: 5 },
    { name: "ИМС", id: 6 },
    { name: "МОП ЭВМ", id: 7 },
    { name: "ПиБЖ", id: 8 },
    { name: "САИТ", id: 9 },
    { name: "САПР", id: 10 },
    { name: "СиПУ", id: 11 },
    { name: "ОИД", id: 12 }
  ];
  
  const closeMenuPopFile = () => {
    props.handleFileClear();
    appData.setFileData(null);
    props.setfilePopUp(false);
  };

  const UpdateTable = () => {
    basicTabData.funUpdateTable();
    closeMenuPopFile();
    const constIdCafedra = cafData.find((e)=>(e.name === valueCafedra)).id 
    const fileData = appData?.fileData;
    const formData = new FormData();
    formData.append('file', fileData);
    console.log("файл ", formData);
    SubmitFileXLSX(constIdCafedra, formData).then((resp)=>{
      if(resp){
        basicTabData.funGetDepartment()
      }
    })
  };
 
  const setCaf = (e) => {
    setvalueCafedra(e.target.textContent);
    setopenListFlag(false);
  };
  useEffect(()=>{
console.log("file", appData.fileData?.name)
  },[])
  return (
    <div className={styles.mainPop}>
      <div className={styles.mainPop__inner}>
        <p>
          Ваш файл : <span style={{ color: "#0040e5" }}>{appData.fileData?.name}</span>
        </p>
        <div>
          <p>Выберите кафедру:</p>
          <div className={styles.SelectCafInput} onClick={() => setopenListFlag(!openListFlag)}>
            <div className={styles.SelectCafInput__inner}>
              <input placeholder="Выберите кафедру" value={valueCafedra} readOnly onClick={() => setopenListFlag(true)} />
              <img style={{ transform: !openListFlag ? "rotate(-90deg)" : "rotate(0deg)" }} src={arrow} />
            </div>
          </div>
          {openListFlag && (
            <div className={styles.list}>
              <div className={styles.listInner}>
                <p onClick={setCaf}>БИТ</p>
                <p onClick={setCaf}>ВМ</p>
                <p onClick={setCaf}>ВТ</p>
                <p onClick={setCaf}>ИАСБ</p>
                <p onClick={setCaf}>ИБТКС</p>
                <p onClick={setCaf}>ИМС</p>
                <p onClick={setCaf}>МОП ЭВМ</p>
                <p onClick={setCaf}>ПиБЖ</p>
                <p onClick={setCaf}>САИТ</p>
                <p onClick={setCaf}>САПР</p>
                <p onClick={setCaf}>СиПУ</p>
                <p onClick={setCaf}>ОИД</p>
              </div>
            </div>
          )}
        </div>
        <p>
          Вы уверены, что хотите обновить все данные в таблице? Данное действие <span style={{ color: "red" }}>нельзя будет отменить!</span>
        </p>
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
