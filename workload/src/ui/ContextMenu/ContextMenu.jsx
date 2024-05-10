import React, { useEffect, useState } from "react";
import styles from "./ContextMenu.module.scss";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
import DataContext from "../../context";
import { EducatorLK } from "../../api/services/ApiRequest";
import { Highlight } from "./Highlight";
import MenuPop from "./MenuPop";
import {
  combineData,
  splitWorkloadCount,
  upDateEducator,
  addСhangedData,
} from "./Function";
import CommentsMenu from "./CommentsMenu";

const ContextMenu = (props) => {
  const { appData, tabPar, basicTabData } = React.useContext(DataContext);
  const [menuShow, setMenuShow] = useState("");

  useEffect(() => {
    console.log("bufferAction", appData.bufferAction);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
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

  //! оставить комментарий
  const onAddComment = () => {
    console.log("оставить комментарий");
    setMenuShow(menuShow === "commentsMenu" ? "" : "commentsMenu");
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
          basicTabData.workloadDataFix,
          tabPar.selectedTr[0],
          dataReq.name
        );
        basicTabData.setWorkloadDataFix(newData);
        appData.setBufferAction([
          { request: "addEducatorWorkload", data, prevState },
          ...appData.bufferAction,
        ]);
        //! занесем id измененнных данных в состояние
        tabPar.setChangedData(
          addСhangedData(tabPar.changedData, "educator", [tabPar.selectedTr[0]])
        );
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
              educatorId: Educator.id,
            },
          },
          ...appData.bufferAction,
        ]);
        //! занесем id измененнных данных в состояние
        tabPar.setChangedData(
          addСhangedData(tabPar.changedData, "educator", tabPar.selectedTr[0])
        );
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
    const prev = basicTabData.workloadDataFix.filter((item) =>
      tabPar.selectedTr.some((el) => el === item.id)
    );
    // Создаем новый массив для измененных данных
    let updatedData = [...basicTabData.workloadDataFix];
    const funData = splitWorkloadCount(updatedData, tabPar.selectedTr, count);
    basicTabData.setWorkloadDataFix(funData.updatedData);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "splitjoin", funData.blocked)
    );

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
    //! занесем id измененнных данных в состояние
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "splitjoin", funData.newIds)
    );
    tabPar.setSelectedTr([]);
    tabPar.setContextMenuShow(false);
  };

  //! соединение нагрузок
  const handleJoinWorkloads = () => {
    setMenuShow("");
    const data = {
      ids: tabPar.selectedTr,
    };
    const funData = combineData(
      basicTabData.workloadDataFix,
      tabPar.selectedTr
    );
    if (funData === null) {
      console.error("неправильно соеденяем данные");
    } else {
      tabPar.setSelectedTr([]);
      basicTabData.setWorkloadDataFix(funData.newUpdatedData);
      //! буфер
      appData.setBufferAction([
        { request: "joinWorkloads", data: data, prevState: funData.prevState },
        ...appData.bufferAction,
      ]);
      tabPar.setChangedData(
        addСhangedData(tabPar.changedData, "splitjoin", data.ids)
      );
    }
    tabPar.setContextMenuShow(false);

    tabPar.setSelectedTr([]);
  };
  //! удаление нагрузки
  const handleDeletWorkload = () => {
    setMenuShow("");
    const data = { ids: tabPar.selectedTr };
    appData.setBufferAction([
      { request: "deleteWorkload", data },
      ...appData.bufferAction,
    ]);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "deleted", data.ids)
    );
    tabPar.setSelectedTr([]);
    tabPar.setContextMenuShow(false);
  };

  //! удалить преподавателя у нагрузки
  const removeEducator = () => {
    setMenuShow("");
    // const { selectedTr, workloadDataFix, setWorkloadDataFix } = tabPar;
    const workloadId = tabPar.selectedTr[0];
    const prevState = basicTabData.workloadDataFix.find(
      (obj) => obj.id === workloadId
    )?.educator;
    const newUpdatedData = basicTabData.workloadDataFix.map((obj) =>
      obj.id === workloadId ? { ...obj, educator: null } : obj
    );
    basicTabData.setWorkloadDataFix(newUpdatedData);
    //! заносим данные в буффер
    appData.setBufferAction([
      { request: "removeEducatorinWorkload", data: { workloadId }, prevState },
      ...appData.bufferAction,
    ]);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "educator", [workloadId])
    );
    tabPar.setContextMenuShow(false);
  };

  //! функция закрепления
  const pinaCell = () => {
    tabPar.setFastenedData((prev) => [
      ...new Set([...tabPar.selectedTr, ...prev]),
    ]);
    tabPar.setContextMenuShow(false);
  };

  //! открепит
  const unPinaCell = () => {
    const mass = tabPar.fastenedData.filter(
      (item) => !tabPar.selectedTr.some((el) => el === item) && item
    );
    tabPar.setFastenedData(mass);
    tabPar.setContextMenuShow(false);
  };

  //! стили позиционирование меню
  const positStyle = {
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
        {tabPar.selectedTr.length === 1 && (
          <MenuPop
            btnText={"Удалить преподавателя"}
            func={removeEducator}
            img={false}
          />
        )}
        <MenuPop btnText={"Закрепить"} func={pinaCell} img={false} />
        <MenuPop btnText={"Открепить"} func={unPinaCell} img={false} />
        <MenuPop
          btnText={"Разделить"}
          func={handleMouseClickPop}
          menuShow={menuShow === "subMenu"}
          img={true}
        />
        {tabPar.selectedTr.length === 1 && (
          <MenuPop
            btnText={"Оставить комментарий"}
            func={onAddComment}
            menuShow={menuShow === "commentsMenu"}
            img={true}
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
          propose={menuShow === "propose"}
          contextPosition={tabPar.contextPosition}
          selectedEducator={selectedEducator}
        />
      )}
      {menuShow === "highlight" && (
        // выделение нагрузки
        <Highlight />
      )}
      {menuShow === "commentsMenu" && (
        <CommentsMenu setMenuShow={setMenuShow} />
      )}
    </div>
  );
};

export default ContextMenu;
