import React, { useContext, useEffect, useState } from "react";
import styles from "./MyWorkload.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useSelector } from "react-redux";
import { getSchedule } from "../../api/services/ApiRequest";
import { headers } from "../TableWorkload/Data";

function MyWorkload(props) {
  const { tabPar, visibleDataPar, basicTabData, checkPar } =
    useContext(DataContext);
  // const [tableHeader, setTableHeader] = useState([...props.tableHeaders]);
  const [tableHeader, setTableHeader] = useState(props.tableHeaders);
  const [tableData, setTableData] = useState([]);
  const [tableDataFix, setTableDataFix] = useState([]);
  const [filtredData, setFiltredData] = useState([]);
  const ssIsChecked = `isCheckedMyWorkload${basicTabData.nameKaf}`;
  // const ssHeader = `MyWorkloadHeader${basicTabData.nameKaf}`;
  const ssHeader = `headerMyWorkload`;
  //! достаем данные из редакса
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);

  useEffect(() => {
    console.log("props.tableHeaders", props.tableHeaders);
  }, [props.tableHeaders]);

  const tabDat = {
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
  };

  useEffect(() => {
    let dataBd = [];
    const fixEducator = funFixEducator(dataBd);
    const checks = isCheckedStore[ssIsChecked];
    const fdfix = FilteredSample(fixEducator, checks);
    setTableData(dataBd);
    setTableDataFix(fdfix);
    setFiltredData(fdfix);
    checkPar.setIsChecked(checks || []);
  }, [isCheckedStore]);

  return (
    <div className={styles.MyWorkload}>
      <UniversalTable
        searchTerm={props.searchTerm}
        contextMenu={""}
        tabDat={tabDat}
      />
    </div>
  );
}

export default MyWorkload;
