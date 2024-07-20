import React, { useEffect, useState } from "react";
import styles from "./TableTeachers.module.scss";
// import DataContext from "../../context";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";

function TableTh(props) {
  // const { checkPar } = React.useContext(DataContext);

  const [sortImg, setSortImg] = useState(0);

  //! открытие модального окна фильтрации столбца
  const clickTh = () => {
    if (props.sampleShow === props.index) {
      props.setSampleShow(null);
    } else {
      const modalData = props.filteredData.map((item) => item[props.item.key]);
      props.setSampleData([...modalData]);
      props.setSampleShow(props.index);
    }
  };

  //! сортируем по колонке в App вызывается useEfferc для обновления массива
  const funSortByColumn = () => {
    let par = "";
    if (props.sortParamByColumn === "") {
      par = `col=${props.item.key}&type=${"asc"}`;
      setSortImg(1);
    } else {
      if (
        props.sortParamByColumn.includes(props.item.key) &&
        props.sortParamByColumn.includes("asc")
      ) {
        par = `col=${props.item.key}&type=${"desc"}`;
        setSortImg(2);
      } else if (
        props.sortParamByColumn.includes(props.item.key) &&
        props.sortParamByColumn.includes("desc")
      ) {
        par = "";
        setSortImg(0);
      } else {
        par = `col=${props.item.key}&type=${"asc"}`;
        setSortImg(1);
      }
    }
    props.setSortParamByColumn(par);
  };

  useEffect(() => {
    if (!props.sortParamByColumn.includes(props.item.key)) {
      setSortImg(0);
    }
  }, [props.sortParamByColumn]);

  return (
    <th name={props.item.key} key={props.item.key} className={styles.fixedTh}>
      <div
        style={
          props.funSpanRow(props.item) === "Институтская нагрузка"
            ? props.funGetStyle(true)
            : props.funGetStyle(false)
        }
      >
        {props.funSpanRow(props.item)}
      </div>
      {props.modal && (
        <SamplePoints
          index={props.index}
          itemKey={props.item.key}
          isSamplePointsData={props.sampleData}
          isAllChecked={props.isAllChecked}
          isChecked={props.isChecked}
          setIsChecked={props.setIsChecked}
          workloadData={props.updatedData}
          setWorkloadDataFix={props.setFilteredData}
          setSpShow={props.setSampleShow}
          sesionName={"isCheckedTeachers"}
        />
      )}

      <div className={styles.th_inner}>
        <div
          onClick={clickTh}
          className={styles.th_title}
          title="Открыть меню фильтрации"
        >
          {props.item.label}
        </div>
        <div className={styles.th_inner_img}>
          {props.item.key !== "id" && (
            <img
              onClick={funSortByColumn}
              className={styles.trSort}
              src={sortImg === 0 ? "./img/=.svg" : "./img/sort.svg"}
              title="Сортировать колонку"
              alt=">"
              style={
                sortImg !== 1
                  ? {
                      transform: "rotate(-180deg)",
                      transition: "all 0.2s ease",
                    }
                  : { transition: "all 0.2s ease" }
              }
            ></img>
          )}
          {props.isChecked.find((item) => item.itemKey === props.item.key) && (
            <img
              src="./img/filterColumn.svg"
              alt=">"
              title="К колонке применен фильтр"
            ></img>
          )}
        </div>
      </div>
    </th>
  );
}

export default TableTh;
