import React, { useState } from 'react';
import styles from "./TableDisciplines.module.scss";
import Button from '../../ui/Button/Button';
import EditInput from '../EditInput/EditInput';

function TableDisciplines() {
  const [searchText, setSearchText] = useState('');
  
  const tableData = [
    {
      id: 1,
      discipline: 'Дисциплина 1',
      workload: 'Нагрузка 1',
      group: 'Группа 1',
      block: 'Блок 1',
      semester: 'Семестр 1',
      period: 'Период 1',
      studyPlan: 'Учебный план 1',
      studyPlanUnit: 'Подразделение учебного плана 1',
      studyPlanUnitId: 'Идентификатор 1С-ЗКГУ',
      educationForm: 'Форма обучения 1',
      educationLevel: 'Уровень подготовки 1',
      trainingDirection: 'Направление подготовки (специальность) 1',
      profile: 'Профиль 1',
      educationalProgram: 'Образовательная программа 1',
      studentCount: 'Количество студентов 1',
      hours: 'Часы 1',
      classroomHours: 'Аудиторные часы 1',
      ratingControlHours: 'Часы рейтинг-контроль 1',
      zetCount: 'Количество в ЗЕТ 1',
      teacher: 'Преподаватель 1',
    },
    {
      id: 2,
      discipline: 'Дисциплина 1',
      workload: 'Нагрузка 1',
      group: 'Группа 1',
      block: 'Блок 1',
      semester: 'Семестр 1',
      period: 'Период 1',
      studyPlan: 'Учебный план 1',
      studyPlanUnit: 'Подразделение учебного плана 1',
      studyPlanUnitId: 'Идентификатор 1С-ЗКГУ ',
      educationForm: 'Форма обучения 1',
      educationLevel: 'Уровень подготовки 1',
      trainingDirection: 'Направление подготовки (специальность) 1',
      profile: 'Профиль 1',
      educationalProgram: 'Образовательная программа 1',
      studentCount: 'Количество студентов 1',
      hours: 'Часы 1',
      classroomHours: 'Аудиторные часы 1',
      ratingControlHours: 'Часы рейтинг-контроль 1',
      zetCount: 'Количество в ЗЕТ 1',
      teacher: 'Преподаватель 1',
    },
  ];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const tableHeaders = [
    '№',
    'Дисциплина',
    'Нагрузка',
    'Группа',
    'Блок',
    'Семестр',
    'Период',
    'Учебный план',
    'Подразделение учебного плана',
    'Идентификатор 1С-ЗКГУ',
    'Форма обучения',
    'Уровень подготовки',
    'Направление подготовки',
    'Профиль',
    'Образовательная программа',
    'Количество студентов',
    'Часы',
    'Аудиторные часы',
    'Часы рейтинг-контроль',
    'Количество в ЗЕТ',
    'Преподаватель',
  ];

  const [selectedComponent, setSelectedComponent] = useState("cathedrals");

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };


  return (
    <div>
    <input type="text" value={searchText} onChange={handleSearch} placeholder="Поиск" />

    <div className={styles.ButtonCaf_gen}>
      <Button Bg={selectedComponent === "cathedrals" ? "#DDDDDD": "#ffffff"} text="Кафедральные" onClick={() => handleComponentChange("cathedrals")}/>
      <Button Bg={selectedComponent === "genInstitute" ? "#DDDDDD": "#ffffff"} text="Общеинститутские" onClick={() => handleComponentChange("genInstitute")}/>
    </div>
    <div className={styles.EditInput}>
      <EditInput tableHeaders={tableHeaders}/>
    </div>
 
    <div className={styles.TableDisciplines__inner}>
      <table className={styles.TableDisciplines}>
        <thead>
          <tr>
            {/* <input type="checkbox" id="chooseAll" className={styles.checkbox}/> */}
            {tableHeaders.map((header) => (
              <th key={header} className={styles.head__table}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            
            <tr key={index}>
              {/* <input key={index} type="checkbox" className={styles.checkbox}/> */}
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className={styles.Block__tables__shadow}></div>
    
    </div>
  );
}

export default TableDisciplines;
