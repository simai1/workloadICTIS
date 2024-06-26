import React, { useEffect, useRef, useState } from "react";
import styles from "./List.module.scss";
import DataContext from "../../context";
import arrow from "./../../img/arrow_down.svg";
function List({
  dataList,
  Textlabel,
  defaultValue,
  handleInputChange,
  name,
  handleInputList,
  value,
}) {
  const { context, appData } = React.useContext(DataContext);
  const allowedDepartmentsNames = dataList
    .filter((department) =>
      appData.myProfile.allowedDepartments.includes(department.id)
    )
    .map((department) => department.name);

  const [activeList, setactiveList] = useState(false);
  const [nameClient, setnameClient] = useState(null);

  useEffect(() => {
    if (value != "undefined") {
      setnameClient(value);
    }
  }, []);

  const addClient = (el) => {
    console.log(el);
    setnameClient(el.name);
    setactiveList(!activeList);
    handleInputList(name, el.id);
  };

  const listRef = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setactiveList(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div className={styles.List}>
      {name === "department" &&
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 39) ? (
        <></>
      ) : (
        <div>
          {Textlabel && (
            <div>
              <label>{Textlabel}</label>
            </div>
          )}
          <div className={styles.ListCont}>
            <input
              readOnly
              onClick={() => setactiveList(!activeList)}
              value={nameClient || ""}
              placeholder={defaultValue}
              className={styles.inputList}
            />
            <span
              onClick={() => setactiveList(!activeList)}
              className={styles.arrowBot}
            >
              <img
                style={{
                  transform: activeList ? "rotate(0deg)" : "rotate(-90deg)",
                }}
                src={arrow}
              />
            </span>
          </div>
          {activeList && (
            <div ref={listRef} className={styles.ListData}>
              <div className={styles.ListDataScroll}>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default List;
