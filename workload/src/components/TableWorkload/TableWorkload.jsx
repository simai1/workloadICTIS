import React, { useContext, useEffect } from "react";
import { Comment, Workload } from "../../api/services/ApiRequest";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import {
  filteredWorkload,
  funFilterSelected,
  funFixEducator,
  funSplitData,
  funfastenedDataSort,
} from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { plagData } from "./PlagData";
import { returnPrevState } from "../../bufferFunction";

function TableWorkload(props) {
  const { appData, tabPar, visibleDataPar, basicTabData } =
    useContext(DataContext);

  //! при событии скролл таблицы изменим индекс первого показываемого tr
  const scrollTable = (e) => {
    visibleDataPar.visibleData !== basicTabData.filtredData.length - 1 &&
      visibleDataPar.setStartData(
        Math.floor(e.target.scrollTop / visibleDataPar.heightTd)
      );
  };

  //! получаем данные нагрузок с бд
  useEffect(() => {
    //? удалить
    const dataBd = plagData;
    basicTabData.setWorkloadData(dataBd);
    // зменяем массив преподавателя на его имя
    const fixData = funFixEducator(dataBd);
    basicTabData.setWorkloadDataFix(fixData);
    // разделяем на общеинституские и кафедральные
    const splitData = funSplitData(fixData, tabPar.dataIsOid);
    basicTabData.setFiltredData(splitData);
    //? удалить

    //! раскомментить
    // Workload().then((data) => {
    //   const dataBd = [...data];
    //   basicTabData.setWorkloadData(dataBd);
    //   // зменяем массив преподавателя на его имя
    //   const fixData = funFixEducator(dataBd);
    //   basicTabData.setWorkloadDataFix(fixData);
    //   // разделяем на общеинституские и кафедральные
    //   const splitData = funSplitData(fixData, tabPar.dataIsOid);
    //   basicTabData.setFiltredData(splitData);
    //   // получаем все комментарии
    //   Comment().then((data) => {
    //     tabPar.setAllCommentsData(data);
    //   });
    // });
  }, []);

  //! закрепленные данные ставим в начало таблицы
  useEffect(() => {
    // console.log(tabPar.fastenedData);
    basicTabData.setWorkloadDataFix(
      funfastenedDataSort(basicTabData.workloadDataFix, tabPar.fastenedData)
    );
  }, [tabPar.fastenedData]);

  //! при зменении основынх данных записываем их в фильтрованные
  useEffect(() => {
    basicTabData.setFiltredData([...basicTabData.workloadDataFix]);
  }, [basicTabData.workloadDataFix]);

  //! обновление таблицы, отмена действия при ctrl+z
  useEffect(() => {
    if (appData.bufferAction[0] === 0) {
      appData.setBufferAction([]);
    }
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + z для отмены последнего действияы
      if (
        (event.ctrlKey || event.comand) &&
        (event.key === "z" ||
          event.key === "я" ||
          event.key === "Z" ||
          event.key === "Я")
      ) {
        console.log("отеменено последнее действие", appData.bufferAction);
        //! отмена последнего действия
        if (appData.bufferAction.length > 0) {
          if (
            appData.bufferAction[0].request === "removeEducatorinWorkload" ||
            appData.bufferAction[0].request === "addEducatorWorkload"
          ) {
            returnPrevState(
              appData.bufferAction,
              basicTabData.workloadDataFix
            ).then((data) => {
              basicTabData.setWorkloadDataFix(data);
              appData.setBufferAction((prevItems) => prevItems.slice(1));
            });
          } else if (appData.bufferAction[0].request === "deleteComment") {
            tabPar.setAllCommentsData([
              ...tabPar.allCommentsData,
              ...appData.bufferAction[0].prevState,
            ]);
            appData.setBufferAction((prevItems) => prevItems.slice(1));
          } else if (appData.bufferAction[0].request === "joinWorkloads") {
            // удаляем нагрузку которую обьеденили
            const dataTable = basicTabData.workloadDataFix.filter(
              (item) =>
                !appData.bufferAction[0].prevState.some(
                  (el) => el.id === item.id
                )
            );
            // сохраняем индекс удаленного элемента
            const deletedIndex = basicTabData.workloadDataFix.findIndex(
              (item) =>
                appData.bufferAction[0].prevState.some(
                  (el) => el.id === item.id
                )
            );
            const newArray = [...dataTable];
            newArray.splice(
              deletedIndex,
              0,
              ...appData.bufferAction[0].prevState
            );
            basicTabData.setWorkloadDataFix(newArray);
            // убираем заблокированные элементы
            appData.setBlockedCheckboxes((prev) =>
              prev.filter(
                (el) =>
                  !appData.bufferAction[0].prevState.some(
                    (item) => item.id !== el
                  )
              )
            );
          } else if (appData.bufferAction[0].request === "splitWorkload") {
            // отмена разделения нагрузки
            basicTabData.setWorkloadDataFix(
              basicTabData.workloadDataFix.filter(
                (item) => !appData.bufferAction[0].newIds.includes(item.id)
              )
            );
            basicTabData.setWorkloadDataFix((prev) => [
              appData.bufferAction[0].prevState[0],
              ...prev,
            ]);
          } else if (appData.bufferAction[0].request === "workloadUpdata") {
            //отмена изменения даннных textarea
            const newData = [...basicTabData.workloadDataFix];
            newData.map((item) => {
              if (item.id === appData.bufferAction[0].data.id) {
                item[appData.bufferAction[0].data.key] =
                  appData.bufferAction[0].prevState;
              }
              return item;
            });
            basicTabData.setWorkloadDataFix([...newData]);
            appData.setBufferAction((prevItems) => prevItems.slice(1));
          } else if (appData.bufferAction[0].request === "deleteWorkload") {
            // возвращаем улаленную нагрузку
            let cd = tabPar.changedData;
            cd.deleted = cd.deleted.filter(
              (el) =>
                !appData.bufferAction[0].data.ids.some((item) => item === el) &&
                el
            );
            tabPar.setChangedData(cd);
            appData.setBufferAction((prevItems) => prevItems.slice(1));
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appData.bufferAction]);

  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  //! фильтруем по FiltredRows
  useEffect(() => {
    const splitData = funSplitData(
      funFixEducator(basicTabData.workloadData),
      tabPar.dataIsOid
    );
    const filterSelected = funFilterSelected(
      splitData,
      tabPar.selectedFilter,
      tabPar.coloredData,
      tabPar.changedData,
      tabPar.fastenedData
    );
    basicTabData.setWorkloadDataFix(filterSelected);
    tabPar.setSelectedTr([]);
    tabPar.setOnCheckBoxAll(false);
    visibleDataPar.setStartData(0);
  }, [tabPar.dataIsOid, tabPar.selectedFilter]);

  //! фильтрация по поиску
  useEffect(() => {
    basicTabData.setFiltredData(
      filteredWorkload(basicTabData.workloadDataFix, props.searchTerm)
    );
  }, [props.searchTerm]);

  //! при нажатии правой кнопки мыши на таблицу открывает мню
  const handleContextMenu = (e) => {
    e.preventDefault();
    let plusX = e.pageX + 256 > window.innerWidth ? -256 : 0;
    let plusY = e.pageY + 320 > window.innerHeight ? -320 : 0;
    tabPar.setContextPosition({ x: e.pageX + plusX, y: e.pageY + plusY });
    tabPar.setContextMenuShow(!tabPar.contextMenuShow);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
      onScroll={scrollTable}
    >
      {tabPar.contextMenuShow && <ContextMenu />}
      <Table />
    </div>
  );
}

export default TableWorkload;
