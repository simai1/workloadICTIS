import React, { useContext, useEffect } from "react";
import Table from "./Table";
import styles from "./UniversalTable.module.scss";
import { filteredWorkload, funfastenedDataSort } from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

//! обязательные параметры
// const tabDat = {
//   tableHeader,
//   setTableHeader,
//   tableData,
//   setTableData,
//   tableDataFix,
//   setTableDataFix,
//   filtredData,
//   setFiltredData,
//   ssIsChecked,
//   ssHeader,
//   isCheckedStore,
//   isSorted: false, //! показать или скрыть сортировку (в заголовке таблицы)
//   isBlocked: true, //! показывать или скрывать блокированные, (для лектора, чтобы он мог выделять цветом)
// };

function UniversalTable(props) {
  const { tabPar, visibleDataPar, basicTabData } = useContext(DataContext);

  //! при событии скролл таблицы изменим индекс первого показываемого tr
  const scrollTable = (e) => {
    const maxStartData =
      props.tabDat.filtredData.length - visibleDataPar.visibleData;
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
    props.tabDat.setTableDataFix(
      funfastenedDataSort(props.tabDat.tableDataFix, tabPar.fastenedData)
    );
  }, [tabPar.fastenedData]);

  //! фильтрация по поиску
  useEffect(() => {
    if (props.searchTerm.length === 0) {
      props.tabDat.setTableDataFix(
        funfastenedDataSort(props.tabDat.tableDataFix, tabPar.fastenedData)
      );
    } else {
      const fd = filteredWorkload(
        props.tabDat.tableDataFix,
        props.searchTerm,
        tabPar.fastenedData
      );
      const fixfd = basicTabData.funFilteredFilterSelected(fd);
      props.tabDat.setFiltredData(fixfd);
    }
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
      ref={tabPar.tableRefWorkload}
    >
      <div className={styles.psevdoElem}></div>

      {tabPar.contextMenuShow &&
        tabPar.selectedTr.length !== 0 &&
        (props.contextMenu === "TableWorkload" ||
          props.contextMenu === "MyWorkload") && (
          <ContextMenu
            setTableDataFix={props.tabDat.setTableDataFix}
            tableDataFix={props.tabDat.tableDataFix}
            allowedMenus={[
              "Закрепить",
              "Открепить",
              "comments",
              "Предложить",
              "Выделить",
            ]}
          />
        )}
      <Table tabDat={props.tabDat} />
    </div>
  );
}

export default UniversalTable;
