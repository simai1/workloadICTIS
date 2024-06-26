import React, { useEffect, useState } from "react";
import styles from "./PopUpCreateEmploy.module.scss";
import DataContext from "../../context";
import Input from "../Input/Input";
import Button from "../Button/Button";
import PopUpContainer from "../PopUpContainer/PopUpContainer";
import List from "../List/List";
import { CreateEducator, GetAllDepartments, GetUsibleDepartment } from "../../api/services/ApiRequest";

export function PopUpCreateEmploy(props) {
  const { appData, basicTabData } = React.useContext(DataContext);
  const [dataNewEdicator, setdataNewEdicator] = useState({
    name: "",
    email: "",
    position: "",
    rate: "",
    department: appData.metodRole[appData.myProfile?.role]?.some((el) => el === 39) ? appData.myProfile.educator.department : "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isRateValid, setIsRateValid] = useState(true);
  // const dataList = [
  //   { id: 1, name: "Внешнее совместительство" },
  //   { id: 2, name: "Внутреннее совместительство" },
  //   { id: 3, name: "Основное место работы" },
  //   { id: 4, name: "Почасовая оплата труда" },
  // ];
  const dataListPosition = [
    { id: 1, name: "Ассистент" },
    { id: 2, name: "Ведущий научный сотрудник" },
    { id: 3, name: "Главный научный сотрудник" },
    { id: 5, name: "Доцент" },
    { id: 6, name: "Научный сотрудник" },
    { id: 7, name: "Профессор" },
    { id: 8, name: "Старший научный сотрудник" },
    { id: 9, name: "Старший преподаватель" },
    { id: 10, name: "Преподаватель" },
    { id: 11, name: "Заведующий кафедрой" },
  ];
  const [dataKaf, setDataKaf] = useState([]);
  useEffect(()=>{
    if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 46)){
      GetAllDepartments().then((resp) => {
        setDataKaf(resp.data);
      });
    }else{
      GetUsibleDepartment().then((resp)=>{
        setDataKaf(resp.data)
      })
    }
  },[])
  // const dataKaf = [
  //   { id: 1, name: "БИТ" },
  //   { id: 2, name: "ИИТиС" },
  //   { id: 3, name: "ВТ" },
  //   { id: 4, name: "ИАСБ" },
  //   { id: 5, name: "ИБТКС" },
  //   { id: 6, name: "ИМС" },
  //   { id: 7, name: "МОП ЭВМ" },
  //   { id: 8, name: "ПиБЖ" },
  //   { id: 9, name: "САИТ" },
  //   { id: 10, name: "САПР" },
  //   { id: 11, name: "СиПУ" },
  //   { id: 12, name: "ФМОИО" },
  // ];

  const handleInputChange = (name, value) => {
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
    }
    if (name === "rate") {
      const rateValue = parseFloat(value.replace(",", "."));
      setIsRateValid(rateValue >= 0 && rateValue <= 1);
    }

    setdataNewEdicator((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleInputList = (name, value) => {
    setdataNewEdicator((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClicks = () => {
    const data = {
      name: dataNewEdicator.name,
      email: dataNewEdicator.email,
      position: dataNewEdicator.position,
      rate: Number(dataNewEdicator.rate.replace(",", ".")),
      department: appData.metodRole[appData.myProfile?.role]?.some((el) => el === 39) ? dataKaf.find((el)=>el.name === dataNewEdicator.department).id : dataNewEdicator.department
    };
    console.log("data", data)
    CreateEducator(data).then((resp) => {
      if(resp.status === 200){
        appData.setcreateEdicatorPopUp(false);
        basicTabData.setActionUpdTabTeach(!basicTabData.actionUpdTabTeach);
        appData.setgodPopUp(true)
      }else{
        appData.setcreateEdicatorPopUp(false);
        appData.seterrorPopUp(true);
      }
    });
  
  };

  return (
    <PopUpContainer title="Добавление преподавателя" mT="120">
      <div className={styles.mainPop__inner}>
        <div className={styles.inputBlock}>
          <Input
            Textlabel="ФИО"
            placeholder="Иванов Иван Михайлович"
            name={"name"}
            handleInputChange={handleInputChange}
          />
          <Input
            Textlabel="Почта"
            placeholder="aaa@sfedu.ru"
            name={"email"}
            handleInputChange={handleInputChange}
            style={{ border: !isEmailValid ? "1px solid red" : "none" }}
          />
          {!isEmailValid && (
            <div
              className={styles.error}
              style={{
                color: "red",
                position: "relative",
                left: "80px",
                top: "-20px",
              }}
            >
              Почта должна валидной!
            </div>
          )}
          <List
            dataList={dataListPosition}
            Textlabel="Должность"
            defaultValue="Выберите должность"
            name={"position"}
            handleInputList={handleInputList}
          />
          <Input
            Textlabel="Ставка"
            placeholder="0.5"
            name={"rate"}
            handleInputChange={handleInputChange}
            style={{ border: !isRateValid ? "1px solid red" : "none" }}
          />
          {!isRateValid && (
            <div
              className={styles.error}
              style={{
                color: "red",
                position: "relative",
                left: "80px",
                top: "-20px",
              }}
            >
              Ставка должна быть от 0 до 1
            </div>
          )}
          <List
            dataList={dataKaf}
            Textlabel="Кафедра"
            defaultValue="Выберите кафедру"
            name={"department"}
            handleInputList={handleInputList}
            value = {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 39) ? appData.myProfile.educator.department : null}
          />
        </div>
        <div
          className={styles.buttonBlock}
          style={{
            display: "flex",
            justifyContent: "end",
            position: "relative",
            bottom: "-10px",
          }}
        >
            <button
            className={styles.buttonSave}
            onClick={handleClicks}
            disabled={!isRateValid || !isEmailValid || !dataNewEdicator.name || !dataNewEdicator.email || !dataNewEdicator.position || !dataNewEdicator.rate || !dataNewEdicator.department}
            style={{
              backgroundColor: (!isRateValid || !isEmailValid || !dataNewEdicator.name || !dataNewEdicator.email || !dataNewEdicator.position || !dataNewEdicator.rate || !dataNewEdicator.department) ? "#b9b9ba" : "#3b28cc",
              cursor: (!isRateValid || !isEmailValid || !dataNewEdicator.name || !dataNewEdicator.email || !dataNewEdicator.position || !dataNewEdicator.rate || !dataNewEdicator.department) ? "not-allowed" : "pointer",
                color:"#fff",
                borderRadius:"8px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "10px",
                paddingBlock: "10px",
                width: "150px",
                transition: "opacity 0.3s ease",
                opacity: 1,
              }}
              onMouseEnter={(e) => {
                e.target.style.transition = "opacity 0.15s ease"; 
                e.target.style.opacity = 0.7;
              }}
              onMouseLeave={(e) => {
                e.target.style.transition = "opacity 0.15s ease"; 
                e.target.style.opacity = 1; 
              }}>Сохранить</button>
        </div>
      </div>
    </PopUpContainer>
  );
}

export default PopUpCreateEmploy;
