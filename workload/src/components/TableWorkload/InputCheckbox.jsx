import React from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import { deleteWorkload } from "../../api/services/ApiRequest";
import { deleteItemBuffer } from "./Function";
function InputCheckbox(props) {
  const { tabPar, appData } = React.useContext(DataContext);

  const cancelChanges = () => {
    console.log("отмена", props.getConfirmation.type);
    if (props.getConfirmation.type === 1) {
      appData.setBufferAction(
        deleteItemBuffer(
          [...appData.bufferAction],
          props.itid,
          "deleteWorkload"
        )
      );
      let changed = { ...tabPar.changedData };
      changed.deleted = changed.deleted.filter((item) => item !== props.itid);
      tabPar.setChangedData(changed);
    } else if (props.getConfirmation.type === 2) {
      appData.setBufferAction(
        deleteItemBuffer(
          [...appData.bufferAction],
          props.itid.slice(0, -1),
          "splitWorkload"
        )
      );
      let changed = { ...tabPar.changedData };
      console.log("changed", changed.splitjoin);
      changed.splitjoin = changed.splitjoin.filter(
        (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
      );
      tabPar.setChangedData(changed);
      console.log("changed", changed.splitjoin, "id", props.itid.slice(0, -1));
    }
  };
  const confirmChanges = () => {
    console.log("подтвердить", props.getConfirmation.type);
    if (props.getConfirmation.type === 1) {
      deleteWorkload([props.itid]).then(() => {
        appData.setBufferAction(
          deleteItemBuffer([...appData.bufferAction], props.itid)
        );
        let changed = { ...tabPar.changedData };
        changed.deleted = changed.deleted.filter((item) => item !== props.itid);
        tabPar.setChangedData(changed);
      });
    } else if (props.getConfirmation.type === 2) {
    }
  };

  return (
    <>
      {props.th ? (
        <th
          style={{ backgroundColor: props.bgColor, zIndex: "31" }}
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
          // onClick={(e) => { //! При нажатии на инпут функция вызывается 2 раза исправить !
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
          {props.getConfirmation.blocked && (
            <div
              style={{
                height: props.getConfirmation.height,
                top: props.getConfirmation.top,
              }}
              key={"confirmation"}
              className={styles.confirmation}
            >
              <button className={styles.btn_left} onClick={cancelChanges}>
                Отменить
              </button>
              <button className={styles.btn_right} onClick={confirmChanges}>
                Подтвердить
              </button>
            </div>
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
