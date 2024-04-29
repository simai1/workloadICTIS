import React from "react";
import TableTh from "./TableTh";
import TableTd from "./TableTd";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import InputCheckbox from "./InputCheckbox";

function Table(props) {
  const { tabPar } = React.useContext(DataContext);

  //! при клике на tr
  const clickTr = (itemId) => {
    tabPar.setSelectedTr((prev) => {
      const index = prev.indexOf(itemId);
      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        return [...prev, itemId];
      }
    });
  };
  //! клик левой кнопкой мыши на tr
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

  const clickTrAll = () => {
    let ids = [];
    if (tabPar.filtredData.length !== tabPar.selectedTr.length) {
      tabPar.filtredData.map((item) => {
        ids.push(item.id);
      });
      tabPar.setOnCheckBoxAll(true);
    } else {
      ids = [];
      tabPar.setOnCheckBoxAll(false);
    }
    tabPar.setSelectedTr(ids);
  };

  return (
    <table className={styles.table} ref={props.tableRef}>
      <thead>
        <tr>
          <InputCheckbox
            bgColor={"#e2e0e5"}
            checked={tabPar.onCheckBoxAll}
            clickTr={clickTrAll}
          />
          {props.tableHeaders.map((item, index) => (
            <TableTh
              key={item.key}
              item={item}
              index={index}
              modal={tabPar.spShow === index}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {tabPar.filtredData.map((item, number) => (
          <tr
            // выделяем цветом если выбранно
            className={
              tabPar.selectedTr.includes(item.id) ? styles.selectedTr : null
            }
            onClick={() => clickTr(item.id)}
            onContextMenu={() => clickTrContetx(item.id)}
            key={item.id}
          >
            <InputCheckbox
              bgColor={tabPar.selectedTr.includes(item.id) ? "#E6ECFD" : "#fff"}
              clickTr={clickTr}
              itemId={item.id}
              checked={tabPar.selectedTr.includes(item.id)}
            />
            {props.tableHeaders.map((itemKey, index) => (
              <TableTd
                key={index}
                item={item}
                itemKey={itemKey}
                index={number}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
