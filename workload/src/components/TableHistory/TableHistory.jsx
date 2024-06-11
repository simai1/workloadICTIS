import React, { useContext, useEffect, useState } from "react";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import {
  filteredWorkload,
  funHistoryFix,
  funfastenedDataSort,
} from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

function TableHistory(props) {
  const { tabPar, visibleDataPar, basicTabData } = useContext(DataContext);
  //! при событии скролл таблицы изменим индекс первого показываемого tr
  const scrollTable = (e) => {
    const maxStartData =
      basicTabData.filtredData.length - visibleDataPar.visibleData;
    visibleDataPar.setStartData(
      Math.max(
        0,
        Math.min(
          Math.floor(e.target.scrollTop / visibleDataPar.heightTd),
          maxStartData
        )
      )
    );
  };

  //! закрепленные данные ставим в начало таблицы
  useEffect(() => {
    // console.log(tabPar.fastenedData);
    basicTabData.setWorkloadDataFix(
      funfastenedDataSort(basicTabData.workloadDataFix, tabPar.fastenedData)
    );
  }, [tabPar.fastenedData]);

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

  const [historyData, sethistoryData] = useState([]);
  useEffect(() => {
    console.log("история изменений", basicTabData.historyChanges);
    //! разделяем историю по типам
    const fixHistory = funHistoryFix(basicTabData.historyChanges);
    console.log("fixHistory", fixHistory);
    sethistoryData(fixHistory);
  }, [basicTabData.historyChanges]);

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
      onScroll={scrollTable}
    >
      {/* {tabPar.contextMenuShow && tabPar.selectedTr.length != 0 && (
        <ContextMenu />
      )} */}
      <Table historyData={historyData} />
    </div>
  );
}

export default TableHistory;
