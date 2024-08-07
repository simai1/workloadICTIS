import React, { useEffect, useState } from "react";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";

function TableTh(props) {
  const { tabPar, checkPar, appData } = React.useContext(DataContext);

  const [sortImg, setSortImg] = useState(0);

  //! открытие модального окна фильтрации столбца
  const clickTh = () => {
    if (tabPar.spShow === props.index) {
      tabPar.setSpShow(null);
    } else {
      let modalData = props.tabDat.tableDataFix.map(
        (item) => item[props.item.key]
      );
      if (checkPar.isChecked) {
        modalData = [...modalData, ...checkPar.isChecked.map((el) => el.value)];
      }
      tabPar.setSamplePointsData([...modalData]);
      tabPar.setSpShow(props.index);
    }
  };

  //! сортируем по колонке в App вызывается useEfferc для обновления массива
  const funSortByColumn = () => {
    let par = "";
    if (props.tabDat.sortParamByColumn === "") {
      par = `col=${props.item.key}&type=${"asc"}`;
      setSortImg(1);
    } else {
      if (
        props.tabDat.sortParamByColumn?.includes(props.item.key) &&
        props.tabDat.sortParamByColumn?.includes("asc")
      ) {
        par = `col=${props.item.key}&type=${"desc"}`;
        setSortImg(2);
      } else if (
        props.tabDat.sortParamByColumn?.includes(props.item.key) &&
        props.tabDat.sortParamByColumn?.includes("desc")
      ) {
        par = "";
        setSortImg(0);
      } else {
        par = `col=${props.item.key}&type=${"asc"}`;
        setSortImg(1);
      }
    }
    props.tabDat.setSortParamByColumn(par);
  };

  useEffect(() => {
    if (!props.tabDat.sortParamByColumn?.includes(props.item.key)) {
      setSortImg(0);
    }
  }, [props.tabDat.sortParamByColumn]);
  return (
    <th
      name={props.item.key}
      key={props.item.key}
      id={
        appData.selectedComponent === "ScheduleMaterials" &&
        (props.item.key === "notes" ||
          props.item.key === "groups" ||
          props.item.key === "audiences")
          ? styles.fihedTh
          : null
      }
    >
      {props.modal && (
        <SamplePoints
          index={props.index}
          itemKey={props.item.key}
          isSamplePointsData={tabPar.isSamplePointsData}
          isAllChecked={checkPar.isAllChecked}
          isChecked={checkPar.isChecked}
          setIsChecked={checkPar.setIsChecked}
          workloadData={props.tabDat.tableData}
          setWorkloadDataFix={props.tabDat.setTableDataFix}
          setSpShow={tabPar.setSpShow}
          sesionName={props.tabDat.ssIsChecked}
        />
      )}

      <div className={styles.th_inner}>
        {(props.item.key === "notes" ||
          props.item.key === "groups" ||
          props.item.key === "audiences") &&
          appData.selectedComponent === "ScheduleMaterials" && (
            <img
              src="./img/Edit.svg"
              className={styles.topRightCorner}
              title="Данная колонка редактируется (Двойной клик по полю колонки)"
            />
          )}
        <div
          onClick={clickTh}
          className={styles.th_title}
          title="Открыть меню фильтрации"
        >
          {props.item.label}
        </div>

        <div className={styles.th_inner_img}>
          {props.tabDat.isSorted &&
            props.item.key !== "id" &&
            props.item.key !== "educator" && (
              <img
                onClick={funSortByColumn}
                className={styles.trSort}
                src={sortImg === 0 ? "./img/=.svg" : "./img/sort.svg"}
                title="Сортировать колонку"
                alt=">"
                style={
                  sortImg !== 1
                    ? {
                        transition: "all 0.2s ease",
                      }
                    : {
                        transition: "all 0.2s ease",
                        transform: "rotate(-180deg)",
                      }
                }
              ></img>
            )}
          {checkPar.isChecked &&
            checkPar.isChecked.find(
              (item) => item.itemKey === props.item.key
            ) && (
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
