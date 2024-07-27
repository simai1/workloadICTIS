//! окно перекрытия блокированных разделенных, соедененных, удаленных строк

import DataContext from "../../../context";
import styles from "./../UniversalTable.module.scss";
import React from "react";
import {
  DeleteMaterials,
  apiSplitByHours,
  deleteWorkload,
  joinAddWorkloads,
  joinWorkloads,
  splitWorkload,
} from "../../../api/services/ApiRequest";
import { deleteItemBuffer } from "../Function";

function OverlapWindow(props) {
  const { tabPar, appData, basicTabData } = React.useContext(DataContext);
  const cancelChanges = () => {
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
      //! отмена разделения
      const dat = { ...props.getConfirmation.data }; //! данные буффера для разделенной
      let buff = [...appData.bufferAction];
      console.log("dat", dat);

      //! получаем обьект из буффера так как в массиве могут быть данные нескольких строк
      let itemBuff = buff.find((el) =>
        el.data.ids.some((e) => e === dat.data.ids[0])
      );
      //! индекс из буффер нашего обьекта
      let index = buff.findIndex((el) =>
        el.data.ids.some((e) => e === dat.data.ids[0])
      );

      //! корректируем data из буффера
      let bd = { ...itemBuff.data };
      const bdids = bd.ids.filter((el) => dat.data.ids[0] !== el);
      const newbd = {
        ids: bdids,
        n: bd.n,
      };
      let bnids = [...itemBuff.newIds];
      const bnidsNew = bnids.filter((el) => !dat.newIds.some((e) => e === el));
      const newState = itemBuff.newState.filter(
        (el) => el.id !== dat.newState.id
      );
      let ps = itemBuff.prevState.filter((el) => el.id !== dat.prevState.id);

      let buffDat = {
        id: dat.id,
        data: newbd,
        newIds: bnidsNew,
        newState: newState,
        prevState: ps,
        request: "splitWorkload",
      };
      buff[index] = buffDat;

      //! если ids пустой значит убираем данный обьект из буффера
      appData.setBufferAction(
        [...buff].filter((el) => el.data?.ids?.length > 0)
      );
      let wdf = [...props.tabDat.filtredData];
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

      props.tabDat.setFiltredData(wdfNew);

      let changed = { ...tabPar.changedData };
      changed.split = changed.split.filter(
        (item) => !dat.newIds.some((el) => el === item)
      );
      tabPar.setChangedData(changed);
    } else if (props.getConfirmation.type === 3) {
      console.log("props.getConfirmation", props.getConfirmation);
      //! отмена обьединения
      const bd = props.getConfirmation.data;
      // удаляем нагрузку которую обьеденили
      const dataTable = [...props.tabDat.filtredData].filter(
        (item) => !bd.prevState.some((el) => el.id === item.id)
      );
      // сохраняем индекс удаленного элемента
      const deletedIndex = props.tabDat.filtredData.findIndex((item) =>
        bd.prevState.some((el) => el.id === item.id)
      );
      const newArray = [...dataTable];
      newArray.splice(deletedIndex, 0, ...bd.prevState);
      props.tabDat.setFiltredData(newArray);
      // убираем заблокированные элементы
      let cd = { ...tabPar.changedData };
      let cdJoin = [...cd.join];
      cdJoin = cdJoin.filter(
        (el) => !bd.prevState.some((item) => item.id === el)
      );
      cd.join = cdJoin;
      tabPar.setChangedData(cd);
      appData.setBufferAction((prevItems) => prevItems.slice(1));
    } else if (props.getConfirmation.type === 4) {
      //! если разделили по часам применяем эту отмену
      const dat = { ...props.getConfirmation.data };
      let updatedData = [...props.tabDat.setFiltredData];
      updatedData = updatedData
        .map((item) => {
          const ind = dat.newIds.findIndex((e) => e === item.id);
          if (ind === -1) {
            return item;
          } else if (ind === 0) {
            return dat.prevState[0];
          }
        })
        .filter((el) => el !== undefined);
      console.log(updatedData);

      props.tabDat.setFiltredData(updatedData);

      let changed = { ...tabPar.changedData };
      changed.split = changed.split.filter(
        (item) => !dat.newIds.some((el) => el === item)
      );
      tabPar.setChangedData(changed);
      //! удалим из буфера
      let buff = [...appData.bufferAction];
      buff = buff
        .filter((el) => {
          if (
            el.request === "splitByHours" &&
            el.data.ids[0] === dat.data.ids[0]
          ) {
            return null;
          } else return el;
        })
        .filter((el) => el !== null);
      appData.setBufferAction([...buff]);
    }
  };

  const confirmChanges = () => {
    //! удаляем нагрузку

    if (props.getConfirmation.type === 1) {
      if (appData.selectedComponent === "ScheduleMaterials") {
        console.log(props.itid);
        DeleteMaterials(props.itid).then((resp) => {
          if (resp?.status === 200) {
            appData.setBufferAction(
              deleteItemBuffer(
                [...appData.bufferAction],
                props.itid,
                "deleteWorkload"
              ).buffer
            );
            props.tabDat.setFiltredData(
              props.tabDat.filtredData.filter((item) => item.id !== props.itid)
            );
            props.tabDat.setTableData(
              props.tabDat.tableData.filter((item) => item.id !== props.itid)
            );
            let changed = { ...tabPar.changedData };
            changed.deleted = changed.deleted.filter(
              (item) => item !== props.itid
            );
            tabPar.setChangedData(changed);
            appData.setDataUpdated(true);
          } else {
            appData.seterrorPopUp(true);
            appData.setPopupErrorText("Возникала ошибка на сервере");
          }
        });
      } else {
        deleteWorkload({ ids: [props.itid] }).then(() => {
          appData.setBufferAction(
            deleteItemBuffer(
              [...appData.bufferAction],
              props.itid,
              "deleteWorkload"
            ).buffer
          );
          props.tabDat.setFiltredData(
            props.tabDat.filtredData.filter((item) => item.id !== props.itid)
          );
          props.tabDat.setTableData(
            props.tabDat.tableData.filter((item) => item.id !== props.itid)
          );
          let changed = { ...tabPar.changedData };
          changed.deleted = changed.deleted.filter(
            (item) => item !== props.itid
          );
          tabPar.setChangedData(changed);
        });
      }
    } else if (props.getConfirmation.type === 2) {
      //! подтверждение разделить нагрузку по подгруппам
      console.log("props.getConfirmation", props.getConfirmation);
      // собираем данные для запроса
      const obj = props.getConfirmation.data;
      const data = {
        workloads: obj.hoursData,
      };

      splitWorkload(data).then((req) => {
        // убираем из буфера
        if (req?.status === 200) {
          appData.setBufferAction(
            deleteItemBuffer(
              [...appData.bufferAction],
              props.itid,
              "splitWorkload"
            ).buffer
          );
          // убираем из блокированных
          let changed = { ...tabPar.changedData };
          changed.split = changed.split.filter(
            (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
          );
          tabPar.setChangedData(changed);
          // обновляем таблицу согласно кафедре
          props.tabDat.funUpdateTabDat(
            basicTabData.tableDepartment.find(
              (el) => el.name === basicTabData.nameKaf
            )?.id
          );
        } else {
          appData.seterrorPopUp(true);
          appData.setPopupErrorText("Возникала ошибка на сервере");
        }
      });
    } else if (props.getConfirmation.type === 3) {
      //! обьединение соединенеи строк
      console.log("props.getConfirmation", props.getConfirmation);
      if (props.getConfirmation.data.action === "?type=add") {
        joinAddWorkloads(props.getConfirmation.data.data).then((res) => {
          if (res?.status === 200) {
            const ab = [...appData.bufferAction];
            const abfix = ab
              .filter((item) => {
                if (
                  item.request === "joinWorkloads" &&
                  item.newState.id === props.itid
                ) {
                  return null;
                } else {
                  return item;
                }
              })
              .filter((el) => el !== null);

            appData.setBufferAction(abfix);

            let changed = { ...tabPar.changedData };
            changed.join = changed.join.filter((item) => item !== props.itid);
            tabPar.setChangedData(changed);
            props.tabDat.funUpdateTabDat(
              basicTabData.tableDepartment.find(
                (el) => el.name === basicTabData.nameKaf
              )?.id
            );
          } else {
            appData.seterrorPopUp(true);
            appData.setPopupErrorText("Возникала ошибка на сервере");
          }
        });
      } else {
        joinWorkloads(
          props.getConfirmation.data.data,
          props.getConfirmation.data.action
        ).then((res) => {
          if (res.status === 200) {
            const ab = [...appData.bufferAction];
            const abfix = ab
              .filter((item) => {
                if (
                  item.request === "joinWorkloads" &&
                  item.newState.id === props.itid
                ) {
                  return null;
                } else {
                  return item;
                }
              })
              .filter((el) => el !== null);

            appData.setBufferAction(abfix);

            let changed = { ...tabPar.changedData };
            changed.join = changed.join.filter((item) => item !== props.itid);
            tabPar.setChangedData(changed);
            props.tabDat.funUpdateTabDat(
              basicTabData.tableDepartment.find(
                (el) => el.name === basicTabData.nameKaf
              )?.id
            );
          } else {
            appData.seterrorPopUp(true);
            appData.setPopupErrorText("Возникала ошибка на сервере");
          }
        });
      }
    } else if (props.getConfirmation.type === 4) {
      //! подтверждение разделения по часам
      const obj = props.getConfirmation.data;
      // собираем данные для запроса
      const data = {
        workloadId: obj.workloadId,
        workloadsData: obj.data.hoursData,
      };
      // запрос на разделение
      apiSplitByHours(data).then((req) => {
        console.log(req);
        if (req?.status === 200) {
          //! убираем обьект из буффера
          appData.setBufferAction(
            deleteItemBuffer(
              [...appData.bufferAction],
              props.itid,
              "splitByHours"
            ).buffer
          );
          //! убираем из блокированных
          let changed = { ...tabPar.changedData };
          changed.split = changed.split.filter(
            (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
          );
          tabPar.setChangedData(changed);
          //! обновляем таблицу
          props.tabDat.funUpdateTabDat(
            basicTabData.tableDepartment.find(
              (el) => el.name === basicTabData.nameKaf
            )?.id
          );
        }
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
