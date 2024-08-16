import React, { useEffect, useRef, useState } from "react";
import styles from "./../ContextMenu.module.scss";
import {
  Educator,
  EducatorByInstitute,
  apiEducatorDepartment,
} from "../../../api/services/ApiRequest";
import DataContext from "../../../context";
import { getStylePosition } from "../Function";

export function EducatorMenu(props) {
  const [educator, setEductor] = useState([]); //преподы с бд
  const [filtredData, setFiltredData] = useState(educator);
  const { tabPar, appData } = React.useContext(DataContext);
  const [allEducator, setAllEducator] = useState([]);
  //! институты которым можно видеть всех преподов для зк
  const institutPermission = ["ИРТСУ", "ИКТИБ", "ИНЕП"];

  useEffect(() => {
    // console.log("appData.myProfile", appData.myProfile);
    if (
      appData.myProfile &&
      institutPermission.find(
        (el) => el === appData.myProfile.institutionalAffiliation
      ) &&
      (appData.myProfile.role === "DEPARTMENT_HEAD" ||
        appData.myProfile.role === "DEPUTY_DEPARTMENT_HEAD")
    ) {
      Educator().then((req) => {
        setAllEducator(req?.data);
      });
    }

    // else {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 2)) {
      if (appData.selectedComponent === "MyWorkload") {
        EducatorByInstitute().then((req) => {
          setEductor(req?.data);
          setFiltredData(req?.data);
        });
      } else {
        apiEducatorDepartment().then((req) => {
          setEductor(req?.data);
          setFiltredData(req?.data);
        });
      }
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)) {
      Educator().then((req) => {
        setEductor(req?.data);
        setFiltredData(req?.data);
      });
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1.1)) {
      EducatorByInstitute().then((req) => {
        setEductor(req?.data);
        setFiltredData(req?.data);
      });
    }
    // }
  }, [appData.myProfile]);

  //! поиск
  const handleSearch = (el) => {
    if (
      appData.myProfile.role === "DEPARTMENT_HEAD" ||
      appData.myProfile.role === "DEPUTY_DEPARTMENT_HEAD"
    ) {
      if (el.target.value !== "") {
        const fd = allEducator.filter((item) =>
          item.name.toLowerCase().includes(el.target.value.toLowerCase())
        );
        setFiltredData(fd);
      } else {
        setFiltredData(educator);
      }
    } else {
      const fd = educator.filter((item) =>
        item.name.toLowerCase().includes(el.target.value.toLowerCase())
      );
      setFiltredData(fd);
    }
  };

  //! переменная которая хранит ширину данного меню
  const [menuWidth, setMenuWidth] = useState(240);
  const menuRef = useRef(null);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth);
    }
  }, [menuRef.current]);

  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setEductor([]);
        props.setMenuShow("");
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div
      className={styles.EducatorMenu}
      ref={menuRef}
      style={getStylePosition(
        tabPar.contextPosition,
        window.innerWidth,
        menuWidth,
        props.conxextMenuRefBlock
      )}
    >
      <input
        type="text"
        placeholder="Поиск"
        className={styles.educator_search}
        onChange={handleSearch}
      />
      <ul className={styles.educator_ul}>
        {filtredData.map((el, index) => (
          <li key={index} className={styles.educator_li}>
            <p
              className={styles.educator}
              onClick={() => props.selectedEducator(el.id)}
            >
              {el.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
