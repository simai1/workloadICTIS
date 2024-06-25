import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import svgExit from "./../../img/exit.svg";
import DataContext from "../../context";
function Profile(props) {
  const { appData } = React.useContext(DataContext);
  const roles = {
    METHODIST: "Методист",
    LECTURER: "Лектор",
    DEPARTMENT_HEAD: "Заведующий кафедрой",
    DIRECTORATE: "Директор",
    EDUCATOR: "Преподаватель",
    UNIT_ADMIN: "Администратор подразделения",
    DEPUTY_DIRECTORATE: "Заместитель директора",
    DEPUTY_DEPARTMENT_HEAD: "Заместитель заведующего кафедрой",
  };
  const institutName = {
    1: "ИКТИБ",
    2: "ИНЕП",
    3: "ИРТСУ",
  };

  const getInstitut = () => {
    const iname = institutName[appData.myProfile?.institutionalAffiliation];
    if (appData.myProfile?.role === "DIRECTORATE" && iname) {
      return iname;
    }
  };

  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (
        props.refProfile.current &&
        !props.refProfile.current.contains(event.target)
      ) {
        props.setOpenModalWind(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

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
          <span className={styles.title}>
            {roles[appData.myProfile?.role]} {getInstitut()}
          </span>
          <span className={styles.inner}>{appData.myProfile?.login}</span>
          <div className={styles.exid}>
            <a href="https://workload.sfedu.ru/auth/logout">
              Выйти <img src={svgExit} alt="->"></img>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
