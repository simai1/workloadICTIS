import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Authorization.module.scss";
import Input from "../../ui/Input/Input";
import { AuthTest } from "../../api/services/ApiRequest";
import DataContext from "../../context";

function Authorization() {
  const { appData, tabPar, visibleDataPar, basicTabData } =
    React.useContext(DataContext);
  const [formData, setFormData] = useState({ login: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = () => {
    console.log('formData', formData)
    AuthTest(formData).then((resp)=>{
      if(resp?.status === 200){
        console.log(resp)
        appData.setMyProfile(resp?.data.user)
        navigate('/HomePage')//!то что нужно вставить
        // location.reload()
      }else{
        alert("Неверный логин или пароль!")
      }
    }) 
  }

  return (
    <main className={styles.Authorization}>
      <div className={styles.Authorization_container}>
        <h2>Авторизация</h2>
        <div className={styles.inputCont}>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleInputChange}
            placeholder="Логин"
          />
        </div>
        <div className={styles.inputCont}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Пароль"
          />
        </div>
      
        <div className={styles.buttonBlock}>
          <button onClick={handleSubmit}>
            Войти
          </button>
        </div>
      </div>
    </main>
  );
}

export default Authorization;
