import React, { useEffect, useRef, useState } from "react";
import styles from "./ContextMenu.module.scss";
import { SubMenu } from "./SubMenu";
import { EducatorMenu } from "./EducatorMenu";
import DataContext from "../../context";
import {
  EducatorLK,
  apiAddAttaches,
  apiUnAttaches,
  createComment,
  createOffer,
} from "../../api/services/ApiRequest";
import { Highlight } from "./Highlight";
import MenuPop from "./MenuPop";
import {
  combineData,
  splitWorkloadCount,
  upDateEducator,
  addСhangedData,
} from "./Function";
import CommentsMenu from "./CommentsMenu";
import PopupOffer from "./PopupOffer";

const ContextMenu = (props) => {
  const { appData, tabPar, basicTabData } = React.useContext(DataContext);
  const [menuShow, setMenuShow] = useState("");
  //! функция которая открывает попап подтверждения отправки предложения
  const [popupOffer, setPopupOffer] = useState(null);
  const [popupComment, setPopupComment] = useState(false);
  const [popupCommentAction, setPopupCommentAction] = useState(null);

  useEffect(() => {
    console.log("bufferAction", appData.bufferAction);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  //! нажатие на разделить
  const handleMouseClickPop = () => {
    setMenuShow(menuShow === "subMenu" ? "" : "subMenu");
  };

  //! нажатие на добавить преподавателя
  const addEducator = () => {
    setMenuShow(menuShow === "educator" ? "" : "educator");
  };

  //! нажатие на предложить
  const onClickPropose = () => {
    setMenuShow(menuShow === "propose" ? "" : "propose");
  };

  //! нажатие выделить
  const ClickHighlightshov = () => {
    setMenuShow(menuShow === "highlight" ? "" : "highlight");
  };

  //! оставить комментарий
  const onAddComment = () => {
    console.log("оставить комментарий");
    setMenuShow(menuShow === "commentsMenu" ? "" : "commentsMenu");
  };

  //! Выбор преподавателя
  const selectedEducator = (id) => {
    // appData.metodRole[appData.myProfile?.role]?.some((el) => el === 9) &&
    //   tabPar.setContextMenuShow(!tabPar.contextMenuShow);
    setMenuShow("");

    const data = {
      workloadId: tabPar.selectedTr[0],
      educatorId: id,
    };

    if (menuShow === "educator") {
      EducatorLK(id).then((dataReq) => {
        const { newData, prevState } = upDateEducator(
          basicTabData?.workloadDataFix,
          tabPar?.selectedTr[0],
          dataReq?.name
        );
        const edicatorName = { edicatorName: dataReq?.name };
        basicTabData.setWorkloadDataFix(newData);
        basicTabData.setFiltredData(newData);
        const workloadId = data.workloadId;
        appData.setBufferAction([
          {
            request: "addEducatorWorkload",
            data,
            prevState,
            edicatorName,
            workloadId,
          },
          ...appData.bufferAction,
        ]);
        //! занесем id измененнных данных в состояние
        tabPar.setChangedData(
          addСhangedData(tabPar.changedData, "educator", [tabPar.selectedTr[0]])
        );
      });
    } else if (menuShow === "propose") {
      setPopupOffer(id);
      console.log("popup", id);
    }
  };

  //! функция для подтверждения или отмены отправки предложения
  const onClickOfferPopup = (action) => {
    const id = popupOffer;
    if (action) {
      //! отправляем запрос на добавление предложения
      EducatorLK(id).then((Educator) => {
        const offer = {
          Educator: appData.myProfile,
          workloadId: tabPar.selectedTr[0],
          educatorId: Educator.id,
        };
        tabPar.setAllOffersData([...tabPar.allOffersData, offer]);
        createOffer(offer).then(() => {
          setPopupOffer(null);
          tabPar.setContextMenuShow(false);
          appData.metodRole[appData.myProfile?.role]?.some((el) => el === 17) &&
            basicTabData.funUpdateOffers();
          appData.metodRole[appData.myProfile?.role]?.some((el) => el === 19) &&
            basicTabData.funUpdateOffersLecturer();
        });
      });
    } else {
      setPopupOffer(null);
      tabPar.setContextMenuShow(false);
    }
  };

  //! попап при отправке комментрия
  const onClickCommentPopup = (action) => {
    if (action) {
      createComment(popupCommentAction).then(() => {
        basicTabData.funUpdateAllComments();
      });
      setPopupComment(false);
    } else {
      setPopupComment(false);
    }
  };

  //! разделение нагрузки на count
  const handleSplitWorkload = (cou) => {
    const count = Number(cou);
    console.log("tabPar.selectedTr", tabPar.selectedTr);
    const dataSel = {
      ids: tabPar.selectedTr,
      n: count,
    };
    const prev = basicTabData.workloadDataFix.filter((item) =>
      tabPar.selectedTr.some((el) => el === item.id)
    );

    console.log("prev", prev);

    // Создаем новый массив для измененных данных
    let updatedData = [...basicTabData.workloadDataFix];
    const funData = splitWorkloadCount(updatedData, tabPar.selectedTr, count);
    basicTabData.setWorkloadDataFix(funData.updatedData);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "split", funData.blocked)
    );
    //! буфер
    appData.setBufferAction([
      {
        id: appData.bufferAction.length,
        request: "splitWorkload",
        data: dataSel,
        prevState: [...prev],
        newState: funData.newState,
        newIds: [...funData.newIds],
      },
      ...appData.bufferAction,
    ]);
    //! занесем id измененнных данных в состояние
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "split", funData.newIds)
    );
    tabPar.setSelectedTr([]);
    tabPar.setContextMenuShow(false);
    setMenuShow("");
  };

  //! соединение нагрузок
  const handleJoinWorkloads = () => {
    setMenuShow("");
    const data = {
      ids: tabPar.selectedTr,
    };
    const funData = combineData(
      basicTabData.workloadDataFix,
      tabPar.selectedTr
    );
    if (funData === null) {
      // console.error("неправильно соеденяем данные");
      appData.seterrorPopUp(true);
      console.log(appData.errorPopUp);
    } else {
      tabPar.setSelectedTr([]);
      basicTabData.setWorkloadDataFix(funData.newUpdatedData);
      //! буфер
      appData.setBufferAction([
        {
          id: appData.bufferAction.length,
          request: "joinWorkloads",
          data: data,
          newState: funData.newState,
          prevState: funData.prevState,
        },
        ...appData.bufferAction,
      ]);
      tabPar.setChangedData(
        addСhangedData(tabPar.changedData, "join", data.ids)
      );
    }
    tabPar.setContextMenuShow(false);

    tabPar.setSelectedTr([]);
  };
  //! удаление нагрузки
  const handleDeletWorkload = () => {
    setMenuShow("");
    const data = { ids: tabPar.selectedTr };
    appData.setBufferAction([
      { request: "deleteWorkload", data },
      ...appData.bufferAction,
    ]);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "deleted", data.ids)
    );
    tabPar.setSelectedTr([]);
    tabPar.setContextMenuShow(false);
  };

  //! удалить преподавателя у нагрузки
  const removeEducator = () => {
    setMenuShow("");
    // const { selectedTr, workloadDataFix, setWorkloadDataFix } = tabPar;
    const workloadId = tabPar.selectedTr[0];
    const prevState = basicTabData.workloadDataFix.find(
      (obj) => obj.id === workloadId
    )?.educator;
    const newUpdatedData = basicTabData.workloadDataFix.map((obj) =>
      obj.id === workloadId ? { ...obj, educator: null } : obj
    );
    basicTabData.setWorkloadDataFix(newUpdatedData);
    //! заносим данные в буффер
    appData.setBufferAction([
      { request: "removeEducatorinWorkload", data: { workloadId }, prevState },
      ...appData.bufferAction,
    ]);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "educator", [workloadId])
    );
    tabPar.setContextMenuShow(false);
  };

  //! функция закрепления
  const pinaCell = () => {
    // запрос на закрепление
    const fastened = tabPar.selectedTr.filter(
      (item) => !tabPar.fastenedData.some((el) => el.workloadId === item)
    );
    console.log(fastened);
    if (fastened.length > 0) {
      const data = {
        workloadIds: fastened,
      };
      apiAddAttaches(data).then(() => {
        tabPar.setContextMenuShow(false);
        tabPar.setSelectedTr([]);
        // запрос на бд для обновления закрепленных данных
        basicTabData.funUpdateFastenedData();
      });
    }
  };

  //! открепить
  const unPinaCell = () => {
    const fastened = tabPar.fastenedData
      .filter((item) => tabPar.selectedTr.find((el) => el === item.workloadId))
      .map((item) => item.id);

    if (fastened.length > 0) {
      apiUnAttaches({ attachesIds: fastened }).then(() => {
        const mass = tabPar.fastenedData.filter(
          (item) =>
            !tabPar.selectedTr.some((el) => el === item.workloadId) && item
        );
        tabPar.setFastenedData(mass);
        tabPar.setContextMenuShow(false);
        tabPar.setSelectedTr([]);
        basicTabData.funUpdateTable(
          basicTabData.tableDepartment.find(
            (el) => el.name === basicTabData?.nameKaf
          )?.id
        );
      });
    }
  };

  //! стили позиционирование меню
  const positStyle = {
    position: "fixed",
    top: tabPar.contextPosition.y,
    left: tabPar.contextPosition.x,
  };

  //! закрытие модального окна при нажати вне него
  const conxextMenuRef = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (
        conxextMenuRef.current &&
        !conxextMenuRef.current.contains(event.target)
      ) {
        tabPar.setContextMenuShow(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div
      // ref={props.refContextMenu}
      ref={conxextMenuRef}
      onContextMenu={handleContextMenu}
      className={styles.ContextMenu}
    >
      {popupOffer && (
        <PopupOffer
          onClickOfferPopup={onClickOfferPopup}
          title={"Вы уверенны что хотите отправить предложение?"}
        />
      )}
      {popupComment && (
        <PopupOffer
          onClickOfferPopup={onClickCommentPopup}
          title={"Вы уверенны что хотите отправить комментарий?"}
        />
      )}
      <div style={positStyle} className={styles.blockMenu}>
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 9) && (
          <MenuPop
            btnText={"Добавить преподователя"}
            func={addEducator}
            menuShow={menuShow === "educator"}
            img={true}
          />
        )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 10) &&
          tabPar.selectedTr.length === 1 && (
            <MenuPop
              btnText={"Удалить преподавателя"}
              func={removeEducator}
              img={false}
            />
          )}
        {/* {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 31)&& */}

        <MenuPop btnText={"Закрепить"} func={pinaCell} img={false} />
        {/* } */}
        {/* {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 31)&& */}
        <MenuPop btnText={"Открепить"} func={unPinaCell} img={false} />
        {/* } */}

        {appData.metodRole[appData.myProfile?.role]?.some(
          (el) =>
            el === 11 &&
            basicTabData.workloadDataFix
              .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
              .every((it) => it.isSplit === false)
        ) && (
          <MenuPop
            btnText={"Разделить"}
            func={handleMouseClickPop}
            menuShow={menuShow === "subMenu"}
            img={true}
          />
        )}

        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 22) &&
          tabPar.selectedTr.length === 1 && (
            <MenuPop
              btnText={"Оставить комментарий"}
              func={onAddComment}
              menuShow={menuShow === "commentsMenu"}
              img={true}
            />
          )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 12) &&
          tabPar.selectedTr.length > 1 && (
            <MenuPop
              btnText={"Объеденить"}
              func={handleJoinWorkloads}
              img={false}
            />
          )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 18) &&
          tabPar.selectedTr.length === 1 && (
            <MenuPop
              btnText={"Предложить"}
              func={onClickPropose}
              menuShow={menuShow === "propose"}
              img={true}
            />
          )}
        {appData.metodRole[appData.myProfile?.role]?.some(
          (el) => el === 13
        ) && (
          <MenuPop btnText={"Удалить"} func={handleDeletWorkload} img={false} />
        )}
        <MenuPop
          btnText={"Выделить"}
          func={ClickHighlightshov}
          menuShow={menuShow === "highlight"}
          img={true}
        />
      </div>

      {menuShow === "subMenu" && (
        // разделение нагрузки
        <SubMenu
          contextPosition={tabPar.contextPosition}
          handleSplitWorkload={handleSplitWorkload}
        />
      )}
      {(menuShow === "educator" || menuShow === "propose") && (
        // меню с выбором преподавалетля
        <EducatorMenu
          propose={menuShow === "propose"}
          contextPosition={tabPar.contextPosition}
          selectedEducator={selectedEducator}
        />
      )}
      {menuShow === "highlight" && (
        // выделение нагрузки
        <Highlight />
      )}
      {menuShow === "commentsMenu" && (
        <CommentsMenu
          setMenuShow={setMenuShow}
          setPopupComment={setPopupComment}
          popupCommentAction={popupCommentAction}
          setPopupCommentAction={setPopupCommentAction}
        />
      )}
    </div>
  );
};

export default ContextMenu;
