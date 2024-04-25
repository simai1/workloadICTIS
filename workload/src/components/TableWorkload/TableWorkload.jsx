import React, { useEffect, useState } from "react";
import { headers } from "./Data";
import { Workload } from "../../api/services/ApiRequest";
import Table from "./Table";

function TableWorkload() {
  const tableHeaders = headers;
  const [workloadData, setWorkloadData] = useState([]); // данные с бд нагрузок
  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные

  useEffect(() => {
    Workload().then((data) => {
      const dataBd = [...data];
      setWorkloadData(dataBd);
      const fd = dataBd;
      setFiltredData(dataBd);
      console.log(dataBd);
    });
  }, []);
  return (
    <div>
      <Table tableHeaders={tableHeaders} filtredData={filtredData} />
    </div>
  );
}

export default TableWorkload;
