import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./TableDisciplines.module.scss";
import Button from "../../ui/Button/Button";
import EditInput from "../EditInput/EditInput";
import { useDispatch, useSelector } from "react-redux";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { NotificationForm } from "../../ui/NotificationForm/NotificationForm";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";
import DataContext from "../../context";
import { Workload } from "../../api/services/ApiGetData";
import { TableNotice } from "./TableNotice";

function TableDisciplines() {
  const [updatedHeader, setUpdatedHeader] = useState([]); //заголовок обновленный для Redux сортировки
  const [updatedData, setUpdatedData] = useState([]); //массив обновленный для Redux сортировки
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице
  const [selectedComponent, setSelectedComponent] = useState("cathedrals"); //выбранный компонент
  const [isHovered, setIsHovered] = useState(false); // флаг открытия уведомлений от преподавателей
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionFigth, setPositionFigth] = useState({ x: 0, y: 0 });
  const [idRow, setIdrow] = useState(0);
  const [isSamplePointsShow, setSamplePointsShow] = useState(false);
  const [isSamplePointsData, setSamplePointsData] = useState("");
  const [isCheckedGlobal, setIsCheckedGlobal] = useState(false); //главный чекбокс таблицы
  const [individualCheckboxes, setIndividualCheckboxes] = useState([]); //чекбоксы таблицы
  const [isChecked, setChecked] = useState([]);
  const [showMenu, setShowMenu] = useState(false); //меню
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); //меню
  const [tableData, setTableData] = useState([]); // соберем из данных апи общие для таблицы
  const [filteredData, setFilteredData] = useState([]);

  //данные вытянутые из контекста
  const { appData } = React.useContext(DataContext);

  function getDataTable() {
    Workload().then((data) => {
      console.log(data);
      const updatedWorkload = data.map((item) => {
        const { isSplit, ...rest } = item; // убираем isSplit из массива
        return {
          ...rest,
          educator: item.educator && item.educator.name,
        };
      });
      appData.setWorkload(updatedWorkload); //данные с апи нагрузки
      setUpdatedData(updatedWorkload);
      setFilteredData(updatedWorkload);
    });
    setTableData(appData.workload);
  }

  // заносим данные о преподавателях в состояние
  useEffect(() => {
    getDataTable();
  }, []);

  //! сортировака (по hedars) пришедших данных из апи
  useEffect(() => {
    const sortedArray = appData.workload.sort((a, b) => {
      const firstArrayKeys = tableHeaders.map((header) => header.key);
      return firstArrayKeys.indexOf(a.key) - firstArrayKeys.indexOf(b.key);
    });
    setTableData(sortedArray);
  }, [appData.workload]);

  // закрытие модального окна при нажатии вне него
  const refSP = useRef(null);
  const refHoverd = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (refSP.current && !refSP.current.contains(event.target)) {
        setSamplePointsShow(false);
      }
      if (refHoverd.current && !refHoverd.current.contains(event.target)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  //чекбоксы
  const handleGlobalCheckboxChange = () => {
    setIsCheckedGlobal(!isCheckedGlobal);
    !isCheckedGlobal
      ? setIndividualCheckboxes(filteredData.map((el) => el.id))
      : setIndividualCheckboxes([]);
  };

  const handleIndividualCheckboxChange = (index) => {
    let ic = [...individualCheckboxes];

    if (ic.includes(filteredData[index].id)) {
      ic = ic.filter((el) => el !== filteredData[index].id);
    } else {
      ic = [...ic, filteredData[index].id];
    }
    setIndividualCheckboxes(ic);

    if (ic.length === filteredData.length) {
      setIsCheckedGlobal(true);
    } else {
      setIsCheckedGlobal(false);
    }
  };

  // при нажатии на кружок уведомления
  const handleClicNotice = (el, index) => {
    setIsHovered(!isHovered);
    setPosition({ x: el.clientX - 40, y: el.clientY - 200 });
    setIdrow(index);
  };

  // клик на th, открытие МО фильтры к колонке
  const clickFigth = (event, index) => {
    setSamplePointsShow(!isSamplePointsShow);
    if (event.clientX + 372 > window.innerWidth) {
      setPositionFigth({ x: window.innerWidth - 500, y: event.clientY - 100 });
    } else {
      setPositionFigth({ x: event.clientX - 50, y: event.clientY - 100 });
    }

    const keyTd = tableHeaders[index].key;

    const td = filteredData
      .map((item) => item[keyTd])
      .filter((value, i, arr) => arr.indexOf(value) === i);

    const data = { td, keyTd };
    setSamplePointsData(data);
  };

  //данные сраницы "Поттом все будет подшгружаться из API"
  const notice = [
    {
      id: 0,
      id_row: 0,
      name: "Данильченко Владислав Иванович",
      text: "Пары неверно назначены преподавателю, должен быть другой",
    },
    {
      id: 1,
      id_row: 0,
      name: "Иванов Иван Иванович",
      text: "Пары неверно назначены преподавателю, должен быть другой",
    },
    {
      id: 2,
      id_row: 1,
      name: "Смирнов Иван Николаевич",
      text: "Пары неверно назначены преподавателю, должен быть другой",
    },
  ];

  //выбор компонента

  const tableHeaders = useMemo(() => {
    return [
      { key: "id", label: "№" },
      { key: "discipline", label: "Дисциплина" },
      { key: "workload", label: "Нагрузка" },
      { key: "groups", label: "Группа" },
      { key: "department", label: "Кафедра" },
      { key: "block", label: "Блок" },
      { key: "semester", label: "Семестр" },
      { key: "period", label: "Период" },
      { key: "curriculum", label: "Учебный план" },
      { key: "curriculumUnit", label: "Подразделение учебного плана" },
      { key: "formOfEducation", label: "Форма обучения" },
      { key: "levelOfTraining", label: "Уровень подготовки" },
      {
        key: "specialty",
        label: "Направление подготовки (специальность)",
      },
      { key: "core", label: "Профиль" },
      { key: "numberOfStudents", label: "Количество студентов" },
      { key: "hours", label: "Часы" },
      { key: "audienceHours", label: "Аудиторные часы" },
      { key: "ratingControlHours", label: "Часы рейтинг-контроль" },
      { key: "educator", label: "Преподаватель" },
    ];
  }, []);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  //! работа с таблицами через REDUX
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

  //! поиск и фильтрация таблицы
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    let fd;
    if (searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        return Object.values(row).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredData(fd);
  };
  useEffect(() => {
    let fd;
    if (searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        return Object.values(row).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredData(fd);
  }, [updatedData, searchTerm]);

  const EditTableData = (selectedComponent) => {
    console.log(selectedComponent);
    //тут написать функцию которая будет подгружать нужное содержимое tableData и tableHeaders
  };

  //! меню при нажатии пкм
  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  //! добавление преподавателя на нагрузку
  const handleMenuClick = () => {
    console.log("handleMenuClick");
  };

  //! расчет left для статических блоков таблицы
  const trRef = useRef(null);
  const [widthsTableHeader, SetWidthsTableHeader] = useState([]);
  useEffect(() => {
    SetWidthsTableHeader(SetHeaderWidths());
  }, [filteredData]);

  function SetHeaderWidths() {
    const widths = [];
    if (trRef && trRef.current) {
      for (let i = 0; i < 4; i++) {
        if (trRef.current.children[i]) {
          widths.push(trRef.current.children[i].offsetWidth);
        }
      }
    }
    return widths;
  }
  const arrLeft = [
    widthsTableHeader[0],
    widthsTableHeader[0] + widthsTableHeader[1],
    widthsTableHeader[0] + widthsTableHeader[1] + widthsTableHeader[2],
  ];

  //! содержимое
  return (
    <div className={styles.tabledisciplinesMain}>
      <div className={styles.tabledisciplinesMain_search}>
        <input
          type="text"
          placeholder="Поиск"
          id="search"
          name="search"
          value={searchTerm}
          onChange={handleSearch}
          className={styles.search}
        />
        <img src="./img/search.svg"></img>
      </div>

      <div className={styles.ButtonCaf_gen}>
        <Button
          Bg={selectedComponent === "cathedrals" ? "#3B28CC" : "#efedf3"}
          textColot={selectedComponent === "cathedrals" ? "#efedf3" : "#000000"}
          text="Кафедральные"
          onClick={() => {
            handleComponentChange("cathedrals");
            EditTableData(selectedComponent);
          }}
        />
        <Button
          Bg={selectedComponent === "genInstitute" ? "#3B28CC" : "#efedf3"}
          textColot={selectedComponent === "cathedrals" ? "#000000" : "#efedf3"}
          text="Общеинститутские"
          onClick={() => {
            handleComponentChange("genInstitute");
            EditTableData(selectedComponent);
          }}
        />
      </div>
      <div className={styles.EditInput}>
        <EditInput tableHeaders={tableHeaders} />
      </div>
      <div>
        {/* <div className={styles.TableDisciplines__inner}> */}
        {isHovered && (
          <NotificationForm
            refHoverd={refHoverd}
            position={position}
            notice={notice.filter((item) => item.id_row === idRow)}
            idRow={idRow}
          />
        )}

        {isSamplePointsShow && (
          <SamplePoints
            refSP={refSP}
            isSamplePointsData={isSamplePointsData}
            positionFigth={positionFigth}
            filteredData={filteredData}
            isChecked={isChecked}
            setChecked={setChecked}
          />
        )}
        {showMenu && (
          <ContextMenu
            showMenu={showMenu}
            menuPosition={menuPosition}
            handleMenuClick={handleMenuClick}
            setShowMenu={setShowMenu}
            individualCheckboxes={individualCheckboxes}
            getDataTable={getDataTable}
          />
        )}
        <div className={styles.table_container}>
          {/* уведомления от преподавателей  */}
          <TableNotice
            filteredData={filteredData}
            isChecked={isChecked}
            notice={notice}
            handleClicNotice={handleClicNotice}
          />
          <div className={styles.TableDisciplines__inner}>
            <table className={styles.taleDestiplinesMainTable}>
              <thead>
                <tr ref={trRef} className={styles.tr_thead}>
                  <th className={styles.checkboxHeader} style={{ left: "0" }}>
                    <input
                      type="checkbox"
                      className={styles.custom__checkbox}
                      id="dataRowGlobal"
                      name="dataRowGlobal"
                      checked={isCheckedGlobal}
                      onChange={handleGlobalCheckboxChange}
                    />
                    <label htmlFor="dataRowGlobal"></label>
                  </th>
                  {updatedHeader.map((header, index) => (
                    <th
                      key={header.key}
                      onClick={(event) => clickFigth(event, index)}
                      className={
                        header.key === "discipline" ||
                        header.key === "id" ||
                        header.key === "workload"
                          ? styles.stytic_th
                          : null
                      }
                      style={{ left: arrLeft[index] || "0" }}
                    >
                      <div className={styles.th_inner}>
                        {header.label}
                        <img src="./img/th_fight.svg" alt=">"></img>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, index) => {
                  const checkValues = Object.values(row).some((value) =>
                    isChecked.includes(value)
                  );
                  if (!checkValues) {
                    return (
                      <tr
                        key={index}
                        onContextMenu={handleContextMenu}
                        className={styles.table_tr}
                        onClick={() => handleIndividualCheckboxChange(index)}
                        style={
                          individualCheckboxes.includes(filteredData[index].id)
                            ? { backgroundColor: "rgb(234, 234, 250)" }
                            : null
                        }
                      >
                        <td className={styles.checkbox} style={{ left: "0" }}>
                          <input
                            type="checkbox"
                            className={styles.custom__checkbox}
                            name="dataRow"
                            id={`dataRow-${index}`}
                            checked={
                              individualCheckboxes.includes(
                                filteredData[index].id
                              )
                                ? true
                                : false
                            }
                            onChange={() =>
                              handleIndividualCheckboxChange(index)
                            }
                          />
                          <label htmlFor={`dataRow-${index}`}></label>
                        </td>
                        {updatedHeader.map((key, ind) => (
                          <td
                            key={updatedHeader[ind].key}
                            className={
                              updatedHeader[ind].key === "discipline" ||
                              updatedHeader[ind].key === "id" ||
                              updatedHeader[ind].key === "workload"
                                ? styles.stytic_td
                                : null
                            }
                            style={{ left: arrLeft[ind] || "0" }}
                          >
                            {row[updatedHeader[ind].key] === null
                              ? "0"
                              : updatedHeader[ind].key === "id"
                              ? index + 1
                              : row[updatedHeader[ind].key]}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={styles.Block__tables__shadow}></div>
    </div>
  );
}

export default TableDisciplines;
