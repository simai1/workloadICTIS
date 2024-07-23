import React, { useContext, useEffect, useState } from "react";
import styles from "./TableSchedule.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import { headers, testData } from "./ScheduleData";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useSelector } from "react-redux";
import { getSchedule } from "../../api/services/ApiRequest";

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
  //! достаем данные из редакса
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);

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
    const dataBd = [];
    getSchedule().then((resp)=>{
      console.log("RESP", resp)
      if(resp.status === 200){
        dataBd = [...resp.data]
      }
    })
   
    const fixEducator = funFixEducator(dataBd);
    const checks = isCheckedStore[ssIsChecked];
    const fdfix = FilteredSample(fixEducator, checks);
    setTableData(dataBd);
    setTableDataFix(fdfix);
    setFiltredData(fdfix);
    checkPar.setIsChecked(checks || []);
  }, [basicTabData.nameKaf, isCheckedStore]);

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
