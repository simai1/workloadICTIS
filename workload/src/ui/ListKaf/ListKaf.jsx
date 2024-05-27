import React, { useEffect, useRef, useState } from "react";
import styles from "./ListKaf.module.scss";
import DataContext from "../../context";
import arrowWhite from "./../../img/arrow-White.svg";
import arrowBlack from "./../../img/arrow_down.svg";

function ListKaf({ dataList, Textlabel, defaultValue, name, setTableMode }) {
  const { tabPar } = React.useContext(DataContext);

  const [activeList, setactiveList] = useState(false);
  const [nameKaf, setnameKaf] = useState(defaultValue);
  const addClient = (el) => {
    console.log(el);
    setnameKaf(el.name);
    setactiveList(!activeList);
    tabPar.setDataIsOid(false);
    setTableMode("cathedrals");
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
    <div ref={refDiv} className={styles.List}>
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
              backgroundColor:
                nameKaf && !tabPar.dataIsOid ? "#3b28cc" : "#fff",
              color: nameKaf && !tabPar.dataIsOid ? "#fff" : "#000",
            }}
            onClick={() => setactiveList(!activeList)}
            value={nameKaf}
            placeholder={defaultValue}
            className={styles.inputList}
          />
          <span
            onClick={() => setactiveList(!activeList)}
            className={styles.arrowBot}
          >
            {!activeList && !tabPar.dataIsOid && <img src={arrowWhite} />}
            {activeList && !tabPar.dataIsOid && (
              <img
                src={arrowBlack}
                style={{
                  transform: "rotate(0deg)",
                }}
              />
            )}
            {!activeList && tabPar.dataIsOid && (
              <img
                src={arrowBlack}
                style={{
                  transform: "rotate(-90deg)",
                }}
              />
            )}
            {activeList && tabPar.dataIsOid && (
              <img
                src={arrowBlack}
                style={{
                  transform: "rotate(0deg)",
                }}
              />
            )}
          </span>
        </div>
        {activeList && (
          <div className={styles.ListData}>
            {dataList.map((item) => (
              <p
                className={styles.NameForList}
                onClick={() => addClient(item)}
                key={item.id}
              >
                {item.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListKaf;
