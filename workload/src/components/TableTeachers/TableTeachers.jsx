import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { headersEducator } from "../TableWorkload/Data";
import { Educator, apiEducatorDepartment } from "../../api/services/ApiRequest";
import Button from "../../ui/Button/Button";
import { SamplePoints } from "./SamplePoints/SamplePoints";
import { ContextFunc } from "./ContextFunc/ContextFunc";
import { PopUpEditTeacher } from "./PopUpEditTeacher/PopUpEditTeacher";
import { horsTeacher } from "./dataHoursForTeacher/HoursTicher";

function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { appData, basicTabData, checkPar } = React.useContext(DataContext);
  const [sampleShow, setSampleShow] = useState(false);
  const [sampleData, setSampleData] = useState([]);
  const [selectRows, setSelectRow] = useState(null);
  const [vizibleCont, setVizibleCont] = useState(false);
  const tableHeaders = headersEducator;
  const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0 });

  //! достаем из sessionStorage заголовок для редактирования полей
  useEffect(() => {
    const ssUpdatedHeader = JSON.parse(
      sessionStorage.getItem("headerTeachers")
    );
    if (ssUpdatedHeader) {
      setUpdatedHeader(ssUpdatedHeader);
    }
  }, [sessionStorage.getItem("headerTeachers")]);
  useEffect(() => {
    props.changeInput();
  }, []);

  //! открытие модального окна фильтрации столбца
  const clickTh = (index, key) => {
    setSampleShow(index);
    const modalData = updatedData.map((item) => item[key]);
    setSampleData([...modalData]);
  };

  const updateTable = () => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 2)) {
      apiEducatorDepartment().then((res) => {
        console.log("teatcher ", res);
        if (res && res.status === 200) {
          appData.setEducator(res.data);
          setFilteredData(res.data);
          setUpdatedData(res.data);
          // setUpdatedHeader(tableHeaders);
        }
      });
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)) {
      Educator().then((res) => {
        console.log("teatcher ", res);
        if (res && res.status === 200) {
          appData.setEducator(res.data);
          setFilteredData(res.data);
          setUpdatedData(res.data);
          // setUpdatedHeader(tableHeaders);
        }
      });
    }
  };
  //! заносим данные о преподавателях в состояние
  React.useEffect(() => {
    updateTable();
  }, [basicTabData.actionUpdTabTeach]);

  const handleNameClick = (id) => {
    props.setEducatorIdforLk(id);
    props.setEducatorData(appData.educator.find((el) => el.id === id));
    basicTabData.setSearchTerm("");
  };

  function addHeadersTable(tableHeaders, educator) {
    const filters = tableHeaders.map((el) => el.key);
    const updatedData = educator.map((data) => {
      const updatedRow = {};
      Object.keys(data).forEach((key) => {
        if (filters.includes(key)) {
          updatedRow[key] = data[key];
        }
      });
      return updatedRow;
    });
    setUpdatedHeader(tableHeaders);
    setUpdatedData(updatedData);
    console.log("filters", filters);
  }

  //! фильтрация по редактированию полей
  useEffect(() => {
    const ssUpdatedHeader = JSON.parse(
      sessionStorage.getItem("headerTeachers")
    );
    console.log("basicTabData.tableHeaders", basicTabData.tableHeaders);
    addHeadersTable(ssUpdatedHeader, appData.educator);
  }, [basicTabData.tableHeaders, appData.educator]);

  //! поиск
  useEffect(() => {
    let fd;
    if (props.searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        console.log(row);
        return Object.values(row)
          .splice(1)
          .some((value) => {
            if (value !== null) {
              return value
                .toString()
                .toLowerCase()
                .includes(props.searchTerm.toLowerCase());
            }
            return false;
          });
      });
    }
    setFilteredData(fd);
  }, [updatedData, props.searchTerm]);

  const clickTrRows = (id, x, y) => {
    setSelectRow(id);
    setPositionMenu({ x, y });
  };

  const funSpanRow = (header) => {
    if (header.key === "instituteManagementWorkload") {
      return "Институтская нагрузка";
    } else if (header.key === "kafedralAdditionalWorkload") {
      return "Кафедральная нагрузка";
    } else return "";
  };

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
            {/* <tr>
                {updatedHeader.map((header, index) => {
                  if (
                    header.key !== "instituteSpringWorkload" &&
                    header.key !== "instituteManagementWorkload" &&
                    header.key !== "kafedralSpringWorkload" &&
                    header.key !== "kafedralAdditionalWorkload"
                  )
                    return (
                      <th colSpan={funSpanRow(header) !== "" ? 3 : 1}>
                        {funSpanRow(header)}
                      </th>
                    );
                })}
              </tr> */}
            <tr>
              {updatedHeader.map((header, index) => (
                <th
                  name={header.key}
                  onClick={() => clickTh(index, header.key)}
                  key={header.key}
                >
                  <div
                    style={{
                      position: "absolute",
                      height: "20px",
                      top: "20px",
                      width: "300px",
                      left: "-212px",
                      pointerEvents: "none",
                      fontSize: "18px",
                    }}
                  >
                    {funSpanRow(header)}
                  </div>
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
              <tr
                key={index}
                className={selectRows === row.id ? styles.SelectedTr : null}
                onContextMenu={(e) => {
                  e.preventDefault();
                  clickTrRows(row.id, e.clientX, e.clientY);
                }}
              >
                {updatedHeader.map((key) => {
                  if (key.key === "name") {
                    return (
                      <td
                        key={key.key}
                        onClick={() => handleNameClick(row.id)}
                        className={styles.tdName}
                        name={key.key}
                      >
                        {row[key.key]}
                      </td>
                    );
                  }
                  if (key.key === "totalHours") {
                    return (
                      <td key={key.key} name={key.key}>
                        <div
                          style={{
                            backgroundColor: appData.WhyColor(
                              row.position,
                              row.totalHours,
                              row.rate
                            ),
                          }}
                          className={styles.tdHours}
                        >
                          {row[key.key]}
                        </div>
                      </td>
                    );
                  } else {
                    return (
                      <td key={key.key} name={key.key}>
                        {key.key === "id" ? index + 1 : row[key.key]}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectRows && (
        <ContextFunc
          setVizibleCont={setVizibleCont}
          updateTable={updateTable}
          setSelectRow={setSelectRow}
          selectRows={selectRows}
          x={positionMenu.x}
          y={positionMenu.y}
        />
      )}
      {vizibleCont && (
        <PopUpEditTeacher
          setVizibleCont={setVizibleCont}
          IdRows={selectRows}
          setSelectRow={setSelectRow}
          updateTable={updateTable}
          selectRows={filteredData.find((el) => el.id === selectRows)}
        />
      )}
    </div>
  );
}

export default TableTeachers;
