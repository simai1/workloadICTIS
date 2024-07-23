import React, { useEffect, useRef, useState } from "react";
import styles from "./ListSchedule.module.scss";
import DataContext from "../../context";
import arrowWhite from "./../../img/arrow-White.svg";
import arrowBlack from "./../../img/arrow_down.svg";

function ListSchedule({
  dataList,
  Textlabel,
  defaultValue,
}) {
  const { tabPar, appData, basicTabData } = React.useContext(DataContext);
  const [activeList, setactiveList] = useState(false);
  
  const addKafedra = (el) => {
    basicTabData.setSelectTableSchedle(el.name);
    setactiveList(false);
  };

  const refDiv = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (refDiv.current && !refDiv.current.contains(event.target)) {
        setactiveList(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);



  return (
    <div ref={refDiv} className={styles.ListSchedule}>
      <div>
        {Textlabel && (
          <div>
            <label>{Textlabel}</label>
          </div>
        )}

        <div className={styles.ListCont}>
          <input
            readOnly
            style={{
              backgroundColor: !activeList ? "#0040E5" : "#fff",
              color: !activeList ? "#fff" : "#000",
            }}
            onClick={() => setactiveList(!activeList)}
            value={basicTabData.selectTableSchedle}
            placeholder={defaultValue}
            className={styles.inputList}
          />
          <span
            onClick={() => setactiveList(!activeList)}
            className={styles.arrowBot}
          >
            {!activeList && (
              <img
                src={arrowWhite}
                style={{
                  transform: "rotate(0deg)",
                }}
              />
            )}
            {activeList && (
              <img
                src={arrowBlack}
                style={{
                  transform: "rotate(-180deg)",
                  paddingBottom: "4px",
                }}
              />
            )}
          </span>
        </div>
        {activeList && basicTabData.tableDepartment.length !== 1 && (
          <div className={styles.ListData}>
            {dataList.length > 1 ? (
              <>
                {dataList.map((el, index) => (
                  <div
                    key={index}
                    onClick={() => addKafedra(el)}
                    className={styles.listItem}
                  >
                    <p>{el.name}</p>
                  </div>
                ))}
              </>
            ) : (
              <div>Нет данных</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListSchedule;
