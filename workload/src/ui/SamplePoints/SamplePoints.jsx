import React, { useEffect, useRef, useState } from "react";
import styles from "./SamplePoints.module.scss";
// import DataContext from "../../context";
import { FilteredSample } from "./Function";

export function SamplePoints(props) {
  // const { basicTabData } = React.useContext(DataContext);
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  //! чтобы SamplePoints не выходил за пределы таблицы
  const spRef = useRef(null);
  useEffect(() => {
    if (spRef.current) {
      const divRect = spRef.current.getBoundingClientRect();
      if (divRect.x + 300 > window.innerWidth) {
        spRef.current.style.left = "-100px";
      }
    }
  }, [spRef]);

  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (spRef.current && !spRef.current.contains(event.target)) {
        props.setSpShow("");
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const filteredData = [
    ...new Set(
      props.isSamplePointsData.filter((el) => {
        // Преобразовываем el в строку, если он является числом
        const elString = typeof el === "number" ? el.toString() : el;
        return elString?.toLowerCase().includes(searchText?.toLowerCase());
      })
    ),
  ].sort((a, b) => {
    // Сортируем отфильтрованные данные по возрастанию
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  //! при нажатии на Input All
  const onAllChecked = () => {
    console.log("props.isAllChecked", props.isAllChecked);

    let checked = [...props.isChecked];
    if (
      [...props.isChecked].filter((el) => el.itemKey === props.itemKey).length >
      0
    ) {
      checked = checked.filter((el) => el.itemKey !== props.itemKey);
    } else {
      [...props.isSamplePointsData].map((item) => {
        checked.push({ value: item, itemKey: props.itemKey });
      });
    }
    props.setIsChecked(checked);

    sessionStorage.setItem(props.sesionName, JSON.stringify([...checked]));

    // Фильтруем данные
    const fdfix = FilteredSample(props.workloadData, checked, props.itemKey);
    props.setWorkloadDataFix(fdfix);
    console.log("props.isAllChecked", props.isAllChecked);
  };

  //! при нажатии на Input
  const onChecked = (el) => {
    let checked = [...props.isChecked]; // основной массив
    if (checked.some((item) => item.value === el)) {
      checked = checked.filter((item) => item.value !== el);
    } else {
      checked.push({ value: el, itemKey: props.itemKey });
    }
    props.setIsChecked(checked);
    sessionStorage.setItem(props.sesionName, JSON.stringify([...checked]));
    // Фильтруем данные
    const fdfix = FilteredSample(props.workloadData, checked);
    props.setWorkloadDataFix(fdfix);
    console.log("props.isChecked", props.isChecked);
  };

  useEffect(() => {
    console.log("вот я да");
  }, []);

  return (
    <main className={styles.SamplePoints} ref={spRef}>
      <div className={styles.container}>
        <div>
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
                checked={
                  ![...props.isChecked].filter(
                    (el) => el.itemKey === props.itemKey
                  ).length > 0
                }
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
                    checked={!props.isChecked.some((item) => item.value === el)}
                  />
                  <p>{props.index === 0 ? index + 1 : el === "" ? "__" : el}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
