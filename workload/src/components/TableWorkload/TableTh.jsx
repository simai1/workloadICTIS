import React from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";

function TableTh(props) {
  const { tabPar } = React.useContext(DataContext);

  //! открытие модального окна фильтрации столбца
  const clickTh = () => {
    // tabPar.isSamplePointsData;
    const modalData = tabPar.filtredData.map((item) => item[props.item.key]);
    console.log(modalData);
    tabPar.setSamplePointsData([...modalData]);
  };

  return (
    <th key={props.item.key}>
      <div className={styles.th_inner} onClick={clickTh}>
        {props.item.label}
        <img src="./img/th_fight.svg"></img>
      </div>
    </th>
  );
}

export default TableTh;
