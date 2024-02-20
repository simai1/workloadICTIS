import React, { useState, useEffect } from "react";
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg";
import { useDispatch } from "react-redux";
import { actions } from "./../../store/filter/filter.slice";

function EditInput({ tableHeaders, setSamplePointsShow }) {
  const [searchResults, setSearchResults] = useState(tableHeaders);

  const [isListOpen, setListOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    Array(searchResults.length).fill(true)
  );

  const [isChecked, setChecked] = useState(tableHeaders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.initializeFilters(tableHeaders));
  }, []);

  const toggleList = () => {
    setListOpen(!isListOpen);
    setSamplePointsShow(false);
  };

  const takeFunction = (index, value) => {
    handleItemClick(value.key);
    toggleChecked(index);
    if (isChecked.includes(value)) {
      // Если значение уже существует, удаляем его из массива
      setChecked(isChecked.filter((item) => item.key !== value.key));
    } else {
      // Если значение уникально, добавляем его в массив
      setChecked((isChecked) => [...isChecked, value]);
    }
  };

  const handleItemClick = (value) => {
    dispatch(actions.toggleTofilter(value));
  };

  const toggleChecked = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handleSearch = (el) => {
    const query = el.target.value;
    setSearchResults(
      tableHeaders.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    );
    if (query === "") {
      setSearchResults(tableHeaders);
    }
    console.log(
      tableHeaders.filter((value, i, arr) => arr.indexOf(value) === 1)
    );
  };

  return (
    <div className={styles.EditInput}>
      {!isListOpen && (
        <button onClick={toggleList}>
          <p>Редактирование полей</p>
          <img src={arrow} alt="arrow"></img>
        </button>
      )}
      {isListOpen && (
        <div className={styles.EditInputOpen}>
          <button onClick={toggleList}>
            <p>Редактирование полей</p>
            <img src={arrow} alt="arrow"></img>
          </button>
          <input
            placeholder="Поиск..."
            type="text"
            className={styles.edit_input}
            onChange={handleSearch}
          />
          <div className={styles.EditInputList}>
            <ul>
              {searchResults.map((row, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    onChange={() => takeFunction(index, row)}
                    // checked={checkedItems[index]}
                    checked={isChecked.includes(row)}
                    className={styles.customInput}
                  />
                  <p>{row.label}</p>
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
