import React, { useState } from "react";
import styles from "./SamplePoints.module.scss";
export function SamplePoints(props) {
  const [isChecked, setChecked] = useState([]);
  const [isAllChecked, setAllChecked] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };
  const filteredData = props.isSamplePointsData.filter((el) =>
    el.toLowerCase().includes(searchText.toLowerCase())
  );

  const onAllChecked = () => {
    isAllChecked ? setChecked(filteredData) : setChecked([]);
    setAllChecked(!isAllChecked);
  };

  const onChecked = (el, index) => {
    if (isChecked.includes(el)) {
      // Если значение уже существует, удаляем его из массива
      setChecked((prevChecked) => prevChecked.filter((item) => item !== el));
      setAllChecked(true);
    } else {
      // Если значение уникально, добавляем его в массив
      setChecked((prevChecked) => [...prevChecked, el]);
    }
    console.log(el, isChecked);
  };

  return (
    <main
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
          <div>
            <input
              type="checkbox"
              onClick={onAllChecked}
              checked={!isAllChecked}
            />{" "}
            <p>Все</p>
          </div>
          {filteredData.map((el, index) => {
            return (
              <div key={index}>
                <input
                  type="checkbox"
                  onClick={() => onChecked(el, index)}
                  checked={isChecked.includes(el)}
                />
                <p>{el}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
