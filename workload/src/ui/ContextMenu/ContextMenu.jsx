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
      workloadId: appData.individualCheckboxes[0],
      educatorId: id,
    };
    if (educatorMenuShow) {
      // получаем преподавателей и изменяем данные в таблице предваритеольно до сохранения
      EducatorLK(id).then((dataReq) => {
        let prevState = null;
        const newUpdatedData = props.updatedData.map((object) => {
          if (object.id === appData.individualCheckboxes[0]) {
            prevState = object.educator;
            return { ...object, educator: dataReq.name };
          }
          return object;
        });
        // newUpdatedData.map((item) => console.log("name", item.educator));
        props.setUpdatedData(newUpdatedData);
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
          workloadId: appData.individualCheckboxes[0],
          educatorId: Educator.id,
        };
        props.setAllOffersData([...props.allOffersData, offer]);

        console.log("offer", offer);

        //! буфер
        appData.setBufferAction([
          {
            request: "createOffer",
            data: {
              workloadId: appData.individualCheckboxes[0],
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
    console.log("Разделить на ", count, appData.individualCheckboxes);
    const data = {
      ids: appData.individualCheckboxes,
      n: count,
    };
    console.log("updatedData", props.updatedData);
    const newUpdatedData = [...props.updatedData]; // копирование исходного массива

    appData.individualCheckboxes.forEach((targetId, index) => {
      const elementIndex = newUpdatedData.findIndex(
        (object) => object.id === targetId
      ); // поиск индекса элемента по id
      const targetElement = newUpdatedData.find(
        (object) => object.id === targetId
      ); // найденный элемент

      targetElement.id = "000000000000";
      targetElement.numberOfStudents = targetElement.numberOfStudents / 2;

      console.log("targetElement", targetElement);
      if (elementIndex !== -1) {
        // если элемент с заданным id найден
        newUpdatedData.splice(elementIndex + index + 1, 0, {
          ...targetElement,
        }); // вставка нового элемента после выбранного элемента
      }
    });
    console.log("newUpdatedData", newUpdatedData);
    props.setUpdatedData(newUpdatedData);

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

  //! соединение нагрузок
  const handleJoinWorkloads = (count) => {
    console.log("соеденить ", count, appData.individualCheckboxes);
    const data = {
      ids: appData.individualCheckboxes,
    };

    // берем все обьеденяемые элементы и записываем в предыдущее сотсояние
    const prevState = props.updatedData.filter((item) => {
      return Object.values(appData.individualCheckboxes).includes(item.id);
    });

    // проверим совпадение необходимых параметов для обьединения
    if (
      prevState.every((item) => item.workload === prevState[0].workload) &&
      prevState.every((item) => item.discipline === prevState[0].discipline) &&
      prevState.every((item) => item.hours === prevState[0].hours)
    ) {
      // подсчет общего колличества студентов
      const sumOfStudents = prevState.reduce(
        (total, el) => total + el.numberOfStudents,
        0
      );
      // складываем уникальные группы
      const groups = prevState.reduce((total, el) => {
        if (!total.includes(el.groups)) {
          return total + " " + el.groups;
        }
        return total;
      }, "");
      const individualCB = Object.values(appData.individualCheckboxes).splice(
        1
      );
      // удаляем все обьеденяемые нагрузки кроме первой
      const upData = props.updatedData.filter((item) => {
        return !individualCB.includes(item.id);
      });

      // изменим параметры нагрузки
      const index = upData.findIndex(
        (item) => item.id === appData.individualCheckboxes[0]
      );
      appData.setBlockedCheckboxes((prevent) => [
        ...prevent,
        appData.individualCheckboxes[0],
      ]);

      if (index !== -1) {
        const updatedObject = {
          ...upData[index],
          groups: groups,
          numberOfStudents: sumOfStudents,
        };
        // Создадим новый массив с обновленным объектом
        const newUpdatedData = [
          ...upData.slice(0, index),
          updatedObject,
          ...upData.slice(index + 1),
        ];
        props.setUpdatedData(newUpdatedData);
        appData.setIndividualCheckboxes([]);
      }

      //! буфер
      appData.setBufferAction([
        { request: "joinWorkloads", data: data, prevState: prevState },
        ...appData.bufferAction,
      ]);
    } else console.log("Нельзя соеденить");
 

  //! удаление нагрузки
  const handleDeletWorkload = () => {
    console.log("удалить ", appData.individualCheckboxes);
    const data = { ids: appData.individualCheckboxes };
    const newUpdatedData = appData.updatedData.filter(
      (item) => !appData.individualCheckboxes.includes(item.id)
    );
    props.setUpdatedData(newUpdatedData);
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
    console.log(appData.individualCheckboxes);
    const data = {
      workloadId: appData.individualCheckboxes[0],
    };
    let prevState = null;
    const newUpdatedData = props.updatedData.map((object) => {
      if (object.id === appData.individualCheckboxes[0]) {
        prevState = object.educator;
        return { ...object, educator: null };
      }
      return object;
    });
    props.setUpdatedData(newUpdatedData);

    //! буфер
    appData.setBufferAction([
      { request: "removeEducatorinWorkload", data: data, prevState: prevState },
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
        {appData.individualCheckboxes.length === 1 && (
          <div>
            <button
              className={styles.activeStylePointer}
              onClick={props.onAddComment}
            >
              Оставить комментарий
            </button>
          </div>
        )}

        {appData.individualCheckboxes.length > 1 && (
          <div>
            <button
              className={styles.activeStylePointer}
              onClick={handleJoinWorkloads}
            >
              Объеденить
            </button>
          </div>
        )}
        {appData.individualCheckboxes.length === 1 && (
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
