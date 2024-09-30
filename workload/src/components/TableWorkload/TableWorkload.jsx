import React, { useContext, useEffect } from "react";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkload, funfastenedDataSort } from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { useSelector } from "react-redux";
// import { FilteredSample } from "../../ui/SamplePoints/Function";

function TableWorkload(props) {
  const { appData, tabPar, visibleDataPar, basicTabData, checkPar } =
    useContext(DataContext);
  const ssname = `isCheckedWorkload${basicTabData.nameKaf}`;

  //! достаем данные из редакса
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);
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
    basicTabData.setWorkloadDataFix(
      funfastenedDataSort(basicTabData.workloadDataFix, tabPar.fastenedData)
    );
  }, [tabPar.fastenedData]);

  //! фильтрация по поиску
  useEffect(() => {
    if (props.searchTerm.length === 0) {
      basicTabData.setWorkloadDataFix(
        funfastenedDataSort(basicTabData.workloadDataFix, tabPar.fastenedData)
      );
    } else {
      const fd = filteredWorkload(
        basicTabData.workloadDataFix,
        props.searchTerm,
        tabPar.fastenedData
      );
      const fixfd = basicTabData.funFilteredFilterSelected(fd);
      basicTabData.setFiltredData(fixfd);
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

  //! достаем из стореджа состояние фитрации по заголовку
  useEffect(() => {
    const checks = isCheckedStore[ssname];
    checkPar.setIsChecked(checks || []);
  }, [basicTabData.nameKaf, isCheckedStore]);

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
      onScroll={scrollTable}
      ref={tabPar.tableRefWorkload}
    >
      <div className={styles.psevdoElem}></div>
      {tabPar.contextMenuShow && tabPar.selectedTr.length != 0 && (
        <ContextMenu
          tableDataFix={basicTabData?.workloadDataFix}
          setTableDataFix={basicTabData?.setWorkloadDataFix}
          allowedMenus={
            appData.myProfile.role === "DEPARTMENT_HEAD" ||
            appData.myProfile.role === "DEPUTY_DEPARTMENT_HEAD"
              ? [
                  "educator",
                  "removeEducator",
                  "Закрепить",
                  "Открепить",
                  "всеразделения",
                  "comments",
                  "всеобъединения",
                  // "Предложить",
                  "Удалить",
                  "Выделить",
                ]
              : null
          }
        />
      )}
      <Table ssname={ssname} />
    </div>
  );
}

export default TableWorkload;
