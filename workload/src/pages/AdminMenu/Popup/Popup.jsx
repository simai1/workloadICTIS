import React, { useEffect, useState, useRef } from "react";
import styles from "./Popup.module.scss";
import { roles, tableHeaderPopup, dataListPosition } from "../AdminData";
import {
  EditTeacher,
  GetAllDepartments,
  GetAllUserss,
  apiAdminUpdata,
} from "../../../api/services/ApiRequest";
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
  // const [maxHours, setMaxHours] = useState(props.data.maxHours);
  // const [minHours, setMinHours] = useState(props.data.minHours);
  // const [recommendedMaxHours, setRecommendedMaxHours] = useState(
  //   props.data.recommendedMaxHours
  // );
  const [rate, setRate] = useState(props.data.rate);

  const [isVisibleAllowedDepartments, setIsVisibleAllowedDepartments] =
    useState(false);
  const [isVisiblePosition, setIsVisiblePosition] = useState(false);
  const [isVisibleRole, setIsVisibleRole] = useState(false);
  const [isVisibleDepartment, setIsVisibleDepartment] = useState(false);
  const [
    isVisibleInstitutionalAffiliation,
    setIsVisibleInstitutionalAffiliation,
  ] = useState(false);

  const [allInstitutionalAffiliation, setAllInstitutionalAffiliation] =
    useState({
      ИКТИБ: 1,
      ИНЭП: 2,
      ИРТСУ: 3,
    });
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
  const [allDepartment, setAllDepartment] = useState([]);
  useEffect(() => {
    GetAllDepartments().then((resp) => {
      if (resp.status == 200) {
        setAllDepartment(resp.data);
      }
    });
  }, []);

  console.log(allDepartment);

  const departmentNames = allowedDepartments
    .map((id) => {
      const department = allDepartment.find((dept) => dept.id === id);
      return department ? department.name : null;
    })
    .filter(Boolean)
    .join(" ");

  const timeoutId = useRef(null);

  const fnShowListAllowedDepartments = () => {
    setIsVisibleAllowedDepartments(!isVisibleAllowedDepartments);
  };

  const fnShowListInstitutionalAffiliation = () => {
    setIsVisibleInstitutionalAffiliation(!isVisibleInstitutionalAffiliation);
  };

  const fnShowListPosition = () => {
    setIsVisiblePosition(!isVisiblePosition);
  };

  const fnShowListRole = () => {
    setIsVisibleRole(!isVisibleRole);
  };

  const fnShowListDepartment = () => {
    setIsVisibleDepartment(!isVisibleDepartment);
  };

  const chooseClickAllowedDepartments = (id) => {
    if (allowedDepartments.includes(id)) {
      allowedDepartments.splice(allowedDepartments.indexOf(id), 1);
    } else {
      allowedDepartments.push(id);
    }
    setAllowedDepartments(allowedDepartments);
    setIsVisibleAllowedDepartments(false);
    const data = {
      id: props.data.id,
      key: "allowedDepartments",
      value: allowedDepartments
    }
    apiAdminUpdata(data).then(() => props.updateAllUsers());
    console.log(data);
  };

  const chooseClickInstitutionalAffiliation = (key, value) => {
    setInstitutionalAffiliation(value);
    setIsVisibleInstitutionalAffiliation(false);
    const data = {
      id: props.data.id,
      key: "institutionalAffiliation",
      value: parseInt(key),
    };
    apiAdminUpdata(data).then(() => props.updateAllUsers());
  };

  const chooseClickPosition = (pos) => {
    setPosition(pos.name);
    setIsVisiblePosition(false);
    const data = {
      position: pos.key,
    };
    EditTeacher(props.data.educatorId, data).then(() => {
      props.updateAllUsers();
    });
  };

  const chooseClickDepartment = (dep) => {
    setDepartment(dep.name);
    setIsVisibleDepartment(false);
    const data = {
      department: dep.id,
      name: props.data.name,
    };
    console.log(data);
    EditTeacher(props.data.educatorId, data).then(() => {
      props.updateAllUsers();
    });
  };

  const chooseClickRole = (key, value) => {
    console.log(key, value);
    setRole(value);
    setIsVisibleRole(false);
    const data = { id: props.data.id, key: "role", value: parseInt(key) };
    apiAdminUpdata(data).then(() => props.updateAllUsers());
  };

  const updateInputField = (key, value) => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      const data = { rate: value };
      EditTeacher(props.data.educatorId, data).then(() => {
        props.updateAllUsers();
      });
    }, 500);
  };
  // const inputNameChange = (event) => {
  //   setName(event.target.value);
  //   updateInputField("name", event.target.value);
  // };

  // const inputLoginChange = (event) => {
  //   setLogin(event.target.value);
  //   updateInputField("login", event.target.value);
  // };

  const inputRateChange = (event) => {
    setRate(event.target.value);
    updateInputField("rate", event.target.value);
  };

  // const inputrecommendedMaxHoursChange = (event) => {
  //   setRecommendedMaxHours(event.target.value);
  //   updateInputField("recommendedMaxHours", event.target.value);
  // };

  // const inputMinHoursChange = (event) => {
  //   setMinHours(event.target.value);
  //   updateInputField("minHours", event.target.value);
  // };

  // const inputMaxHoursChange = (event) => {
  //   setMaxHours(event.target.value);
  //   updateInputField("maxHours", event.target.value);
  // };

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
                // onChange={inputNameChange}
                readOnly
              ></input>
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Почта</div>
              <input
                className={styles.rigth}
                placeholder="___"
                value={login}
                // onChange={inputLoginChange}
                readOnly
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
                      <li
                        key={key}
                        onClick={() => chooseClickRole(key, allRole[key])}
                      >
                        {allRole[key]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.PopupBody}>
              <div className={styles.left}>Институт</div>
              <div
                className={styles.rigth}
                onClick={fnShowListInstitutionalAffiliation}
              >
                {institutionalAffiliation}
              </div>
              {isVisibleInstitutionalAffiliation && (
                <div
                  style={{
                    position: "absolute",
                    top: "3.4vw",
                    borderTop: "none",
                  }}
                  className={styles.list}
                >
                  <ul>
                    {Object.keys(allInstitutionalAffiliation).map((key) => (
                      <li
                        key={allInstitutionalAffiliation[key]}
                        onClick={() =>
                          chooseClickInstitutionalAffiliation(
                            allInstitutionalAffiliation[key],
                            key
                          )
                        }
                      >
                        {key}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Разрешенные кафедры</div>
              <div
                className={styles.rigth}
                onClick={fnShowListAllowedDepartments}
              >
                {departmentNames}
              </div>
              {isVisibleAllowedDepartments && (
                <div
                  style={{
                    position: "absolute",
                    top: "3.4vw",
                    borderTop: "none",
                  }}
                  className={styles.list}
                >
                  <ul>
                    {allDepartment.map((allowedDep) => (
                      <li
                        key={allowedDep.id}
                        onClick={() =>
                          chooseClickAllowedDepartments(allowedDep.id)
                        }
                      >
                        {allowedDep.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.PopupBody}>
              <div className={styles.left}>Кафедра</div>
              <div className={styles.rigth} onClick={fnShowListDepartment}>
                {department}
              </div>
              {isVisibleDepartment && (
                <div
                  style={{
                    position: "absolute",
                    top: "3.4vw",
                    borderTop: "none",
                  }}
                  className={styles.list}
                >
                  <ul>
                    {allDepartment.map((dep) => (
                      <li
                        key={dep.id}
                        onClick={() => chooseClickDepartment(dep)}
                      >
                        {dep.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
            {/* <div className={styles.PopupBody}>
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
            </div> */}
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
