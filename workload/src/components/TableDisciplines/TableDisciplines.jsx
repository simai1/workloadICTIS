import React, { useState, useEffect, useMemo } from 'react';
import styles from "./TableDisciplines.module.scss";
import Button from '../../ui/Button/Button';
import EditInput from '../EditInput/EditInput';
import { useDispatch, useSelector} from "react-redux";
import ContextMenu from '../../ui/ContextMenu/ContextMenu';
import { NotificationForm } from "../../ui/NotificationForm/NotificationForm";

function TableDisciplines() {
  const [updatedHeader, setUpdatedHeader] = useState([]); // State to hold the updated table headers
  const [updatedData, setUpdatedData] = useState([]); // State to hold the updated table headers
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [selectedComponent, setSelectedComponent] = useState("cathedrals");
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [idRow, setIdrow] = useState(0);
 

  const handleClic = (el, index) => {
    setIsHovered(!isHovered);
    setPosition({ x: el.clientX - 50, y: el.clientY - 300 });
    setIdrow(index);
    console.log(index);
  };

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
      studyPlanUnit: "Подразделение учебного плана 1",
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
      workload: "Нагрузка 1",
      group: "Группа 1",
      block: "Блок 1",
      semester: "Семестр 1",
      period: "Период 1",
      studyPlan: "Учебный план 1",
      studyPlanUnit: "Подразделение учебного плана 1",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ ",
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
      id: 3,
      discipline: "Дисциплина 1",
      workload: "Нагрузка 1",
      group: "Группа 1",
      block: "Блок 1",
      semester: "Семестр 1",
      period: "Период 1",
      studyPlan: "Учебный план 1",
      studyPlanUnit: "Подразделение учебного плана 1",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ ",
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
      id: 4,
      discipline: "Дисциплина 1",
      workload: "Нагрузка 1",
      group: "Группа 1",
      block: "Блок 1",
      semester: "Семестр 1",
      period: "Период 1",
      studyPlan: "Учебный план 1",
      studyPlanUnit: "Подразделение учебного плана 1",
      studyPlanUnitId: "Идентификатор 1С-ЗКГУ ",
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
  ];

  const tableHeaders = useMemo(() => {
    return [
      { key: 'id', label: '№' },
    { key: 'discipline', label: 'Дисциплина' },
    { key: 'workload', label: 'Нагрузка' },
    { key: 'group', label: 'Группа' },
    { key: 'block', label: 'Блок' },
    { key: 'semester', label: 'Семестр' },
    { key: 'period', label: 'Период' },
    { key: 'studyPlan', label: 'Учебный план' },
    { key: 'studyPlanUnit', label: 'Подразделение учебного плана' },
    { key: 'studyPlanUnitId', label: 'Идентификатор 1С-ЗКГУ' },
    { key: 'educationForm', label: 'Форма обучения' },
    { key: 'educationLevel', label: 'Уровень подготовки' },
    { key: 'trainingDirection', label: 'Направление подготовки (специальность)' },
    { key: 'profile', label: 'Профиль' },
    { key: 'educationalProgram', label: 'Образовательная программа' },
    { key: 'studentCount', label: 'Количество студентов' },
    { key: 'hours', label: 'Часы' },
    { key: 'classroomHours', label: 'Аудиторные часы' },
    { key: 'ratingControlHours', label: 'Часы рейтинг-контроль' },
    { key: 'zetCount', label: 'Количество в ЗЕТ' },
    { key: 'teacher', label: 'Преподаватель' },
    ];
  }, []);
 

  

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  
  useEffect(() => {
    addHeadersTable(filters, tableHeaders, tableData);
  }, [filters, dispatch]);

  function addHeadersTable(filters, tableHeaders, tableData) {
    const updatedHeader = tableHeaders.filter((header) => filters.includes(header.key));
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
  
  const EditTableData = (selectedComponent) =>{
    console.log(selectedComponent);
    //тут написать функцию которая будет подгружать нужное содержимое tableData и tableHeaders
  }

  //меню
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMenuClick = () => {
   setShowMenu(false);
  };


  return (
    <div className={styles.tabledisciplines}>
     <input type="text" placeholder="Поиск" value={searchTerm} onChange={handleSearch} />

    <div className={styles.ButtonCaf_gen}>
      <Button Bg={selectedComponent === "cathedrals" ? "#DDDDDD": "#ffffff"} text="Кафедральные" onClick={() => {handleComponentChange("cathedrals"); EditTableData(selectedComponent);}}/>
      <Button Bg={selectedComponent === "genInstitute" ? "#DDDDDD": "#ffffff"} text="Общеинститутские" onClick={() => {handleComponentChange("genInstitute"); EditTableData(selectedComponent);}}/>
    </div>
    <div className={styles.EditInput}>
      <EditInput tableHeaders={tableHeaders}/>
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
            {filteredData.map((row, index) => (
              <tr className={styles.notice} key={index}>
                <td
                  className={
                    notice.some((item) => item.id_row === index) ?
                    styles.notice_circle : null
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
            ))}
          </tbody>
        </table>
        {isHovered && (
          <NotificationForm
            position={position}
            notice={notice.filter((item) => item.id_row === idRow)}
            idRow={idRow}
          />
        )}
  <table className={styles.TableDisciplines}>
   
    <thead>
      <tr>
        {updatedHeader.map((header) => (
          <th key={header.key}>{header.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
    {showMenu && (
      <ContextMenu showMenu={showMenu} menuPosition={menuPosition}
      handleMenuClick = {handleMenuClick}
      />
    )}

      {filteredData.map((row, index) => (
        
        <tr key={index} onContextMenu={handleContextMenu}>
          {Object.keys(row).map((key) => (
            <td key={key}>{row[key]}</td>
          ))}
        </tr>
      ))}
     
    </tbody>
  </table>

  <div className={styles.Block__tables__shadow}></div>
</div>
</div>
)}

export default TableDisciplines;

