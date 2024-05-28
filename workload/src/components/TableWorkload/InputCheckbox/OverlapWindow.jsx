//! окно перекрытия блокированных разделенных, соедененных, удаленных строк

import DataContext from "../../../context";
import styles from "./../TableWorkload.module.scss";
import React from "react";
import {
  deleteWorkload,
  splitWorkload,
} from "../../../api/services/ApiRequest";
import { deleteItemBuffer } from "../Function";

function OverlapWindow(props) {
  const { tabPar, appData, basicTabData } = React.useContext(DataContext);

  const cancelChanges = () => {
    console.log("отмена", props.getConfirmation.type);
    if (props.getConfirmation.type === 1) {
      appData.setBufferAction(
        deleteItemBuffer(
          [...appData.bufferAction],
          props.itid,
          "deleteWorkload"
        ).buffer
      );
      let changed = { ...tabPar.changedData };
      changed.deleted = changed.deleted.filter((item) => item !== props.itid);
      tabPar.setChangedData(changed);
    } else if (props.getConfirmation.type === 2) {
      const funData = deleteItemBuffer(
        [...appData.bufferAction],
        props.itid.slice(0, -1),
        "splitWorkload"
      );
      appData.setBufferAction(funData.buffer);
      const ind = basicTabData.workloadDataFix.findIndex(
        (el) => el.id === props.itid
      );
      console.log("ind", ind, "prev", funData.item.prevState[0]);
      let data = basicTabData.workloadDataFix.filter(
        (item) => item.id.slice(0, -1) !== props.itid.slice(0, -1)
      );
      data[ind] = funData.item.prevState[0];
      basicTabData.setWorkloadDataFix(data);
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
      deleteWorkload({ ids: [props.itid] }).then(() => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "deleteWorkload"
          ).buffer
        );
        basicTabData.setWorkloadDataFix(
          basicTabData.workloadDataFix.filter((item) => item.id !== props.itid)
        );
        let changed = { ...tabPar.changedData };
        changed.deleted = changed.deleted.filter((item) => item !== props.itid);
        tabPar.setChangedData(changed);
      });
    } else if (props.getConfirmation.type === 2) {
      let data = null;
      appData.bufferAction.map((item) => {
        if (
          item.request === "splitWorkload" &&
          item.data.ids.find((el) => el === props.itid.slice(0, -1))
        ) {
          data = { ids: [props.itid.slice(0, -1)], n: item.data.n };
        }
      });
      splitWorkload(data).then(() => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "splitWorkload"
          ).buffer
        );
        let changed = { ...tabPar.changedData };
        changed.splitjoin = changed.splitjoin.filter(
          (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
        );
        console.log(changed);

        tabPar.setChangedData(changed);
        basicTabData.updateAlldata();
      });
    }
  };

  return (
    <div className={styles.OverlapWindow}>
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
    </div>
  );
}

export default OverlapWindow;
