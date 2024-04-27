import React, { useEffect, useState } from "react";
import styles from "./ContextMenu.module.scss";
import arrow from "./../../img/arrow.svg";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
import DataContext from "../../context";
import { EducatorLK } from "../../api/services/ApiRequest";
import { Highlight } from "./Highlight";
import MenuPop from "./MenuPop";
import { splitWorkloadCount, upDateEducator } from "./Function";

const ContextMenu = (props) => {
  const { appData, tabPar } = React.useContext(DataContext);
  const [menuShow, setMenuShow] = useState("");
  const [educatorMenuShow, setEducatorMenuShow] = useState(false);
  const [propose, setPropose] = useState(false);
  const [Highlightshow, setHighlightshow] = useState(false);

  useEffect(() => {
    console.log("bufferAction", appData.bufferAction);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    tabPar.setContextPosition({ x: e.clientX, y: e.clientY });
  };

  //! нажатие на разделить
  const handleMouseClickPop = () => {
    setMenuShow(menuShow === "subMenu" ? "" : "subMenu");
  };

  //! нажатие на добавить преподавателя
  const addEducator = () => {
    setMenuShow(menuShow === "educator" ? "" : "educator");
  };

  //! нажатие на предложить
  const onClickPropose = () => {
    setMenuShow(menuShow === "propose" ? "" : "propose");
  };

  //! нажатие выделить
  const ClickHighlightshov = () => {
    setMenuShow(menuShow === "highlight" ? "" : "highlight");
  };

  //!функция замены цвета
  const SetColor = (colorRows) => {
    const updatedHighlights = [...props.Highlight]; // Создаем копию текущего состояния highlights
    appData.individualCheckboxes.forEach((id) => {
      const existingIndex = updatedHighlights.findIndex((el) => el.id === id);
      if (existingIndex !== -1) {
        updatedHighlights[existingIndex] = {
          ...updatedHighlights[existingIndex],
          color: colorRows,
        };
      } else {
        updatedHighlights.push({ id: id, color: colorRows }); // Добавляем новый элемент в массив
      }
    });
    props.setHighlight(updatedHighlights); // Обновляем состояние highlights
    console.log(props.Highlight);
  };

  //! Выбор преподавателя
  const selectedEducator = (id) => {
    setMenuShow("");
    const data = {
      workloadId: tabPar.selectedTr[0],
      educatorId: id,
    };

    if (menuShow === "educator") {
      EducatorLK(id).then((dataReq) => {
        const { newData, prevState } = upDateEducator(
          tabPar.workloadDataFix,
          tabPar.selectedTr[0],
          dataReq.name
        );
        tabPar.setWorkloadDataFix(newData);
        appData.setBufferAction([
          { request: "addEducatorWorkload", data, prevState },
          ...appData.bufferAction,
        ]);
      });
    } else if (menuShow === "propose") {
      //! отправляем запрос на добавление предложения
      EducatorLK(id).then((Educator) => {
        const offer = {
          Educator: appData.myProfile,
          workloadId: tabPar.selectedTr[0],
          educatorId: Educator.id,
        };
        tabPar.setAllOffersData([...tabPar.allOffersData, offer]);
        //! буфер
        appData.setBufferAction([
          {
            request: "createOffer",
            data: {
              workloadId: tabPar.selectedTr[0],
              educatorId: appData.myProfile.id,
            },
          },
          ...appData.bufferAction,
        ]);
      });
    }
  };

  //! Деление нагрузки на count
  const handleSplitWorkload = (count) => {
    setMenuShow("");
    const data = {
      ids: tabPar.selectedTr,
      n: count,
    };
    const prev = tabPar.workloadDataFix.filter((item) =>
      tabPar.selectedTr.some((el) => el === item.id)
    );
    // Создаем новый массив для измененных данных
    let updatedData = [...tabPar.workloadDataFix];
    const funData = splitWorkloadCount(updatedData, tabPar.selectedTr, count);
    tabPar.setWorkloadDataFix(funData.updatedData);
    appData.setBlockedCheckboxes((prevent) => [...prevent, ...funData.blocked]);
    //! буфер
    appData.setBufferAction([
      {
        request: "splitWorkload",
        data: data,
        prevState: prev,
        newIds: funData.newIds,
      },
      ...appData.bufferAction,
    ]);
  };

  //! соединение нагрузок
  const handleJoinWorkloads = (count) => {
    setMenuShow("");
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
    } else props.setIsPopUpMenu(true);
  };
  //! удаление нагрузки
  const handleDeletWorkload = () => {
    setMenuShow("");
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
  };

  //! удалить преподавателя у нагрузки
  const removeEducator = () => {
    setMenuShow("");
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
  };

  //! стили позиционирование меню
  const positStyle =
    tabPar.contextPosition.y + 320 > window.innerHeight
      ? {
          position: "fixed",
          top: tabPar.contextPosition.y - 320,
          left: tabPar.contextPosition.x,
        }
      : {
          position: "fixed",
          top: tabPar.contextPosition.y,
          left: tabPar.contextPosition.x,
        };

  return (
    <div
      ref={props.refContextMenu}
      onContextMenu={handleContextMenu}
      className={styles.ContextMenu}
    >
      <div style={positStyle} className={styles.blockMenu}>
        <MenuPop
          btnText={"Добавить преподователя"}
          func={addEducator}
          menuShow={menuShow === "educator"}
          img={true}
        />

        <MenuPop
          btnText={"Удалить преподавателя"}
          func={removeEducator}
          img={false}
        />
        <MenuPop btnText={"Закрепить"} func={removeEducator} img={false} />
        <MenuPop
          btnText={"Разделить"}
          func={handleMouseClickPop}
          menuShow={menuShow === "subMenu"}
          img={true}
        />
        {tabPar.selectedTr.length === 1 && (
          <MenuPop
            btnText={"Оставить комментарий"}
            func={props.onAddComment}
            img={false}
          />
        )}
        {tabPar.selectedTr.length > 1 && (
          <MenuPop
            btnText={"Объеденить"}
            func={handleJoinWorkloads}
            img={false}
          />
        )}
        {tabPar.selectedTr.length === 1 && (
          <MenuPop
            btnText={"Предложить"}
            func={onClickPropose}
            menuShow={menuShow === "propose"}
            img={true}
          />
        )}
        <MenuPop btnText={"Удалить"} func={handleDeletWorkload} img={false} />
        <MenuPop
          btnText={"Выделить"}
          func={ClickHighlightshov}
          menuShow={menuShow === "highlight"}
          img={true}
        />
      </div>

      {menuShow === "subMenu" && (
        // разделение нагрузки
        <SubMenu
          contextPosition={tabPar.contextPosition}
          handleSplitWorkload={handleSplitWorkload}
        />
      )}
      {(menuShow === "educator" || menuShow === "propose") && (
        // меню с выбором преподавалетля
        <EducatorMenu
          propose={propose}
          contextPosition={tabPar.contextPosition}
          selectedEducator={selectedEducator}
        />
      )}
      {menuShow === "highlight" && (
        // выделение нагрузки
        <Highlight
          contextPosition={tabPar.contextPosition}
          SetColor={SetColor}
        />
      )}
    </div>
  );
};

export default ContextMenu;
