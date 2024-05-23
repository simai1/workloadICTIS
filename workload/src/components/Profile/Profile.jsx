import React, { useState } from "react";
import styles from "./Profile.module.scss";
import svgExit from "./../../img/exit.svg";
import DataContext from "../../context";
function Profile(props) {
  const { appData } = React.useContext(DataContext);
  const roles = {
    METHODIST: "Методист",
    LECTURER: "Лектор",
    DEPARTMENT_HEAD: "Заведующий кафедры",
    DIRECTORATE: "Директор",
    EDUCATOR: "Преподаватель",
  };
  const clickModalWind = () => {
    props.setOpenModalWind(!props.onenModalWind);
  };
  return (
    <div ref={props.refProfile} className={styles.Profile}>
      <div className={styles.container} onClick={clickModalWind}>
        {appData.myProfile?.name}
      </div>
      {props.onenModalWind && (
        <div className={styles.modal_window}>
          <div className={styles.triangle}></div>
          <span className={styles.title}>{roles[appData.myProfile?.role]}</span>
          <span className={styles.inner}>{appData.myProfile?.login}</span>
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
