import React, { useRef } from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";

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

  const getTextAreaOn = () => {
    if (
      props.itemKey.key === "numberOfStudents" ||
      props.itemKey.key === "hours"
    ) {
      return true;
    }
  };

  const onChangeTextareaTd = (e) => {
    console.log(e.target.value);
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
        {getTextAreaOn() ? (
          <div>
            <textarea
              defaultValue={props.item[props.itemKey.key]}
              onChange={onChangeTextareaTd}
              className={styles.textarea}
              type="text"
            ></textarea>
            <div className={styles.svg_textarea}>
              <SvgChackmark className={styles.SvgChackmark_green} />
              <SvgCross />
            </div>
          </div>
        ) : props.itemKey.key !== "id" ? (
          props.item[props.itemKey.key] === null ? (
            "0"
          ) : (
            props.item[props.itemKey.key]
          )
        ) : (
          props.index + 1
        )}
      </div>
    </td>
  );
}

export default TableTd;
