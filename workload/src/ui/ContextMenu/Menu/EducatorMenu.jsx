import React, { useEffect, useRef, useState } from "react";
import styles from "./../ContextMenu.module.scss";
import {
  Educator,
  apiEducatorDepartment,
} from "../../../api/services/ApiRequest";
import DataContext from "../../../context";
import { getStylePosition } from "../Function";

export function EducatorMenu(props) {
  const [educator, setEductor] = useState([]); //преподы с бд
  const [filtredData, setFiltredData] = useState(educator);
  const { tabPar, appData } = React.useContext(DataContext);

  useEffect(() => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 2)) {
      apiEducatorDepartment().then((req) => {
        setEductor(req.data);
        setFiltredData(req.data);
      });
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)) {
      Educator().then((req) => {
        setEductor(req.data);
        setFiltredData(req.data);
      });
    }
  }, [appData.myProfile]);

  //! поиск
  const handleSearch = (el) => {
    const fd = educator.filter((item) =>
      item.name.toLowerCase().includes(el.target.value.toLowerCase())
    );
    setFiltredData(fd);
  };

  //! переменная которая хранит ширину данного меню
  const [menuWidth, setMenuWidth] = useState(240);
  const menuRef = useRef(null);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth);
    }
  }, [menuRef.current]);

  return (
    <div
      className={styles.EducatorMenu}
      ref={menuRef}
      style={getStylePosition(
        tabPar.contextPosition,
        window.innerWidth,
        menuWidth,
        props.conxextMenuRef
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
