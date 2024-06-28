import React, { useEffect, useState } from "react";
import DataContext from "../../../context";
import { workloadUpdata } from "../../../api/services/ApiRequest";
import { addСhangedData } from "./../Function";

function SplitByHoursMenu(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);
  const [inpValue, setInpValue] = useState(2); //! переменная на сколько разделить по часам
  const [popupShareShow, setPopupShareShow] = useState(false); //! открываем попап для расчета часов по формуле
  const [tableData, setTableData] = useState(null); //! данные для таблицы редактирования ввноса часов
  const [inputEditValue, setInputEditValue] = useState([]);
  const [buffData, setBuffData] = useState({
    workloadId: tabPar.selectedTr[0],
    request: "splitByHours",
  });

  //! ввод в инпут значения, на сколько разделить строку по часам
  const inpChange = (e) => {
    const value = e.target.value;
    const val = Number(value.replace(".", ""));
    if (val && val >= 2 && val <= 10) {
      setInpValue(val);
    }
  };

  //! разделение нагрузки по часам кнопка подтвердить
  const funsplitByHours = () => {
    setPopupShareShow(true);
    //! получаем строку которую выделили
    const prev = basicTabData.workloadDataFix.find(
      (item) => item.id === tabPar.selectedTr[0]
    );
    const origHours = {
      hours: prev.hours,
      audienceHours: prev.audienceHours,
      ratingControlHours: prev.ratingControlHours,
    };
    setTableData(origHours);

    setBuffData((el) => ({ ...el, prevState: [prev], origHours }));
  };

  //! вводим в инпут часы и записываем в состояние
  const changeHours = (e, index) => {
    let prevVal = [...inputEditValue];
    prevVal[index] = Number(e.target.value) ? Number(e.target.value) : "";
    setInputEditValue(prevVal);
  };

  //! функция для разделения строк при нажатии сохранить
  const handleSplitWorkload = (bufdat) => {
    let updatedData = [...basicTabData.workloadDataFix];
    //! находим индекс строки которую будем делить
    const indexWorkload = updatedData.findIndex(
      (el) => el.id === bufdat.workloadId
    );

    //! создадим массив который необходимо вставить в существующий
    const newValue = [];
    for (let i = 0; i < Number(inpValue); i++) {
      const origHours = {
        ...updatedData[indexWorkload],
        ...bufdat.data.hoursData[i],
        id: updatedData[indexWorkload].id + (i + 1),
      };
      newValue.push(origHours);
    }

    //! вставляем в массив новые данные
    updatedData = [
      ...updatedData.slice(0, indexWorkload),
      { ...updatedData[indexWorkload], id: updatedData[indexWorkload].id + 0 },
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

  //! сохранить введенные изменения кнопка сохранить
  const saveClickShare = () => {
    // tabPar.setContextMenuShow(false);
    //! расчитаем часы для буффера
    let hoursData = [];
    for (let i = 0; i < Number(inpValue); i++) {
      const origHours = {
        hours: Number(funCalculationHours(i)),
        audienceHours: inputEditValue[i],
        ratingControlHours: Number(funCalculationRatingControlHours(i)),
      };
      hoursData.push(origHours);
    }
    //! расчитаем новые id
    const newIds = Array.from(
      { length: Number(inpValue) + 1 },
      (_, index) => buffData.workloadId + index
    );
    const data = {
      ids: [buffData.workloadId],
      hoursData,
      n: Number(inpValue) + 1,
    };
    const bufdat = {
      ...buffData,
      data,
      newIds: newIds,
      id: appData.bufferAction.length,
    };
    setBuffData(bufdat);
    //! вызываем функцию для разделения строк на бэке
    handleSplitWorkload(bufdat);
  };

  useEffect(() => {
    console.log("buffData", buffData);
    console.log("tabPar.changedData", tabPar.changedData);
  }, [buffData, tabPar.changedData]);

  //! функция расчета часов
  const funCalculationHours = (index) => {
    let value = 0;
    if (inputEditValue[index]) {
      value =
        (inputEditValue[index] / tableData.audienceHours) * tableData.hours;
    }
    return value.toFixed(2);
  };

  //! функция расчета часов рейтинг-констроль
  const funCalculationRatingControlHours = (index) => {
    let value = 0;
    if (inputEditValue[index]) {
      value =
        (inputEditValue[index] / tableData.audienceHours) *
        tableData.ratingControlHours;
    }
    return value.toFixed(2);
  };

  //! функция для расчета совпадает ли сумма введенных данных с исходными
  const funCalcInputHours = () => {
    const sum = inputEditValue.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return !(tableData.audienceHours === sum);
  };

  return (
    <>
      {popupShareShow && (
        <div className={props.styles.popupToShare}>
          <div className={props.styles.popupToShare_inner}>
            <h3>Расчет часов</h3>
            <div className={props.styles.popupToShare_body}>
              <table>
                <thead>
                  <tr>
                    <th>Часы</th>
                    <th>Аудиторные часы</th>
                    <th>Часы рейтинг-контроль</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={props.styles.origData}>
                    <td>{tableData.hours}</td>
                    <td>
                      <div
                        style={
                          funCalcInputHours()
                            ? {
                                borderColor: "red",
                                transition: "all 0.15s ease",
                              }
                            : null
                        }
                        className={props.styles.errorBorder}
                      >
                        {tableData.audienceHours}
                      </div>
                    </td>
                    <td>{tableData.ratingControlHours}</td>
                  </tr>
                  {Array.from({ length: Number(inpValue) }, (_, index) => (
                    <tr key={index + "tr"}>
                      <td>{funCalculationHours(index)}</td>
                      <td className={props.styles.inputTd}>
                        <input
                          style={
                            funCalcInputHours()
                              ? {
                                  borderColor: "red",
                                  transition: "all 0.15s ease",
                                }
                              : null
                          }
                          className={props.styles.errorBorder}
                          placeholder="0"
                          value={
                            inputEditValue[index] ? inputEditValue[index] : "0"
                          }
                          type="number"
                          onChange={(e) => changeHours(e, index)}
                        />
                      </td>
                      <td>{funCalculationRatingControlHours(index)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={props.styles.errortext}>
              {funCalcInputHours() && (
                <span>
                  Сумма введенных часов должна равняться исходному значению!
                </span>
              )}
            </div>
            <div className={props.styles.button}>
              <button
                style={
                  funCalcInputHours() ? { backgroundColor: "#757575" } : null
                }
                onClick={!funCalcInputHours() ? saveClickShare : null}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

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
          value={inpValue}
          onChange={(e) => inpChange(e)}
        ></input>
        <div className={props.styles.SplitByHoursMenuButtonBox}>
          <button onClick={() => funsplitByHours(inpValue)}>Подтвердить</button>
        </div>
      </div>
    </>
  );
}

export default SplitByHoursMenu;
