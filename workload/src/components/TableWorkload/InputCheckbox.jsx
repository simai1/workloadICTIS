import React from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
function InputCheckbox(props) {
  const { tabPar } = React.useContext(DataContext);
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
          {tabPar.fastenedData.includes(props.itid) && (
            <img
              className={styles.fastenedImg}
              src="./img/fastened.svg"
              alt="fastened"
            ></img>
          )}

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
