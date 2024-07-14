import React, { useContext, useEffect, useState } from "react";
import styles from "./TableSchedule.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import { headers, testData } from "./ScheduleData";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";

function TableSchedule(props) {
  const { tabPar, visibleDataPar, basicTabData, checkPar } =
    useContext(DataContext);
  const [tableHeader, setTableHeader] = useState([...props.tableHeaders]);
  const [tableData, setTableData] = useState([]);
  const [tableDataFix, setTableDataFix] = useState([]);
  const [filtredData, setFiltredData] = useState([]);
  const ssIsChecked = `isCheckedSchedule${basicTabData.nameKaf}`;
  // const ssHeader = `TableScheduleHeader${basicTabData.nameKaf}`;
  const ssHeader = `headerSchedule`;

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
  };

  useEffect(() => {
    const dataBd = [...testData];
    const ssIsChec = JSON.parse(sessionStorage.getItem(ssIsChecked));
    const fixEducator = funFixEducator(dataBd);
    const fdfix = FilteredSample(fixEducator, ssIsChec);
    console.log("fdfix", fdfix);
    setTableData(dataBd);
    setTableDataFix(fixEducator);
    setFiltredData(fixEducator);
  }, [basicTabData.nameKaf]);

  useEffect(() => {
    console.log("tableHeader", tableHeader);
    console.log("tableData", tableData);
    console.log("tableDataFix", tableDataFix);
    console.log("filtredData", filtredData);
  }, [tableHeader, tableData, tableDataFix, filtredData]);
  return (
    <div className={styles.TableSchedule}>
      <UniversalTable
        searchTerm={props.searchTerm}
        contextMenu={""}
        tabDat={tabDat}
      />
    </div>
  );
}

export default TableSchedule;
