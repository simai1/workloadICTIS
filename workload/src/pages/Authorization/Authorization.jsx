import React from "react";
import { Link } from "react-router-dom";
import styles from "./Authorization.module.scss";
// http://localhost:3010/auth/loginSfedu
function Authorization() {
  return (
    <main className={styles.Authorization}>
      <div className={styles.Authorization_container}>
        <h2>Авторизация</h2>
        <a
          className={styles.button}
          href="http://localhost:3010/auth/loginSfedu"
        >
          Войти через сервис Microsoft
        </a>
      </div>
      <Link className={styles.home} to="./HomePage">
        HomePage
      </Link>
    </main>
  );
}

export default Authorization;
