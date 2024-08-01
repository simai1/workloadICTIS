import React, { useEffect, useState } from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";

function TableTh(props) {
  const { tabPar, basicTabData, checkPar, appData } =
    React.useContext(DataContext);

  const [sortImg, setSortImg] = useState(0);

  //! открытие модального окна фильтрации столбца
  const clickTh = () => {
    if (tabPar.spShow === props.index) {
      tabPar.setSpShow(null);
    } else {
      const modalData = basicTabData.workloadDataFix.map(
        (item) => item[props.item.key]
      );
      tabPar.setSamplePointsData([...modalData]);
      tabPar.setSpShow(props.index);
    }
  };

  //! сортируем по колонке в App вызывается useEfferc для обновления массива
  const funSortByColumn = () => {
    let par = "";
    if (appData.sortParamByColumn === "") {
      par = `col=${props.item.key}&type=${"asc"}`;
      setSortImg(2);
    } else {
      if (
        appData.sortParamByColumn.includes(props.item.key) &&
        appData.sortParamByColumn.includes("asc")
      ) {
        par = `col=${props.item.key}&type=${"desc"}`;
        setSortImg(1);
      } else if (
        appData.sortParamByColumn.includes(props.item.key) &&
        appData.sortParamByColumn.includes("desc")
      ) {
        par = "";
        setSortImg(0);
      } else {
        par = `col=${props.item.key}&type=${"asc"}`;
        setSortImg(2);
      }
    }
    appData.setSortParamByColumn(par);

    basicTabData.funUpdateTable(
      basicTabData?.tableDepartment.find(
        (el) => el.name === basicTabData?.nameKaf
      )?.id,
      par
    );
  };

  useEffect(() => {
    if (!appData.sortParamByColumn.includes(props.item.key)) {
      setSortImg(0);
    }
  }, [appData.sortParamByColumn]);

  return (
    <th name={props.item.key} key={props.item.key}>
      {props.modal && (
        <SamplePoints
          index={props.index}
          itemKey={props.item.key}
          isSamplePointsData={tabPar.isSamplePointsData}
          isAllChecked={checkPar.isAllChecked}
          isChecked={checkPar.isChecked}
          setIsChecked={checkPar.setIsChecked}
          workloadData={tabPar.UpdateWorkloadForBoofer(
            basicTabData.workloadData
          )}
          // workloadDataFix={basicTabData.workloadDataFix}
          setWorkloadDataFix={basicTabData.setWorkloadDataFix}
          setSpShow={tabPar.setSpShow}
          sesionName={`isCheckedWorkload${basicTabData.nameKaf}`}
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
          {props.item.key !== "id" && props.item.key !== "educator" && (
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
                      transform: "rotate(-180deg)",
                    }
                  : { transition: "all 0.2s ease" }
              }
            ></img>
          )}
          {checkPar.isChecked.find(
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
