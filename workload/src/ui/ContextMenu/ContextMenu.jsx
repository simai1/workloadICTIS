import React, { useEffect, useState } from "react";
import styles from "./ContextMenu.module.scss";
import arrow from "./../../img/arrow.svg";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
// import {
//   addEducatorWorkload,
//   createOffer,
//   deleteWorkload,
//   joinWorkloads,
//   removeEducatorinWorkload,
//   splitWorkload,
// } from "../../api/services/ApiRequest";
import DataContext from "../../context";
import { EducatorLK } from "../../api/services/ApiRequest";
// import { addDataBuffer } from "../../bufferFunction";
const ContextMenu = (props) => {
  const [menuPosition, setMenuPosition] = useState(props.menuPosition);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [educatorMenuShow, setEducatorMenuShow] = useState(false);
  const [propose, setPropose] = useState(false);

  const { appData } = React.useContext(DataContext);
  useEffect(() => {
    console.log("bufferAction", appData.bufferAction);
  }, []);

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
      // получаем преподавателей и изменяем данные в таблице предваритеольно до сохранения
      EducatorLK(id).then((dataReq) => {
        let prevState = null;
        const newFilteredData = props.updatedData.map((object) => {
          if (object.id === props.individualCheckboxes[0]) {
            prevState = object.educator;
            return { ...object, educator: dataReq.name };
          }
          return object;
        });
        // newFilteredData.map((item) => console.log("name", item.educator));
        props.setUpdatedData(newFilteredData);
        //! буфер
        appData.setBufferAction([
          { request: "addEducatorWorkload", data: data, prevState: prevState },
          ...appData.bufferAction,
        ]);
      });

      //! отправка запроса на добавление преподавателя
      // addEducatorWorkload(data).then(() => {
      //   props.getDataTableAll();
      // });
      // запросим данные таблицы
    } else if (propose) {
      //! отправляем запрос на добавление предложения
      EducatorLK(id).then((Educator) => {
        console.log("allOffersData", props.allOffersData);
        console.log("data", data);

        const offer = {
          Educator: appData.myProfile,
          workloadId: props.individualCheckboxes[0],
          educatorId: Educator.id,
        };
        props.setAllOffersData([...props.allOffersData, offer]);

        console.log("offer", offer);

        //! буфер
        appData.setBufferAction([
          {
            request: "createOffer",
            data: {
              workloadId: props.individualCheckboxes[0],
              educatorId: appData.myProfile.id,
            },
          },
          ...appData.bufferAction,
        ]);
      });
      // createOffer(data).then(() => {
      //   props.getDataTableAll();
      //   console.log("Предложение отправленно ", data);
      // });
    }
  };

  //! Деление нагрузки на count
  const handleSplitWorkload = (count) => {
    console.log("Разделить на ", count, props.individualCheckboxes);
    const data = {
      ids: props.individualCheckboxes,
      n: count,
    };
    console.log("filteredData", props.filteredData);
    const newFilteredData = [...props.filteredData]; // копирование исходного массива

    props.individualCheckboxes.forEach((targetId, index) => {
      const elementIndex = newFilteredData.findIndex(
        (object) => object.id === targetId
      ); // поиск индекса элемента по id
      const targetElement = newFilteredData.find(
        (object) => object.id === targetId
      ); // найденный элемент

      if (elementIndex !== -1) {
        // если элемент с заданным id найден
        newFilteredData.splice(elementIndex + index + 1, 0, {
          ...targetElement,
        }); // вставка нового элемента после выбранного элемента
      }
    });
    console.log("newFilteredData", newFilteredData);
    props.setFilteredData(newFilteredData);
    //! буфер
    appData.setBufferAction([
      { request: "splitWorkload", data: data },
      ...appData.bufferAction,
    ]);
    //! запрос на деление нагрузки
    // splitWorkload(data).then(() => {
    //   props.getDataTableAll();
    // });
  };

  //! соеденить 2 нагрузки
  const handleJoinWorkloads = (count) => {
    console.log("соеденить ", count, props.individualCheckboxes);
    const data = {
      ids: props.individualCheckboxes,
    };

    //! буфер
    appData.setBufferAction([
      { request: "joinWorkloads", data: data },
      ...appData.bufferAction,
    ]);

    //! запрос на соединение нагрузок
    // joinWorkloads(data).then((response) => {
    //   props.getDataTableAll();
    // });
  };

  //! удаление нагрузки
  const handleDeletWorkload = () => {
    console.log("удалить ", props.individualCheckboxes);
    const data = { ids: props.individualCheckboxes };
    const newFilteredData = props.filteredData.filter(
      (item) => !props.individualCheckboxes.includes(item.id)
    );
    props.setFilteredData(newFilteredData);
    //! буфер
    appData.setBufferAction([
      { request: "deleteWorkload", data: data },
      ...appData.bufferAction,
    ]);
    //! запрос на удаление нагрузки
    // deleteWorkload(data).then(() => {
    //   props.getDataTableAll();
    // });
  };

  //! удалить преподавателя у нагрузки
  const removeEducator = () => {
    console.log(props.individualCheckboxes);
    const data = {
      workloadId: props.individualCheckboxes[0],
    };
    const newFilteredData = props.filteredData.map((object) => {
      if (object.id === props.individualCheckboxes[0]) {
        return { ...object, educator: null };
      }
      return object;
    });
    // newFilteredData.map((item) => console.log("name", item.educator));
    props.setFilteredData(newFilteredData);

    //! буфер
    appData.setBufferAction([
      { request: "removeEducatorinWorkload", data: data },
      ...appData.bufferAction,
    ]);
    //! запрос на удаление преподавателя с нагрузки
    // removeEducatorinWorkload(data).then(() => {
    //   props.getDataTableAll();
    // });
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
