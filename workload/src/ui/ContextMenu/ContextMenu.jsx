import React, { useState } from "react";
import styles from "./ContextMenu.module.scss";
import arrow from "./../../img/arrow.svg";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
import {
  addEducatorWorkload,
  deleteWorkload,
  joinWorkloads,
  splitWorkload,
} from "../../api/services/ApiGetData";
const ContextMenu = (props) => {
  const [menuPosition, setMenuPosition] = useState(props.menuPosition);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [educatorMenuShow, setEducatorMenuShow] = useState(false);
  const [propose, setPropose] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  //! нажатие на разделить
  const handleMouseClickPop = () => {
    setShowSubMenu(!showSubMenu);
    setEducatorMenuShow(false);
    setPropose(false);
  };

  //! нажатие на добавить преподавателя
  const addEducator = () => {
    setPropose(false);
    setShowSubMenu(false);
    setEducatorMenuShow(!educatorMenuShow);
  };

  //! нажатие на предложить
  const onClickPropose = () => {
    setEducatorMenuShow(false);
    setShowSubMenu(false);
    setPropose(!propose);
  };

  //! Выбор преподавателя
  const selectedEducator = (id) => {
    props.setShowMenu(false);
    const data = {
      workloadId: props.individualCheckboxes[0],
      educatorId: id,
    };
    if (educatorMenuShow) {
      // отправка запроса на добавление преподавателя
      props.individualCheckboxes[0]
        ? addEducatorWorkload(data).then((response) => {
            props.getDataTable();
          })
        : console.error("не выбранно ни одной строки");
      // запросим данные таблицы
    } else if (propose) {
      console.log("Предложение ", data);
    }
  };

  //! Деление нагрузки на count
  const handleSplitWorkload = (count) => {
    console.log("Разделить на ", count, props.individualCheckboxes);
    const data = {
      workloadId: props.individualCheckboxes[0],
      n: count,
    };
    props.individualCheckboxes[0]
      ? splitWorkload(data).then((response) => {
          props.getDataTable();
        })
      : console.error("не выбранно ни одной нагрузки");
  };

  //! соеденить 2 нагрузки
  const handleJoinWorkloads = (count) => {
    console.log("соеденить ", count, props.individualCheckboxes);
    const data = {
      ids: props.individualCheckboxes,
    };
    props.individualCheckboxes.length === 2
      ? joinWorkloads(data).then((response) => {
          props.getDataTable();
        })
      : console.error("Выберите 2 нагрузки");
  };

  //! удаление нагрузки
  const handleDeletWorkload = () => {
    console.log("удалить ", props.individualCheckboxes[0]);
    const data = props.individualCheckboxes[0];
    props.individualCheckboxes[0]
      ? deleteWorkload(data).then((response) => {
          props.getDataTable();
        })
      : console.error("Выберите 1 нагрузку");
  };

  return (
    <div
      ref={props.refContextMenu}
      onContextMenu={handleContextMenu}
      className={styles.ContextMenu}
    >
      <div
        style={{
          position: "fixed",
          top: menuPosition.y,
          left: menuPosition.x,
        }}
        className={styles.blockMenu}
      >
        <div className={styles.blockMenuPop} onClick={addEducator}>
          <button className={styles.activeStylePointer}>
            Добавить преподователя
          </button>
          <img
            src={arrow}
            alt=">"
            className={educatorMenuShow ? styles.imgOpen : styles.imgClose}
          />
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.handleMenuClick}
          >
            Удалить преподавателя
          </button>
        </div>

        <div onClick={handleMouseClickPop} className={styles.blockMenuPop}>
          <button className={styles.buttonDel}>Разделить</button>

          {showSubMenu && (
            <img src={arrow} alt=">" className={styles.imgOpen} />
          )}
          {!showSubMenu && (
            <img src={arrow} alt=">" className={styles.imgClose} />
          )}
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={props.onAddComment}
          >
            Оставить комментарий
          </button>
        </div>
        <div>
          <button
            className={styles.activeStylePointer}
            onClick={handleJoinWorkloads}
          >
            Объеденить
          </button>
        </div>
        <div className={styles.blockMenuPop} onClick={onClickPropose}>
          <button className={styles.activeStylePointer}>Предложить</button>
          <img
            src={arrow}
            alt=">"
            className={propose ? styles.imgOpen : styles.imgClose}
          />
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
            onClick={handleDeletWorkload}
          >
            Удалить
          </button>
        </div>
      </div>
      {showSubMenu && (
        <SubMenu
          handleMenuClick={props.handleMenuClick}
          menuPosition={menuPosition}
          handleSplitWorkload={handleSplitWorkload}
        />
      )}
      {(educatorMenuShow || propose) && (
        <EducatorMenu
          propose={propose}
          menuPosition={menuPosition}
          selectedEducator={selectedEducator}
        />
      )}
    </div>
  );
};

export default ContextMenu;
