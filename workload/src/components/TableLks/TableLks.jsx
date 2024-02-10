import React, { useState } from 'react';
import styles from "./TableLks.module.scss";
import EditInput from '../EditInput/EditInput';
import ArrowBack from "./../../img/arrow-back.svg";

function TableLks({delNameChange}) {
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
   
  ];
  const handleNameClick = (name) => {
    delNameChange(name);
  };

  return (
    <div>
    <input type="text" value={searchText} onChange={handleSearch} placeholder="Поиск" />
    
    <button className={styles.buttonBack} onClick={() => handleNameClick("")}>
        <img src={ArrowBack}></img>
        <p>Назад</p>
    </button>

    <div className={styles.EditInput}>
      <EditInput/>
    </div>
 
    <div className={styles.TableLks__inner}>
      <table className={styles.TableLks}>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={header} className={styles.head__table}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* <div className={styles.Block__tables__shadow}></div> */}

    </div>
  );
}

export default TableLks;
