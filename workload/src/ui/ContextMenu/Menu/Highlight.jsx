import React, { useEffect, useRef, useState } from "react";
import styles from "./../ContextMenu.module.scss";
import DataContext from "../../../context";
import {
  apiAddColored,
  apiDelColors,
  apiUpdateColors,
} from "../../../api/services/ApiRequest";
import { getStylePosition } from "../Function";

export function Highlight(props) {
  const { tabPar, basicTabData } = React.useContext(DataContext);
  //! функция занесения выбранных цветов в состояние
  const SetColor = (colorNumber) => {
    colorNumber = colorNumber + 1;
    if (colorNumber === 1) {
      //! удаляем выделение
      const coloerd = tabPar.coloredData
        .filter((item) =>
          tabPar.selectedTr.some((el) => el === item.workloadId)
        )
        .map((el) => el.id);
      const data = {
        colorIds: coloerd,
      };
      apiDelColors(data).then(() => {
        basicTabData.funUpdateAllColors();
      });
    } else {
      //! добалвяем выделение
      const workloadIds = tabPar.selectedTr.filter(
        (item) => !tabPar.coloredData.some((el) => el.workloadId === item)
      );
      const setWorkloadIds = tabPar.coloredData
        .filter((item) =>
          tabPar.selectedTr.some((el) => el === item.workloadId)
        )
        .map((el) => el.id);
      const data = {
        color: colorNumber,
        workloadIds: workloadIds,
      };
      const setData = {
        color: colorNumber,
        colorIds: setWorkloadIds,
      };

      if (workloadIds.length > 0) {
        apiAddColored(data).then(() => {
          basicTabData.funUpdateAllColors();
        });
      }
      if (setWorkloadIds.length > 0) {
        apiUpdateColors(setData).then(() => {
          basicTabData.funUpdateAllColors();
        });
      }
    }
    tabPar.setContextMenuShow(false);
    tabPar.setSelectedTr([]);
  };

  //! переменная которая хранит ширину данного меню
  const [menuWidth, setMenuWidth] = useState(111);
  const menuRef = useRef(null);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth);
    }
  }, [menuRef.current]);

  return (
    <div
      className={styles.blockHighlight}
      ref={menuRef}
      style={getStylePosition(
        tabPar.contextPosition,
        window.innerWidth,
        menuWidth,
        props.conxextMenuRefBlock
      )}
    >
      <div onClick={() => SetColor(0)}>
        <button className={styles.Group0}>Убрать</button>
      </div>
      <div onClick={() => SetColor(1)}>
        <button className={styles.Group1}>Группа 1</button>
      </div>
      <div onClick={() => SetColor(2)}>
        <button className={styles.Group2}>Группа 2</button>
      </div>
      <div onClick={() => SetColor(3)}>
        <button className={styles.Group3}>Группа 3</button>
      </div>
    </div>
  );
}
