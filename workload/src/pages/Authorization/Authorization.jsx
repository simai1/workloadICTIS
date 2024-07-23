import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Authorization.module.scss";
import Input from "../../ui/Input/Input";

function Authorization() {
  const [formData, setFormData] = useState({ login: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = () => {
    // Use the formData object as needed, for example, send it to an API endpoint
    console.log(formData);
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
