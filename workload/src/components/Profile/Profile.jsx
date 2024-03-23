import React, { useState } from "react";
import styles from "./Profile.module.scss";
import svgExit from "./../../img/exit.svg";
function Profile(props) {
  const clickModalWind = () => {
    props.setOpenModalWind(!props.onenModalWind);
  };
  return (
    <div ref={props.refProfile} className={styles.Profile}>
      <div className={styles.container} onClick={clickModalWind}>
        Иванов Иван Ивановчи
      </div>
      {props.onenModalWind && (
        <div className={styles.modal_window}>
          <div className={styles.triangle}></div>
          <span className={styles.title}>Заведующий кафедры</span>
          <span className={styles.inner}>ivanov@sfedu.ru</span>
          <div className={styles.exid}>
            <span>Выйти</span>
            <img src={svgExit} alt="->"></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
