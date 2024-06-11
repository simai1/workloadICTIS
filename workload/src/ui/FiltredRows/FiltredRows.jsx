import React, { useContext, useState } from "react";
import styles from "./FiltredRows.module.scss";
import ArrowImg from "./../../img/arrow-White.svg";
import Arrowtop from "./../../img/arrow.svg";
import pencil from "./../../img/pencil.svg";
import filter from "./../../img/filter.svg";
import thimbtack from "./../../img/thumbtack.svg";
import DataContext from "../../context";
const FiltredRows = () => {
  const [OpenCloseMenu, setOpenCloseMenu] = useState(false);
  const { tabPar, basicTabData } = useContext(DataContext);

  //! закрытие модального окна при нажатии вне него
  const refFR = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (refFR.current && !refFR.current.contains(event.target)) {
        setOpenCloseMenu(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const OpCloseMenu = () => {
    setOpenCloseMenu(!OpenCloseMenu);
  };
  const Fuctionmenu = (text) => {
    setOpenCloseMenu(!OpenCloseMenu);
    tabPar.setSelectedFilter(text);
  };
  const AllDist = ()=>{
    basicTabData.funUpdateTable();
    Fuctionmenu("Все дисциплины");
  }
  return (
    <div ref={refFR} className={styles.FiltredRows}>
      <div className={styles.FiltredRows__inner}>
        <button onClick={OpCloseMenu}>
          {tabPar.selectedFilter} <img src={ArrowImg} alt="ArrowImg"></img>
        </button>
        {OpenCloseMenu && (
          <ul className={styles.FiltredRows__list}>
            <li onClick={() =>
              AllDist()
            }>
              Все дисциплины
              <img
                className={styles.FirstImg}
                src={Arrowtop}
                alt="Arrowtop"
              ></img>
            </li>
            <li onClick={() => Fuctionmenu("Закрепленные")}>
              Закрепленные <img src={thimbtack} alt="thimbtack"></img>
            </li>
            <li onClick={() => Fuctionmenu("Измененные")}>
              Измененные <img src={filter} alt="filter"></img>
            </li>
            <li onClick={() => Fuctionmenu("Выделенные")}>
              Выделенные <img src={pencil} alt="pencil"></img>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default FiltredRows;
