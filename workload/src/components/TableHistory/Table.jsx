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
    const height =
      (props.historyData.length -
        visibleDataPar.startData -
        visibleDataPar.visibleData) *
      visibleDataPar.heightTd;

    if (height <= 0) {
      return 0;
    } else {
      return height;
    }
  };

  //! клик правой кнопкой мыши на tr
  const clickTrContetx = (e, itemId) => {
    tabPar.setSelectedTr((prev) => {
      const index = prev.indexOf(itemId);
      if (
        index === -1 &&
        tabPar.selectedTr.length === 0 &&
        !props.contextShow
      ) {
        return [...prev, itemId];
      } else if (tabPar.selectedTr.length === 1 && props.contextShow) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        return [...prev];
      }
    });
    props.setContetxShow(!props.contextShow);
    props.setContextPosition({ x: e.clientX, y: e.clientY - 200 });
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
    if (props.historyData.length !== tabPar.selectedTr.length) {
      props.historyData.map((item) => {
        ids.push(item.value.objid);
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
    const itemId = itemss.value.objid;
    let classText = null;
    classText = tabPar.selectedTr?.includes(itemId)
      ? `${styles.selectedTr}`
      : null;
    if (borderState === itemss.id) {
      classText = `${classText} ${styles.border0}`;
    }
    return classText;
  };

  //! функция опредления заблокирован ли tr, чтобы вывести кнопки отмены подтверждения
  const getConfirmation = (itemId) => {
    return funGetConfirmation(itemId, tabPar.changedData, appData.bufferAction);
  };

  const [borderState, setBorderState] = useState("");
  const getBorder = (item) => {
    setBorderState(item.id);
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
                orighistoryData={props.orighistoryData}
                sethistoryData={props.sethistoryData}
              />
            ))}
          </tr>
        </thead>
        {props.historyData.length === 0 && (
          <tbody className={styles.NotData}>
            <tr>
              <td
                className={styles.tdfix}
                style={{ pointerEvents: "none" }}
              ></td>
              <td className={styles.tdfix2} style={{ pointerEvents: "none" }}>
                <div className={styles.notdatadiv}>
                  {tabPar.perenesenAction
                    ? "Нет перенесенных данных"
                    : "Нет данных"}
                </div>
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
                onMouseEnter={() => getBorder(item)}
                onMouseLeave={() => getBorder("")}
                // выделяем цветом если выбранно для контекстного меню
                className={getClassNameTr(item)}
                onClick={(e) => clickTr(e, item.value.objid)}
                onContextMenu={(e) => clickTrContetx(e, item.value.objid)}
                key={item.value.id + number + "tr"}
                name={item.number === 0 ? "bottomBorder" : null}
              >
                <InputCheckbox
                  clickTr={() => {}}
                  itemId={item.id + "checkBox"}
                  itid={item.value.id}
                  number={number}
                  obj={item}
                  getConfirmation={getConfirmation(item.value.id)}
                  checked={tabPar.selectedTr.includes(item.value.objid)}
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
