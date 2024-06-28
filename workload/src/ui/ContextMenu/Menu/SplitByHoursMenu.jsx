import React from "react";
import DataContext from "../../../context";

function SplitByHoursMenu(props) {
  const { tabPar, basicTabData } = React.useContext(DataContext);

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
          onClick={
            tabPar.inpValueHoursPopup !== "" && tabPar.inpValueHoursPopup !== 1
              ? () => funsplitByHours(tabPar.inpValueHoursPopup)
              : null
          }
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
}

export default SplitByHoursMenu;
