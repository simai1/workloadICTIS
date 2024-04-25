import React, { useState} from "react";
import styles from "./SamplePoints.module.scss";
export function SamplePoints(props) {
  const [isAllChecked, setAllChecked] = useState(true);
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = props.isSamplePointsData.td.filter((el) => {
    // Преобразовываем el в строку, если он является числом
    const elString = typeof el === "number" ? el.toString() : el;
    return elString?.toLowerCase().includes(searchText?.toLowerCase());
  });

  const onAllChecked = () => {
    isAllChecked ? props.setChecked(filteredData) : props.setChecked([]);
    setAllChecked(!isAllChecked);
  };

  const onChecked = (el, index) => {
    let len = props.isChecked.length;
    if (props.isChecked.includes(el)) {
      // Если значение уже существует, удаляем его из массива
      props.setChecked((prevChecked) =>
        prevChecked.filter((item) => item !== el)
      );
      len = len - 1;
    } else {
      // Если значение уникально, добавляем его в массив
      props.setChecked((prevChecked) => [...prevChecked, el]);
      len = len + 1;
    }

    if (len === 0) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  };

  return (
    <main
      ref={props.refSP}
      className={styles.SamplePoints}
      style={{
        top: props.positionFigth.y,
        left: props.positionFigth.x,
      }}
    >
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
                  checked={!props.isChecked.includes(el)}
                />
                <p>
                  {props.isSamplePointsData.keyTd === "id" ? index + 1 : el}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
