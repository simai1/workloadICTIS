import React, { useEffect, useState } from "react";
import { headers } from "./Data";
import { Workload } from "../../api/services/ApiRequest";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import { filteredWorkload, funFixEducator } from "./Function";
import DataContext from "../../context";

function TableWorkload(props) {
  const { tabPar } = React.useContext(DataContext);
  const tableHeaders = headers;

  //! получаем данные нагрузок с бд
  useEffect(() => {
    Workload().then((data) => {
      const dataBd = [...data];
      tabPar.setWorkloadData(dataBd);
      // зменяем массив преподавателя на его имя
      tabPar.setFiltredData(funFixEducator(dataBd));
    });
  }, []);

  //! фильтрация по поиску
  useEffect(() => {
    tabPar.setFiltredData(
      filteredWorkload(funFixEducator(tabPar.workloadData), props.searchTerm)
    );
  }, [props.searchTerm]);

  return (
    <div className={styles.tabledisciplinesMain}>
      <Table tableHeaders={tableHeaders} />
    </div>
  );
}

export default TableWorkload;
