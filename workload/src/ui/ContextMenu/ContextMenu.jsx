import React, { useState } from "react";
import styles from "./ContextMenu.module.scss";
import arrow from "./../../img/arrow.svg";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
import {
  addEducatorWorkload,
  createOffer,
  deleteWorkload,
  joinWorkloads,
  removeEducatorinWorkload,
  splitWorkload,
} from "../../api/services/ApiRequest";
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
      addEducatorWorkload(data).then(() => {
        props.getDataTableAll();
      });
      // запросим данные таблицы
    } else if (propose) {
      //! отправляем запрос на добавление предложения
      createOffer(data).then(() => {
        props.getDataTableAll();
        console.log("Предложение отправленно ", data);
      });
    }
  };

  //! Деление нагрузки на count
  const handleSplitWorkload = (count) => {
    console.log("Разделить на ", count, props.individualCheckboxes);
    const data = {
      ids: props.individualCheckboxes,
      n: count,
    };
    props.individualCheckboxes[0]
      ? splitWorkload(data).then(() => {
          props.getDataTableAll();
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
          props.getDataTableAll();
        })
      : console.error("Выберите 2 нагрузки");
  };

  //! удаление нагрузки
  const handleDeletWorkload = () => {
    console.log("удалить ", props.individualCheckboxes);
    const data = { ids: props.individualCheckboxes };
    deleteWorkload(data).then(() => {
      props.getDataTableAll();
    });
  };

  //! удалить преподавателя у нагрузки
  const removeEducator = () => {
    console.log(props.individualCheckboxes);
    const data = {
      workloadId: props.individualCheckboxes[0],
    };
    removeEducatorinWorkload(data).then(() => {
      props.getDataTableAll();
    });
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
            onClick={removeEducator}
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
        {props.individualCheckboxes.length === 1 && (
          <div>
            <button
              className={styles.activeStylePointer}
              onClick={props.onAddComment}
            >
              Оставить комментарий
            </button>
          </div>
        )}

        {props.individualCheckboxes.length > 1 && (
          <div>
            <button
              className={styles.activeStylePointer}
              onClick={handleJoinWorkloads}
            >
              Объеденить
            </button>
          </div>
        )}
        {props.individualCheckboxes.length === 1 && (
          <div className={styles.blockMenuPop} onClick={onClickPropose}>
            <button className={styles.activeStylePointer}>Предложить</button>
            <img
              src={arrow}
              alt=">"
              className={propose ? styles.imgOpen : styles.imgClose}
            />
          </div>
        )}

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
        // меню с выбором преподавалетля
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
