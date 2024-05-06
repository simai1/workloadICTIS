import React, { useRef } from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";

function TableTd(props) {
  const { tabPar } = React.useContext(DataContext);
  //определение каласса td
  const getClassNameTr = () => {
    const changedData = tabPar.changedData[props.itemKey.key];
    if (!changedData) return null;
    return changedData.find((el) => el === props.item.id)
      ? styles.tdChanged
      : null;
  };

  return (
    <td
      name={props.itemKey.key}
      key={props.item.id + "_" + props.itemKey.key}
      className={getClassNameTr()}
    >
      <div
        key={props.item.id + "div" + props.itemKey.key}
        className={styles.tdInner}
      >
        {props.itemKey.key !== "id"
          ? props.item[props.itemKey.key] === null
            ? "0"
            : props.item[props.itemKey.key]
          : props.index + 1}
      </div>
    </td>
  );
}

export default TableTd;
