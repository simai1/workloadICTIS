import React, { useContext, useEffect, useState } from "react";
import styles from "./TableSchedule.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useSelector } from "react-redux";
import { getSchedule } from "../../api/services/ApiRequest";

function TableSchedule(props) {
  const { tabPar, visibleDataPar, basicTabData, checkPar, appData } =
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
console.log("tableHeader", tableHeader)
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
    appData.setLoaderAction(true);
    let dataBd = [];
    let url = "";
    if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 55)){
      if(basicTabData.selectTableSchedle != "Все"){
        const depart = basicTabData.tableDepartment.find((el) => el.name === basicTabData.selectTableSchedle)?.id
        url = `?departments=${depart}`;
      }else if(basicTabData.selectTableSchedle === "Все"){
        url = "";
      }
    }else{
      url = "";
    }
    getSchedule(url).then((resp)=>{
      console.log("RESP", resp)
      if(resp.status === 200){
        dataBd = [... resp.data]
        const fixEducator = funFixEducator(dataBd);
        const checks = isCheckedStore[ssIsChecked];
        const fdfix = FilteredSample(fixEducator, checks);
        setTableData(dataBd);
        setTableDataFix(fdfix);
        setFiltredData(fdfix);
        checkPar.setIsChecked(checks || []);
        appData.setLoaderAction(false);
      }
    })
  
   
  }, [basicTabData.selectTableSchedle, isCheckedStore]);

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
