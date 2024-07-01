import React, { useEffect, useState } from "react";
import styles from "./Popup.module.scss";
import { roles, tableHeaderPopup } from "../AdminData";
import { GetAllDepartments, apiAdminUpdata } from "../../../api/services/ApiRequest";
import DataContext from "../../../context";
function Popup(props) {
  const [popupData, setPopupData] = useState({ ...props.data });
  const [listData, setListData] = useState([]);
  const [listShow, setListShow] = useState("");
  const {basicTabData } = React.useContext(DataContext);
  const [department, setDepartment] = useState([])
  useEffect(()=>{
    GetAllDepartments().then((resp)=>{
      if(resp.status == 200){
        setDepartment(resp.data);
        console.log("department", department)
      }
    })
  },[])
  //! при клике на инпут внрути попапа
  const inpClick = (key) => {
    if (listShow === key) {
      setListShow("");
      setListData([]);
    } else {
      if (key === "role") {
        setListShow(key);
        setListData(Object.keys(roles));
      }
      if (key === "department") {
        setListShow(key);
        setListData(department.map((el)=> el.name));
      }
    }
    if (key === "role") {
      setListData(Object.keys(roles)); 
    }
    if (key === "department") {
      setListData(department.map((el)=> el.name));
    }
  };

  const liClick = (value, key) => {
    setListShow("");
    if (key === "role") {
      const data = {
        id: popupData.id,
        key: key,
        value: Object.keys(roles).findIndex((e) => e === value) + 1,
      };
      apiAdminUpdata(data).then((req) => {
        console.log(req);
        if (req?.status === 200) {
          let dat = { ...popupData };
          dat[key] = value;
          setPopupData(dat);
        }
      });
    }else if(key === 'department'){
      // const data = {
      //   id: popupData.id,
      //   key: key,
      //   value: Object.keys(department?.name).findIndex((e) => e === value) + 1,
      // };
    }

    //  apiAdminUpdata
  };

  return (
    <>
    <div className={styles.Popup}>
      <div className={styles.PopupBox}>
        <div className={styles.box_scroll}>
          {tableHeaderPopup.map((keys) => (
            <>
              <div key={keys.key} className={styles.PopupBody}>
                <div className={styles.left}>{keys.key}</div>
                <input
                  onClick={() => inpClick(keys.key)}
                  value={popupData && popupData[keys.key]}
                  placeholder="___"
                  className={styles.rigth}
                />
                {listShow === keys.key && (
                  <div className={styles.list}>
                    <div
                      style={{ top: "-6px", left: "9px" }}
                      className={styles.left}
                    >
                      {keys.key}
                    </div>
                    <ul>
                      {listData.map((item) => (
                        <li onClick={() => liClick(item, keys.key)}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ))}
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
