import React, { useEffect, useState } from "react";
import styles from "./ContextMenu.module.scss";
import { Educator, apiEducatorDepartment } from "../../api/services/ApiRequest";
import DataContext from "../../context";

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

  return (
    <div
      className={styles.EducatorMenu}
      style={
        tabPar.contextPosition.x + 280 + 180 > window.innerWidth
          ? {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x - 200,
            }
          : {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x + 280,
            }
      }
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
