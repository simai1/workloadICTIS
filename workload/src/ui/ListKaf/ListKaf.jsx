import React, { useEffect, useRef, useState } from "react";
import styles from "./ListKaf.module.scss";
import DataContext from "../../context";
import arrowWhite from "./../../img/arrow-White.svg";
import arrowBlack from "./../../img/arrow_down.svg";
import { apiGetHistory } from "../../api/services/ApiRequest";

function ListKaf({
  dataList,
  Textlabel,
  defaultValue,
  name,
  setTableMode,
  setisBlocked,
}) {
  const { tabPar, appData, basicTabData } = React.useContext(DataContext);
  const [activeList, setactiveList] = useState(false);
  const [openLists, setopenLists] = useState("");
  const setopenList = (index) => {
    if (index === openLists) {
      setopenLists("");
    } else {
      setopenLists(index);
    }
  };
  const addKafedra = (el) => {
    console.log(el);
    basicTabData.setnameKaf(el.name);
    setactiveList(!activeList);
    basicTabData.setselectISOid(false);
    tabPar.setDataIsOid(false);
    setTableMode("cathedrals");
    basicTabData.funUpdateTable(el.id);
    tabPar.setSelectedFilter("Все Дисциплины");
    setopenLists("");
    appData.setSelectedComponent("Disciplines");
  };

  const refDiv = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    console.log("defaultValue", defaultValue);
    setopenLists("");
    const handler = (event) => {
      if (refDiv.current && !refDiv.current.contains(event.target)) {
        setactiveList(false);
        setopenLists("");
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  //! функция при клике на история
  const clickHistory = (item) => {
    apiGetHistory().then((req) => {
      basicTabData.setHistoryChanges(req);
      setactiveList(false);
      setopenLists("");
      
    });
    tabPar.setSelectedFilter("Все Дисциплины");
    basicTabData.setnameKaf(item.name);
    appData.setSelectedComponent("History");
  };

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
              backgroundColor: !basicTabData.selectISOid ? "#3b28cc" : "#fff",
              color: !basicTabData.selectISOid ? "#fff" : "#000",
            }}
            onClick={() => setactiveList(!activeList)}
            value={basicTabData.nameKaf}
            placeholder={defaultValue}
            className={styles.inputList}
          />
          <span
            onClick={() => setactiveList(!activeList)}
            className={styles.arrowBot}
          >
            {!basicTabData.selectISOid && (
              <img
                src={arrowWhite}
                style={{
                  transform: "rotate(-90deg)",
                }}
              />
            )}
            {activeList && (
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
            {dataList.map((item, index) => (
              <div>
                <p
                  className={styles.NameForList}
                  onClick={
                    ()=>{
                      if(item.blocked){
                        if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 28)){
                          setopenList(index)
                        }
                      }
                      else{
                        addKafedra(item)
                      }
                    }
                  
                  }
                  style={item.blocked ? { color: "#E81414" } : null}
                >
                  {item.name}
                </p>
                {item.blocked && openLists === index && (
                  <div className={styles.ListVRot}>
                    <p
                      className={styles.NameForList}
                      onClick={() => addKafedra(item)}
                    >
                      Нагрузка
                    </p>
                    <p
                      className={styles.NameForList}
                      onClick={() => clickHistory(item)}
                    >
                      История
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListKaf;
