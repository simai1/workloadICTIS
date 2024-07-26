import React, { useContext, useEffect, useState } from "react";
import styles from "./TableSchedule.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useSelector } from "react-redux";
import { getSchedule } from "../../api/services/ApiRequest";
import { scheduleHead } from "../TableWorkload/Data";

function TableSchedule(props) {
  const { tabPar, visibleDataPar, basicTabData, checkPar, appData } =
    useContext(DataContext);
  const [tableHeader, setTableHeader] = useState([...props.tableHeaders]);
  // const [tableHeader, setTableHeader] = useState(scheduleHead);
  const [tableData, setTableData] = useState([]);
  const [tableDataFix, setTableDataFix] = useState([]);
  const [filtredData, setFiltredData] = useState([]);
  const ssIsChecked = `isCheckedSchedule${basicTabData.nameKaf}`;
  // const ssHeader = `TableScheduleHeader${basicTabData.nameKaf}`;
  const ssHeader = `headerSchedule`;
  //! достаем данные из редакса
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);

  const funUpdateTabDat = () => {
    appData.setDataUpdated(false);
    appData.setLoaderAction(2);
    let dataBd = [];
    let url = "";
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 55)) {
      if (basicTabData.selectTableSchedle != "Все") {
        const depart = basicTabData.tableDepartment.find(
          (el) => el.name === basicTabData.selectTableSchedle
        )?.id;
        url = `?departments=${depart}`;
      } else if (basicTabData.selectTableSchedle === "Все") {
        url = "";
      }
    } else {
      url = "";
    }
    getSchedule(url).then((resp) => {
      if (resp.status === 200) {
        dataBd = [...resp.data];
        const fixEducator = funFixEducator(dataBd);
        const checks = isCheckedStore[ssIsChecked];
        const fdfix = FilteredSample(fixEducator, checks);
        setTableData(dataBd);
        setTableDataFix(fdfix);
        setFiltredData(fdfix);
        checkPar.setIsChecked(checks || []);
        appData.setLoaderAction(0);
      }
    });
  };

  useEffect(() => {
    funUpdateTabDat();
  }, [basicTabData.selectTableSchedle, isCheckedStore, appData.dataUpdated]);

  const tabDat = {
    funUpdateTabDat,
    tableHeader,
    setTableHeader,
    tableData,
    setTableData,
    tableDataFix,
    setTableDataFix,
    filtredData,
    setFiltredData,
    ssIsChecked,
    ssHeader,
    isCheckedStore,
    isSorted: false, //! показать или скрыть сортировку
    isBlocked: false, //! показывать или скрывать блокированные
  };

  return (
    <div className={styles.TableSchedule}>
      <UniversalTable
        searchTerm={props.searchTerm}
        contextMenu={
          appData.metodRole[appData.myProfile?.role]?.some((el) => el === 54.1)
            ? "Schedule"
            : ""
        }
        tabDat={tabDat}
      />
    </div>
  );
}

export default TableSchedule;
