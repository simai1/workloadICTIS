import React, { useState } from "react";
import styles from "./SamplePoints.module.scss";
import DataContext from "../../context";
import { FilteredSample } from "./Function";

export function SamplePoints(props) {
  const { tabPar, checkPar, basicTabData } = React.useContext(DataContext);
  const [searchText, setSearchText] = useState("");

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
    const checked = checkPar.isAllChecked ? [...filteredData] : [];
    let check = [];
    checked.map((item) => {
      check.push({ value: item, itemKey: props.itemKey });
    });
    checkPar.setIsChecked(check);
    checkPar.setAllChecked(!checkPar.isAllChecked);
    // Фильтруем данные
    const fdfix = FilteredSample(
      basicTabData.workloadDataFix,
      checked,
      props.itemKey
    );
    basicTabData.setFiltredData(fdfix);
  };

  //! при нажатии на Input
  const onChecked = (el) => {
    let checked = [...checkPar.isChecked];
    if (checked.some((item) => item.value === el)) {
      checked = checked.filter((item) => item.value !== el);
    } else {
      checked.push({ value: el, itemKey: props.itemKey });
    }
    checkPar.setIsChecked(checked);
    // Фильтруем данные
    const fdfix = FilteredSample(basicTabData.workloadDataFix, checked);
    basicTabData.setFiltredData(fdfix);
    const allChecked = checked.length === 0;
    checkPar.setAllChecked(allChecked);
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
              checked={checkPar.isAllChecked}
            />
            <p>Все</p>
          </div>
          {filteredData.map((el, index) => {
            return (
              <div key={index} htmlFor={`checkbox-${index}`}>
                <input
                  id={`checkbox-${index}`}
                  type="checkbox"
                  onChange={() => onChecked(el)}
                  checked={
                    !checkPar.isChecked.some((item) => item.value === el)
                  }
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
