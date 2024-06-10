import React, { useState } from "react";
import TableTh from "./TableTh";
import TableTd from "./TableTd";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import InputCheckbox from "./InputCheckbox/InputCheckbox";
import { funGetConfirmation, getTextForNotData } from "./Function";

function Table(props) {
  const { tabPar, visibleDataPar, basicTabData, appData } =
    React.useContext(DataContext);
  //! определение верхнего отступа таблицы
  const getTopHeight = () => {
    return visibleDataPar.startData * visibleDataPar.heightTd;
  };

  //! определение нижнего отступа таблицы
  const getBottomHeight = () => {
    return (
      (props.historyData.length -
        visibleDataPar.startData -
        visibleDataPar.visibleData) *
      visibleDataPar.heightTd
    );
  };

  //! клик правой кнопкой мыши на tr
  const clickTrContetx = (itemId) => {
    tabPar.setSelectedTr((prev) => {
      const index = prev.indexOf(itemId);
      if (
        index === -1 &&
        tabPar.selectedTr.length === 0 &&
        !tabPar.contextMenuShow
      ) {
        return [...prev, itemId];
      } else if (tabPar.selectedTr.length === 1 && tabPar.contextMenuShow) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        return [...prev];
      }
    });
  };

  //! при клике на tr выделяем его
  const clickTr = (el, itemId) => {
    // el.stopProgretions();
    const a = el.target.nodeName;
    if (a === "TD" || a === "INPUT") {
      var len = tabPar.selectedTr.length;
      tabPar.setSelectedTr((prev) => {
        const index = prev.indexOf(itemId);
        if (index !== -1) {
          len--;
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        } else {
          len++;
          return [...prev, itemId];
        }
      });
      if (props.historyData.length === len) {
        tabPar.setOnCheckBoxAll(true);
      } else {
        tabPar.setOnCheckBoxAll(false);
      }
    }
  };

  const clickTrAll = () => {
    let ids = [];
    if (basicTabData.filtredData.length !== tabPar.selectedTr.length) {
      basicTabData.filtredData.map((item) => {
        ids.push(item.id);
      });
      tabPar.setOnCheckBoxAll(true);
    } else {
      ids = [];
      tabPar.setOnCheckBoxAll(false);
    }
    tabPar.setSelectedTr(ids);
  };

  //определение каласса tr
  const getClassNameTr = (itemss) => {
    const itemId = itemss.value.id;
    let classText = null;
    classText = tabPar.selectedTr?.includes(itemId)
      ? `${styles.selectedTr}`
      : null;
    const item = tabPar.coloredData?.find((el) => el.workloadId === itemId);
    const colored = item ? `colored${item.color}` : null;
    classText = item ? `${classText} ${styles[colored]}` : classText;
    classText = tabPar.changedData.deleted?.find((el) => el === itemId)
      ? `${classText} ${styles.trDeleted}`
      : classText;
    classText =
      tabPar.changedData.split?.find((el) => el === itemId) ||
      tabPar.changedData.join?.find((el) => el === itemId) ||
      itemss.value.isBlocked
        ? `${classText} ${styles.trBlocked}`
        : classText;
    if (itemss.number === 0) {
      classText = `${classText} ${styles.border0}`;
    }
    return classText;
  };

  //! функция опредления заблокирован ли tr, чтобы вывести кнопки отмены подтверждения
  const getConfirmation = (itemId) => {
    return funGetConfirmation(itemId, tabPar.changedData, appData.bufferAction);
  };

  return (
    <div>
      <table className={styles.table} ref={props.tableRef}>
        <thead>
          <tr key={"tr1"}>
            <InputCheckbox
              key={"chek1"}
              bgColor={"#e2e0e5"}
              checked={tabPar.onCheckBoxAll}
              clickTr={clickTrAll}
              th={true}
            />

            {basicTabData.tableHeaders.map((item, index) => (
              <TableTh
                key={item.key}
                item={item}
                index={index}
                modal={tabPar.spShow === index}
              />
            ))}
          </tr>
        </thead>
        {props.historyData.length === 0 && (
          <tbody className={styles.NotData}>
            <tr>
              <td className={styles.tdfix}></td>
              <td className={styles.tdfix2}>
                {props.historyData.length === 0 && (
                  <div className={styles.notdatadiv}>
                    {getTextForNotData(tabPar.selectedFilter)}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          <tr
            key={"tr2"}
            className={styles.trPlug}
            style={{ height: getTopHeight() }}
          ></tr>

          {props.historyData
            .slice(
              visibleDataPar.startData,
              visibleDataPar.startData + visibleDataPar.visibleData
            )
            .map((item, number) => (
              <tr
                // onMouseEnter={() => getBorder(true)}
                // onMouseLeave={() => getBorder(false)}
                colSpan={item.number + ""}
                // выделяем цветом если выбранно для контекстного меню
                className={getClassNameTr(item)}
                onClick={(e) => clickTr(e, item.value.id)}
                onContextMenu={
                  getConfirmation(item.value.id).blocked
                    ? null
                    : () => clickTrContetx(item.value.id)
                }
                key={item.value.id + number + "tr"}
              >
                <InputCheckbox
                  clickTr={() => {}}
                  itemId={item.id + "checkBox"}
                  itid={item.value.id}
                  number={number}
                  getConfirmation={getConfirmation(item.value.id)}
                  checked={tabPar.selectedTr.includes(item.value.id)}
                />
                {basicTabData.tableHeaders.map((itemKey) => (
                  <TableTd
                    key={item.value.id + "td" + itemKey.key + number}
                    obj={item}
                    item={item.value}
                    itemKey={itemKey}
                    index={visibleDataPar.startData + number}
                  />
                ))}
              </tr>
            ))}
          <tr
            key={"tr3"}
            className={styles.trPlug}
            style={{ height: getBottomHeight() }}
          ></tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
