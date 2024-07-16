import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkloadHistory, funHistoryFix } from "./Function";
import DataContext from "../../context";
import { apiCheckedUpdate, apiGetHistory } from "../../api/services/ApiRequest";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useSelector } from "react-redux";
import { headers } from "../TableWorkload/Data";

function TableHistory(props) {
  const { tabPar, checkPar, visibleDataPar, basicTabData, appData } =
    useContext(DataContext);
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);
  const [contextShow, setContetxShow] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const [historyData, sethistoryData] = useState([]);
  const [orighistoryData, origsethistoryData] = useState([]);
  const ssname = `isCheckedHistory${basicTabData.nameKaf}`;
  const ssheader = "headerHistory";

  const headerStore = useSelector(
    (state) => state.editInputChecked.editInputCheckeds[ssheader]
  );

  //! получаем данные с апи по истории
  useEffect(() => {
    basicTabData.funUpdateHistory();
  }, []);

  //! достаем из стореджа состояние фитрации по заголовку
  useEffect(() => {
    const checks = isCheckedStore[ssname];
    checkPar.setIsChecked(checks || []);
  }, [basicTabData.nameKaf, isCheckedStore]);

  //! при событии скролл таблицы изменим индекс первого показываемого tr
  const scrollTable = (e) => {
    const maxStartData = historyData.length - visibleDataPar.visibleData;
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

  //! обновляем вертуальный скролл при переходе на другуюс таблицу
  const containertableRef = useRef(null);

  //! фильтрация по поиску
  useEffect(() => {
    const hd = filteredWorkloadHistory(orighistoryData, props.searchTerm);
    sethistoryData(hd);
  }, [props.searchTerm]);

  //! при нажатии правой кнопки мыши на таблицу открывает меню
  const handleContextMenu = (e) => {
    e.preventDefault();
    let plusX = e.pageX + 256 > window.innerWidth ? -256 : 0;
    let plusY = e.pageY + 320 > window.innerHeight ? -320 : 0;
    tabPar.setContextPosition({ x: e.pageX + plusX, y: e.pageY + plusY });
    tabPar.setContextMenuShow(!tabPar.contextMenuShow);
  };

  // //! функция фильтрации по редактированию полей
  // function addHeadersTable(tableHeaders, data) {
  //   const filters = tableHeaders?.map((el) => el.key);
  //   const updatedData = data.map((data) => {
  //     const updatedRow = {};
  //     Object.keys(data).forEach((key) => {
  //       if (filters?.includes(key)) {
  //         updatedRow[key] = data[key];
  //       }
  //     });
  //     return updatedRow;
  //   });
  //   props.setTableHeaders(headers);
  //   return { tableHeaders, updatedData };
  // }
  //! фильтрация по редактированию полей
  useEffect(() => {
    basicTabData.setTableHeaders(headerStore || headers);
  }, [basicTabData.tableHeaders, headerStore]);

  useEffect(() => {
    appData.setLoaderAction(true);
    apiGetHistory().then((req) => {
      const hd = req?.filter(
        (it) =>
          it.checked === tabPar.perenesenAction &&
          it.department === basicTabData.nameKaf
      );
      //! преобразуем историю для вывода
      const fixHistory = funHistoryFix(hd);
      const checks = isCheckedStore[ssname];
      const fdfix = FilteredSample(fixHistory, checks, ssname);
      sethistoryData(fdfix);
      origsethistoryData(fixHistory);
      visibleDataPar.setStartData(0);
      appData.setLoaderAction(false);
    });
  }, [
    basicTabData.historyChanges,
    tabPar.perenesenAction,
    basicTabData.nameKaf,
  ]);

  //! функция контекстного меню для перекидывания перенесенных нагрузок
  const funPerenos = () => {
    const data = {
      ids: tabPar.selectedTr,
    };
    apiCheckedUpdate(data).then((res) => {
      tabPar.setSelectedTr([]);
      setContetxShow(false);
      basicTabData.funUpdateHistory();
    });
  };

  const contextRef = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (contextRef.current && !contextRef.current.contains(event.target)) {
        setContetxShow(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
      onScroll={scrollTable}
      ref={containertableRef}
    >
      {contextShow && (
        <div
          ref={contextRef}
          style={{
            top: `${contextPosition.y}px`,
            left: `${contextPosition.x}px`,
          }}
          className={styles.contextShow}
        >
          <div onClick={funPerenos}>
            {!tabPar.perenesenAction
              ? 'Добавить в "Перенесенные"'
              : 'Вернуть в "Не перенесенные"'}
          </div>
        </div>
      )}

      <Table
        historyData={historyData}
        orighistoryData={orighistoryData}
        origsethistoryData={origsethistoryData}
        sethistoryData={sethistoryData}
        setContetxShow={setContetxShow}
        contextShow={contextShow}
        contextPosition={contextPosition}
        setContextPosition={setContextPosition}
      />
    </div>
  );
}

export default TableHistory;
