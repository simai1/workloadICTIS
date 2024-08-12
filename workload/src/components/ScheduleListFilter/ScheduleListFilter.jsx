import { useDispatch, useSelector } from "react-redux";
import styles from "./ScheduleListFilter.module.scss";
import arrowBlack from "./../../img/arrow_down.svg";
import arrowWhite from "./../../img/arrow-White.svg";
import { useEffect, useRef, useState } from "react";
import { setScheduleSelected } from "./../../store/schedule/schedule.slice";

function ScheduleListFilter() {
  const [listOpen, setListOpen] = useState(false);

  const listData = ["Все", "Новые", "Старые"];

  const store = useSelector((state) => state.scheduleSlice);
  console.log(store);
  const dispatch = useDispatch();

  //! Клик открытия листа
  const funOnClickBtn = () => {
    setListOpen(!listOpen);
  };

  //! клик выбора
  const liClick = (el) => {
    setListOpen(false);
    dispatch(setScheduleSelected({ select: el }));
  };

  const refDiv = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (refDiv.current && !refDiv.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);
  return (
    <div className={styles.ScheduleListFilter}>
      <button onClick={funOnClickBtn}>
        <p>{store.scheduleSelectedFilter.select} </p>
        <img
          src={!listOpen ? arrowWhite : arrowBlack}
          style={
            listOpen ? { transform: "rotate(-180deg)" } : { marginTop: "2px" }
          }
        />
      </button>
      {listOpen && (
        <div ref={refDiv} className={styles.list}>
          <img src={arrowBlack} onClick={() => setListOpen(false)} />
          <ul>
            {listData.map((el, index) => (
              <li key={index} onClick={() => liClick(el)}>
                {el}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ScheduleListFilter;
