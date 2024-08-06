import React, { useState, useEffect, useRef } from "react";
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg";
import { useDispatch, useSelector } from "react-redux";
// import { actions } from "./../../store/filter/filter.slice";
import DataContext from "../../context";
import {
  addAllCheckeds,
  addChecked,
  removeAllCheckeds,
  removeChecked,
} from "../../store/filter/editInputChecked.slice";
// import { headers as hed } from "../TableDisciplines/Data";

function EditInput({ selectedComponent, originalHeader, ssname }) {
  const { basicTabData, appData } = React.useContext(DataContext);
  const headers = [...basicTabData.tableHeaders];
  const [searchResults, setSearchResults] = useState(headers);
  const [isListOpen, setListOpen] = useState(false);

  const headerStore = useSelector(
    (state) => state.editInputChecked.editInputCheckeds[ssname]
  );
  // const jsoh = JSON.parse(sessionStorage.getItem(ssname));
  const ssUpdatedHeader = headerStore || originalHeader;

  const dispatch = useDispatch();

  const [isAllChecked, setIsAllChecked] = useState(
    originalHeader?.length === ssUpdatedHeader?.length ? true : false
  );
  const [checkedItems, setCheckedItems] = useState(
    appData.selectedComponent === "ScheduleMaterials" ?   Array(originalHeader?.slice(6).length).fill(true) :  Array(originalHeader?.slice(3).length).fill(true)
  );

  const [isChecked, setChecked] = useState(
    ssUpdatedHeader && originalHeader
      ? originalHeader
          .map((item) => item.key)
          .filter((key) => !ssUpdatedHeader.some((item) => item.key === key))
      : []
  );
  useEffect(() => {
    const ssuh = headerStore;
    const ssuhfix = ssuh?.map((el) => el.key);
    const oh = originalHeader.map((item) => item.key);
    if (ssuh && ssuh !== null) {
      const ohfix = oh.filter((el) => !ssuhfix?.some((e) => e === el));
      setChecked(ohfix);
      setIsAllChecked(
        originalHeader?.length === ssUpdatedHeader?.length ? true : false
      );
    }
  }, [originalHeader, selectedComponent]);

  useEffect(() => {
    appData.selectedComponent === "ScheduleMaterials" ? setSearchResults(originalHeader.slice(6)) : setSearchResults(originalHeader.slice(3));

  }, [basicTabData.tableHeaders, selectedComponent]);

  //! закрытие модального окна при нажатии вне него
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

  //! при нажатии input
  const takeFunction = (index, value) => {
    // handleItemClick(value.key);
    let checked = [...isChecked];
    toggleChecked(index);
    if (checked.some((item) => item === value.key)) {
      checked = checked.filter((item) => item !== value.key);
    } else {
      checked.push(value.key);
      // dispatch(removeChecked({ key: value.key, tableName: ssname }));
    }
    setChecked([...checked]);
    // Фильтрация заголовков
    const filteredHeaders = originalHeader.filter(
      (header) => !checked.includes(header.key)
    );
    dispatch(
      addAllCheckeds({ checked: [...filteredHeaders], tableName: ssname })
    );
    basicTabData.setTableHeaders(filteredHeaders);

    if (checked.length === 0) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  };
  const toggleChecked = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  //! поиск
  const handleSearch = (el) => {
    const query = el.target.value;
    setSearchResults(
      originalHeader.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    );
    if (query === "") {
      setSearchResults(originalHeader.filter((_, index) => index > 2));
    }
  };

  //! при нажатии все
  function takeFunctionAll() {
    setIsAllChecked(!isAllChecked);
    if (isChecked.length !== 0) {
      setChecked([]);
      basicTabData.setTableHeaders([...originalHeader]);
      // sessionStorage.setItem(ssname, JSON.stringify([...originalHeader]));
      dispatch(
        addAllCheckeds({ tableName: ssname, checked: [...originalHeader] })
      );
    } else {
      if(appData.selectedComponent === "ScheduleMaterials") {
        setChecked([...originalHeader.slice(6)].map((el) => el.key));
        basicTabData.setTableHeaders([...originalHeader].slice(0, 6));
        dispatch(
          addAllCheckeds({
            checked: [...originalHeader].slice(0, 6),
            tableName: ssname,
          })
        );
      }else{
        setChecked([...originalHeader.slice(3)].map((el) => el.key));
       basicTabData.setTableHeaders([...originalHeader].slice(0, 3));
        dispatch(
          addAllCheckeds({
            checked: [...originalHeader].slice(0, 3),
            tableName: ssname,
          })
        );
      }
      
    }
  }

  return (
    <div ref={refLO} className={styles.EditInput}>
      {!isListOpen && (
        <button onClick={toggleList}>
          <p className={styles.textButton}>Редактирование полей</p>
          {isChecked.length > 0 && !isListOpen ? (
            <img src="./img/filterColumn.svg" alt="arrow" />
          ) : (
            <img src={arrow} alt="arrow"></img>
          )}
        </button>
      )}
      {isListOpen && (
        <div className={`${styles.EditInputOpen} ${styles.fadein}`}>
          <button onClick={toggleList}>
            <p>Редактирование полей</p>
            <img
              src={arrow}
              alt="arrow"
              style={{
                transform: "rotate(-180deg)",
                left: "10px",
                position: "relative",
              }}
            />
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
              <li>
                <input
                  type="checkbox"
                  onChange={takeFunctionAll}
                  checked={isAllChecked}
                  className={styles.customInput}
                  name="search3"
                />
                <p>Все</p>
              </li>
              {searchResults.map((row, index) => (
                <div key={index + 1}>
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
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditInput;
