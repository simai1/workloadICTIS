import React, { useContext, useEffect } from "react";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkload, funfastenedDataSort } from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

function TableWorkload(props) {
  const { tabPar, visibleDataPar, basicTabData, checkPar } =
    useContext(DataContext);
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
    const fd = filteredWorkload(basicTabData.workloadDataFix, props.searchTerm);
    const fixfd = basicTabData.funFilteredFilterSelected(fd);
    basicTabData.setFiltredData(fixfd);
  }, [props.searchTerm]);

  //! при нажатии правой кнопки мыши на таблицу открывает мню
  const handleContextMenu = (e) => {
    e.preventDefault();
    let plusX = e.pageX + 256 > window.innerWidth ? -256 : 0;
    let plusY = e.pageY + 320 > window.innerHeight ? -320 : 0;
    tabPar.setContextPosition({ x: e.pageX + plusX, y: e.pageY + plusY });
    tabPar.setContextMenuShow(!tabPar.contextMenuShow);
  };

  //! достаем и локал стореджа состояние фитрации по заголовку
  useEffect(() => {
    const ssIsChecked = JSON.parse(sessionStorage.getItem("isCheckedWorkload"));
    console.log("ssIsChecked", ssIsChecked);
    if (ssIsChecked && ssIsChecked !== null && ssIsChecked.length > 0) {
      checkPar.setIsChecked(ssIsChecked);
      checkPar.setAllChecked(false);
    }
    if (checkPar.isChecked.length !== 0) {
      checkPar.setAllChecked(false);
    }
  }, []);

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
      onScroll={scrollTable}
      ref={tabPar.tableRefWorkload}
    >
      {tabPar.contextMenuShow && tabPar.selectedTr.length != 0 && (
        <ContextMenu />
      )}
      <Table />
    </div>
  );
}

export default TableWorkload;
