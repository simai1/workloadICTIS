import React from "react";
import styles from "./../TableWorkload.module.scss";
import DataContext from "../../../context";
import Comments from "./Comments";
function InputCheckbox(props) {
  const { appData, tabPar, basicTabData } = React.useContext(DataContext);

  const stylesTh = { backgroundColor: props.bgColor, zIndex: "31" };
  const stylesTd = {
    zIndex: `${10 - props.number}`,
    backgroundColor: props.bgColor,
  };

  return (
    <>
      {props.th ? (
        <th style={stylesTh} className={styles.InputCheckbox}>
          <div className={styles.bacground}></div>
          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </th>
      ) : (
        <td style={stylesTd} className={styles.InputCheckbox}>
          <div className={styles.bacground}></div>

          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
          {(props.obj.action === "after" ||
            props.obj.type === "Обновленная") && (
            <>
              <div className={styles.arrow}>
                <img
                  style={{
                    transform:
                      props.obj.type === "Обновленная"
                        ? "rotate(-90deg)"
                        : "none",
                  }}
                  src="img/Arrow.svg"
                  alt=">"
                />

                <div className={styles.type}>{props.obj.type}</div>
              </div>
            </>
          )}
        </td>
      )}
    </>
  );
}

export default InputCheckbox;
