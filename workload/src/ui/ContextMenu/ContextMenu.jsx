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
import {
  combineData,
  addСhangedData,
  upDateEducators,
  combineDataIdentify,
} from "./Function";
import CommentsMenu from "./Menu/CommentsMenu";
import PopupOffer from "./Menu/PopupOffer";
import SplitByHoursMenu from "./Menu/SplitByHoursMenu";
import { UniversalPopup } from "../UniversalPopup/UniversalPopup";
import { addWorkload } from "./ContextMenuData";

const ContextMenu = () => {
  const { appData, tabPar, basicTabData } = React.useContext(DataContext);
  const [menuShow, setMenuShow] = useState("");
  //! функция которая открывает попап подтверждения отправки предложения
  const [popupOffer, setPopupOffer] = useState(null);
  const [popupComment, setPopupComment] = useState(false);
  const [popupCommentAction, setPopupCommentAction] = useState(null);
  const conxextMenuRefBlock = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  //! нажатие на разделить
  const handleMouseClickPop = () => {
    setMenuShow(menuShow === "subMenu" ? "" : "subMenu");
  };

  const splitByHoursFun = () => {
    setMenuShow(menuShow === "splitByHoursMenu" ? "" : "splitByHoursMenu");
    if (
      basicTabData.workloadDataFix.find(
        (item) => item.id === tabPar.selectedTr[0]
      ).audienceHours === 0 &&
      menuShow === ""
    ) {
      appData.setUniversalPopupTitle(
        "Внимание, аудиторные часы равняются нулю!"
      );
    }
  };

  //! разделение вкр
  const splitVKR = () => {
    setMenuShow(menuShow === "splitVKR" ? "" : "splitVKR");
  };

  //! разделение доп нагрузки
  const splitAddModal = () => {
    const itname = basicTabData.workloadDataFix.filter((item) =>
      tabPar.selectedTr.some((el) => el === item.id)
    )[0].workload;
    console.log("itname", itname);
    const type = addWorkload.find((el) => el.name === itname);
    if (type) {
      tabPar.setTypeSplit(type);
    }
    setMenuShow(menuShow === "splitByHoursMenu" ? "" : "splitByHoursMenu");
  };

  //! разделение кандидатского экзамена
  const funSplitCandidatesExam = () => {
    setMenuShow(
      menuShow === "splitCandidatesExam" ? "" : "splitCandidatesExam"
    );
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
      tabPar.setContextMenuShow(false);
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
    let data = {
      ids: tabPar.selectedTr,
    };

    const funData = combineData(
      basicTabData.workloadDataFix,
      tabPar.selectedTr,
      action
    );

    if (funData === null) {
      appData.seterrorPopUp(true);
      const text = combineDataIdentify(
        basicTabData.workloadDataFix,
        tabPar.selectedTr,
        action
      );
      if (text && text !== "Не совпадает: ") {
        appData.setPopupErrorText(
          `Извините, данную операцию невозможно выполнить. ${text}`
        );
      }
    } else {
      tabPar.setSelectedTr([]);
      basicTabData.setWorkloadDataFix(funData.newUpdatedData);

      const hoursData = {
        numberOfStudents: funData.newState.numberOfStudents,
        hours: funData.newState.hours,
        ratingControlHours: funData.newState.ratingControlHours,
        audienceHours: funData.newState.audienceHours,
      };

      if (action === "add" || action === "candidatesExam") {
        data = {
          ids: tabPar.selectedTr,
          workloadData: hoursData,
        };
      }

      //! буфер
      appData.setBufferAction([
        {
          id: appData.bufferAction.length,
          request: "joinWorkloads",
          data: data,
          hoursData: hoursData,
          newState: funData.newState,
          prevState: funData.prevState,
          action: action === "candidatesExam" ? `?type=add` : `?type=${action}`,
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

  //! функция определения выводить ли разделить
  const funGetSplit = () => {
    if (
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 11) &&
      !funGetSplitDopWorkload()
    ) {
      if (
        basicTabData.workloadDataFix
          .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
          .every((it) => it.isSplit === false && it.workload === "Защита ВКР")
      ) {
        return true;
      } else return false;
    } else return false;
  };

  //! функция для определения разделения доп нагрузки
  function funGetSplitDopWorkload() {
    // if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 11)) {
    const a = basicTabData.workloadDataFix.find((item) =>
      tabPar.selectedTr.some((el) => el === item.id)
    ).workload;
    console.log(
      "addWorkload? ",
      addWorkload.find(
        (e) => e.name.replace(/\s/g, "") === a.replace(/\s/g, "")
      )
    );
    if (
      basicTabData.workloadDataFix
        .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
        .every(
          (it) =>
            it.isSplit === false &&
            addWorkload.some(
              (el) =>
                el.name.replace(/\s/g, "") === it.workload.replace(/\s/g, "")
            )
        )
    ) {
      return true;
    } else return false;
    // } else return false;
  }
  //! функция для определения обьединения доп нагрузки
  function funGetJoinDopWorkload() {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 12)) {
      if (
        basicTabData.workloadDataFix
          .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
          .every((it) => addWorkload.some((el) => el.name === it.workload))
      ) {
        return true;
      } else return false;
    } else return false;
  }

  function determineIsBlocked() {
    return basicTabData.workloadDataFix
      .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
      .every((el) => !el.isBlocked);
  }
  function determineIsBlockedNot() {
    return basicTabData.workloadDataFix
      .filter((item) => tabPar.selectedTr.some((el) => el === item.id))
      .every((el) => el.isBlocked);
  }

  const funHeightIsBloced = () => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 33.2)) {
      return true;
    } else {
      if (determineIsBlockedNot()) {
        return false;
      } else if (determineIsBlocked()) {
        return true;
      }
    }
  };

  //! функция которая определяет какое разделене выводить
  function getSplitMenuPopup(
    metodRole,
    myProfile,
    funGetSplitDopWorkload,
    workloadDataFix,
    selectedTr
  ) {
    let massMenuPop = [];

    const wdFix = workloadDataFix.filter((item) =>
      selectedTr.some((el) => el === item.id)
    );

    if (metodRole[myProfile?.role]?.some((el) => el === 11)) {
      //!
      if (
        !funGetSplitDopWorkload() &&
        wdFix.every(
          (it) =>
            it.isSplit === false &&
            it.workload !== "Защита ВКР" &&
            !it.workload.toLowerCase().includes("экзамен") &&
            !it.workload.toLowerCase().includes("практика")
        )
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"Разделить по подгруппам"}
            func={handleMouseClickPop}
            menuShow={menuShow === "subMenu"}
            img={true}
          />
        );
      }

      //!
      if (
        !funGetSplitDopWorkload() &&
        wdFix.every(
          (it) =>
            it.isSplit === false &&
            it.workload !== "Защита ВКР" &&
            it.workload !== "Кандидатский экзамен"
        )
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"Разделить по часам"}
            func={splitByHoursFun}
            menuShow={menuShow === "splitByHoursMenu"}
            img={true}
          />
        );
      }

      //!
      if (funGetSplit()) {
        massMenuPop.push(
          <MenuPop
            btnText={"Разделить"}
            func={splitVKR}
            menuShow={menuShow === "splitVKR"}
            img={true}
          />
        );
      }

      //!
      if (selectedTr.length === 1 && funGetSplitDopWorkload()) {
        massMenuPop.push(
          <MenuPop
            btnText={"Разделить"}
            func={splitAddModal}
            menuShow={menuShow === "splitByHoursMenu"}
            img={true}
          />
        );
      }

      if (
        wdFix.every(
          (it) => it.isSplit === false && it.workload === "Кандидатский экзамен"
        )
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"Разделить"}
            func={funSplitCandidatesExam}
            menuShow={menuShow === "splitCandidatesExam"}
            img={true}
          />
        );
      }
    }

    return massMenuPop;
  }

  //! функция которая определяет какое объединение выводить
  function getJoinMenuPopup(
    metodRole,
    myProfile,
    funGetJoinDopWorkload,
    workloadDataFix,
    selectedTr
  ) {
    let massMenuPop = [];
    const wdFix = workloadDataFix.filter((item) =>
      selectedTr.some((el) => el === item.id)
    );
    if (
      metodRole[myProfile?.role]?.some((el) => el === 12) &&
      selectedTr.length > 1
    ) {
      //!
      if (
        !funGetJoinDopWorkload() &&
        wdFix.every(
          (it) =>
            it.workload !== "Защита ВКР" &&
            !it.workload.toLowerCase().includes("экзамен") &&
            !it.workload.toLowerCase().includes("практика")
        )
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"объединить по подгруппам"}
            func={() => handleJoinWorkloads("g")}
            img={false}
          />
        );
      }

      //!
      if (
        !funGetJoinDopWorkload() &&
        wdFix.every(
          (it) =>
            it.isSplit === true &&
            it.workload !== "Защита ВКР" &&
            it.workload !== "Кандидатский экзамен"
        )
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"объединить по часам"}
            func={() => handleJoinWorkloads("h")}
            img={false}
          />
        );
      }

      //!
      if (
        !funGetJoinDopWorkload() &&
        wdFix.every((it) => it.workload === "Защита ВКР")
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"объединить"}
            func={() => handleJoinWorkloads("vkr")}
            img={false}
          />
        );
      }

      //!
      if (
        funGetJoinDopWorkload() &&
        wdFix.every((it) => it.workload !== "Защита ВКР")
      ) {
        massMenuPop.push(
          <MenuPop
            btnText={"объединить"}
            func={() => handleJoinWorkloads("add")}
            img={false}
          />
        );
      }

      //!
      if (wdFix.every((it) => it.workload === "Кандидатский экзамен")) {
        massMenuPop.push(
          <MenuPop
            btnText={"объединить"}
            func={() => handleJoinWorkloads("candidatesExam")}
            img={false}
          />
        );
      }
    }

    return massMenuPop;
  }

  return (
    <div
      ref={conxextMenuRef}
      onContextMenu={handleContextMenu}
      className={styles.ContextMenu}
    >
      {popupOffer && (
        <PopupOffer
          conxextMenuRefBlock={conxextMenuRefBlock}
          onClickOfferPopup={onClickOfferPopup}
          title={"Вы уверенны что хотите отправить предложение?"}
        />
      )}
      {popupComment && (
        <PopupOffer
          conxextMenuRefBlock={conxextMenuRefBlock}
          onClickOfferPopup={onClickCommentPopup}
          title={"Вы уверенны что хотите отправить комментарий?"}
        />
      )}
      <div
        style={positStyle}
        className={styles.blockMenu}
        ref={conxextMenuRefBlock}
      >
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 9) &&
          determineIsBlocked() && (
            <MenuPop
              btnText={"Добавить преподавателя"}
              func={addEducator}
              menuShow={menuShow === "educator"}
              img={true}
            />
          )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 10) &&
          new Set(tabPar.selectedTr).size < 10 &&
          determineIsBlocked() && (
            <MenuPop
              btnText={"Удалить преподавателя"}
              func={removeEducator}
              img={false}
            />
          )}
        <MenuPop btnText={"Закрепить"} func={pinaCell} img={false} />
        <MenuPop btnText={"Открепить"} func={unPinaCell} img={false} />
        {determineIsBlocked() &&
          getSplitMenuPopup(
            appData.metodRole,
            appData.myProfile,
            funGetSplitDopWorkload,
            basicTabData.workloadDataFix,
            tabPar.selectedTr
          )}

        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 22) &&
          tabPar.selectedTr.length === 1 &&
          determineIsBlocked() && (
            <MenuPop
              btnText={"Оставить комментарий"}
              func={onAddComment}
              menuShow={menuShow === "commentsMenu"}
              img={true}
            />
          )}

        {getJoinMenuPopup(
          appData.metodRole,
          appData.myProfile,
          funGetJoinDopWorkload,
          basicTabData.workloadDataFix,
          tabPar.selectedTr
        )}

        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 18) &&
          tabPar.selectedTr.length === 1 &&
          determineIsBlocked() && (
            <MenuPop
              btnText={"Предложить"}
              func={onClickPropose}
              menuShow={menuShow === "propose"}
              img={true}
            />
          )}
        {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 13) &&
          determineIsBlocked() && (
            <MenuPop
              btnText={"Удалить"}
              func={handleDeletWorkload}
              img={false}
            />
          )}
        {funHeightIsBloced() && (
          <MenuPop
            btnText={"Выделить"}
            func={ClickHighlightshov}
            menuShow={menuShow === "highlight"}
            img={true}
          />
        )}
      </div>

      {menuShow === "subMenu" && (
        // разделение нагрузки
        <SubMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          setMenuShow={setMenuShow}
          contextPosition={tabPar.contextPosition}
          typeSplit={menuShow}
        />
      )}
      {menuShow === "splitCandidatesExam" && (
        <SubMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          setMenuShow={setMenuShow}
          contextPosition={tabPar.contextPosition}
          typeSplit={menuShow}
        />
      )}
      {(menuShow === "educator" || menuShow === "propose") && (
        // меню с выбором преподавалетля
        <EducatorMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          propose={menuShow === "propose"}
          contextPosition={tabPar.contextPosition}
          selectedEducator={selectedEducator}
        />
      )}
      {menuShow === "highlight" && (
        // выделение нагрузки
        <Highlight conxextMenuRefBlock={conxextMenuRefBlock} />
      )}
      {menuShow === "commentsMenu" && (
        <CommentsMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          setMenuShow={setMenuShow}
          setPopupComment={setPopupComment}
          popupCommentAction={popupCommentAction}
          setPopupCommentAction={setPopupCommentAction}
        />
      )}
      {menuShow === "splitByHoursMenu" && (
        <SplitByHoursMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          styles={styles}
          setMenuShow={setMenuShow}
          typeMenu={"splitByHoursMenu"}
        />
      )}
      {menuShow === "splitVKR" && (
        <SplitByHoursMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          styles={styles}
          setMenuShow={setMenuShow}
          typeMenu={"splitVKR"}
        />
      )}
      {menuShow === "splitByHoursMenu" && (
        <SplitByHoursMenu
          conxextMenuRefBlock={conxextMenuRefBlock}
          styles={styles}
          setMenuShow={setMenuShow}
          typeMenu={"splitByHoursMenu"}
        />
      )}
      {appData.universalPopupTitle !== "" && <UniversalPopup />}
    </div>
  );
};

export default ContextMenu;
