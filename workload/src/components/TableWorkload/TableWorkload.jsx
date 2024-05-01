import React, { useContext, useEffect } from "react";
import { Comment, Workload } from "../../api/services/ApiRequest";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkload, funFixEducator, funSplitData } from "./Function";
import DataContext from "../../context";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

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
  useEffect(() => {
    console.log(appData.bufferAction);
  }, [appData.bufferAction]);
  //! получаем данные нагрузок с бд
  useEffect(() => {
    Workload().then((data) => {
      const dataBd = [...data];
      basicTabData.setWorkloadData(dataBd);
      // зменяем массив преподавателя на его имя
      const fixData = funFixEducator(dataBd);
      basicTabData.setWorkloadDataFix(fixData);
      // разделяем на общеинституские и кафедральные
      const splitData = funSplitData(fixData, tabPar.dataIsOid);
      basicTabData.setFiltredData(splitData);
      // получаем все комментарии
      Comment().then((data) => {
        tabPar.setAllCommentsData(data);
      });
    });
  }, []);

  //! при зменении основынх данных записываем их в фильтрованные
  useEffect(() => {
    basicTabData.setFiltredData([...basicTabData.workloadDataFix]);
  }, [basicTabData.workloadDataFix]);

  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  useEffect(() => {
    const splitData = funSplitData(
      funFixEducator(basicTabData.workloadData),
      tabPar.dataIsOid
    );
    basicTabData.setWorkloadDataFix(splitData);
    tabPar.setSelectedTr([]);
    tabPar.setOnCheckBoxAll(false);
    visibleDataPar.setStartData(0);
  }, [tabPar.dataIsOid]);

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
