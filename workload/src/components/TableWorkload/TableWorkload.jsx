import React, { useEffect, useState } from "react";
import { headers } from "./Data";
import { Workload } from "../../api/services/ApiRequest";
import Table from "../TableDisciplines/Table";

function TableWorkload() {
  const tableHeaders = headers;
  const [workloadData, setWorkloadData] = useState([]);
  useEffect(() => {
    Workload().then((data) => {
      setWorkloadData([...data]);
      console.log(data);
    });
  }, []);
  return (
    <div>
      <Table tableHeaders={tableHeaders} workloadData={workloadData} />
    </div>
  );
}

export default TableWorkload;
