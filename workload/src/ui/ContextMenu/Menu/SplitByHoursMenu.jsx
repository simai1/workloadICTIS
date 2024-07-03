import React from "react";
import DataContext from "../../../context";
import { addСhangedData } from "../Function";

function SplitByHoursMenu(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);

  //! ввод в инпут значения, на сколько разделить строку по часам
  const inpChange = (e) => {
    const value = e.target.value;
    const val = Number(value.replace(".", ""));
    if (val && val >= 0 && val <= 9) {
      tabPar.setInpValueHoursPopup(val);
    } else if (value === "") {
      tabPar.setInpValueHoursPopup("");
    }
  };

  //! разделение нагрузки по часам кнопка подтвердить
  const funsplitByHours = () => {
    tabPar.setPopupShareShow(true);
    //! получаем строку которую выделили
    const prev = basicTabData.workloadDataFix.find(
      (item) => item.id === tabPar.selectedTr[0]
    );
    const origHours = {
      hours: prev.hours,
      audienceHours: prev.audienceHours,
      ratingControlHours: prev.ratingControlHours,
      numberOfStudents: prev.numberOfStudents,
    };
    tabPar.setTableDataHoursPopup(origHours);
    tabPar.setBuffDataHoursPopup((el) => ({
      workloadId: tabPar.selectedTr[0],
      ...el,
      prevState: [prev],
      origHours,
      request: "splitByHours",
    }));
  };

  //! разделение вкр
  const funSplitVKR = () => {
    // tabPar.setPopupShareShow(true);
    //! получаем строку которую выделили
    const prev = basicTabData.workloadDataFix.find(
      (item) => item.id === tabPar.selectedTr[0]
    );
    const origHours = {
      hours: prev.hours,
      audienceHours: prev.audienceHours,
      ratingControlHours: prev.ratingControlHours,
      numberOfStudents: prev.numberOfStudents,
    };
    const buffDataOrig = {
      workloadId: tabPar.selectedTr[0],
      prevState: [prev],
      origHours,
      request: "splitByHours",
    };

    //! функция для разделения строк
    const handleSplit = (bufdat, inpValueHoursPopup) => {
      console.log("bufdat", bufdat);
      let updatedData = [...basicTabData.workloadDataFix];
      //! находим индекс строки которую будем делить
      const indexWorkload = updatedData.findIndex(
        (el) => el.id === bufdat.workloadId
      );

      //! создадим массив который необходимо вставить в существующий
      const newValue = [];
      for (let i = 0; i < Number(inpValueHoursPopup); i++) {
        const origHours = {
          ...updatedData[indexWorkload],
          ...bufdat.data.hoursData[i],
          id: updatedData[indexWorkload].id + (i + 1),
          isMerged: false,
          isSplit: true,
          educator: "___",
        };
        newValue.push(origHours);
      }

      //! вставляем в массив новые данные
      updatedData = [
        ...updatedData.slice(0, indexWorkload),
        {
          ...updatedData[indexWorkload],
          id: updatedData[indexWorkload].id + 0,
          isSplit: false,
          isSplitArrow: true,
          isMerged: false,
        },
        ...newValue,
        ...updatedData.slice(indexWorkload + 1),
      ];
      basicTabData.setWorkloadDataFix(updatedData);
      tabPar.setChangedData(
        addСhangedData(tabPar.changedData, "split", bufdat.newIds)
      );
      //! буфер
      appData.setBufferAction([bufdat, ...appData.bufferAction]);
    };

    //! расчитаем часы для буффера
    let hoursData = [];
    console.log(tabPar.tableDataHoursPopup);
    for (let i = 0; i < Number(tabPar.inpValueHoursPopup); i++) {
      const origHoursData = {
        numberOfStudents: origHours.numberOfStudents,
        hours: origHours.numberOfStudents * 0.5,
        audienceHours: origHours.numberOfStudents * 0.5,
        ratingControlHours: 0,
      };
      hoursData.push(origHoursData);
    }

    //! расчитаем новые id
    const newIds = Array.from(
      { length: Number(tabPar.inpValueHoursPopup) + 1 },
      (_, index) => buffDataOrig.workloadId + index
    );
    const data = {
      ids: [buffDataOrig.workloadId],
      hoursData,
      n: Number(tabPar.inpValueHoursPopup) + 1,
    };
    const bufdat = {
      ...buffDataOrig,
      data,
      newIds: newIds,
      id: appData.bufferAction.length,
    };
    //! вызываем функцию для разделения строк на бэке
    handleSplit(bufdat, tabPar.inpValueHoursPopup);
    tabPar.setSelectedTr("");
    tabPar.setInpValueHoursPopup(2);
    tabPar.setInputEditValue([]);
    tabPar.setPopupShareShow(false);
  };

  //! при клике на подтвердить определяем какую функцию вызвать как разделить
  const clickConfirm = () => {
    if (tabPar.inpValueHoursPopup !== "" && tabPar.inpValueHoursPopup !== 1) {
      if (props.typeMenu === "splitByHoursMenu") {
        funsplitByHours();
      } else if (props.typeMenu === "splitVKR") {
        funSplitVKR();
      }
    }
  };

  return (
    <div
      className={props.styles.SplitByHoursMenu}
      style={
        tabPar.contextPosition.x + 280 + 180 > window.innerWidth
          ? {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x - 150,
            }
          : {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x + 280,
            }
      }
    >
      <input
        type="number"
        value={tabPar.inpValueHoursPopup}
        placeholder="От 2 до 9"
        onChange={(e) => inpChange(e)}
      ></input>
      <span>{tabPar.inpValueHoursPopup === 1 && "От 2 до 9"}</span>
      <div className={props.styles.SplitByHoursMenuButtonBox}>
        <button
          style={
            tabPar.inpValueHoursPopup === "" || tabPar.inpValueHoursPopup === 1
              ? { backgroundColor: "#757575" }
              : null
          }
          onClick={clickConfirm}
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
}

export default SplitByHoursMenu;
