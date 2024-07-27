import React, { useContext, useEffect, useState } from "react";
import styles from "./MyWorkload.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useSelector } from "react-redux";
import { apiOwnDepartHead, getSchedule } from "../../api/services/ApiRequest";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";

function MyWorkload(props) {
  const { appData, tabPar, checkPar } = useContext(DataContext);
  const [tableHeader, setTableHeader] = useState(props.tableHeaders);
  const [tableData, setTableData] = useState([]);
  const [tableDataFix, setTableDataFix] = useState([]);
  const ssIsChecked = `isCheckedMyWorkload`;
  const ssHeader = `headerMyWorkload`;
  //! достаем данные из редакса
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);
  const tabDat = {
    funUpdateTabDat,
    tableHeader,
    setTableHeader,
    tableData,
    setTableData,
    tableDataFix,
    setTableDataFix,
    filtredData: tabPar.tableDataMyWorkload,
    setFiltredData: tabPar.setTableDataMyWorkload,
    ssIsChecked,
    ssHeader,
    isCheckedStore,
    isSorted: false, //! показать или скрыть сортировку
    isBlocked: true, //! показывать или скрывать блокированные
  };

  function funUpdateTabDat() {
    console.log("Обновление таблицы");
    appData.setLoaderAction(2);
    apiOwnDepartHead().then((req) => {
      let data = [];
      if (req.status === 200) {
        data = [...req.data];
      }
      const fixEducator = funFixEducator(data);
      const checks = isCheckedStore[ssIsChecked];
      const fdfix = FilteredSample(fixEducator, checks);
      setTableData(data);
      setTableDataFix(fdfix);
      tabPar.setTableDataMyWorkload(fdfix);
      checkPar.setIsChecked(checks || []);
      appData.setLoaderAction(0);
    });
  }

  useEffect(() => {
    funUpdateTabDat();
  }, [isCheckedStore]);

  //! функция которая возвращает контекстное меню с параметрами
  const getContextMenu = () => {
    return (
      <ContextMenu
        setTableDataFix={tabPar.setTableDataMyWorkload}
        tableDataFix={tabPar.tableDataMyWorkload}
        allowedMenus={[
          "Закрепить",
          "Открепить",
          "comments",
          "Предложить",
          "Выделить",
          "всеразделения",
          "всеобъединения",
        ]}
      />
    );
  };

  return (
    <div className={styles.MyWorkload}>
      <UniversalTable
        searchTerm={props.searchTerm}
        contextMenu={getContextMenu}
        tabDat={tabDat}
      />
    </div>
  );
}

export default MyWorkload;
