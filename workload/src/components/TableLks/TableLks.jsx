import React, { useState } from 'react';
import styles from "./TableLks.module.scss";
import EditInput from '../EditInput/EditInput';
import ArrowBack from "./../../img/arrow-back.svg";

function TableLks({delNameChange, NameTeachers}) {
  const [searchText, setSearchText] = useState('');
  
  const tableHeaders = [
    '№',
    'Дисциплина',
    'Нагрузка',
    'Тип',
    'Подразделение учебного плана',
    'Направление подготовки',
    'Часы',
    'Часы период 1',
    'Часы период 2',
    'Часы без периода',
    'Ауд. часы',
  ];

  const tableData = [
    {
      id: 1,
      discipline: 'Технологии программирования',
      workload: 'Лекционные',
      type: 'ОИД',
      division: 'ИКТИБ ИРТСУ',
      direction: 'Направление подготовки',
      hours: '50',
      hours_period_1: '25',
      hours_period_2: '25',
      hours_without_a_period: '0',
      classroom_hours: '3',
    },
    {
      id: 2,
      discipline: 'Методы оптимизации',
      workload: 'Практические',
      type: 'ОИД',
      division: 'ИКТИБ ИРТСУ',
      direction: 'Направление подготовки',
      hours: '50',
      hours_period_1: '30',
      hours_period_2: '20',
      hours_without_a_period: '0',
      classroom_hours: '3',
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

   <div className={styles.DataLks}>
      <div className={styles.DataLksInner}>
        <div className={styles.DataLksHead}>
          <h1>{NameTeachers.name}</h1>
          <div className={styles.DataLksHeadSchet}><p><span>600</span>/<span>800</span></p></div>
        </div>
      
        <p>Кафедра информационной безопасности телекоммуникационных систем</p>
        <p>{NameTeachers.post}</p>
        <p>Ставка: {NameTeachers.bet}</p>
      </div>
      <div className={styles.EditInput}>
          <EditInput tableHeaders={tableHeaders}/>
        </div>
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
