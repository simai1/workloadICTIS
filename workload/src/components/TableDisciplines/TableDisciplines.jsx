import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./TableDisciplines.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";
import DataContext from "../../context";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";

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
import { EducatorLK, getAllColors } from "../../api/services/ApiRequest";
import { PopUpFile } from "../../ui/PopUpFile/PopUpFile";
import Table from "./Table";
import { headers } from "./Data";

function TableDisciplines(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]); //заголовок обновленный для Redux сортировки
  const [updatedData, setUpdatedData] = useState([]); //массив обновленный для Redux сортировки
  const [tableData, setTableData] = useState([]); // соберем из данных апи общие для таблицы
  const [filteredData, setFilteredData] = useState([]);
  const [sortData, setSortData] = useState([]); // данные при выборе все дисциплины измененные выделенные и тд
  const [isHovered, setIsHovered] = useState(false); // флаг открытия уведомлений от преподавателей
  const [isPopUpMenu, setIsPopUpMenu] = useState(false); // флаг открытия PopUp меню
  const [isPopUpFile, setIsPopUpFile] = useState(false); // флаг открытия PopUp меню
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionFigth, setPositionFigth] = useState({ x: 0, y: 0 });
  const [idRow, setIdrow] = useState(0);
  const [isSamplePointsShow, setSamplePointsShow] = useState(false);
  const [isSamplePointsData, setSamplePointsData] = useState("");
  const [isCheckedGlobal, setIsCheckedGlobal] = useState(false); //главный чекбокс таблицы
  const [isChecked, setChecked] = useState([]);
  const [showMenu, setShowMenu] = useState(false); //меню
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); //меню
  const [commentAllData, setCommentAllData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]);
  const [allColorsData, setAllColorsData] = useState([]); // выделенные цветом храним id
  const [Highlight, setHighlight] = useState([]); // массив хранения выделенных цветом (хранится id нагрузки и номер цвета)
  const [modalWindowOffer, setModalWindowOffer] = useState({
    id: null,
    flag: false,
  });
  const [generalInstituteData, setGeneralInstituteData] = useState([]); // общеинститутские данные
  const [cathedralData, setCathedralData] = useState([]); // кафедральыне данные
  const [changeNumberOfStudents, setChangeNumberOfStudents] = useState([]); // храним id нагрузок у которых изменили количество студентво
  const [changeHours, setChangHours] = useState([]); // храним id нагрузок у которых изменили час
  const [changeEducator, setChangEducator] = useState([]); // храним id нагрузок у которых изменили преподавателя
  const [allChangeData, setAllChangeData] = useState([]); // все измененные данные
  const tableHeaders = headers;
  //! данные вытянутые из контекста
  const { appData } = React.useContext(DataContext);
  // при изменении количесвтва студентов или часов id этих нагрузок будут записываться в состояние а затем выделяться цветом
  useEffect(() => {
    setChangeNumberOfStudents(
      appData.bufferAction
        .filter((item) => item.data?.key === "numberOfStudents")
        .map((el) => el.data.id)
    );
    setChangHours(
      appData.bufferAction
        .filter((item) => item.data?.key === "hours")
        .map((el) => el.data.id)
    );
    setChangEducator(
      appData.bufferAction
        .filter((item) => item.request === "addEducatorWorkload")
        .map((el) => el.data.workloadId)
    );
  }, [appData.bufferAction]);

  useEffect(() => {
    setAllChangeData([
      ...changeEducator,
      ...changeHours,
      ...changeNumberOfStudents,
    ]);
  }, [changeEducator, changeHours, changeNumberOfStudents]);

  const getDataTableAll = () => {
    getDataTable().then((data) => {
      appData.setWorkload(data);
      let reqData = data;
      // выводим данные в зависимостри кафедральные или общеинститутские
      const dataIsOid =
        props.tableMode === "genInstitute"
          ? reqData.filter((item) => item.isOid === true)
          : reqData.filter((item) => item.isOid === false);
      setUpdatedData(dataIsOid);
      setFilteredData(data);
      setSortData(dataIsOid);
      setGeneralInstituteData(reqData.filter((item) => item.isOid === true));
      setCathedralData(reqData.filter((item) => item.isOid === false));
      getAllOffers(setAllOffersData);
      // funcGetAllColors(setAllColorsData); // получение цветов
      appData.setIndividualCheckboxes([]);
    });
  };

  //! заносим данные в состояния
  useEffect(() => {
    getDataTableAll();
    setTableData(appData.workload);
    getDataAllComment(setCommentAllData); // получение комментариев
    getAllWarnin(appData.setAllWarningMessage); // предупреждения
    getAllOffers(setAllOffersData); // предложения
  }, []);

  //! фильтрация при выборе всех дисциплин измененных выделенных и тд
  useEffect(() => {
    if (props.SelectedText === "Выделенные") {
      setSortData(
        updatedData.filter((item) => Highlight.some((el) => el.id === item.id))
      );
    }
    if (props.SelectedText === "Все дисциплины") {
      setSortData(updatedData);
    }
    if (props.SelectedText === "Измененные") {
      setSortData(
        updatedData.filter((item) => allChangeData.some((el) => el === item.id))
      );
    }
  }, [props.SelectedText, updatedData]);

  //! при изменении SortData обновим таблицу
  useEffect(() => {
    setFilteredData(sortData);
  }, [sortData]);

  //! обновляем таблицу если перешли между кафедральным и общенститутским
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
      appData.setBufferAction([]);
    }
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + z для отмены последнего действияы
      if (
        (event.ctrlKey || event.comand) &&
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
          } else if (appData.bufferAction[0].request === "workloadUpdata") {
            //отмена изменения даннных textarea
            const newData = [...updatedData];
            newData.map((item) => {
              if (item.id === appData.bufferAction[0].data.id) {
                item[appData.bufferAction[0].data.key] =
                  appData.bufferAction[0].prevState;
              }
              return item;
            });
            setUpdatedData([...newData]);
            appData.setBufferAction((prevItems) => prevItems.slice(1));
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appData.bufferAction]);

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
  const refTextArea = useRef(null);
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
      if (refTextArea.current && !refTextArea.current.contains(event.target)) {
        setCellNumber(null);
        setTextareaTd(null);
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
      console.log("click")
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
  const handleClicOffer = (el, index) => {
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
    console.log(event, index);
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
      fd = sortData;
      setFilteredData(fd);
    } else {
      fd = appData.workload.filter((row) => {
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
      setFilteredData(fd);
    }
  }, [updatedData, props.searchTerm]);

  //! меню при нажатии пкм
  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
    if (e.clientX + 260 > window.innerWidth) {
      setMenuPosition({ x: e.clientX - 260, y: e.clientY });
    } else {
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }
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
    widthsTableHeader[0] + widthsTableHeader[1] + 0.5,
    widthsTableHeader[0] + widthsTableHeader[1] + widthsTableHeader[2],
  ];

  //! функция изменения значения td при двойном клике
  const [cellNumber, setCellNumber] = useState([]);
  const changeValueTd = (index, ind) => {
    if (ind === 15 || ind === 14) {
      setCellNumber({ index, ind });
    }
  };
  const [textareaTd, setTextareaTd] = useState("");
  const onChangeTextareaTd = (event) => {
    setTextareaTd(event.target.value);
  };
  const onClickButton = (id, key) => {
    let parsedValue = parseFloat(textareaTd);
    let numberValue = isNaN(parsedValue) ? textareaTd : parsedValue;
    //! параметры запроса на изменение данных
    const data = { id: id, key: key.key, value: numberValue };
    const item = updatedData.find((item) => item.id === id);
    if (numberValue) {
      const updatedArray = updatedData.map((item) => {
        if (item.id === id) {
          return { ...item, [key.key]: numberValue };
        }
        return item;
      });
      setUpdatedData(updatedArray);
    }
    numberValue &&
      //! буфер
      appData.setBufferAction([
        { request: "workloadUpdata", data: data, prevState: item[key.key] },
        ...appData.bufferAction,
      ]);
    setCellNumber([]);
    setTextareaTd(null);
  };
  //! содержимое
  return (
    <div className={styles.tabledisciplinesMain}>
      <div>
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
            <Table
              trRef={trRef}
              filteredData={filteredData}
              handleIndividualCheckboxChange={handleIndividualCheckboxChange}
              commentAllData={commentAllData}
              allOffersData={allOffersData}
              handleClicOffer={handleClicOffer}
              updatedHeader={updatedHeader}
              arrLeft={arrLeft}
              refTextArea={refTextArea}
              onChangeTextareaTd={onChangeTextareaTd}
              textareaTd={textareaTd}
              SvgChackmark={SvgChackmark}
              onClickButton={onClickButton}
              handleContextMenu={handleContextMenu}
              handleGlobalCheckboxChange={handleGlobalCheckboxChange}
              clickFigth={clickFigth}
              changeValueTd={changeValueTd}
              setCellNumber={setCellNumber}
              cellNumber={cellNumber}
              handleClicNotice={handleClicNotice}
            />
          </div>
        </div>
      </div>
      <div className={styles.Block__tables__shadow}></div>

      {isPopUpMenu && <PopUpError setIsPopUpMenu={setIsPopUpMenu} />}
      {appData.fileData !== null && (
        <PopUpFile
          setIsPopUpFile={setIsPopUpFile}
          handleFileClear={props.handleFileClear}
        />
      )}
    </div>
  );
}
export default TableDisciplines;
