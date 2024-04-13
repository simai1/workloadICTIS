import React, { useState } from "react";
import styles  from './FiltredRows.module.scss'
import ArrowImg from "./../../img/arrow-White.svg"
import Arrowtop from "./../../img/arrow.svg"
import pencil from "./../../img/pencil.svg"
import filter from "./../../img/filter.svg"
import thimbtack from "./../../img/thumbtack.svg"
const FiltredRows = ({props}) => {
    const [OpenCloseMenu, setOpenCloseMenu] = useState(false);
    const [SelectedText, setSelectedText] = useState("Все дисциплины");

   
    const OpCloseMenu = () => {
        setOpenCloseMenu(!OpenCloseMenu);
    }
    const  Fuctionmenu = (text) =>{
        setOpenCloseMenu(!OpenCloseMenu);
        setSelectedText(text)
    }
    return(
   
     <div className={styles.FiltredRows}> 
        <div className={styles.FiltredRows__inner}>
            <button onClick={OpCloseMenu}>{SelectedText} <img src={ArrowImg} alt="ArrowImg"></img></button>
            {OpenCloseMenu && (
                <ul className={styles.FiltredRows__list}>
                    <li onClick={()=> Fuctionmenu("Все дисциплины")} >Все дисциплины <img className={styles.FirstImg} src={Arrowtop} alt="Arrowtop"></img></li>
                    <li onClick={()=> Fuctionmenu("Выделенные")}>Выделенные <img src={pencil} alt="pencil"></img></li>
                    <li onClick={()=> Fuctionmenu("Измененные")}>Измененные <img src={filter} alt="filter"></img></li>
                    <li onClick={()=> Fuctionmenu("Закрепленные")}>Закрепленные <img src={thimbtack} alt="thimbtack"></img></li>
                </ul>
            )}
        </div>
     </div>
    )
}

export default FiltredRows;