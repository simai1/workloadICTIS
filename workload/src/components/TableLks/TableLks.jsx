import React, { useState, useEffect, useRef } from "react";
import styles from "./TableLks.module.scss";
import EditInput from "../EditInput/EditInput";
import ArrowBack from "./../../img/arrow-back.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDataEducatorLK } from "../../api/services/AssignApiData";
import { actions } from "../../store/filter/filter.slice";
import DataContext from "../../context";
function TableLks(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [EducatorLkData, setEducatorLkData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [colorHours, setColorHours] = useState(null);
  const { appData, basicTabData, checkPar } = React.useContext(DataContext);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([
    { key: "department", label: "Кафедра" },
    { key: "discipline", label: "Дисциплина" },
    { key: "hoursFirstPeriod", label: "Часы период 1" },
    { key: "hoursSecondPeriod", label: "Часы период 2" },
    { key: "hoursWithoutPeriod", label: "Дополнительные часы" },
  ]);

  //!!!!!!!!!!!!!! сброс состояния редукса //!!!!!!!!!!!
  const updateTable = () => {
    dispatch(actions.initializeFilters(tableHeaders));
  };
  useEffect(() => {
    updateTable();
  }, []);

  // useEffect(()=>{
  //   console.log("EducatorLkData", EducatorLkData)
  //   console.log("EducatorLkData?.position", EducatorLkData.position)
  //   console.log("EducatorLkData?.totalHours", EducatorLkData.totalHours)
  //   console.log("EducatorLkData?.rate", EducatorLkData.rate)
  //   setColorHours(appData.WhyColor(EducatorLkData?.position, EducatorLkData?.totalHours, EducatorLkData?.rate))
  // },[EducatorLkData,])

  //! получаем данные личного кабинета преподавателя
  useEffect(() => {
    console.log(props.educatorIdforLk);
    getDataEducatorLK(props.educatorIdforLk, setEducatorLkData, setTableData);
  }, [props.educatorIdforLk]);

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
  console.log("filters", filters);
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

  useEffect(() => {
    const fd = updatedData.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(fd);
  }, [updatedData]);

  // Функция для определения цвета фона
  const [showFullText, setShowFullText] = useState(false);
  const lenSlice = 100;
  const gettdInnerText = (item, index) => {
    if (showFullText === index) {
      if (item === null || item === undefined || item === "") {
        return "___";
      }
      if (item === "id") {
        return index + 1;
      } else {
        return item;
      }
    } else {
      if (item === "id") {
        return index + 1;
      } else if (item === null || item === undefined || item === "") {
        return "___";
      } else if (typeof item === "string" && item.length > lenSlice) {
        return item.slice(0, lenSlice) + "...";
      } else {
        return item;
      }
    }
  };

  //! функция определения класса td для открытия длинного текста в попап со скролом
  const getClaasNametdInner = (index, row) => {
    let text = styles.notdatadiv;
    if (showFullText === index && row?.length > lenSlice) {
      text = `${text} ${styles.gettdInner}`;
    }
    return text;
  };

  return (
    <div className={styles.TableLks}>
      {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 16) && (
        <button className={styles.buttonBack} onClick={handleNameClick}>
          <img src={ArrowBack} alt="arrow"></img>
          <p>Назад</p>
        </button>
      )}
      <div className={styles.DataLks}>
        <div className={styles.DataLksInner}>
          <div className={styles.DataLksHead}>
            <h1>{EducatorLkData?.name}</h1>
            <div
              className={styles.DataLksHeadSchet}
              style={
                EducatorLkData
                  ? {
                      backgroundColor: appData.WhyColor(
                        EducatorLkData?.position,
                        EducatorLkData?.totalHours,
                        EducatorLkData?.rate
                      ),
                    }
                  : null
              }
            >
              <p>
                <span>{EducatorLkData?.totalHours}</span>/
                <span>{EducatorLkData?.maxHours}</span>
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

      {tableData[0] ? (
        <div
          className={styles.TableLks__inner}
          style={
            filteredData.length < 5
              ? { height: `${150 * filteredData.length}px` }
              : null
          }
        >
          <table
            className={styles.TableLks}
            style={
              filteredData.length < 5
                ? { height: `${150 * filteredData.length}px` }
                : null
            }
          >
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
                    return (
                      <td key={key} className={styles.tdspecialtyTd}>
                        <div
                          onMouseEnter={
                            row[key]?.length > lenSlice
                              ? () => setShowFullText(index)
                              : null
                          }
                          onMouseLeave={() => setShowFullText(null)}
                          className={styles.tdInner}
                        >
                          <div
                            className={getClaasNametdInner(index, row[key])}
                            style={
                              showFullText === index &&
                              row[key]?.length > lenSlice
                                ? {
                                    position: "absolute",
                                    backgroundColor: "inherit",
                                    width: "100%",
                                    padding: "4px",
                                    top: "-45px",
                                    boxShadow:
                                      "0px 3px 18px rgba(0, 0, 0, 0.15)",
                                    zIndex: "100",
                                  }
                                : null
                            }
                          >
                            {gettdInnerText(row[key], index)}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.notData}>
          <h2>Нет данных</h2>
        </div>
      )}
    </div>
  );
}

export default TableLks;
