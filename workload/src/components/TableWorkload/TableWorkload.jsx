import React, { useContext, useEffect } from "react";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkload, funfastenedDataSort } from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

function TableWorkload(props) {
  const { tabPar, visibleDataPar, basicTabData } = useContext(DataContext);
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
