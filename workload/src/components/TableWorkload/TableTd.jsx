import React, { useState } from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";

function TableTd(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);
  const [onTextArea, setOnTextArea] = useState(false);
  const [textareaTd, setTextareaTd] = useState(props.item[props.itemKey.key]);

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
      //! проеряем роль
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 8) &&
      (props.itemKey.key === "numberOfStudents" ||
        props.itemKey.key === "hours")
    ) {
      return onTextArea;
    }
  };

  const onChangeTextareaTd = (e) => {
    // console.log(e.target.value);
    setTextareaTd(e.target.value);
  };

  //! при двойном клике на td открываем textarea
  const funDubleClick = () => {
    setOnTextArea(!onTextArea);
  };

  //! при клтике отмена техтаре
  const crossClick = (e) => {
    setOnTextArea(false);
  };

  //! при клике применить изменения textArea
  const onClickButton = () => {
    let parsedValue = parseFloat(textareaTd);
    let numberValue = isNaN(parsedValue) ? textareaTd : parsedValue;
    //! параметры запроса на изменение данных
    const data = {
      id: props.item.id,
      key: props.itemKey.key,
      value: numberValue,
    };

    if (numberValue) {
      const updatedArray = basicTabData.workloadDataFix.map((item) => {
        if (item.id === props.item.id) {
          return { ...item, [props.itemKey.key]: numberValue };
        }
        return item;
      });
      basicTabData.setWorkloadDataFix(updatedArray);
      //! буфер
      appData.setBufferAction([
        {
          request: "workloadUpdata",
          data: data,
          prevState: props.item[props.itemKey.key],
        },
        ...appData.bufferAction,
      ]);
      let cd = { ...tabPar.changedData };
      cd[props.itemKey.key] = [...cd[props.itemKey.key], props.item.id];
      tabPar.setChangedData(cd);
    }

    setTextareaTd(null);
    setOnTextArea(false);
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
        onDoubleClick={funDubleClick}
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
              <SvgChackmark
                onClick={onClickButton}
                className={styles.SvgChackmark_green}
              />
              <SvgCross onClick={crossClick} />
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
