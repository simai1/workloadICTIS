import React from "react";
import styles from "./TableWorkload.module.scss";
// import DataContext from "../../context";

function InputCheckbox(props) {
  // const { tabPar } = React.useContext(DataContext);

  return (
    <td
      style={{ backgroundColor: props.bgColor }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={styles.InputCheckbox}
    >
      <input
        onChange={() => props.clickTr(props.itemId)}
        type="checkbox"
        checked={props.checked}
      ></input>
    </td>
  );
}

export default InputCheckbox;
