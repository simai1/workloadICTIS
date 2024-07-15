import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./../UniversalTable.module.scss";
import DataContext from "../../../context";
import { ReactComponent as LogoAllComment } from "./../../../img/arrow_down.svg";
import { AcceptOffer, AcceptOfferZK } from "../../../api/services/ApiRequest";

function Offers(props) {
  const { appData, basicTabData } = useContext(DataContext);
  const [offerWindowShow, setOfferWindowShow] = useState(false);
  const [onAllOffersShow, setOnAllOffersShow] = useState(false);

  const circleClick = () => {
    setOfferWindowShow(!offerWindowShow);
  };
  const allOffersClick = () => {
    setOnAllOffersShow(!onAllOffersShow);
  };
  //! функция отклонить
  const reject = (offerData) => {
    // //! отклоняем дирекцией, сделалть зависимость от роли
    // //! отклоняем от зк
    // if (appData.myProfile?.role === "DEPARTMENT_HEAD") {
    //   const data = { id: offerData.offer.id, status: 3 };
    //   AcceptOfferZK(data).then(() => {
    //     basicTabData.funUpdateOffers();
    //     setOfferWindowShow(false);
    //   });
    // }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 38)) {
      const data = { id: offerData.offer.id, status: 5 };
      AcceptOffer(data).then(() => {
        basicTabData.funUpdateOffers();
        setOfferWindowShow(false);
      });
    }
  };
  //! функция применить
  const accept = (offerData) => {
    //! принимаем от зк
    // if (appData.myProfile?.role === "DEPARTMENT_HEAD") {
    //   const data = { id: offerData.offer.id, status: 2 };
    //   AcceptOfferZK(data).then(() => {
    //     setOfferWindowShow(false);
    //     // обновляем данные таблицы и предложений
    //     basicTabData.funUpdateOffers();
    //     basicTabData.funUpdateTable(
    //       basicTabData.tableDepartment.find(
    //         (el) => el.name === basicTabData.nameKaf
    //       )?.id
    //     );
    //   });
    // }
    //! принимаем от дирекции
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 38)) {
      const data = { id: offerData.offer.id, status: 4 };
      AcceptOffer(data).then(() => {
        setOfferWindowShow(false);
        // обновляем данные таблицы и предложений
        basicTabData.funUpdateOffers();
        basicTabData.funUpdateTable(
          basicTabData.tableDepartment.find(
            (el) => el.name === basicTabData.nameKaf
          )?.id
        );
      });
    }
  };
  const offerRender = (offerData) => {
    return (
      <div key={offerData.offer.id} className={styles.offerbox}>
        <div className={styles.offerTitle}>{offerData.offer.proposer.name}</div>
        <div className={styles.offerCenter}>предложил преподавателя</div>
        <div className={styles.offerEducator}>
          {offerData.offer.educator.name}
        </div>
        {appData.metodRole[appData.myProfile?.role]?.some(
          (el) => el === 38
        ) && (
          <div className={styles.offerButton}>
            <button className={styles.left} onClick={() => reject(offerData)}>
              Отклонить
            </button>
            <button className={styles.rigth} onClick={() => accept(offerData)}>
              Принять
            </button>
          </div>
        )}
      </div>
    );
  };

  //! закрытие модального окна при нажати вне него
  const offerRef = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (offerRef.current && !offerRef.current.contains(event.target)) {
        setOfferWindowShow(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <>
      {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 34) && (
        <div
          ref={offerRef}
          className={styles.Offers}
          onClick={(e) => e.stopPropagation()}
        >
          {props.offerData.length > 0 && (
            <div>
              <div className={styles.circle} onClick={circleClick}>
                {props.offerData.length}
              </div>
            </div>
          )}
          {offerWindowShow && (
            <div className={styles.containerOffer}>
              {onAllOffersShow ? (
                <div className={styles.offerScroll}>
                  {props.offerData.map((item) => offerRender(item))}
                </div>
              ) : (
                offerRender(props.offerData[0])
              )}
              {props.offerData.length > 1 && (
                <div className={styles.btn_left} onClick={allOffersClick}>
                  <span className={onAllOffersShow ? styles.blue : null}>
                    {props.offerData.length}
                  </span>
                  <LogoAllComment
                    className={onAllOffersShow ? styles.svg : null}
                    height={10}
                    width={15}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Offers;
