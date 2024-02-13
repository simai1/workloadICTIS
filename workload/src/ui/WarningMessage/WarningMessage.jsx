import React from "react";
import styles  from './WarningMessage.module.scss'
import arrow from "./../../img/arrow.svg"
const WarningMessage = ({id="1", name="Бабулинко А А", hours="98"}) => {
    return(
        <li>
            <div className={styles.nameWarnName}>
            <p className={styles.circlesbuttonWarn}><span>{id}</span></p>
            <p>{name}</p>
            </div>
            <div className={styles.buttonWarnBlock}>
                <p>Перегрузка - <span>{hours}</span> ч</p>
                <img className={styles.arrowButton} src={arrow} alt="arrow"/>
            </div>
       </li>
    )
}

export default WarningMessage;