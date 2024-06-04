import React, { useState, useEffect, useMemo } from "react";
import styles from "./TableLks.module.scss";
import EditInput from "../EditInput/EditInput";
import ArrowBack from "./../../img/arrow-back.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDataEducatorLK } from "../../api/services/AssignApiData";
import { actions } from "../../store/filter/filter.slice";
function TableLks(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [EducatorLkData, setEducatorLkData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([
    { key: "department", label: "Кафедра" },
    { key: "specialty", label: "Дисциплина" },
    { key: "hoursFirstPeriod", label: "Часы период 1" },
    { key: "hoursSecondPeriod", label: "Часы период 2" },
    { key: "hoursWithoutPeriod", label: "Часы период 3" },
])

  //!!!!!!!!!!!!!! сброс состояния редукса //!!!!!!!!!!!
  const updateTable = ()=>{
    dispatch(actions.initializeFilters(tableHeaders));
  }
  useEffect(() => {
    updateTable();
  }, []);
  
  //! получаем данные личного кабинета преподавателя
  useEffect(() => {
    getDataEducatorLK(props.educatorIdforLk, setEducatorLkData, setTableData);
  }, [props.educatorIdforLk]);
  console.log("EducatorLkData", EducatorLkData);
  console.log("tableData", tableData);

  //! то что введено в поисковую строку, обновляет данные компонента
  useEffect(() => {
    setSearchTerm(props.searchTerm);
  }, [props.searchTerm]);
  
  //! клик на стрелку назад
  const handleNameClick = () => {
    props.setEducatorIdforLk("");
    props.changeInput();
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  console.log('filters', filters)
  useEffect(() => {
    addHeadersTable(filters, tableHeaders, tableData);
    console.log(filters);
  }, [filters, dispatch, tableHeaders, tableData]);

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

  const filteredData = updatedData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const AllHours = EducatorLkData?.totalHours;
  const OgranHours = EducatorLkData?.maxHours;
  var BackgroundColorHours = WhyColor(AllHours, OgranHours);

  // Функция для определения цвета фона
  function WhyColor(AllHours, OgranHours) {
    let bg;
    if (AllHours <= OgranHours - 300) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (OgranHours - 300 < AllHours && AllHours <= OgranHours - 100) {
      bg = "#FFD600"; // Желтый цвет
    } else {
      bg = "#E81414"; // Красный цвет
    }
    return bg;
  }

  // const gettdInnerText = () => {
  //   if (showFullText) {
  //     if (
  //       props.item[props.itemKey.key] === null ||
  //       props.item[props.itemKey.key] === undefined ||
  //       props.item[props.itemKey.key] === ""
  //     ) {
  //       return "___";
  //     }
  //     if (props.itemKey.key === "id") {
  //       return props.index + 1;
  //     } else {
  //       return props.item[props.itemKey.key];
  //     }
  //   } else {
  //     if (props.itemKey.key === "id") {
  //       return props.index + 1;
  //     } else if (
  //       props.item[props.itemKey.key] === null ||
  //       props.item[props.itemKey.key] === undefined ||
  //       props.item[props.itemKey.key] === ""
  //     ) {
  //       return "___";
  //     } else if (
  //       typeof props.item[props.itemKey.key] === "string" &&
  //       props.item[props.itemKey.key].length > lenSlice
  //     ) {
  //       return props.item[props.itemKey.key].slice(0, lenSlice) + "...";
  //     } else {
  //       return props.item[props.itemKey.key];
  //     }
  //   }
  // };
  
  return (
    <div className={styles.TableLks}>
      <button className={styles.buttonBack} onClick={handleNameClick}>
        <img src={ArrowBack} alt="arrow"></img>
        <p>Назад</p>
      </button>

      <div className={styles.DataLks}>
        <div className={styles.DataLksInner}>
          <div className={styles.DataLksHead}>
            <h1>{EducatorLkData?.name}</h1>
            <div
              className={styles.DataLksHeadSchet}
              style={{ backgroundColor: BackgroundColorHours }}
            >
              <p>
                <span>{AllHours}</span>/<span>{OgranHours}</span>
              </p>
            </div>
          </div>

          <p>Кафедра: {EducatorLkData?.department}</p>
          <p>Должность: {EducatorLkData?.position}</p>
          <p>Ставка: {EducatorLkData?.rate}</p>
        </div>
        {/* {tableData[0] && (
          <div className={styles.EditInput}>
            <EditInput
              originalHeader={tableHeaders}
              updateTable={updateTable}
              top={60.3}
              h={64}
            />
          </div>
        )} */}
      </div>

      {tableData[0] && (
        <div className={styles.TableLks__inner}>
          <table className={styles.TableLks}>
            <thead>
              <tr>
                {updatedHeader.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className={styles.tableRow}>
                {Object.keys(row).map((key) => {
                  if (key === "specialty") {
                    return (
                      <td
                        key={key}
                        className={styles.tdspecialtyTd}
                      >
                        <div className={styles.tdspecialty}>
                          <span>
                            {row[key].length > 100 ? row[key].slice(0, 100) + "..." :
                            row[key] === "" ? "___" : row[key]}
                          </span>
                        </div>
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
      )}
    </div>
  );
}

export default TableLks;
