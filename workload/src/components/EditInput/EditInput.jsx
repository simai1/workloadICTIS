import React, { useState, useEffect, useRef } from "react";
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg";
import { useDispatch } from "react-redux";
import { actions } from "./../../store/filter/filter.slice";
import DataContext from "../../context";
import { headers as hed } from "../TableDisciplines/Data";

function EditInput({ selectedComponent }) {
  const { basicTabData } = React.useContext(DataContext);

  const headers = hed.slice(3);
  const [searchResults, setSearchResults] = useState(headers);
  const [isListOpen, setListOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    Array(searchResults.length).fill(true)
  );
  const [isChecked, setChecked] = useState([]);

  useEffect(() => {
    setSearchResults(headers);
  }, [basicTabData.tableHeaders, selectedComponent]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.initializeFilters(basicTabData.tableHeaders));
  }, [basicTabData.tableHeaders, selectedComponent]);

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
    let checked = [...isChecked];
    toggleChecked(index);
    if (checked.some((item) => item === value.key)) {
      checked = checked.filter((item) => item !== value.key);
    } else {
      checked.push(value.key);
    }
    setChecked([...checked]);
    // Фильтрация заголовков
    const filteredHeaders = hed.filter(
      (header) => !checked.includes(header.key)
    );
    basicTabData.setTableHeaders(filteredHeaders);
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
      headers.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    );
    if (query === "") {
      setSearchResults(headers);
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
                    checked={!isChecked.includes(row.key)}
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
