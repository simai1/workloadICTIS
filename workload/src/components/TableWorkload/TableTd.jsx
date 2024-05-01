import React, { useRef } from "react";
import styles from "./TableWorkload.module.scss";

function TableTd(props) {
  const refTd = useRef(null);
  return (
    <td
      ref={refTd}
      name={props.itemKey.key}
      key={props.item.id + "_" + props.itemKey.key}
    >
      <div
        key={props.item.id + "div" + props.itemKey.key}
        className={styles.tdInner}
      >
        {props.itemKey.key !== "id"
          ? props.item[props.itemKey.key]
          : props.index + 1}
      </div>
    </td>
  );
}

export default TableTd;
