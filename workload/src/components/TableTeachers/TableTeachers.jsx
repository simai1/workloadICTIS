import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { headersEducator } from "../TableWorkload/Data";
import { Educator, apiEducatorDepartment } from "../../api/services/ApiRequest";
import Button from "../../ui/Button/Button";
import { SamplePoints } from "./SamplePoints/SamplePoints";
import { ContextFunc } from "./ContextFunc/ContextFunc";
import { PopUpEditTeacher } from "./PopUpEditTeacher/PopUpEditTeacher";


function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { appData, basicTabData, checkPar } = React.useContext(DataContext);
  const [sampleShow, setSampleShow] = useState(false);
  const [sampleData, setSampleData] = useState([]);
  const [selectRows, setSelectRow] = useState(null)
  const [vizibleCont, setVizibleCont] = useState(false)
  const tableHeaders = headersEducator;
  const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0 });

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
      apiEducatorDepartment().then((res) => {
        if (res && res.status === 200) {
          appData.setEducator(res.data);
          setFilteredData(res.data);
          setUpdatedData(res.data);
          setUpdatedHeader(tableHeaders);
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
          setUpdatedHeader(tableHeaders);
        }
      });
    }
  }, [basicTabData.actionUpdTabTeach]);
  const updateTable = ()=>{
    Educator().then((res) => {
      console.log("teatcher ", res);
      if (res && res.status === 200) {
        appData.setEducator(res.data);
        setFilteredData(res.data);
        setUpdatedData(res.data);
        setUpdatedHeader(tableHeaders);
      }
    });
  }
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
    console.log("updatedHeader", updatedHeader)
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

    if (totalHours <= AllHours - 300) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (
      AllHours - 300 < totalHours &&
      totalHours <= AllHours - 100
    ) {
      bg = "#FFD600"; // Желтый цвет
    }
    else{
      bg = "#E81414"; // Красный цвет
    }
    return bg;
  }

  const clickTrRows = (id, x, y) => {
    setSelectRow(id);
    console.log("settId", id);
    setPositionMenu({ x, y });
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
          {/* onClick={()=>{clickTrRows(row.id)}} */}
            {filteredData.map((row, index) => (
              <tr 
                key={index} 
                className={selectRows === row.id ? styles.SelectedTr : null}
                onContextMenu={(e) => {
                  e.preventDefault(); // Предотвращаем стандартное контекстное меню
                  clickTrRows(row.id, e.clientX, e.clientY); // Передаем координаты курсора
                }}
              >
                {Object.keys(row).map((key) => {
                  if (key === "name") {
                    return (
                      <td
                        key={key}
                        onClick={() => handleNameClick(index, row.id)}
                        className={styles.tdName}
                        name={key}
                      >
                        {row[key]}
                      </td>
                    );
                  }
                  if (key === "totalHours") {
                    return (
                      <td key={key} name={key}>
                        <div
                          style={{
                            backgroundColor: WhyColor(row.totalHours, row.rate),
                          }}
                          className={styles.tdHours}
                        >
                          {row[key]}
                        </div>
                      </td>
                    );
                  } else {
                    return (
                      <td key={key} name={key}>{key === "id" ? index + 1 : row[key]}</td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectRows&& <ContextFunc setVizibleCont={setVizibleCont} updateTable={updateTable} setSelectRow={setSelectRow} selectRows={selectRows} x={positionMenu.x} y={positionMenu.y}/>}
      {vizibleCont && <PopUpEditTeacher  setVizibleCont={setVizibleCont} IdRows={selectRows} setSelectRow={setSelectRow} updateTable={updateTable} selectRows={filteredData.find((el)=>el.id === selectRows)}/>}
    </div>
  );
}

export default TableTeachers;
