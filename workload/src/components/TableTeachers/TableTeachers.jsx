import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
import EditInput from "../EditInput/EditInput";
import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { Educator } from "../../api/services/ApiRequest";
import { getDataEducator } from "../../api/services/AssignApiData";

function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [clickedName, setClickedName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]); // соберем из аднных апи общие данные
  const { appData } = React.useContext(DataContext);

  useEffect(() => {
    props.changeInput();
  }, []);

  //! заносим данные о преподавателях в состояние
  React.useEffect(() => {
    getDataEducator().then((data) => {
      appData.setEducator(data);
      setFilteredData(data);
      setUpdatedData(data);
    });
  }, []);

  const tableHeaders = [
    { key: "id", label: "№" },
    { key: "name", label: "Преподователь" },
    { key: "position", label: "Должность" },
    { key: "typeOfEmployment", label: "Вид занятости" },
    { key: "department", label: "Кафедра" },
    { key: "rate", label: "Ставка" },
    { key: "maxHours", label: "Максимум часов" },
    { key: "recommendedMaxHours", label: "Рекомендуемый максимум часов" },
    { key: "minHours", label: "Минимум часов" },
  ];

  const handleNameClick = (index, id) => {
    props.setEducatorIdforLk(id);
    console.log("ideducator", id);
    props.setEducatorData(appData.educator[index]);
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    addHeadersTable(filters, tableHeaders, appData.educator);
  }, [filters, dispatch]);

  function addHeadersTable(filters, tableHeaders, educator) {
    const updatedHeader = tableHeaders.filter((header) =>
      filters.includes(header.key)
    );
    const updatedData = educator.map((data) => {
      const updatedRow = {};
      Object.keys(data).forEach((key) => {
        if (filters.includes(key)) {
          updatedRow[key] = data[key];
        }
      });
      return updatedRow;
    });
    setUpdatedHeader(updatedHeader);
    setUpdatedData(updatedData);
  }
  // const handleSearch = (event) => {
  //   const searchTerm = event.target.value;
  //   setSearchTerm(searchTerm);
  //   let fd;
  //   if (searchTerm === "") {
  //     fd = updatedData;
  //   } else {
  //     fd = updatedData.filter((row) => {
  //       return Object.values(row).some((value) =>
  //         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //     });
  //   }
  //   setFilteredData(fd);
  // };
  React.useEffect(() => {
    let fd;
    if (props.searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        return Object.values(row).some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        );
      });
    }
    setFilteredData(fd);
  }, [updatedData, props.searchTerm]);

  return (
    <div className={styles.TableTeachers}>
      {/* <div className={styles.tabledisciplinesMain_search}>
        <input
          id="searchTableTeachers"
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={handleSearch}
          className={styles.search}
        />
        <img src="./img/search.svg"></img>
      </div> */}
      {/* 
      <div className={styles.EditInput}>
        <EditInput tableHeaders={tableHeaders} />
      </div> */}

      <div className={styles.TableTeachers__inner}>
        <table className={styles.TableTeachers}>
          <thead>
            <tr>
              {updatedHeader.map((header) => (
                <th key={header.key}>{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((key) => {
                  if (key === "name") {
                    return (
                      <td
                        key={key}
                        onClick={() => handleNameClick(index, row.id)}
                        className={styles.tdName}
                      >
                        {row[key]}
                      </td>
                    );
                  } else {
                    return (
                      <td key={key}>{key === "id" ? index + 1 : row[key]}</td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableTeachers;
