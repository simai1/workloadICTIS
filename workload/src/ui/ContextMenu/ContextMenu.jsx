import React, { useEffect, useRef, useState } from "react";
import styles from "./ContextMenu.module.scss";
import { SubMenu } from "./Menu/SubMenu";
import { EducatorMenu } from "./Menu/EducatorMenu";
import DataContext from "../../context";
import {
  EducatorLK,
  apiAddAttaches,
  apiUnAttaches,
  createComment,
  createOffer,
} from "../../api/services/ApiRequest";
import { Highlight } from "./Menu/Highlight";
import MenuPop from "./Menu/MenuPop";
import { combineData, addСhangedData, upDateEducators } from "./Function";
import CommentsMenu from "./Menu/CommentsMenu";
import PopupOffer from "./Menu/PopupOffer";
import SplitByHoursMenu from "./Menu/SplitByHoursMenu";
import { UniversalPopup } from "../UniversalPopup/UniversalPopup";

const ContextMenu = () => {
  const { appData, tabPar, basicTabData } = React.useContext(DataContext);
  const [menuShow, setMenuShow] = useState("");
  //! функция которая открывает попап подтверждения отправки предложения
  const [popupOffer, setPopupOffer] = useState(null);
  const [popupComment, setPopupComment] = useState(false);
  const [popupCommentAction, setPopupCommentAction] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  console.log("bufferAction", appData.bufferAction);

  //! нажатие на разделить
  const handleMouseClickPop = () => {
    setMenuShow(menuShow === "subMenu" ? "" : "subMenu");
  };

  const splitByHoursFun = () => {
    setMenuShow(menuShow === "splitByHoursMenu" ? "" : "splitByHoursMenu");
    if (
      basicTabData.workloadDataFix.find(
        (item) => item.id === tabPar.selectedTr[0]
      ).audienceHours === 0
    ) {
      appData.setUniversalPopupTitle(
        "Внимание, аудиторные часы равняются нулю!"
      );
    }
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
    setMenuShow(menuShow === "commentsMenu" ? "" : "commentsMenu");
  };

  //! функция выбора преподавателя
  const selectedEducator = (id) => {
    setMenuShow("");
    const data = {
      workloadIds: tabPar.selectedTr,
      educatorId: id,
    };
    console.log(data);
    if (menuShow === "educator") {
      EducatorLK(id).then((dataReq) => {
        const { newData, prevState } = upDateEducators(
          basicTabData?.workloadDataFix,
          tabPar?.selectedTr,
          dataReq?.name
        );
        const edicatorName = { edicatorName: dataReq?.name };
        basicTabData.setWorkloadDataFix(newData);
        basicTabData.setFiltredData(newData);
        const workloadId = data.workloadIds;
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
          addСhangedData(tabPar.changedData, "educator", tabPar.selectedTr)
        );
      });
    } else if (menuShow === "propose") {
      setPopupOffer(id);
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

  //! соединение нагрузок
  const handleJoinWorkloads = (action) => {
    setMenuShow("");
    const data = {
      ids: tabPar.selectedTr,
    };
    const funData = combineData(
      basicTabData.workloadDataFix,
      tabPar.selectedTr,
      action
    );
    if (funData === null) {
      appData.seterrorPopUp(true);
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

  // //! обьединение по часам
  // const  handleJoinWorkloadsByHors = () => {

  // }
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
    const workloadIds = tabPar.selectedTr;
    let prevState = [];
    basicTabData.workloadDataFix.map((obj) => {
      if (workloadIds.some((e) => e === obj.id)) {
        prevState.push({ workloadId: obj.id, state: obj.educator });
      }
    });
    const newUpdatedData = basicTabData.workloadDataFix.map((obj) =>
      workloadIds.some((e) => e === obj.id) ? { ...obj, educator: null } : obj
    );
    basicTabData.setWorkloadDataFix(newUpdatedData);
    //! заносим данные в буффер
    appData.setBufferAction([
      { request: "removeEducatorinWorkload", data: { workloadIds }, prevState },
      ...appData.bufferAction,
    ]);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "educator", workloadIds)
    );
    tabPar.setContextMenuShow(false);
  };

  //! функция закрепления
  const pinaCell = () => {
    // запрос на закрепление
    const fastened = tabPar.selectedTr.filter(
      (item) => !tabPar.fastenedData.some((el) => el.workloadId === item)
    );
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
            btnText={"Добавить преподавателя"}
            func={addEducator}
            menuShow={menuShow === "educator"}
            img={true}
          />
        )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 10) &&
          new Set(tabPar.selectedTr).size < 10 && (
            <MenuPop
              btnText={"Удалить преподавателя"}
              func={removeEducator}
              img={false}
            />
          )}
        <MenuPop btnText={"Закрепить"} func={pinaCell} img={false} />
        <MenuPop btnText={"Открепить"} func={unPinaCell} img={false} />
        {appData.metodRole[appData.myProfile?.role]?.some(
          (el) =>
            el === 11 &&
            basicTabData.workloadDataFix
              .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
              .every((it) => it.isSplit === false)
        ) && (
          <MenuPop
            btnText={"Разделить по подгруппам"}
            func={handleMouseClickPop}
            menuShow={menuShow === "subMenu"}
            img={true}
          />
        )}

        {appData.metodRole[appData.myProfile?.role]?.some(
          (el) =>
            el === 11.1 &&
            basicTabData.workloadDataFix
              .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
              .every((it) => it.isSplit === false)
        ) && (
          <MenuPop
            btnText={"Разделить по часам"}
            func={splitByHoursFun}
            menuShow={menuShow === "splitByHoursMenu"}
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
              btnText={"Объеденить по подгруппам"}
              func={() => handleJoinWorkloads("g")}
              img={false}
            />
          )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 12) &&
          tabPar.selectedTr.length > 1 && (
            <MenuPop
              btnText={"Объеденить по часам"}
              func={() => handleJoinWorkloads("h")}
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
          setMenuShow={setMenuShow}
          contextPosition={tabPar.contextPosition}
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
      {menuShow === "splitByHoursMenu" && (
        <SplitByHoursMenu styles={styles} setMenuShow={setMenuShow} />
      )}
      {appData.universalPopupTitle !== "" && <UniversalPopup />}
    </div>
  );
};

export default ContextMenu;
