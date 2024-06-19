import React, { useState } from "react";
import styles from "./PopUpCreateEmploy.module.scss";
import DataContext from "../../context";
import Input from "../Input/Input";
import Button from "../Button/Button";
import PopUpContainer from "../PopUpContainer/PopUpContainer";
import List from "../List/List";
import { CreateEducator } from "../../api/services/ApiRequest";

export function PopUpCreateEmploy(props) {
  const { appData, basicTabData } = React.useContext(DataContext);
  const [dataNewEdicator, setdataNewEdicator] = useState({
    name: "",
    email: "",
    position: "",
    rate: "",
    typeOfEmployment: "",
    department: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isRateValid, setIsRateValid] = useState(true);
  const dataList = [
    { id: 1, name: "Внешнее совместительство" },
    { id: 2, name: "Внутреннее совместительство" },
    { id: 3, name: "Основное место работы" },
    { id: 4, name: "Почасовая оплата труда" },
  ];
  const dataListPosition = [
    { id: 1, name: "Ассистент" },
    { id: 2, name: "Ведущий научный сотрудник" },
    { id: 3, name: "Главный научный сотрудник" },
    { id: 4, name: "Директор института" },
    { id: 5, name: "Доцент" },
    { id: 6, name: "Научный сотрудник" },
    { id: 7, name: "Профессор" },
    { id: 8, name: "Старший научный сотрудник" },
    { id: 9, name: "Старший преподаватель" },
    { id: 10, name: "Преподаватель" },
    { id: 11, name: "Заведующий кафедрой" },
  ];
  const dataKaf = [
    { id: 1, name: "БИТ" },
    { id: 2, name: "ИИТиС" },
    { id: 3, name: "ВТ" },
    { id: 4, name: "ИАСБ" },
    { id: 5, name: "ИБТКС" },
    { id: 6, name: "ИМС" },
    { id: 7, name: "МОП ЭВМ" },
    { id: 8, name: "ПиБЖ" },
    { id: 9, name: "САИТ" },
    { id: 10, name: "САПР" },
    { id: 11, name: "СиПУ" },
    { id: 12, name: "ФМОИО" },
  ];

  const handleInputChange = (name, value) => {
    if (name === "email") {
      setIsEmailValid(value.endsWith("@sfedu.ru"));
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
      typeOfEmployment: dataNewEdicator.typeOfEmployment,
      department: dataNewEdicator.department,
    };
    CreateEducator(data).then(() => {
      appData.setcreateEdicatorPopUp(false);
      //! обновляем таблицу преподавателей
      basicTabData.setActionUpdTabTeach(!basicTabData.actionUpdTabTeach);
    });
  };

  return (
    <PopUpContainer title="Добавление преподавателя" mT="120">
      <div className={styles.mainPop__inner}>
        <div className={styles.inputBlock}>
          <Input
            Textlabel="ФИО"
            placeholder="Иваннов Иван Михайлович"
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
              Почта должна быть в домене sfedu.ru
            </div>
          )}
          <List
            dataList={dataListPosition}
            Textlabel="Должность"
            defaultValue="Выберите должность"
            name={"position"}
            handleInputList={handleInputList}
          />
          <List
            dataList={dataList}
            Textlabel="Вид занятости"
            defaultValue="Выберите вид занятости"
            name={"typeOfEmployment"}
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
            Textlabel="кафедра"
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
          <Button
            text="Сохранить"
            Bg="#3b28cc"
            textColot="#fff"
            handleClicks={handleClicks}
            style={{ opacity: !isEmailValid || !isRateValid ? 0.2 : 1 }}
          />
        </div>
      </div>
    </PopUpContainer>
  );
}

export default PopUpCreateEmploy;
