import React, { useContext, useEffect } from "react";
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
import { returnPrevState } from "../../bufferFunction";
import { delChangeData } from "../../ui/ContextMenu/Function";

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

  //! закрепленные данные ставим в начало таблицы
  useEffect(() => {
    // console.log(tabPar.fastenedData);
    basicTabData.setWorkloadDataFix(
      funfastenedDataSort(basicTabData.workloadDataFix, tabPar.fastenedData)
    );
  }, [tabPar.fastenedData]);

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
            // убираем выделение с преподавателя
            tabPar.setChangedData(
              delChangeData(tabPar.changedData, "educator", [
                appData.bufferAction[0].data.workloadId,
              ])
            );

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
            tabPar.setChangedData((prev) =>
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
            // возвращаем удаленную нагрузку
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
