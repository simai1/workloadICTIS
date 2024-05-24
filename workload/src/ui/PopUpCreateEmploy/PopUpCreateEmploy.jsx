import React, { useState } from "react";
import styles from "./PopUpCreateEmploy.module.scss";
import DataContext from "../../context";
import Input from "../Input/Input";
import Button from "../Button/Button";
import PopUpContainer from "../PopUpContainer/PopUpContainer";

export function PopUpCreateEmploy(props) { 
  const {appData} = React.useContext(DataContext);
 const [dataNewEdicator, setdataNewEdicator] = useState([
    {
        fio: "",
        position: "",
        rate: "",
        department: "",
    }
 ])
    const handleInputChange = (name, value) => {
        setdataNewEdicator(prevState => ({ ...prevState, [name]: value }));
        console.log("Worked")
    }
    const handleClicks = () =>{
        console.log('dataNewEdicator', dataNewEdicator)
    }
  return (
    <PopUpContainer title="Добавление преподавателя" mT="120">
        <div className={styles.mainPop__inner}>
            <div className={styles.inputBlock}>
                <Input Textlabel="ФИО" placeholder="Иваннов Иван Михайлович" name={"fio"} handleInputChange={handleInputChange}/>
                <Input Textlabel="Должность" placeholder="Заведующий кафедрой САПР" name={"position"} handleInputChange={handleInputChange}/>
                {/* <Input Textlabel="Ставка" placeholder="0,5"/> */}
                <Input Textlabel="Ставка" placeholder="0,5" name={"rate"} handleInputChange={handleInputChange}/>
                <Input Textlabel="Кафедра" placeholder="САПР" name={"department"} handleInputChange={handleInputChange}/>
            </div>
            <div className={styles.buttonBlock} style={{display:"flex", justifyContent:"end", position:"relative", bottom:"-20px"}}>
                <Button text="Сохранить" Bg="#8bc975" textColot="#fff" handleClicks={handleClicks}/>
            </div>
        </div>
    </PopUpContainer>
  );
}
