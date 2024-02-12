import React, { useState, useEffect } from 'react';
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg";
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './../../store/filter/filter.slice';

function EditInput({ tableHeaders, top }) {
  const [isListOpen, setListOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(Array(tableHeaders.length).fill(true));
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(actions.initializeFilters(tableHeaders));
  }, [dispatch, tableHeaders]);

  const toggleList = () => {
    setListOpen(!isListOpen);
  }

  const takeFunction = (index, value) => {
    handleItemClick(value);
    toggleChecked(index);
  }

  const handleItemClick = (value) => {
    dispatch(actions.toggleTofilter(value));
  }

  const toggleChecked = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  }
  
  return (
    <div className={styles.EditInput}>
      {!isListOpen && (
        <button onClick={toggleList}>
          <p>Редактирование полей</p>
          <img src={arrow} alt="arrow"></img>
        </button>
      )}
      {isListOpen && (
        <div className={styles.EditInputOpen} style={{top:top + "vh"}}>
          <button onClick={toggleList}>
            <p>Редактирование полей</p>
            <img src={arrow} alt="arrow"></img>
          </button>
          <div className={styles.EditInputList}>
            <ul>
                {tableHeaders.map((row, index) => (
                  <li key={index}>
                    
                    <input
                      type="checkbox"
                      onChange={() => takeFunction(index, row)}
                      checked={checkedItems[index]}
                      className={styles.customInput}
                    />
                    <p>
                    {Object.values(row).join("")}
                    </p>
                  </li>
                ))}
              </ul>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default EditInput;
