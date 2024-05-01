import React from "react";
import styles from "./TableWorkload.module.scss";

function InputCheckbox(props) {
  return (
    <>
      {props.th ? (
        <th
          style={{ backgroundColor: props.bgColor }}
          className={styles.InputCheckbox}
        >
          <input
            onChange={() => props.clickTr(props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </th>
      ) : (
        <td
          style={{ backgroundColor: props.bgColor }}
          // onClick={(e) => { // При нажатии на инпут функция вызывается 2 раза исправить !
          //   e.stopPropagation();
          // }}
          className={styles.InputCheckbox}
        >
          <input
            onChange={() => props.clickTr(props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </td>
      )}
    </>
  );
}

export default InputCheckbox;
