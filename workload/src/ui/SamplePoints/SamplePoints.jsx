import React, { useEffect, useRef, useState } from "react";
import styles from "./SamplePoints.module.scss";
// import DataContext from "../../context";
import { FilteredSample } from "./Function";
import { useDispatch } from "react-redux";
import {
  addAllCheckeds,
  addChecked,
  removeAllCheckeds,
  removeChecked,
} from "../../store/filter/isChecked.slice";

export function SamplePoints(props) {
  const dispatch = useDispatch();
  // const { basicTabData } = React.useContext(DataContext);
  const [searchText, setSearchText] = useState("");
  console.log("sesionName", props.sesionName);
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
    let checked = [...props.isChecked];
    if (
      [...props.isChecked].filter((el) => el.itemKey === props.itemKey).length >
      0
    ) {
      checked = checked.filter((el) => el.itemKey !== props.itemKey);
      // if (props.sesionName.includes("isCheckedSchedule")) {
      dispatch(
        removeAllCheckeds({
          itemKey: props.itemKey,
          tableName: props.sesionName,
        })
      );
      // }
    } else {
      // [...props.isSamplePointsData].map((item) => {
      //   checked.push({ value: item, itemKey: props.itemKey });
      // });
      //! записываем уникальные
      const uniqueItems = new Set();
      [...props.isSamplePointsData].forEach((item) => {
        const itemKey = {
          value: item,
          itemKey: props.itemKey,
        };
        if (!uniqueItems.has(JSON.stringify(itemKey))) {
          uniqueItems.add(JSON.stringify(itemKey));
          checked.push(itemKey);
        }
      });
      console.log("checked", checked);

      dispatch(
        addAllCheckeds({
          checked: checked,
          tableName: props.sesionName,
        })
      );
    }
    const uniqueArray = [
      ...new Set(checked.map((item) => JSON.stringify(item))),
    ].map((item) => JSON.parse(item));
    props.setIsChecked(uniqueArray);
    // if (!props.sesionName.includes("isCheckedSchedule")) {
    //   sessionStorage.setItem(
    //     props.sesionName,
    //     JSON.stringify([...uniqueArray])
    //   );
    // }

    // Фильтруем данные
    const fdfix = FilteredSample(
      props.workloadData,
      uniqueArray,
      props.sesionName
    );
    props.setWorkloadDataFix(fdfix);
  };

  //! при нажатии на Input
  const onChecked = (el) => {
    let checked = [...props.isChecked]; // основной массив
    if (
      checked.some(
        (item) => item.value === el && props.itemKey === item.itemKey
      )
    ) {
      checked = checked.filter((item) => item.value !== el);
      // if (props.sesionName.includes("isCheckedSchedule")) {
      dispatch(
        removeChecked({
          value: el,
          itemKey: props.itemKey,
          tableName: props.sesionName,
        })
      );
      // }
    } else {
      checked.push({ value: el, itemKey: props.itemKey });
      // if (props.sesionName.includes("isCheckedSchedule")) {
      dispatch(
        addChecked({
          value: el,
          itemKey: props.itemKey,
          tableName: props.sesionName,
        })
      );
      // }
    }
    const uniqueArray = [
      ...new Set(checked.map((item) => JSON.stringify(item))),
    ].map((item) => JSON.parse(item));
    props.setIsChecked(uniqueArray);
    // if (!props.sesionName.includes("isCheckedSchedule")) {
    //   sessionStorage.setItem(
    //     props.sesionName,
    //     JSON.stringify([...uniqueArray])
    //   );
    // }
    // Фильтруем данные
    const fdfix = FilteredSample(
      props.workloadData,
      uniqueArray,
      props.sesionName
    );
    props.setWorkloadDataFix(fdfix);
  };

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
                    checked={
                      !props.isChecked.some(
                        (item) =>
                          item.value === el && props.itemKey === item.itemKey
                      )
                    }
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
