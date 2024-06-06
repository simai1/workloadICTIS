import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { getDataEducator } from "../../api/services/AssignApiData";
import { headersEducator } from "../TableWorkload/Data";
import { apiEducatorDepartment } from "../../api/services/ApiRequest";
import Button from "../../ui/Button/Button";
import { SamplePoints } from "./SamplePoints/SamplePoints";

function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { appData, basicTabData, checkPar } = React.useContext(DataContext);
  const [sampleShow, setSampleShow] = useState(false);
  const [sampleData, setSampleData] = useState([]);
  const tableHeaders = headersEducator;
  useEffect(() => {
    props.changeInput();
  }, []);

  //! открытие модального окна фильтрации столбца
  const clickTh = (index, key) => {
    setSampleShow(index);
    const modalData = updatedData.map((item) => item[key]);
    setSampleData([...modalData]);
  };

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
  }, [basicTabData.actionUpdTabTeach]);

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

  // Функция для определения цвета фона
  function WhyColor(totalHours, stavka) {
    let bg;
    let OgranHours = 900;
    let AllHours = OgranHours * stavka;
  
    if (totalHours <= OgranHours - 300) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (OgranHours - 300 < totalHours && totalHours <= OgranHours - 100) {
      bg = "#FFD600"; // Желтый цвет
    } if(totalHours >= OgranHours) {
      bg = "#E81414"; // Красный цвет
    }
    return bg;
  }

  return (
    <div className={styles.TableTeachers}>
      {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 4) ? (
        <Button
          text="Создать преподавателя"
          Bg="#3b28cc"
          textColot="#fff"
          onClick={() => {
            appData.setcreateEdicatorPopUp(true);
          }}
        />
      ) : (
        <div style={{ height: "59px" }}></div>
      )}
      <div className={styles.TableTeachers__inner}>
        <table className={styles.table}>
          <thead>
            <tr>
              {updatedHeader.map((header, index) => (
                <th
                  name={header.key}
                  onClick={() => clickTh(index, header.key)}
                  key={header.key}
                >
                  {sampleShow === index && (
                    <SamplePoints
                      setSampleShow={setSampleShow}
                      index={index}
                      itemKey={header.key}
                      filteredData={filteredData}
                      setFiltredData={setFilteredData}
                      setUpdatedData={setUpdatedData}
                      updatedData={updatedData}
                      isSamplePointsData={sampleData}
                    />
                  )}

                  <div className={styles.th_inner} onClick={clickTh}>
                    {header.label}
                    <img
                      src={
                        checkPar.isChecked.find(
                          (item) => item.itemKey === header.key
                        )
                          ? "./img/filterColumn.svg"
                          : "./img/th_fight.svg"
                      }
                    ></img>
                  </div>
                </th>
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
                  } if (key === "totalHours") {
                    return (
                      
                      <td
                        key={key}
                      >
                        <div
                           style={{backgroundColor: WhyColor(row.totalHours, row.rate)}}
                        className={styles.tdHours}
                        >
                          {row[key]}
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
    </div>
  );
}

export default TableTeachers;
