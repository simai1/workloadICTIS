import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./TableDisciplines.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { NotificationForm } from "../../ui/NotificationForm/NotificationForm";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";
import DataContext from "../../context";

import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";

import {
  funcGetAllColors,
  getAllOffers,
  getAllWarnin,
  getDataAllComment,
  getDataTable,
} from "../../api/services/AssignApiData";
import OfferModalWindow from "../OfferModalWindow/OfferModalWindow";
import { returnPrevState } from "../../bufferFunction";
import { PopUpError } from "../../ui/PopUp/PopUpError";
import { getAllColors } from "../../api/services/ApiRequest";

function TableDisciplines(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]); //заголовок обновленный для Redux сортировки
  const [updatedData, setUpdatedData] = useState([]); //массив обновленный для Redux сортировки
  // const [selectedComponent, setSelectedComponent] = useState("cathedrals"); //выбранный компонент
  const [isHovered, setIsHovered] = useState(false); // флаг открытия уведомлений от преподавателей
  const [isPopUpMenu, setIsPopUpMenu] = useState(false); // флаг открытия PopUp меню
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionFigth, setPositionFigth] = useState({ x: 0, y: 0 });
  const [idRow, setIdrow] = useState(0);
  const [isSamplePointsShow, setSamplePointsShow] = useState(false);
  const [isSamplePointsData, setSamplePointsData] = useState("");
  const [isCheckedGlobal, setIsCheckedGlobal] = useState(false); //главный чекбокс таблицы
  const [isChecked, setChecked] = useState([]);
  const [showMenu, setShowMenu] = useState(false); //меню
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); //меню
  const [tableData, setTableData] = useState([]); // соберем из данных апи общие для таблицы
  const [filteredData, setFilteredData] = useState([]);
  const [commentAllData, setCommentAllData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]);
  const [allColorsData, setAllColorsData] = useState([]); // выделенные цветом храним id

  const [Highlight, setHighlight] = useState([]);

  const [modalWindowOffer, setModalWindowOffer] = useState({
    id: null,
    flag: false,
  });

  const [generalInstituteData, setGeneralInstituteData] = useState([]); // общеинститутские данные
  const [cathedralData, setCathedralData] = useState([]); // кафедральыне данные

  //! данные вытянутые из контекста
  const { appData } = React.useContext(DataContext);
  const getDataTableAll = () => {
    getDataTable().then((data) => {
      appData.setWorkload(data);
      // выводим данные в зависимостри кафедральные или общеинститутские
      const dataIsOid =
        props.tableMode === "genInstitute"
          ? data.filter((item) => item.isOid === false)
          : data.filter((item) => item.isOid === true);

      setUpdatedData(dataIsOid);
      setFilteredData(dataIsOid);

      setGeneralInstituteData(data.filter((item) => item.isOid === false));
      setCathedralData(data.filter((item) => item.isOid === true));

      getAllOffers(setAllOffersData);
      // funcGetAllColors(setAllColorsData); // получение цветов
      appData.setIndividualCheckboxes([]);
      console.log("Таблица обноленна");
    });
  };

  //! обновляем таблице если перешли между кафедральным и общенститутским
  useEffect(() => {
    if (props.tableMode === "genInstitute") {
      setUpdatedData(generalInstituteData);
      setFilteredData(generalInstituteData);
    } else {
      setUpdatedData(cathedralData);
      setFilteredData(cathedralData);
    }
    // убираем выделенные нагрузки
    appData.setIndividualCheckboxes([]);
  }, [props.tableMode]);

  //! при обновлении updatedData запосним наши данные
  useEffect(() => {
    if (props.tableMode === "genInstitute") {
      setGeneralInstituteData(updatedData);
    } else {
      setCathedralData(updatedData);
    }
  }, [updatedData]);

  //! обновление таблицы, отмена действия при ctrl+z
  useEffect(() => {
    if (appData.bufferAction[0] === 0) {
      getDataTableAll();
      getDataAllComment(setCommentAllData); // получение комментариев
      console.log("Таблица обноленна после буффера");
      appData.setBufferAction([]);
    }
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + z для отмены последнего действияы
      if (
        event.ctrlKey &&
        (event.key === "z" ||
          event.key === "я" ||
          event.key === "Z" ||
          event.key === "Я")
      ) {
        console.log("отеменено последнее действие", appData.bufferAction);
        //! отмена последнего действия
        if (appData.bufferAction.length > 0) {
          if (
            appData.bufferAction[0].request === "removeEducatorinWorkload" ||
            appData.bufferAction[0].request === "addEducatorWorkload"
          ) {
            returnPrevState(appData.bufferAction, updatedData).then((data) => {
              setUpdatedData(data);
              appData.setBufferAction((prevItems) => prevItems.slice(1));
            });
          } else if (appData.bufferAction[0].request === "deleteComment") {
            setCommentAllData([
              ...commentAllData,
              ...appData.bufferAction[0].prevState,
            ]);
            appData.setBufferAction((prevItems) => prevItems.slice(1));
          } else if (appData.bufferAction[0].request === "joinWorkloads") {
            // удаляем нагрузку которую обьеденили
            const dataTable = updatedData.filter(
              (item) =>
                !appData.bufferAction[0].prevState.some(
                  (el) => el.id === item.id
                )
            );
            // сохраняем индекс удаленного элемента
            const deletedIndex = updatedData.findIndex((item) =>
              appData.bufferAction[0].prevState.some((el) => el.id === item.id)
            );
            const newArray = [...dataTable];
            newArray.splice(
              deletedIndex,
              0,
              ...appData.bufferAction[0].prevState
            );
            setUpdatedData(newArray);
            // убираем заблокированные элементы
            appData.setBlockedCheckboxes((prev) =>
              prev.filter(
                (el) =>
                  !appData.bufferAction[0].prevState.some(
                    (item) => item.id !== el
                  )
              )
            );
          } else if (appData.bufferAction[0].request === "splitWorkload") {
            // отмена разделения нагрузки
            setUpdatedData(
              updatedData.filter(
                (item) => !appData.bufferAction[0].newIds.includes(item.id)
              )
            );
            setUpdatedData((prev) => [
              appData.bufferAction[0].prevState[0],
              ...prev,
            ]);
          }
        }

        //функция отмены последенего действия находится в TableDisciplines
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appData.bufferAction]);

  //! заносим данные в состояния
  useEffect(() => {
    getDataTableAll();
    setTableData(appData.workload);
    getDataAllComment(setCommentAllData); // получение комментариев
    getAllWarnin(appData.setAllWarningMessage); // предупреждения
    getAllOffers(setAllOffersData); // предложения
  }, []);

  //! сортировака (по hedars) пришедших данных из апи
  useEffect(() => {
    const sortedArray = appData.workload.sort((a, b) => {
      const firstArrayKeys = tableHeaders.map((header) => header.key);
      return firstArrayKeys.indexOf(a.key) - firstArrayKeys.indexOf(b.key);
    });
    setTableData(sortedArray);
  }, [appData.workload]);

  //! закрытие модального окна при нажатии вне него
  const refSP = useRef(null);
  const refHoverd = useRef(null);
  const refOffer = useRef(null);
  const refContextMenu = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (refSP.current && !refSP.current.contains(event.target)) {
        setSamplePointsShow(false);
      }
      if (refOffer.current && !refOffer.current.contains(event.target)) {
        setModalWindowOffer({ id: modalWindowOffer.id, flag: false });
      }
      if (
        props.refProfile.current &&
        !props.refProfile.current.contains(event.target)
      ) {
        props.setOpenModalWind(false);
      }
      if (refHoverd.current && !refHoverd.current.contains(event.target)) {
        setIsHovered(false);
      }
      if (
        refContextMenu.current &&
        !refContextMenu.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  //! чекбоксы
  const handleGlobalCheckboxChange = () => {
    // выделяем нагрузку если ее нет в блокированных (при нажатии на "выделить все")
    setIsCheckedGlobal(!isCheckedGlobal);
    !isCheckedGlobal
      ? appData.setIndividualCheckboxes(
          filteredData.map((el) => {
            if (!appData.blockedCheckboxes.includes(el.id)) {
              return el.id;
            }
          })
        )
      : appData.setIndividualCheckboxes([]);
  };

  const handleIndividualCheckboxChange = (el, index) => {
    if (
      el.target.tagName !== "DIV" &&
      el.target.tagName !== "TEXTAREA" &&
      el.target.tagName !== "svg" &&
      el.target.tagName !== "path"
    ) {
      let ic = [...appData.individualCheckboxes];

      if (ic.includes(filteredData[index].id)) {
        ic = ic.filter((el) => el !== filteredData[index].id);
      } else {
        ic = [...ic, filteredData[index].id];
      }
      appData.setIndividualCheckboxes(ic);

      if (ic.length === filteredData.length) {
        setIsCheckedGlobal(true);
      } else {
        setIsCheckedGlobal(false);
      }
    }
  };

  //! при нажатии на кружок уведомления
  const handleClicNotice = (el, index) => {
    setIsHovered(!isHovered);
    setPosition({ x: el.pageX - 40, y: el.pageY - 200 });
    setIdrow(filteredData[index].id);
  };

  //! при нажатии на кружок предложения
  const handleClicOffer = (el, id_workload, index) => {
    console.log("id", index, id_workload, allOffersData[index]);
    setModalWindowOffer({
      id: allOffersData.find(
        (item) => item.workloadId === filteredData[index].id
      ).id,
      flag: !modalWindowOffer.flag,
    });
    setPosition({ x: el.pageX - 40, y: el.pageY - 260 });
  };

  //! добавить комментарий к нагрузке из контекстного меню
  const onAddComment = () => {
    setShowMenu(false);
    setIdrow(appData.individualCheckboxes[0]);
    setIsHovered(true);
    setPosition({ x: menuPosition.x - 60, y: menuPosition.y - 125 });
  };

  //! клик на th, открытие МО фильтры к колонке
  const clickFigth = (event, index) => {
    setSamplePointsShow(!isSamplePointsShow);
    if (event.clientX + 372 > window.innerWidth) {
      setPositionFigth({ x: event.pageX - 50, y: event.pageY - 150 });
    } else {
      setPositionFigth({ x: event.pageX - 50, y: event.pageY - 150 });
    }

    const keyTd = tableHeaders[index].key;

    const td = filteredData
      .map((item) => item[keyTd])
      .filter((value, i, arr) => arr.indexOf(value) === i);

    const data = { td, keyTd };
    setSamplePointsData(data);
  };

  //выбор компонента
  // ! заголовки
  const tableHeaders = useMemo(() => {
    return [
      { key: "id", label: "№" },
      { key: "discipline", label: "Дисциплина" },
      { key: "workload", label: "Нагрузка" },
      { key: "groups", label: "Группа" },
      { key: "department", label: "Кафедра" },
      { key: "block", label: "Блок" },
      { key: "semester", label: "Семестр" },
      { key: "period", label: "Период" },
      { key: "curriculum", label: "Учебный план" },
      { key: "curriculumUnit", label: "Подразделение учебного плана" },
      { key: "formOfEducation", label: "Форма обучения" },
      { key: "levelOfTraining", label: "Уровень подготовки" },
      {
        key: "specialty",
        label: "Направление подготовки (специальность)",
      },
      { key: "core", label: "Профиль" },
      { key: "numberOfStudents", label: "Количество студентов" },
      { key: "hours", label: "Часы" },
      { key: "audienceHours", label: "Аудиторные часы" },
      { key: "ratingControlHours", label: "Часы рейтинг-контроль" },
      { key: "educator", label: "Преподаватель" },
    ];
  }, []);

  // const handleComponentChange = (component) => {
  //   setSelectedComponent(component);
  // };

  //! работа с таблицами через REDUX
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  useEffect(() => {
    addHeadersTable(filters, tableHeaders, tableData);
  }, [filters, dispatch]);

  function addHeadersTable(filters, tableHeaders, tableData) {
    const updatedHeader = tableHeaders.filter((header) =>
      filters.includes(header.key)
    );
    const updatedData = tableData.map((data) => {
      const updatedRow = {};
      Object.keys(data).forEach((key) => {
        if (filters.includes(key)) {
          updatedRow[key] = data[key];
        }
      });
      return updatedRow;
    });

    setUpdatedHeader(updatedHeader);
    setUpdatedData(updatedData);
  }

  //! компонет поиска выведен в родительский
  //! useEffect следит за изменение searchTerm
  useEffect(() => {
    let fd;
    if (props.searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        return Object.values(row).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value
              .toString()
              .toLowerCase()
              .includes(props.searchTerm.toLowerCase())
        );
      });
    }
    setFilteredData(fd);
  }, [updatedData, props.searchTerm]);

  //! меню при нажатии пкм
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    // console.log(index);
    setShowMenu(!showMenu);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  //! расчет left для статических блоков таблицы
  const trRef = useRef(null);
  const [widthsTableHeader, SetWidthsTableHeader] = useState([]);
  useEffect(() => {
    SetWidthsTableHeader(SetHeaderWidths());
  }, [filteredData]);

  function SetHeaderWidths() {
    const widths = [];
    if (trRef && trRef.current) {
      for (let i = 0; i < 4; i++) {
        if (trRef.current.children[i]) {
          widths.push(trRef.current.children[i].offsetWidth);
        }
      }
    }
    return widths;
  }
  const arrLeft = [
    widthsTableHeader[0],
    widthsTableHeader[0] + widthsTableHeader[1],
    widthsTableHeader[0] + widthsTableHeader[1] + widthsTableHeader[2],
  ];

  //! функция изменения значения td при двойном клике
  const [cellNumber, setCellNumber] = useState([]);
  const changeValueTd = (index, ind) => {
    // console.log("изменить ", index, ind);
    if (ind === 15 || ind == 14) {
      setCellNumber({ index, ind });
    }
    // console.log(cellNumber);
  };
  const [textareaTd, setTextareaTd] = useState("");
  const onChangeTextareaTd = (event) => {
    setTextareaTd(event.target.value);
  };

  const onClickButton = (id, key) => {
    const parsedValue = Number(textareaTd);
    const numberValue = isNaN(parsedValue) ? textareaTd : parsedValue;
    //! отпрака запроса на изменение данных
    const data = { id: id, key: key.key, value: numberValue };
    console.log("Изменение данных таблицы", data);
    const item = updatedData.find((item) => item.id === id);
    const updatedArray = updatedData.map((item) => {
      if (item.id === id) {
        return { ...item, [key.key]: numberValue };
      }
      return item;
    });
    setUpdatedData(updatedArray);

    textareaTd &&
      //! буфер
      appData.setBufferAction([
        { request: "workloadUpdata", data: data, prevState: item[key.key] },
        ...appData.bufferAction,
      ]);
    // workloadUpdata(id, { [key.key]: numberValue }).then(() =>
    //   getDataTableAll()
    // );
    setCellNumber([]);
  };
  //! содержимое
  return (
    <div className={styles.tabledisciplinesMain}>
      <div>
        {isHovered && (
          <NotificationForm
            refHoverd={refHoverd}
            position={position}
            setPosition={setPosition}
            workloadId={idRow}
            commentAllData={commentAllData}
            setCommentAllData={setCommentAllData}
            getDataAllComment={getDataAllComment}
            setIsHovered={setIsHovered}
            commentData={commentAllData
              .filter((item) => item.workloadId === idRow)
              .reverse()}
          />
        )}

        {modalWindowOffer.flag && (
          <OfferModalWindow
            allOffersDataItem={allOffersData.filter(
              (item) => item.id === modalWindowOffer.id
            )}
            modalWindowOffer={modalWindowOffer}
            setModalWindowOffer={setModalWindowOffer}
            position={position}
            refOffer={refOffer}
            workloadId={modalWindowOffer.id}
            getDataTableAll={getDataTableAll}
          />
        )}

        {isSamplePointsShow && (
          <SamplePoints
            refSP={refSP}
            isSamplePointsData={isSamplePointsData}
            positionFigth={positionFigth}
            filteredData={filteredData}
            isChecked={isChecked}
            setChecked={setChecked}
          />
        )}
        {showMenu && (
          <ContextMenu
            Highlight={Highlight}
            setHighlight={setHighlight}
            isPopUpMenu={isPopUpMenu}
            setIsPopUpMenu={setIsPopUpMenu}
            refContextMenu={refContextMenu}
            showMenu={showMenu}
            menuPosition={menuPosition}
            setShowMenu={setShowMenu}
            getDataTableAll={getDataTableAll}
            onAddComment={onAddComment}
            updatedData={updatedData}
            setUpdatedData={setUpdatedData}
            setAllOffersData={setAllOffersData}
            allOffersData={allOffersData}
          />
        )}
        <div className={styles.table_container}>
          {/* уведомления от преподавателей  */}
          <div className={styles.TableDisciplines__inner}>
            <table className={styles.taleDestiplinesMainTable}>
              <thead>
                <tr ref={trRef} className={styles.tr_thead}>
                  <th className={styles.checkboxHeader} style={{ left: "0" }}>
                    <div className={styles.input_left}></div>
                    <input
                      type="checkbox"
                      className={styles.custom__checkbox}
                      id="dataRowGlobal"
                      name="dataRowGlobal"
                      checked={isCheckedGlobal}
                      onChange={handleGlobalCheckboxChange}
                    />
                    <label htmlFor="dataRowGlobal"></label>
                  </th>
                  {updatedHeader.map((header, index) => (
                    <th
                      key={header.key}
                      onClick={(event) => clickFigth(event, index)}
                      className={
                        header.key === "discipline" ||
                        header.key === "id" ||
                        header.key === "workload"
                          ? styles.stytic_th
                          : null
                      }
                      style={{ left: arrLeft[index] || "0" }}
                    >
                      <div className={styles.th_inner}>
                        {header.label}
                        <img src="./img/th_fight.svg" alt=">"></img>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, index) => {
                  const checkValues = Object.values(row).some((value) =>
                    isChecked.includes(value)
                  );
                  if (!checkValues) {
                    return (
                      <tr
                        key={index}
                        onContextMenu={(e) => handleContextMenu(e, index)}
                        className={`
                          ${
                            appData.individualCheckboxes.includes(
                              filteredData[index].id
                            )
                              ? styles.colorChecked
                              : ""
                          }
                          ${
                            appData.blockedCheckboxes.includes(
                              filteredData[index].id
                            )
                              ? styles.clorBlocked
                              : ""
                          }
                          ${
                            !Highlight.some((item) =>
                              item.id.includes(filteredData[index].id)
                            )
                              ? ""
                              : Highlight.find((item) =>
                                  item.id.includes(filteredData[index].id)
                                ).color === 1
                              ? styles.colorBlue
                              : Highlight.find((item) =>
                                  item.id.includes(filteredData[index].id)
                                ).color === 2
                              ? styles.colorGreen
                              : Highlight.find((item) =>
                                  item.id.includes(filteredData[index].id)
                                ).color === 3
                              ? styles.colorYellow
                              : ""
                          }
                        `}
                        onClick={(el) =>
                          handleIndividualCheckboxChange(el, index)
                        }
                      >
                        <td className={styles.checkbox} style={{ left: "0" }}>
                          {/* //!вывод комментарие  */}
                          {commentAllData.map(
                            (item) =>
                              item.workloadId === filteredData[index].id && (
                                <div
                                  key={item.id}
                                  className={styles.notice}
                                  onClick={(el) => handleClicNotice(el, index)}
                                  style={
                                    allOffersData.some(
                                      (el) => el.workloadId === item.workloadId
                                    )
                                      ? {
                                          transform: "translateY(+18px)",
                                        }
                                      : null
                                  }
                                >
                                  {
                                    commentAllData.filter(
                                      (item) =>
                                        item.workloadId ===
                                        filteredData[index].id
                                    ).length
                                  }
                                  <div
                                    className={
                                      allOffersData.some(
                                        (el) =>
                                          el.workloadId === item.workloadId
                                      )
                                        ? styles.notis_rigth_two
                                        : styles.notis_rigth_one
                                    }
                                  ></div>
                                </div>
                              )
                          )}

                          {/* //! вывод предложений */}

                          {allOffersData.map(
                            (item) =>
                              item.workloadId === filteredData[index].id && (
                                <div
                                  key={item.id}
                                  className={styles.notice}
                                  style={
                                    commentAllData.some(
                                      (el) => el.workloadId === item.workloadId
                                    )
                                      ? {
                                          backgroundColor: "#FFD600",
                                          transform: "translateY(-18px)",
                                        }
                                      : {
                                          backgroundColor: "#FFD600",
                                        }
                                  }
                                  onClick={(el, item) =>
                                    handleClicOffer(
                                      el,
                                      filteredData[index].id,
                                      index
                                    )
                                  }
                                >
                                  {
                                    allOffersData.filter(
                                      (item) =>
                                        item.workloadId ===
                                        filteredData[index].id
                                    ).length
                                  }
                                  <div
                                    className={
                                      commentAllData.some(
                                        (el) =>
                                          el.workloadId === item.workloadId
                                      )
                                        ? styles.notis_rigth_two
                                        : styles.notis_rigth_one
                                    }
                                  ></div>
                                </div>
                              )
                          )}

                          <input
                            type="checkbox"
                            className={styles.custom__checkbox}
                            name="dataRow"
                            id={`dataRow-${index}`}
                            checked={
                              appData.individualCheckboxes.includes(
                                filteredData[index].id
                              )
                                ? true
                                : false
                            }
                            onChange={(el) =>
                              handleIndividualCheckboxChange(el, index)
                            }
                          />
                          <label htmlFor={`dataRow-${index}`}></label>
                        </td>
                        {updatedHeader.map((key, ind) => (
                          <td
                            key={updatedHeader[ind].key}
                            className={
                              updatedHeader[ind].key === "discipline" ||
                              updatedHeader[ind].key === "id" ||
                              updatedHeader[ind].key === "workload"
                                ? styles.stytic_td
                                : null
                            }
                            style={{ left: arrLeft[ind] || "0" }}
                          >
                            <div
                              className={styles.td_inner}
                              onDoubleClick={() => changeValueTd(index, ind)}
                            >
                              {/* редактирование поля нагрузки при двойном клике на нее */}
                              {cellNumber &&
                              cellNumber.index === index &&
                              cellNumber.ind === ind ? (
                                <div className={styles.textarea_title}>
                                  <textarea
                                    className={styles.textarea}
                                    type="text"
                                    defaultValue={row[updatedHeader[ind].key]}
                                    onChange={onChangeTextareaTd}
                                  ></textarea>
                                  <div className={styles.svg_textarea}>
                                    <SvgChackmark
                                      className={styles.SvgChackmark_green}
                                      onClick={() => onClickButton(row.id, key)}
                                    />
                                    <SvgCross
                                      onClick={() => {
                                        setCellNumber([]);
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : row[updatedHeader[ind].key] === null ? (
                                "0"
                              ) : updatedHeader[ind].key === "id" ? (
                                index + 1
                              ) : (
                                row[updatedHeader[ind].key]
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={styles.Block__tables__shadow}></div>

      {isPopUpMenu && <PopUpError setIsPopUpMenu={setIsPopUpMenu} />}
    </div>
  );
}

export default TableDisciplines;
