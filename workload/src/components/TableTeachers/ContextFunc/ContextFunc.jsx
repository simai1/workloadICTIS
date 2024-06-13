import React, { useEffect, useRef } from "react";
import styles from "./ContextFunc.module.scss"
import { DeleteTeacher } from "../../../api/services/ApiRequest";
export function ContextFunc(props){

        const refMenu = useRef(null)
      useEffect(() => {
        const handler = (event) => {
          if (
            refMenu.current &&
            !refMenu.current.contains(event.target)
          ) {
            props.setSelectRow(null);
          }
        };
        document.addEventListener("click", handler, true);
        return () => {
          document.removeEventListener("click", handler);
        };
      }, []);
    //! стили позиционирование меню
    const positStyle = {
        position: "fixed",
        top: props.y,
        left: props.x,
    };

    const deleteTeacher = () =>{
        DeleteTeacher(props.selectRows).then(()=>{
            props.updateTable()
            props.setSelectRow(null);
        })
    }
return(
    <div ref={refMenu} style={positStyle} className={styles.MenuCont}>
        <div className={styles.MenuContInner}>
            <div>
                <button className={styles.butttonMenuContext} onClick={()=>props.setVizibleCont(true)}>Редактировать</button>
            </div>
            <div>
                <button className={styles.butttonMenuContext} onClick={deleteTeacher}>Удалить</button>  
            </div>
        </div>
    </div>
)
}