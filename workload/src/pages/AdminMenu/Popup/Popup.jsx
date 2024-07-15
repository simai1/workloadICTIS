import React, { useEffect, useState, useRef } from "react";
import styles from "./Popup.module.scss";
import { roles, tableHeaderPopup, dataListPosition } from "../AdminData";
import {
  EditTeacher,
  GetAllDepartments,
  apiAdminUpdata,
} from "../../../api/services/ApiRequest";
import DataContext from "../../../context";
function Popup(props) {
  const [name, setName] = useState(props.data.name);
  const [institutionalAffiliation, setInstitutionalAffiliation] = useState(
    props.data.institutionalAffiliation
  );
  const [department, setDepartment] = useState(props.data.department);
  const [role, setRole] = useState(props.data.role);
  const [position, setPosition] = useState(props.data.position);
  const [allowedDepartments, setAllowedDepartments] = useState(
    props.data.allowedDepartments
  );
  const [login, setLogin] = useState(props.data.login);
  const [maxHours, setMaxHours] = useState(props.data.maxHours);
  const [minHours, setMinHours] = useState(props.data.minHours);
  const [recommendedMaxHours, setRecommendedMaxHours] = useState(
    props.data.recommendedMaxHours
  );
  const [rate, setRate] = useState(props.data.rate);

  const [isVisiblePosition, setIsVisiblePosition] = useState(false);
  const [isVisibleRole, setIsVisibleRole] = useState(false);

  const [allPosition, setAllPosition] = useState(dataListPosition);
  const [allRole, setAllRole] = useState({
    1: "METHODIST",
    2: "LECTURER",
    3: "DEPARTMENT_HEAD",
    4: "DIRECTORATE",
    5: "EDUCATOR",
    6: "UNIT_ADMIN",
    7: "DEPUTY_DIRECTORATE",
    8: "DEPUTY_DEPARTMENT_HEAD",
    9: "GIGA_ADMIN",
    10: "GOD",
  });

  // Object.keys(allRole).map(key => console.log(key, allRole[key]))

  const timeoutId = useRef(null);

  // console.log(
  //   role,
  //   login,
  //   maxHours,
  //   minHours,
  //   recommendedMaxHours,
  //   position,
  //   department,
  //   name,
  //   institutionalAffiliation,
  //   allowedDepartments
  // );

  const fnShowListPosition = () => {
    setIsVisiblePosition(!isVisiblePosition);
  };

  const fnShowListRole = () => {
    setIsVisibleRole(!isVisibleRole);
  };

  const chooseClickPosition = (pos) => {
    setPosition(pos.name);
    setIsVisiblePosition(false);
    const data = {
      id: props.data.id,
      key: "position",
      value: pos.key,
    };
    console.log(data.id, data.key, data.value);
    apiAdminUpdata(data);
  };

  const chooseClickRole = (key, value) => {
    console.log(key,value);
    setRole(value);
    setIsVisibleRole(false)
    const data = {id: props.data.id, key: "role", value: key}
    apiAdminUpdata(data)
  };

  const updateInputField = (key, value) => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      const data = { id: props.data.id, key, value };
      apiAdminUpdata(data);
    }, 5000);
  };
  const inputNameChange = (event) => {
    setName(event.target.value);
    updateInputField("name", event.target.value);
  };

  const inputLoginChange = (event) => {
    setLogin(event.target.value);
    updateInputField("login", event.target.value);
  };

  const inputRateChange = (event) => {
    setRate(event.target.value);
    updateInputField("rate", event.target.value);
  };

  const inputrecommendedMaxHoursChange = (event) => {
    setRecommendedMaxHours(event.target.value);
    updateInputField("recommendedMaxHours", event.target.value);
  };

  const inputMinHoursChange = (event) => {
    setMinHours(event.target.value);
    updateInputField("minHours", event.target.value);
  };

  const inputMaxHoursChange = (event) => {
    setMaxHours(event.target.value);
    updateInputField("maxHours", event.target.value);
  };

  return (
    <>
      <div className={styles.Popup}>
        <div className={styles.PopupBox}>
          <div className={styles.box_scroll}>
            <div className={styles.PopupBody}>
              <div className={styles.left}>ФИО</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={name}
                onChange={inputNameChange}
              ></input>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Почта</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={login}
                onChange={inputLoginChange}
              ></input>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Роль</div>
              <div className={styles.rigth} onClick={fnShowListRole}>
                {role}
              </div>
              {isVisibleRole && (
                <div
                  style={{
                    position: "absolute",
                    top: "3.4vw",
                    borderTop: "none",
                  }}
                  className={styles.list}
                >
                  <ul>
                    {Object.keys(allRole).map((key) => (
                      <li key={key} onClick={() => chooseClickRole(key, allRole[key])}>
                        {allRole[key]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/*          <div className={styles.PopupBody}>
              <div className={styles.left}>Институт</div>
              <div className={styles.list}>
                <div
                  style={{ top: "-6px", left: "9px" }}
                  className={styles.left}
                >
                  {keys.name}
                </div>
                <ul>
                  {listData.map((item) => (
                    <li>{item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Разрешенные кафедры</div>
              <div className={styles.list}>
                <div
                  style={{ top: "-6px", left: "9px" }}
                  className={styles.left}
                >
                  {keys.name}
                </div>
                <ul>
                  {listData.map((item) => (
                    <li>{item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Кафедра</div>
              <div className={styles.list}>
                <div
                  style={{ top: "-6px", left: "9px" }}
                  className={styles.left}
                >
                  {keys.name}
                </div>
                <ul>
                  {listData.map((item) => (
                    <li>{item.name}</li>
                  ))}
                </ul>
              </div>
            </div> */}
            <div className={styles.PopupBody}>
              <div className={styles.left}>Должность</div>
              <div className={styles.rigth} onClick={fnShowListPosition}>
                {position}
              </div>
              {isVisiblePosition && (
                <div
                  style={{
                    position: "absolute",
                    top: "3.4vw",
                    borderTop: "none",
                  }}
                  className={styles.list}
                >
                  <ul>
                    {allPosition.map((pos) => (
                      <li
                        key={pos.key}
                        onClick={() => chooseClickPosition(pos)}
                      >
                        {pos.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Ставка</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={rate}
                onChange={inputRateChange}
              ></input>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Максимальные часы</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={maxHours}
                onChange={inputMaxHoursChange}
              ></input>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Минимальные часы</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={minHours}
                onChange={inputMinHoursChange}
              ></input>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Рек. макс. часы</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={recommendedMaxHours}
                onChange={inputrecommendedMaxHoursChange}
              ></input>
            </div>
          </div>
          <div className={styles.buttonBox}>
            <button onClick={props.closeClick}>Закрыть</button>
          </div>
        </div>
        <div className={styles.PopupBack}></div>
      </div>
    </>
  );
}

export default Popup;
