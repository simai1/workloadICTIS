import styles from "./TableTeachers.module.scss";
import React, { useState } from 'react';
import EditInput from "../EditInput/EditInput";
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../store/filter/filter.slice';

function TableTeachers({onNameChange}) {
  const [searchText, setSearchText] = useState('');
  const [clickedName, setClickedName] = useState('');

  const tableData = [
    {
      id: 1,
      name: 'Данильченко Владислав Иванович',
      post: 'Старший преподаватель',
      bet: '0,75',
      hours: '600',
      hours_period_1: '240',
      hours_period_2: '260',
      hours_without_a_period: '100',
      department: 'ПиБЖ',
    },
    {
      id: 2,
      name: 'Капылов Никита Максимович',
      post: 'Старший преподаватель',
      bet: '0,75',
      hours: '600',
      hours_period_1: '240',
      hours_period_2: '260',
      hours_without_a_period: '100',
      department: 'ПиБЖ',
    },
  ];
  const tableHeaders = [
    '№',
    'Преподователь',
    'Должность',
    'Ставка',
    'Часы',
    'Часы период 1',
    'Часы период 2',
    'Часы без периода',
    'Кафедра',
  ];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleNameClick = (name, index) => {
    setClickedName(name);
    let postClickTicher = tableData[index].post;
    let betClickTicher = tableData[index].bet;
    onNameChange(name, postClickTicher, betClickTicher);
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );
   //////////////////////////////state
  //  const {filters} = useSelector(state => state);
  //  const dispatch = useDispatch();
  //  console.log(filters)


  return (
    <div>
      <input type="text" value={searchText} onChange={handleSearch} placeholder="Поиск" />

      <div className={styles.EditInput}>
        <EditInput tableHeaders={tableHeaders}/>
      </div>

      <div className={styles.TableTeachers__inner}>
        <table className={styles.TableTeachers}>
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.id}</td>
                <td onClick={() => handleNameClick(row.name, index)} className={styles.tdName}>{row.name}</td>
                <td>{row.post}</td>
                <td>{row.bet}</td>
                <td>{row.hours}</td>
                <td>{row.hours_period_1}</td>
                <td>{row.hours_period_2}</td>
                <td>{row.hours_without_a_period}</td>
                <td>{row.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div className={styles.Block__tables__shadow}></div> */}
    </div>
  );
}

export default TableTeachers;
