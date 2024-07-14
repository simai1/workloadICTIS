import React, { useContext, useEffect, useState } from "react";
import TableTh from "./TableTh";
import TableTd from "./TableTd";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";
import InputCheckbox from "./InputCheckbox/InputCheckbox";
import { funGetConfirmation, getTextForNotData } from "./Function";

function Table(props) {
  const { tabPar, visibleDataPar, basicTabData, appData } =
    useContext(DataContext);

  const [tableHeaders, setTableHeaders] = useState([]);
  console.log("hed", tableHeaders);
  console.log("data", props.tabDat.filtredData);
  //! заголово таблицы хранится в sessionStorage, есть он есть то применяем к таблице
  useEffect(() => {
    const ssUpdatedHeader = JSON.parse(
      sessionStorage.getItem(props.tabDat.ssHeader)
    );
    if (ssUpdatedHeader) {
      setTableHeaders(ssUpdatedHeader);
    } else {
      setTableHeaders(props.tabDat.tableHeader);
    }
  }, [props.tabDat.tableHeader]);

  //! определение верхнего отступа таблицы
  const getTopHeight = () => {
    return visibleDataPar.startData * visibleDataPar.heightTd;
  };

  //! определение нижнего отступа таблицы
  const getBottomHeight = () => {
    return (
      (props.tabDat.filtredData.length -
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
    console.log("clickTr");
    const a = el.target.nodeName;
    console.log(el.target.getAttribute("name"));
    if (
      a === "TD" ||
      a === "INPUT" ||
      el.target.getAttribute("name") === "educator"
    ) {
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
      if (props.tabDat.filtredData.length === len) {
        tabPar.setOnCheckBoxAll(true);
      } else {
        tabPar.setOnCheckBoxAll(false);
      }
    }
  };

  const clickTrAll = () => {
    let ids = [];
    if (props.tabDat.filtredData.length !== tabPar.selectedTr.length) {
      props.tabDat.filtredData.map((item) => {
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
  const getClassNameTr = (items) => {
    const itemId = items.id;
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
      items.isBlocked
        ? `${classText} ${styles.trBlocked}`
        : classText;

    return classText;
  };

  //! функция опредления заблокирован ли tr, чтобы вывести кнопки отмены подтверждения
  const getConfirmation = (itemId) => {
    return funGetConfirmation(itemId, tabPar.changedData, appData.bufferAction);
  };

  return (
    <div>
      <table id={"table-id"} className={styles.table}>
        <thead>
          <tr key={"tr1"}>
            <InputCheckbox
              key={"chek1"}
              bgColor={"#e2e0e5"}
              checked={tabPar.onCheckBoxAll}
              clickTr={clickTrAll}
              th={true}
              tabDat={props.tabDat}
            />

            {tableHeaders.map((item, index) => (
              <TableTh
                key={item.key}
                item={item}
                index={index}
                modal={tabPar.spShow === index}
                tabDat={props.tabDat}
              />
            ))}
          </tr>
        </thead>
        {props.tabDat.filtredData.length === 0 && (
          // если нет данных то выводим нет данных
          <tbody className={styles.NotData}>
            <tr>
              <td
                className={styles.tdfix}
                style={{ pointerEvents: "none" }}
              ></td>
              <td className={styles.tdfix2} style={{ pointerEvents: "none" }}>
                {
                  <div className={styles.notdatadiv}>
                    {getTextForNotData(tabPar.selectedFilter)}
                  </div>
                }
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

          {props.tabDat.filtredData
            .slice(
              visibleDataPar.startData,
              visibleDataPar.startData + visibleDataPar.visibleData
            )
            .map((item, number) => (
              <tr
                // выделяем цветом если выбранно для контекстного меню
                className={getClassNameTr(item)}
                onClick={
                  getConfirmation(item.id).blocked
                    ? null
                    : (e) => clickTr(e, item.id)
                }
                onContextMenu={
                  getConfirmation(item.id).blocked
                    ? null
                    : () => clickTrContetx(item.id)
                }
                key={item.id}
              >
                <InputCheckbox
                  clickTr={() => {}}
                  itemId={item.id + "checkBox"}
                  itid={item.id}
                  workload={item}
                  number={number}
                  getConfirmation={getConfirmation(item.id)}
                  checked={tabPar.selectedTr.includes(item.id)}
                  tabDat={props.tabDat}
                />
                {tableHeaders.map((itemKey, index) => (
                  <TableTd
                    key={item.id + "td" + itemKey.key + "_" + index}
                    item={item}
                    itemKey={itemKey}
                    ind={index}
                    index={visibleDataPar.startData + number}
                    tabDat={props.tabDat}
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
