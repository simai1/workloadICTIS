import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import svgExit from "./../../img/exit.svg";
import DataContext from "../../context";
// import { getAllocatedAndUnallocatedWrokloadHours } from "../../api/services/ApiRequest";
function Profile(props) {
  const { appData } = React.useContext(DataContext);
  const [name, setName] = useState("");
  const roles = {
    METHODIST: "Методист",
    LECTURER: "Лектор",
    DEPARTMENT_HEAD: "Заведующий кафедрой",
    DIRECTORATE: "Директор",
    EDUCATOR: "Преподаватель",
    UNIT_ADMIN: "Администратор подразделения",
    DEPUTY_DIRECTORATE: "Заместитель директора",
    DEPUTY_DEPARTMENT_HEAD: "Заместитель заведующего кафедрой",
    GIGA_ADMIN: "Администратор системы",
    GOD: "БОГ",
  };

  const getInstitut = () => {
    const iname = appData.myProfile?.institutionalAffiliation;
    if (appData.myProfile?.role === "DIRECTORATE") {
      return iname;
    }
  };

  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (
        props?.refProfile.current &&
        !props?.refProfile.current.contains(event.target)
      ) {
        props?.setOpenModalWind(false);
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

  //! функция которая добовляет инициалы на основе ширины страницы
  const getNameByWidth = (name) => {
    let n = name;
    if (name && window.innerWidth < 1400) {
      const splitName = name.split(" ");
      const fio =
        splitName[0] + " " + splitName[1][0] + ". " + splitName[2][0] + ".";
      n = fio;
    }
    return n || name;
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    let origName = appData.myProfile?.name;
    let fio = "";
    if (name && windowWidth < 1400) {
      const splitName = origName.split(" ");
      fio = splitName[0] + " " + splitName[1][0] + ". " + splitName[2][0] + ".";
    }
    setName(fio || origName);
  }, [appData.myProfile?.name, windowWidth]);

  return (
    <div ref={props.refProfile} className={styles.Profile}>
      <div className={styles.container} onClick={clickModalWind}>
        {name}
      </div>
      {props.onenModalWind && (
        <div className={styles.modal_window}>
          <div className={styles.triangle}></div>
          <span className={styles.title}>
            {roles[appData.myProfile?.role]} {getInstitut()}
          </span>
          <span className={styles.inner}>{appData.myProfile?.login}</span>
          {appData.metodRole[appData.myProfile?.role]?.some(
            (el) => el === 52
          ) && (
            <div className={styles.profileData}>
              <p>
                Общая сумма нагрузки :{" "}
                {appData.hoursWorkloadSumma?.hoursAllWorkload} часов{" "}
              </p>
              <p>
                Осталось распределить :{" "}
                {appData.hoursWorkloadSumma?.hoursWorkloadWithoutEducators}{" "}
                часов
              </p>
            </div>
          )}
          <div className={styles.exid}>
            <a href="http://192.168.120.15:3010/auth/logout">
              Выйти <img src={svgExit} alt="->"></img>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
