import React, { useState, useEffect, useRef } from "react";
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg";
import { useDispatch } from "react-redux";
import { actions } from "./../../store/filter/filter.slice";

function EditInput({ tableHeaders, selectedComponent }) {
  const [searchResults, setSearchResults] = useState(tableHeaders.slice(3));
  const [isListOpen, setListOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    Array(searchResults.length).fill(true)
  );

  const [isChecked, setChecked] = useState(tableHeaders.slice(3));

  useEffect(() => {
    setSearchResults(tableHeaders.slice(3));
    setChecked(tableHeaders.slice(3));
  }, [tableHeaders, selectedComponent]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.initializeFilters(tableHeaders));
  }, [tableHeaders, selectedComponent]);
  // console.log("EditInput", tableHeaders);
  // закрытие модального окна при нажатии вне него
  const refLO = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (refLO.current && !refLO.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  const takeFunction = (index, value) => {
    handleItemClick(value.key);
    toggleChecked(index);
    console.log("isChecked ", isChecked);
    if (isChecked.some((item) => item.key === value.key)) {
      // Если значение уже существует, удаляем его из массива
      setChecked(isChecked.filter((item) => item.key !== value.key));
      console.log("существует ");
      console.log("value ", value);
    } else {
      // Если значение уникально, добавляем его в массив
      setChecked((isChecked) => [...isChecked, value]);
      console.log("уникально ");
      console.log("value ", value);
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
      tableHeaders
        .slice(3)
        .filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )
    );
    if (query === "") {
      setSearchResults(tableHeaders.slice(3));
    }
  };
  return (
    <div ref={refLO} className={styles.EditInput}>
      {!isListOpen && (
        <button onClick={toggleList}>
          <p>Редактирование полей</p>
          <img src={arrow} alt="arrow"></img>
        </button>
      )}
      {isListOpen && (
        <div className={`${styles.EditInputOpen} ${styles.fadein}`}>
          <button onClick={toggleList}>
            <p>Редактирование полей</p>
            <img src={arrow} alt="arrow"></img>
          </button>
          <input
            placeholder="Поиск"
            type="text"
            className={styles.edit_input}
            onChange={handleSearch}
            id="search2"
            name="search2"
          />
          <div className={styles.EditInputList}>
            <ul className={styles.fadeinul}>
              {searchResults.map((row, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    onChange={() => takeFunction(index, row)}
                    checked={isChecked.some((item) => item.key === row.key)}
                    className={styles.customInput}
                    id={`search3-${index}`}
                    name="search3"
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
