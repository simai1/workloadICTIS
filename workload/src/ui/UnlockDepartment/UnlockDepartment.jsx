import React, { useEffect, useRef } from "react";

import styles from "./UnlockDepartment.module.scss";
import DataContext from "../../context";
import { ApiUnblockTable, UnblockTablePlease } from "../../api/services/ApiRequest";
const UnlockDepartment = (props) => {
  const { basicTabData, appData } = React.useContext(DataContext);
  const refSave = useRef(null);

  
    const UnblockTable = () =>{
        //! функция разблокирования таблицы
        if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 48)){
            const idTableUnlock = basicTabData?.tableDepartment.find((el)=>el.name === basicTabData?.nameKaf).id
            ApiUnblockTable(idTableUnlock).then((resp)=>{
              if(resp.status === 200){
                props.denyClick()
                basicTabData.funGetDepartment();
                basicTabData.setnameKaf(basicTabData?.tableDepartment[0].name)
                appData.setgodPopUp(true);
              }else{
                appData.seterrorPopUp(true)
                props.denyClick()
              }
            })
        }else{  //! функция запроса на разблокирование таблицы
            let idTableUnlock = 0
            if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 53)){
              idTableUnlock = appData.myProfile.educator.departmentId
            }else{
              idTableUnlock = basicTabData?.tableDepartment.find((el)=>el.name === basicTabData?.nameKaf).id
            }
            UnblockTablePlease(idTableUnlock).then((resp)=>{
              if(resp.status === 200){
                props.denyClick()
                if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 53)){
                  idTableUnlock = appData.myProfile.educator.departmentId
                  basicTabData.funUpdateTable(appData.myProfile.educator.departmentId);
                }
                else{
                  basicTabData.funUpdateTable(
                    basicTabData.tableDepartment.find(
                      (el) => el.name === basicTabData?.nameKaf
                    )?.id
                  );
                }
              }
            })
        }
    }

   //! сброс состояния при клике на другую область
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (refSave.current && !refSave.current.contains(event.target)) {
            props.denyClick();
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);


  return (
    <div className={styles.UnlockDepartment} ref={refSave}>
           <div className={styles.trangle}></div>
      <div>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.btnBox}>
          <button onClick={() => props.denyClick()}>Нет</button>
          <button onClick={UnblockTable}>Да</button>
        </div>
      </div>

    </div>
  );
};

export default UnlockDepartment;
