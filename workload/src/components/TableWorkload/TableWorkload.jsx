import React, { useEffect, useState } from "react";
import { headers } from "./Data";
import { Workload } from "../../api/services/ApiRequest";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkload, funFixEducator, funSplitData } from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

function TableWorkload(props) {
  const { tabPar } = React.useContext(DataContext);
  const tableHeaders = headers;

  //! получаем данные нагрузок с бд
  useEffect(() => {
    Workload().then((data) => {
      const dataBd = [...data];
      tabPar.setWorkloadData(dataBd);
      // зменяем массив преподавателя на его имя
      const fixData = funFixEducator(dataBd);
      tabPar.setWorkloadDataFix(fixData);
      // разделяем на общеинституские и кафедральные
      const splitData = funSplitData(fixData, tabPar.dataIsOid);
      tabPar.setFiltredData(splitData);
    });
  }, []);

  //! при зменении основынх данных записываем их в фильтрованные
  useEffect(() => {
    tabPar.setFiltredData([...tabPar.workloadDataFix]);
  }, [tabPar.workloadDataFix]);

  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  useEffect(() => {
    const splitData = funSplitData(
      funFixEducator(tabPar.workloadData),
      tabPar.dataIsOid
    );
    tabPar.setWorkloadDataFix(splitData);
    tabPar.setSelectedTr([]);
    tabPar.setOnCheckBoxAll(false);
  }, [tabPar.dataIsOid]);

  //! фильтрация по поиску
  useEffect(() => {
    tabPar.setFiltredData(
      filteredWorkload(tabPar.workloadDataFix, props.searchTerm)
    );
  }, [props.searchTerm]);

  //! при нажатии правой кнопки мыши на таблицу открывает мню
  const handleContextMenu = (event) => {
    event.preventDefault();
    tabPar.setContextPosition({ x: event.pageX, y: event.pageY });
    tabPar.setContextMenuShow(!tabPar.contextMenuShow);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
    >
      {tabPar.contextMenuShow && <ContextMenu />}
      <Table tableHeaders={tableHeaders} />
    </div>
  );
}

export default TableWorkload;
