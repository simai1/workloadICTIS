import React, { useState, useRef, useEffect } from "react";
import styles from "./SamplePoints.module.scss";
import DataContext from "../../context";
import { FilteredSample } from "./Function";
export function SamplePoints(props) {
  const { tabPar } = React.useContext(DataContext);
  const [isAllChecked, setAllChecked] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isChecked, setIsChecked] = useState([]);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = [
    ...new Set(
      tabPar.isSamplePointsData.filter((el) => {
        // Преобразовываем el в строку, если он является числом
        const elString = typeof el === "number" ? el.toString() : el;
        return elString?.toLowerCase().includes(searchText?.toLowerCase());
      })
    ),
  ];

  //! при нажатии на Input All
  const onAllChecked = () => {
    const checked = isAllChecked ? [...filteredData] : [];
    setIsChecked(checked);
    setAllChecked(!isAllChecked);
    // Фильтруем данные
    const fdfix = FilteredSample(
      tabPar.workloadDataFix,
      checked,
      props.itemKey
    );
    tabPar.setFiltredData(fdfix);
  };

  //! при нажатии на Input
  const onChecked = (el) => {
    const checked = [...isChecked];
    const index = checked.indexOf(el);
    index !== -1 ? checked.splice(index, 1) : checked.push(el);
    setIsChecked(checked);
    // Фильтруем данные
    const fdfix = FilteredSample(
      tabPar.workloadDataFix,
      checked,
      props.itemKey
    );
    tabPar.setFiltredData(fdfix);
    const allChecked = checked.length === 0;
    setAllChecked(allChecked);
  };

  return (
    <main className={styles.SamplePoints}>
      <div className={styles.container}>
        <input
          className={styles.search}
          type="text"
          placeholder="Поиск"
          value={searchText}
          onChange={handleInputChange}
        />
        <div className={styles.points}>
          <div htmlFor="allCheckbox">
            <input
              id="allCheckbox"
              type="checkbox"
              onChange={onAllChecked}
              checked={isAllChecked}
            />
            <p>Все</p>
          </div>
          {filteredData.map((el, index) => {
            return (
              <div key={index} htmlFor={`checkbox-${index}`}>
                <input
                  id={`checkbox-${index}`}
                  type="checkbox"
                  onChange={() => onChecked(el, index)}
                  checked={!isChecked.includes(el)}
                />
                <p>{props.index === 0 ? index + 1 : el}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
