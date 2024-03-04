import React, { useState } from "react";
import styles from "./ContextMenu.module.scss";
import arrow from "./../../img/arrow.svg";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
import { addEducatorWorkload } from "../../api/services/ApiGetData";
const ContextMenu = (props) => {
  const [menuPosition, setMenuPosition] = useState(props.menuPosition);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [educatorMenuShow, setEducatorMenuShow] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };
  const handleMouseClickPop = () => {
    setShowSubMenu(!showSubMenu);
  };

  //! Добавить преподавателя
  const addEducator = () => {
    setEducatorMenuShow(!educatorMenuShow);
  };

  //! Выбор преподавателя
  const selectedEducator = (id) => {
    props.setShowMenu(false);
    const data = {
      idWorkload: "John",
      idEductor: id,
    };
    addEducatorWorkload(data) //отправка запроса на добавление преподавателя
      .then((response) => {
        console.log("Response:", response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div onContextMenu={handleContextMenu} className={styles.ContextMenu}>
      <div
        style={{
          position: "fixed",
          top: menuPosition.y,
          left: menuPosition.x,
        }}
        className={styles.blockMenu}
      >
        <div className={styles.blockMenuPop}>
          <button onClick={addEducator} className={styles.activeStylePointer}>
            Добавить преподователя
          </button>
          <img
            src={arrow}
            className={educatorMenuShow ? styles.imgOpen : styles.imgClose}
          />
        </div>
        <div onClick={handleMouseClickPop} className={styles.blockMenuPop}>
          <button className={styles.buttonDel}>Разделить</button>

          {showSubMenu && <img src={arrow} className={styles.imgOpen} />}
          {!showSubMenu && <img src={arrow} className={styles.imgClose} />}
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.handleMenuClick}
          >
            Объеденить
          </button>
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.handleMenuClick}
          >
            Копировать
          </button>
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.handleMenuClick}
          >
            Согласовать
          </button>
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.handleMenuClick}
          >
            Предложить
          </button>
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.handleMenuClick}
          >
            Удалить
          </button>
        </div>
      </div>
      {showSubMenu && (
        <SubMenu
          handleMenuClick={props.handleMenuClick}
          menuPosition={menuPosition}
        />
      )}
      {educatorMenuShow && (
        <EducatorMenu
          menuPosition={menuPosition}
          selectedEducator={selectedEducator}
        />
      )}
    </div>
  );
};

export default ContextMenu;
