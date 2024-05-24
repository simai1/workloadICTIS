import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { getDataEducator } from "../../api/services/AssignApiData";
import { headersEducator } from "../TableWorkload/Data";
import { apiEducatorDepartment } from "../../api/services/ApiRequest";

function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { appData } = React.useContext(DataContext);
  const tableHeaders = headersEducator;
  useEffect(() => {
    props.changeInput();
  }, []);

  //! заносим данные о преподавателях в состояние
  React.useEffect(() => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 2)) {
      apiEducatorDepartment().then((data) => {
        appData.setEducator(data);
        setFilteredData(data);
        setUpdatedData(data);
        setUpdatedHeader(tableHeaders);
      });
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)) {
      getDataEducator().then((data) => {
        appData.setEducator(data);
        setFilteredData(data);
        setUpdatedData(data);
        setUpdatedHeader(tableHeaders);
      });
    }
  }, []);

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

  React.useEffect(() => {
    let fd;
    if (props.searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        return Object.values(row)
          .splice(1)
          .some((value) =>
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
      <div className={styles.TableTeachers__inner}>
        <table className={styles.table}>
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
