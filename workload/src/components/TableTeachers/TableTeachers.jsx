import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { headersEducator } from "../TableWorkload/Data";
import {
  Educator,
  EducatorByInstitute,
  // GetAllUsers,
  apiEducatorDepartment,
} from "../../api/services/ApiRequest";
import Button from "../../ui/Button/Button";
// import { SamplePoints } from "./SamplePoints/SamplePoints";
import { ContextFunc } from "./ContextFunc/ContextFunc";
import { PopUpEditTeacher } from "./PopUpEditTeacher/PopUpEditTeacher";
import { FilteredSample } from "./SamplePoints/Function";
// import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";
import TableTh from "./TableTh";
import { ReactComponent as ImgClearFilter } from "./../../img/ClearFilter.svg";

function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { appData, basicTabData } = React.useContext(DataContext);
  const [sampleShow, setSampleShow] = useState(false);
  const [sampleData, setSampleData] = useState([]);
  const [selectRows, setSelectRow] = useState(null);
  const [vizibleCont, setVizibleCont] = useState(false);
  const tableHeaders = headersEducator;
  const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [sortParamByColumn, setSortParamByColumn] = useState("");

  const [isChecked, setIsChecked] = useState([]); // состояние инпутов в SamplePoints для преподавателей
  const [isAllChecked, setAllChecked] = useState(true); // инпут все в SamplePoints для преподавателей
  // const checkData = {
  //   isChecked,
  //   setIsChecked,
  //   isAllChecked,
  //   setAllChecked,
  // };

  //! достаем и локал стореджа состояние фитрации по заголовку
  useEffect(() => {
    const ssIsChecked = JSON.parse(sessionStorage.getItem("isCheckedTeachers"));
    if (ssIsChecked && ssIsChecked !== null && ssIsChecked.length > 0) {
      setIsChecked(ssIsChecked);
    } else {
      setIsChecked([]);
    }
  }, []);

  //! достаем из sessionStorage заголовок для редактирования полей
  useEffect(() => {
    const ssUpdatedHeader = JSON.parse(
      sessionStorage.getItem("headerTeachers")
    );
    if (ssUpdatedHeader && ssUpdatedHeader !== null) {
      setUpdatedHeader(ssUpdatedHeader);
    }
  }, [sessionStorage.getItem("headerTeachers")]);
  useEffect(() => {
    props.changeInput();
  }, []);

  // //! открытие модального окна фильтрации столбца
  // const clickTh = (index, key) => {
  //   setSampleShow(index);
  //   const modalData = updatedData.map((item) => item[key]);
  //   setSampleData([...modalData]);
  // };

  const updateTable = () => {
    const par = sortParamByColumn !== "" ? `?${sortParamByColumn}` : "";
    if (
      appData.metodRole[appData.myProfile?.role]?.some(
        (el) => el === 2 || el === 1.1
      )
    ) {
      apiEducatorDepartment(par).then((res) => {
        if (res && res.status === 200) {
          appData.setEducator(res.data);
          const ssIsChecked = JSON.parse(
            sessionStorage.getItem("isCheckedTeachers")
          );
          const fdfix = FilteredSample(res.data, ssIsChecked);
          setFilteredData([...fdfix]);
          // setFilteredData(res.data);
          setUpdatedData(res.data);
          setUpdatedHeader(tableHeaders);
        }
      });
    } else if (
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)
    ) {
      console.log("sortParamByColumn", par);
      Educator(par).then((res) => {
        if (res && res.status === 200) {
          appData.setEducator(res.data);
          const ssIsChecked = JSON.parse(
            sessionStorage.getItem("isCheckedTeachers")
          );
          const fdfix = FilteredSample(res.data, ssIsChecked);
          setFilteredData([...fdfix]);
          // setFilteredData(res.data);
          setUpdatedData(res.data);
          setUpdatedHeader(tableHeaders);
        }
      });
      // else if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 45)){
      //   GetAllUse.then((res) => {
      //     console.log("teatcher ", res);
      //     if (res && res.status === 200) {
      //       appData.setEducator(res.data);
      //       const fdfix = FilteredSample(res.data, isChecked);
      //       setFilteredData([...fdfix]);
      //       // setFilteredData(res.data);
      //       setUpdatedData(res.data);
      //       setUpdatedHeader(tableHeaders);
      //     }
      //   });
      // }
    }
    // else if (
    //   appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1.1)
    // ) {
    //   EducatorByInstitute().then((res) => {
    //     if (res && res.status === 200) {
    //       appData.setEducator(res.data);
    //       const ssIsChecked = JSON.parse(
    //         sessionStorage.getItem("isCheckedTeachers")
    //       );
    //       const fdfix = FilteredSample(res.data, ssIsChecked);
    //       setFilteredData([...fdfix]);
    //       // setFilteredData(res.data);
    //       setUpdatedData(res.data);
    //       setUpdatedHeader(tableHeaders);
    //     }
    //   });
    // }
  };

  //! заносим данные о преподавателях в состояние
  useEffect(() => {
    updateTable();
  }, [basicTabData.actionUpdTabTeach, sortParamByColumn]);

  useEffect(() => {
    //! филтрация по samplePoints
    const fdfix = FilteredSample(appData.educator, isChecked);
    setFilteredData([...fdfix]);
  }, [appData.educator, updatedData, props.searchTerm]);

  const handleNameClick = (id) => {
    props.setEducatorIdforLk(id);
    props.setEducatorData(appData.educator.find((el) => el.id === id));
    basicTabData.setSearchTerm("");
  };

  //! функция фильтрации по редактированию полей
  function addHeadersTable(tableHeaders, educator) {
    const filters = tableHeaders?.map((el) => el.key);
    const updatedData = educator.map((data) => {
      const updatedRow = {};
      Object.keys(data).forEach((key) => {
        if (filters?.includes(key)) {
          updatedRow[key] = data[key];
        }
      });
      return updatedRow;
    });
    setUpdatedHeader(tableHeaders);
    setUpdatedData(updatedData);
  }

  //! фильтрация по редактированию полей
  useEffect(() => {
    const ssUpdatedHeader = JSON.parse(
      sessionStorage.getItem("headerTeachers")
    );
    let uh = null;
    if (ssUpdatedHeader && ssUpdatedHeader !== null) {
      uh = ssUpdatedHeader;
    } else {
      uh = tableHeaders;
    }
    addHeadersTable(uh, appData.educator);
  }, [basicTabData.tableHeaders, appData.educator]);

  //! поиск
  useEffect(() => {
    let fd;
    if (props.searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
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
    //! филтрация по samplePoints
    const fdfix = FilteredSample(fd, isChecked);
    setFilteredData([...fdfix]);
    // setFilteredData(fd);
  }, [updatedData, props.searchTerm]);

  const clickTrRows = (id, x, y) => {
    setSelectRow(id);
    if (x + 200 > window.innerWidth) {
      x -= 140;
      setPositionMenu({ x, y });
    } else {
      setPositionMenu({ x, y });
    }
  };

  const keysInst = [
    "instituteManagementWorkload",
    "instituteSpringWorkload",
    "instituteAutumnWorkload",
  ];
  const keysKaf = [
    "kafedralAutumnWorkload",
    "kafedralSpringWorkload",
    "kafedralAdditionalWorkload",
  ];

  const funSpanRow = (header) => {
    if (!updatedHeader.some((el) => el.key === "instituteManagementWorkload")) {
      if (header.key === "instituteSpringWorkload") {
        return "Институтская нагрузка";
      }
    }
    if (
      !updatedHeader.some((el) => el.key === "instituteManagementWorkload") &&
      !updatedHeader.some((el) => el.key === "instituteSpringWorkload")
    ) {
      if (header.key === "instituteAutumnWorkload") {
        return "Институтская нагрузка";
      }
    }

    if (!updatedHeader.some((el) => el.key === "kafedralAdditionalWorkload")) {
      if (header.key === "kafedralSpringWorkload") {
        return "Кафедральная нагрузка";
      }
    }
    if (
      !updatedHeader.some((el) => el.key === "kafedralAdditionalWorkload") &&
      !updatedHeader.some((el) => el.key === "kafedralSpringWorkload")
    ) {
      if (header.key === "kafedralAutumnWorkload") {
        return "Кафедральная нагрузка";
      }
    }

    if (header.key === "instituteManagementWorkload") {
      return "Институтская нагрузка";
    } else if (header.key === "kafedralAdditionalWorkload") {
      return "Кафедральная нагрузка";
    } else return "";
  };

  //!функция сброса фильтров
  const refreshFilters = () => {
    setIsChecked([]);
    setAllChecked([]);
    sessionStorage.setItem("isCheckedTeachers", null);
    const fdfix = FilteredSample(updatedData, [], "idasdasd");
    setFilteredData(fdfix);
    console.log("click");
  };

  const funGetStyle = (action) => {
    let mass = [];
    if (action) {
      mass = updatedHeader.filter((el) => keysInst.some((e) => e === el.key));
    } else {
      mass = updatedHeader.filter((el) => keysKaf.some((e) => e === el.key));
    }
    const style = {
      position: "absolute",
      height: "20px",
      top: "10px",
      width: `${mass.length * 100}px`,
      left: mass.length === 3 ? "-200px" : mass.length === 2 ? "-90px" : "10px",
      pointerEvents: "none",
      fontSize:
        mass.length === 3 ? "18px" : mass.length === 2 ? "16px" : "12px",
    };
    return style;
  };

  return (
    <div className={styles.TableTeachers}>
      {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 4) ? (
        <Button
          text="Создать преподавателя"
          Bg="#0040E5"
          textColot="#fff"
          onClick={() => {
            appData.setcreateEdicatorPopUp(true);
          }}
        />
      ) : (
        <div style={{ height: "59px" }}></div>
      )}

      <div className={styles.filterdClear}>
        <ImgClearFilter
          className={isChecked.length > 0 ? styles.svgRed : null}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={refreshFilters}
        />
        {isHovered && (
          <div className={styles.BlockTextFilter}>
            <div className={styles.triangle}></div>
            <p className={styles.textFilter}>Сбросить фильтры</p>
          </div>
        )}
      </div>
      <div className={styles.TableTeachers__inner}>
        <table className={styles.table}>
          <thead>
            <tr>
              {updatedHeader?.map((item, index) => (
                <TableTh
                  key={item.key}
                  item={item}
                  index={index}
                  modal={sampleShow === index}
                  sampleShow={sampleShow}
                  setSampleShow={setSampleShow}
                  sampleData={sampleData}
                  setSampleData={setSampleData}
                  updatedData={updatedData}
                  isAllChecked={isAllChecked}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  setFilteredData={setFilteredData}
                  sortParamByColumn={sortParamByColumn}
                  setSortParamByColumn={setSortParamByColumn}
                  funSpanRow={funSpanRow}
                  funGetStyle={funGetStyle}
                />
              ))}
            </tr>
          </thead>
          {filteredData.length === 0 && (
            <tbody className={styles.NotData}>
              <tr>
                <td className={styles.tdfix} style={{ pointerEvents: "none" }}>
                  <div className={styles.notdatadiv}>Нет данных</div>
                </td>
              </tr>
            </tbody>
          )}
          <tbody>
            {filteredData?.map((row, index) => (
              <tr
                key={index}
                className={selectRows === row.id ? styles.SelectedTr : null}
                onContextMenu={(e) => {
                  e.preventDefault();
                  clickTrRows(row.id, e.clientX, e.clientY);
                }}
              >
                {updatedHeader?.map((key) => {
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
                              appData.educator.find((el) => el.id === row.id)
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
                      <td
                        key={key.key}
                        name={key.key}
                        className={styles.fixedTd}
                      >
                        <div className={styles.tdInner}>
                          {key.key === "id" ? index + 1 : row[key.key]}
                        </div>
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
