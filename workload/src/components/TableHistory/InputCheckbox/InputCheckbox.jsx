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
          <div
            className={styles.bacground}
            // style={
            //   props.obj.number === 0
            //     ? {
            //         borderRight: "3px solid green",
            //         height: `${150 * props.obj.length - 50}px`,
            //       }
            //     : null
            // }
          ></div>

          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
          {props.obj.action === "after" && (
            <>
              <div className={styles.arrow}>
                <img src="img/Arrow.svg" alt=">" />
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
