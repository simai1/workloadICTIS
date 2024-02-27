import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
import EditInput from "../EditInput/EditInput";
import { useDispatch, useSelector } from "react-redux";
import { ApiGetData } from "../../api/services/ApiGetData";
import DataContext from "../../context";

function TableTeachers({ onNameChange }) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedName, setClickedName] = useState("");

  const { setEducator, educator } = React.useContext(DataContext);
  // заносим данные о преподавателях в состояние
  React.useEffect(() => {
    ApiGetData().then((data) => {
      setEducator(data);
    });
  }, []);

  const tableData = educator;
  // const tableData = [
  //   {
  //     id: 1,
  //     name: "Данильченко Владислав Иванович",
  //     post: "Старший преподаватель",
  //     bet: "0,75",
  //     hours: "600",
  //     hours_period_1: "240",
  //     hours_period_2: "260",
  //     hours_without_a_period: "100",
  //     department: "ПиБЖ",
  //   },
  //   {
  //     id: 2,
  //     name: "Капылов Никита Максимович",
  //     post: "Старший преподаватель",
  //     bet: "0,75",
  //     hours: "600",
  //     hours_period_1: "240",
  //     hours_period_2: "260",
  //     hours_without_a_period: "100",
  //     department: "ПиБЖ",
  //   },
  // ];
  const tableHeaders = [
    { key: "id", label: "№" },
    { key: "name", label: "Преподователь" },
    { key: "post", label: "Должность" },
    { key: "bet", label: "Ставка" },
    { key: "hours", label: "Часы" },
    { key: "hours_period_1", label: "Часы период 1" },
    { key: "hours_period_2", label: "Часы период 2" },
    { key: "hours_without_a_period", label: "Часы без периода" },
    { key: "department", label: "Кафедра" },
  ];

  const handleNameClick = (name, index) => {
    setClickedName(name);
    let postClickTicher = tableData[index].post;
    let betClickTicher = tableData[index].bet;
    onNameChange(name, postClickTicher, betClickTicher);
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    addHeadersTable(filters, tableHeaders, tableData);
  }, [filters, dispatch]);

  function addHeadersTable(filters, tableHeaders, tableData) {
    const updatedHeader = tableHeaders.filter((header) =>
      filters.includes(header.key)
    );
    const updatedData = tableData.map((data) => {
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = updatedData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <input
        id="searchTableTeachers"
        type="text"
        placeholder="Поиск"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className={styles.EditInput}>
        <EditInput tableHeaders={tableHeaders} />
      </div>

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
                        onClick={() => handleNameClick(row.name, index)}
                        className={styles.tdName}
                      >
                        {row[key]}
                      </td>
                    );
                  } else {
                    return <td key={key}>{row[key]}</td>;
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
