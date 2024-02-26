import React, { useState, useEffect, useMemo } from "react";
import styles from "./TableDisciplines.module.scss";
import Button from "../../ui/Button/Button";
import EditInput from "../EditInput/EditInput";
import { useDispatch, useSelector } from "react-redux";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { NotificationForm } from "../../ui/NotificationForm/NotificationForm";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";

function TableDisciplines() {
  const [updatedHeader, setUpdatedHeader] = useState([]); //заголовок обновленный для Redux сортировки
  const [updatedData, setUpdatedData] = useState([]); //массив обновленный для Redux сортировки
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице
  const [selectedComponent, setSelectedComponent] = useState("cathedrals"); //выбранный компонент
  const [isHovered, setIsHovered] = useState(false);
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

  //чекбоксы 
  const handleGlobalCheckboxChange = () => {
    setIsCheckedGlobal(!isCheckedGlobal);
    setIndividualCheckboxes(filteredData.map(() => !isCheckedGlobal));
  };

  const handleIndividualCheckboxChange = (index) => {
    const updatedCheckboxes = [...individualCheckboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setIndividualCheckboxes(updatedCheckboxes);
    if (!isCheckedGlobal) {
      setIsCheckedGlobal(!isCheckedGlobal);
    }
  };

  // при нажатии на кружок уведомления
  const handleClic = (el, index) => {
    setIsHovered(!isHovered);
    setSamplePointsShow(false);
    setPosition({ x: el.clientX - 50, y: el.clientY - 300 });
    setIdrow(index);
    console.log(index);
  };

  // фильтры к отдельной колонке
  const clickFigth = (el, index) => {
    setSamplePointsShow(!isSamplePointsShow);
    setIsHovered(false);
    if (el.clientX + 372 > window.innerWidth) {
      setPositionFigth({ x: window.innerWidth - 500, y: el.clientY - 100 });
    } else {
      setPositionFigth({ x: el.clientX - 50, y: el.clientY - 100 });
    }
    const td = filteredData
      .map((item) => item[Object.keys(item)[index]])
      .filter((value, i, arr) => arr.indexOf(value) === i);
    setSamplePointsData(td);
    console.log(el.clientX);
  };

  //данные сраницы "Поттом все будет подшгружаться из API"
  const notice = [
    {
      id: 0,
      id_row: 1,
      name: "Данильченко Владислав Иванович",
      text: "Пары неверно назначены преподавателю, должен быть другой",
    },
    {
      id: 1,
      id_row: 1,
      name: "Иванов Иван Иванович",
      text: "Пары неверно назначены преподавателю, должен быть другой",
    },
    {
      id: 2,
      id_row: 3,
      name: "Смирнов Иван Николаевич",
      text: "Пары неверно назначены преподавателю, должен быть другой",
    },
  ];

  const tableData = [
    {
      id: 1,
      discipline: "Дисциплина 1",
      workload: "Нагрузка 1",
      group: "Группа 1",
      block: "Блок 1",
      semester: "Семестр 1",
      period: "Период 1",
      studyPlan: "Учебный план 1",
      studyPlanUnit: "2одразделение учебного плана 1",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ",
      educationForm: "Форма обучения 1",
      educationLevel: "Уровень подготовки 1",
      trainingDirection: "Направление подготовки (специальность) 1",
      profile: "Профиль 1",
      educationalProgram: "Образовательная программа 1",
      studentCount: "Количество студентов 1",
      hours: "Часы 1",
      classroomHours: "Аудиторные часы 1",
      ratingControlHours: "Часы рейтинг-контроль 1",
      zetCount: "Количество в ЗЕТ 1",
      teacher: "Преподаватель 1",
    },
    {
      id: 2,
      discipline: "Дисциплина 1",
      workload: "Нагрузка 2",
      group: "Группа 2",
      block: "Блок 2",
      semester: "Семестр 2",
      period: "Период 2",
      studyPlan: "Учебный план 2",
      studyPlanUnit: "Подразделение учебного плана 2",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ ",
      educationForm: "Форма обучения 2",
      educationLevel: "Уровень подготовки 2",
      trainingDirection: "Направление подготовки (специальность) 2",
      profile: "Профиль 2",
      educationalProgram: "Образовательная программа 2",
      studentCount: "Количество студентов 2",
      hours: "Часы 2",
      classroomHours: "Аудиторные часы 2",
      ratingControlHours: "Часы рейтинг-контроль 2",
      zetCount: "Количество в ЗЕТ 2",
      teacher: "Преподаватель 2",
    },
    {
      id: 3,
      discipline: "Дисциплина 3",
      workload: "Нагрузка 3",
      group: "Группа 1",
      block: "Блок 3",
      semester: "Семестр 3",
      period: "Период 3",
      studyPlan: "Учебный план 3",
      studyPlanUnit: "Подразделение учебного плана 3",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ ",
      educationForm: "Форма обучения 3",
      educationLevel: "Уровень подготовки 3",
      trainingDirection: "Направление подготовки (специальность) 3",
      profile: "Профиль 3",
      educationalProgram: "Образовательная программа 3",
      studentCount: "Количество студентов 3",
      hours: "Часы 3",
      classroomHours: "Аудиторные часы 3",
      ratingControlHours: "Часы рейтинг-контроль 3",
      zetCount: "Количество в ЗЕТ 3",
      teacher: "Преподаватель 3",
    },
    {
      id: 4,
      discipline: "Дисциплина 4",
      workload: "Нагрузка 4",
      group: "Группа 2",
      block: "Блок 4",
      semester: "Семестр 4",
      period: "Период 4",
      studyPlan: "Учебный план 4",
      studyPlanUnit: "Подразделение учебного плана 4",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ ",
      educationForm: "Форма обучения 4",
      educationLevel: "Уровень подготовки 4",
      trainingDirection: "Направление подготовки (специальность) 4",
      profile: "Профиль 4",
      educationalProgram: "Образовательная программа 4",
      studentCount: "Количество студентов 4",
      hours: "Часы 4",
      classroomHours: "Аудиторные часы 4",
      ratingControlHours: "Часы рейтинг-контроль 4",
      zetCount: "Количество в ЗЕТ 4",
      teacher: "Преподаватель 4",
    },
  ];

  const tableHeaders = useMemo(() => {
    return [
      { key: "id", label: "№" },
      { key: "discipline", label: "Дисциплина" },
      { key: "workload", label: "Нагрузка" },
      { key: "group", label: "Группа" },
      { key: "block", label: "Блок" },
      { key: "semester", label: "Семестр" },
      { key: "period", label: "Период" },
      { key: "studyPlan", label: "Учебный план" },
      { key: "studyPlanUnit", label: "Подразделение учебного плана" },
      { key: "studyPlanUnitId", label: "Идентификатор 1С-ЗКГУ" },
      { key: "educationForm", label: "Форма обучения" },
      { key: "educationLevel", label: "Уровень подготовки" },
      {
        key: "trainingDirection",
        label: "Направление подготовки (специальность)",
      },
      { key: "profile", label: "Профиль" },
      { key: "educationalProgram", label: "Образовательная программа" },
      { key: "studentCount", label: "Количество студентов" },
      { key: "hours", label: "Часы" },
      { key: "classroomHours", label: "Аудиторные часы" },
      { key: "ratingControlHours", label: "Часы рейтинг-контроль" },
      { key: "zetCount", label: "Количество в ЗЕТ" },
      { key: "teacher", label: "Преподаватель" },
    ];
  }, []);

  const ProwNoHidenrow = [
    'id',
    "discipline",
    "workload",
    "group",
  ] 
  //выбор компонента
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  //работа с таплицами через REDUX
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
    const tableCells = document.querySelectorAll("th:nth-child(-n+3)");
    const widths = Array.from(tableCells).map(
      (cell) => cell.getBoundingClientRect().width
    );
    setLeft((Left) => [widths[0], widths[1], widths[2]]);
    setUpdatedHeader(updatedHeader);
    setUpdatedData(updatedData);
  }

  //поиск и фильтрация таблицы
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = updatedData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
 


 
  const EditTableData = (selectedComponent) => {
    console.log(selectedComponent);
    //тут написать функцию которая будет подгружать нужное содержимое tableData и tableHeaders
  };

  //меню при нажатии пкм

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMenuClick = () => {
    setShowMenu(false);
  };



  // исправить
  const [Left, setLeft] = useState([]);
  useEffect(() => {
    const tableCells = document.querySelectorAll("th:nth-child(-n+3)");
    const widths = Array.from(tableCells).map(
      (cell) => cell.getBoundingClientRect().width
    );
    setLeft((Left) => [widths[0], widths[1], widths[2]]);
    console.log(Left);
  }, []);

  const arrLeft = [56, 126, 272];
 
  //содержимое
  return (
    <div className={styles.tabledisciplinesMain}>
      <input
        type="text"
        placeholder="Поиск"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className={styles.ButtonCaf_gen}>
        <Button
          Bg={selectedComponent === "cathedrals" ? "#DDDDDD" : "#ffffff"}
          text="Кафедральные"
          onClick={() => {
            handleComponentChange("cathedrals");
            EditTableData(selectedComponent);
          }}
        />
        <Button
          Bg={selectedComponent === "genInstitute" ? "#DDDDDD" : "#ffffff"}
          text="Общеинститутские"
          onClick={() => {
            handleComponentChange("genInstitute");
            EditTableData(selectedComponent);
          }}
        />
      </div>
      <div className={styles.EditInput}>
        <EditInput
          tableHeaders={tableHeaders}
          setSamplePointsShow={setSamplePointsShow}
        />
      </div>
      <div className={styles.TableDisciplines__inner}>
        <table className={styles.TableDisciplines_circle}>
          <thead>
            <tr>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th></th>
            </tr>
            {/* {filteredData.map((row, index) => (
              <tr className={styles.notice} key={index}>
                <td
                  className={
                    notice.some((item) => item.id_row === index)
                      ? styles.notice_circle
                      : null
                  }
                >
                  <div
                    className={styles.notice_circle_inner}
                    onClick={(el) => handleClic(el, index)}
                  >
                    {notice.filter((item) => item.id_row === index).length}
                  </div>
                </td>
              </tr>
            ))} */}
            {filteredData.map((row, index) => {
              const checkValues = Object.values(row).some((value) =>
                isChecked.includes(value)
              );
              if (!checkValues) {
                return (
                  <tr className={styles.notice} key={index}>
                    <td
                      className={
                        notice.some((item) => item.id_row === index)
                          ? styles.notice_circle
                          : null
                      }
                    >
                      <div
                        className={styles.notice_circle_inner}
                        onClick={(el) => handleClic(el, index)}
                      >
                        {notice.filter((item) => item.id_row === index).length}
                      </div>
                    </td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
        {isHovered && (
          <NotificationForm
            position={position}
            notice={notice.filter((item) => item.id_row === idRow)}
            idRow={idRow}
          />
        )}
        {isSamplePointsShow && (
          <SamplePoints
            isSamplePointsData={isSamplePointsData}
            positionFigth={positionFigth}
            filteredData={filteredData}
            isChecked={isChecked}
            setChecked={setChecked}
          />
        )}
        <table className={styles.taleDestiplinesMainTable} ref={tableRef}>
          <thead>
            <tr>
              <th className={styles.checkboxHeader} style={{ left: "0" }}>
                <input
                  type="checkbox"
                  className={styles.custom__checkbox}
                  name="dataRowGlobal"
                  checked={isCheckedGlobal}
                  onChange={handleGlobalCheckboxChange}
                />
                <label htmlFor="dataRowGlobal"></label>
              </th>
              {updatedHeader.map((header, index) => (
                <th
                  key={header.key}
                  onClick={(el) => clickFigth(el, index)}
                  className={
                    header.key === "discipline" ||
                    header.key === "id" ||
                    header.key === "workload"
                      ? styles.stytic_th
                      : null
                  }
                  style={{ left: arrLeft[index] }}
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
            {showMenu && (
              <ContextMenu
                showMenu={showMenu}
                menuPosition={menuPosition}
                handleMenuClick={handleMenuClick}
              />
            )}
            {filteredData.map((row, index) => {
              const checkValues = Object.values(row).some((value) =>
                isChecked.includes(value)
              );
              if (!checkValues) {
                return (
                  <tr key={index} onContextMenu={handleContextMenu}>
                    <td className={styles.checkbox} style={{ left: "0" }}>
                      <input
                        type="checkbox"
                        className={styles.custom__checkbox}
                        name="dataRow"
                        checked={individualCheckboxes[index] || false}
                        onChange={() => handleIndividualCheckboxChange(index)}
                      />
                      <label htmlFor="dataRow"></label>
                    </td>
                    {Object.keys(row).map((key, index) => (
                      <td
                        key={key}
                        className={
                          key === "discipline" ||
                          key === "id" ||
                          key === "workload"
                            ? styles.stytic_td
                            : null
                        }
                        style={{ left: arrLeft[index] }}
                      >
                        {row[key]}{" "}
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
      <div className={styles.Block__tables__shadow}></div>
    </div>
  );
}

export default TableDisciplines;
