import React, { useState, useEffect, useMemo } from 'react';
import styles from "./TableLks.module.scss";
import EditInput from '../EditInput/EditInput';
import ArrowBack from "./../../img/arrow-back.svg";
import { useDispatch, useSelector} from "react-redux";

function TableLks({delNameChange, NameTeachers}) {
  const [updatedHeader, setUpdatedHeader] = useState([]); // State to hold the updated table headers
  const [updatedData, setUpdatedData] = useState([]); // State to hold the updated table headers
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  const tableHeaders = useMemo(() => {
    return [
      { key: 'id', label: '№' },
      { key: 'discipline', label: 'Дисциплина' },
      { key: 'workload', label: 'Нагрузка' },
      { key: 'type', label: 'Тип' },
      { key: 'division', label: 'Подразделение учебного плана' },
      { key: 'direction', label: 'Направление подготовки' },
      { key: 'hours', label: 'Часы' },
      { key: 'hours_period_1', label: 'Часы период 1' },
      { key: 'hours_period_2', label: 'Часы период 2' },
      { key: 'hours_without_a_period', label: 'Часы без периода' },
      { key: 'classroom_hours', label: 'Ауд. часы' },
    ];
  }, []);

  const tableData = useMemo(() => 
  [
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
  ]
, []);


 

  
  const handleNameClick = (name) => {
    delNameChange(name);
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  
  useEffect(() => {
    addHeadersTable(filters, tableHeaders, tableData);
  }, [filters, dispatch, tableHeaders, tableData]);

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

  const AllHours = "405";
  const OgranHours = "800";
  var BackgroundColorHours = WhyColor(AllHours, OgranHours);
  
  // Функция для определения цвета фона
  function WhyColor(AllHours, OgranHours) {
    let bg;
    if (AllHours <= OgranHours - 300) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (OgranHours - 300 < AllHours && AllHours <= OgranHours - 100) {
      bg = "#FFD600"; // Желтый цвет
    } else {
      bg = "#E81414"; // Красный цвет
    }
    return bg;
  }
  
console.log(
  BackgroundColorHours
)

  return (
    <div>
     <input type="text" placeholder="Поиск" value={searchTerm} onChange={handleSearch} />
    
    <button className={styles.buttonBack} onClick={() => handleNameClick("")}>
        <img src={ArrowBack} alt='arrow'></img>
        <p>Назад</p>
    </button>

   <div className={styles.DataLks}>
      <div className={styles.DataLksInner}>
        <div className={styles.DataLksHead}>
          <h1>{NameTeachers.name}</h1>
          <div className={styles.DataLksHeadSchet} style={{ backgroundColor: BackgroundColorHours}}><p><span>{AllHours}</span>/<span>{OgranHours}</span></p></div>
        </div>
      
        <p>Кафедра информационной безопасности телекоммуникационных систем</p>
        <p>{NameTeachers.post}</p>
        <p>Ставка: {NameTeachers.bet}</p>
      </div>
      <div className={styles.EditInput}>
          <EditInput tableHeaders={tableHeaders}  top={60.3} h={64} />
        </div>
    </div>
   
    <div className={styles.TableLks__inner}>
      <table className={styles.TableLks}>
      <thead>
          <tr>
            {updatedHeader.map((header) => (
              <th key={header.key}>
                {header.label}  
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map(key => (
                  <td key={key}>
                    {row[key]}
                  </td>  
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
