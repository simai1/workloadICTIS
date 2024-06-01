//! окно перекрытия блокированных разделенных, соедененных, удаленных строк

import DataContext from "../../../context";
import styles from "./../TableWorkload.module.scss";
import React from "react";
import {
  deleteWorkload,
  joinWorkloads,
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
      const dat = { ...props.getConfirmation.data };
      console.log("dat", dat);

      let buff = [...appData.bufferAction];
      let itemBuff = buff.find((el) => el.id === dat.id);
      let index = buff.findIndex((el) => el.id === dat.id);
      let bd = { ...itemBuff.data };
      const bdids = bd.ids.filter((el) => !dat.data.ids.some((e) => e === el));
      const newbd = {
        ids: bdids,
        n: bd.n,
      };
      let bnids = [...itemBuff.newIds];
      const bnidsNew = bnids.filter((el) => !dat.newIds.some((e) => e === el));
      let ps = itemBuff.prevState.filter((el) => el.id !== dat.prevState.id);
      let buffDat = {
        id: dat.id,
        data: newbd,
        newIds: bnidsNew,
        prevState: ps,
        request: "splitWorkload",
      };
      buff[index] = buffDat;
      appData.setBufferAction([...buff]);
      let wdf = [...basicTabData.workloadDataFix];
      console.log(wdf);

      let datMap = { ...dat };
      let f = true;
      const wdfNew = wdf
        .map((item) => {
          if (datMap.newIds.some((el) => el === item.id)) {
            if (f) {
              f = false;
              return datMap.prevState[0];
            }
          } else return item;
        })
        .filter((el) => el !== undefined);

      basicTabData.setWorkloadDataFix(wdfNew);

      let changed = { ...tabPar.changedData };
      console.log("changed", changed.split);
      changed.split = changed.split.filter(
        (item) => !dat.newIds.some((el) => el === item)
      );
      console.log("changed", changed.split);
      tabPar.setChangedData(changed);

      // const funData = deleteItemBuffer(
      //   [...appData.bufferAction],
      //   props.itid.slice(0, -1),
      //   "splitWorkload"
      // );
      // appData.setBufferAction(funData.buffer);
      // const ind = basicTabData.workloadDataFix.findIndex(
      //   (el) => el.id === props.itid
      // );

      // console.log("ind", ind, "prev", funData.item.prevState[0]);
      // let data = basicTabData.workloadDataFix.filter(
      //   (item) => item.id.slice(0, -1) !== props.itid.slice(0, -1)
      // );
      // data = [
      //   ...data.slice(0, ind),
      //   funData.item.prevState[0],
      //   ...data.slice(ind),
      // ];
      // data[ind] = funData.item.prevState[0];

      // basicTabData.setWorkloadDataFix(data);
      // let changed = { ...tabPar.changedData };
      // console.log("changed", changed.split);
      // changed.split = changed.split.filter(
      //   (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
      // );
      // tabPar.setChangedData(changed);
    } else if (props.getConfirmation.type === 3) {
      const funData = deleteItemBuffer(
        [...appData.bufferAction],
        props.itid.slice(0, -1),
        "joinWorkload"
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
      console.log("changed", changed.join);
      changed.join = changed.join.filter(
        (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
      );
      tabPar.setChangedData(changed);
      console.log("changed", changed.join, "id", props.itid.slice(0, -1));
    }
  };

  const confirmChanges = () => {
    console.log("подтвердить", props.getConfirmation.type);
    // удаляем нагрузку
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
    }
    // разделяем нагрузку
    else if (props.getConfirmation.type === 2) {
      splitWorkload(props.getConfirmation.data.data).then(() => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "splitWorkload"
          ).buffer
        );
        let changed = { ...tabPar.changedData };
        changed.split = changed.split.filter(
          (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
        );
        console.log(changed);

        tabPar.setChangedData(changed);
        basicTabData.updateAlldata();
      });
    } else if (props.getConfirmation.type === 3) {
      let data = null;
      appData.bufferAction.map((item) => {
        if (
          item.request === "joinWorkload" &&
          item.data.ids.find((el) => el === props.itid)
        ) {
          data = item.data;
        }
      });
      joinWorkloads(data).then(() => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "joinWorkload"
          ).buffer
        );
        let changed = { ...tabPar.changedData };
        changed.join = changed.join.filter((item) => item !== props.itid);
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
