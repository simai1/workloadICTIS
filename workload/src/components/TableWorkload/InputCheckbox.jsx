import React from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import { deleteWorkload } from "../../api/services/ApiRequest";
import { deleteItemBuffer } from "./Function";
function InputCheckbox(props) {
  const { tabPar, appData } = React.useContext(DataContext);

  const cancelChanges = () => {
    console.log("отмена");
    appData.setBufferAction(
      deleteItemBuffer([...appData.bufferAction], props.itid)
    );
    let changed = { ...tabPar.changedData };
    changed.deleted = changed.deleted.filter((item) => item !== props.itid);
    tabPar.setChangedData(changed);
  };
  const confirmChanges = () => {
    console.log("подтвердить");
    deleteWorkload([props.itid]).then(() => {
      appData.setBufferAction(
        deleteItemBuffer([...appData.bufferAction], props.itid)
      );
      let changed = { ...tabPar.changedData };
      changed.deleted = changed.deleted.filter((item) => item !== props.itid);
      tabPar.setChangedData(changed);
    });
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
