import React, { useEffect, useState } from "react";
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

  /* */

  // const 
  console.log(
    role,
    login,
    maxHours,
    minHours,
    recommendedMaxHours,
    position,
    department,
    name,
    institutionalAffiliation,
    allowedDepartments
  );

  const inputNameChange = (event) => {
    setName(event.target.value);
  };

  const inputLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const inputRateChange = (event) => {
    setRate(event.target.value);
  };

  const inputrecommendedMaxHoursChange = (event) => {
    setRecommendedMaxHours(event.target.value)
  }

  const inputMinHoursChange = (event) => {
    setMinHours(event.target.value);
  };

  const inputMaxHoursChange = (event) => {
    setMaxHours(event.target.value);
  };

  return (
    <>
      <div className={styles.Popup}>
        <div className={styles.PopupBox}>
          <div className={styles.box_scroll}>
            {/* {tableHeaderPopup.map((keys) => (
              <>
                <div key={keys.key} className={styles.PopupBody}>
                  <div className={styles.left}>{keys.name}</div>
                  <input
                    onClick={() => inpClick(keys.key)}
                    value={popupData && popupData[keys.key]}
                    placeholder="___"
                    className={styles.rigth}
                    onChange={handleChange}
                  />
                  {listShow === keys.key && (
                    <div className={styles.list}>
                      <div
                        style={{ top: "-6px", left: "9px" }}
                        className={styles.left}
                      >
                        {keys.name}
                      </div>
                      <ul>
                        {listData.map((item) => (
                          <li onClick={() => liClick(item, keys.key)}>
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ))} */}
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
             {/* <div className={styles.PopupBody}>
              <div className={styles.left}>Роль</div>
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
