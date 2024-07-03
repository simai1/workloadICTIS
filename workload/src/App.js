import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import {
  bufferRequestToApi,
  fixDataBuff,
  returnPrevState,
} from "./bufferFunction";
import { headers } from "./components/TableWorkload/Data";
import {
  Comment,
  GetDepartment,
  Workload,
  getAllAttaches,
  getAllColors,
  getOffers,
  apiGetHistory,
  CommentsLecktorer,
  getOffersLecturer,
  getAllocatedAndUnallocatedWrokloadHours,
} from "./api/services/ApiRequest";

import {
  funFilterSelected,
  funFixEducator,
  funSortedFastened,
} from "./components/TableWorkload/Function";
import { delChangeData } from "./ui/ContextMenu/Function";
import { FilteredSample } from "./ui/SamplePoints/Function";
import { horsTeacher } from "./components/TableTeachers/dataHoursForTeacher/HoursTicher";
import AdminMenu from "./pages/AdminMenu/AdminMenu";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [workload, setWorkload] = useState([]); // данные о нагрузках
  const [allWarningMessage, setAllWarningMessage] = useState([]);
  const [individualCheckboxes, setIndividualCheckboxes] = useState([]); //чекбоксы таблицы
  const [fileData, setFileData] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  //! в файле RoleMetods можно посмотреть назание метода и их id
  const metodRole = {
    METHODIST: [
      1, 3, 4, 8, 9, 10, 14, 17, 20, 21, 25, 26, 28, 29, 31, 34, 35, 36, 16, 40,
      47, 48, 50,
    ],
    LECTURER: [2, 15, 17, 17.1, 18, 20, 22, 24, 34, 37, 41],
    DEPARTMENT_HEAD: [
      2, 3, 4, 8, 9, 10, 11, 12, 13, 15, 17, 18, 20, 22, 23, 25, 26, 27, 30, 31,
      32, 33, 34, 36, 16, 39, 40, 49, 50, 51, 52,
    ],
    DIRECTORATE: [
      1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 23, 25, 26, 27, 28, 30, 31,
      34, 35, 36, 38, 16, 40, 44, 47, 50,
    ],
    UNIT_ADMIN: [
      2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 23, 25, 26, 27, 28, 30, 31,
      34, 35, 36, 38, 16, 40, 48, 42, 50,
    ],
    EDUCATOR: [15, 24, 41],
    DEPUTY_DIRECTORATE: [
      1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 23, 25, 26, 27, 28, 30, 31,
      34, 35, 36, 38, 16, 40, 44, 47, 50,
    ],
    DEPUTY_DEPARTMENT_HEAD: [
      2, 3, 4, 8, 9, 10, 11, 12, 13, 15, 17, 18, 20, 22, 23, 25, 26, 27, 30, 31,
      32, 33, 34, 36, 16, 39, 40, 49, 50, 51, 52,
    ],
    GIGA_ADMIN: [
      1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 23, 25, 26, 27, 28, 29, 30,
      31, 34, 35, 36, 38, 16, 40, 44, 46, 48, 50,
    ],
    GOD: [
      1, 3, 4, 8, 8.1, 9, 10, 11, 11.1, 12, 13, 14, 17, 18, 20, 21, 22, 23, 25,
      26, 27, 28, 29, 30, 31, 34, 35, 36, 38, 16, 40, 44, 45, 46, 48, 50,
    ],
  };
  // appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)

  //! буфер последних действий. Выполняется после кнопки сохранить
  const [bufferAction, setBufferAction] = useState([]);
  const [errorPopUp, seterrorPopUp] = useState(false); //popUp error visible
  const [godPopUp, setgodPopUp] = useState(false); //popUp good visible
  const [createEdicatorPopUp, setcreateEdicatorPopUp] = useState(false); //popUp error visible
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [loaderAction, setLoaderAction] = useState(false);
  const [universalPopupTitle, setUniversalPopupTitle] = useState(""); // если он не пустой, то открывается универсальный попап с данным title
  const [hoursWorkloadSumma, setHoursWorkloadSumma] = useState([]);
  const [sortParamByColumn, setSortParamByColumn] = useState(""); //! сортировка в колнке по возрастанию убыванию или без если ""

  const [popupErrorText, setPopupErrorText] = useState(""); //! если не пустой то в поап ерор будет текст который в состоянии

  const appData = {
    hoursWorkloadSumma,
    individualCheckboxes,
    setIndividualCheckboxes,
    educator,
    setEducator,
    positions,
    setPositions,
    workload,
    setWorkload,
    allWarningMessage,
    setAllWarningMessage,
    bufferAction,
    setBufferAction,
    myProfile,
    fileData,
    setFileData,
    metodRole,
    seterrorPopUp,
    errorPopUp,
    setcreateEdicatorPopUp,
    createEdicatorPopUp,
    backBuffer,
    setgodPopUp,
    godPopUp,
    selectedComponent,
    setSelectedComponent,
    loaderAction,
    setLoaderAction,
    myProfile,
    setMyProfile,
    WhyColor,
    funSaveAllData,
    universalPopupTitle,
    setUniversalPopupTitle,
    popupErrorText,
    setPopupErrorText,
    sortParamByColumn,
    setSortParamByColumn,
  };

  useEffect(() => {
    console.log("myProfile", myProfile);
  }, [myProfile]);

  //! параметры таблицы
  const [tableHeaders, setTableHeaders] = useState(headers);
  const [workloadData, setWorkloadData] = useState([]); // данные с бд нагрузок
  const [workloadDataFix, setWorkloadDataFix] = useState([]); //данные с убранным массиовм преподавателя
  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные
  const [allCommentsData, setAllCommentsData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]); // предложения
  const [selectkafedra, setselectkafedra] = useState(""); //state выбранной кафедры
  const [actionUpdTabTeach, setActionUpdTabTeach] = useState(false); // при изменении обновляется таблицы преподавателей
  const [tableDepartment, settableDepartment] = useState([]);
  const [selectISOid, setselectISOid] = useState(true);
  const [nameKaf, setnameKaf] = useState(null);
  const [historyChanges, setHistoryChanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице

  const basicTabData = {
    searchTerm,
    setSearchTerm,
    updateAlldata,
    tableHeaders,
    setTableHeaders,
    workloadData,
    setWorkloadData,
    workloadDataFix,
    setWorkloadDataFix,
    filtredData,
    setFiltredData,
    allCommentsData,
    allOffersData,
    setAllCommentsData,
    funUpdateAllComments,
    funUpdateOffers,
    funUpdateTable,
    funUpdateFastenedData,
    funUpdateAllColors,
    setselectkafedra,
    funGetDepartment,
    funFilteredFilterSelected,
    selectkafedra,
    actionUpdTabTeach,
    setActionUpdTabTeach,
    tableDepartment,
    nameKaf,
    setnameKaf,
    setselectISOid,
    selectISOid,
    historyChanges,
    setHistoryChanges,
    funUpdateHistory,
  };

  const [coloredData, setColoredData] = useState([]); // выделенные цветом
  const [fastenedData, setFastenedData] = useState([]); // закрепленные строки (храним их id)
  const [selectedTable, setSelectedTable] = useState("Disciplines");
  const [selectedFilter, setSelectedFilter] = useState("Все дисциплины"); // текст в FiltredRows
  const [selectedTr, setSelectedTr] = useState([]); //выбранные tr
  const [onCheckBoxAll, setOnCheckBoxAll] = useState(false); //выбранные tr
  const [isSamplePointsData, setSamplePointsData] = useState([]); // данные фильтрации по th
  const [spShow, setSpShow] = useState(null); // отображение модального окна th
  const [contextMenuShow, setContextMenuShow] = useState(false); // показать скрыть контекст меню
  const [contextPosition, setContextPosition] = useState({ x: 300, y: 300 }); // позиция контекст меню в таблице
  const [perenesenAction, setPerenesenAction] = useState(false); // флаг который открывает перенесенные в истории

  const changedDataObj = {
    split: [],
    join: [],
    educator: [],
    hours: [],
    numberOfStudents: [],
    deleted: [],
    audienceHours: [],
  };
  // храним id и ключь измененных td для подсвечивания
  const [changedData, setChangedData] = useState(changedDataObj);
  const [isChecked, setIsChecked] = useState([]); // состояние инпутов в SamplePoints //! сбросить
  const [isAllChecked, setAllChecked] = useState([]); // инпут все в SamplePoints //! сбросить
  const checkPar = {
    isChecked,
    setIsChecked,
    isAllChecked,
    setAllChecked,
  };
  //! для виртуального скролла
  const [startData, setStartData] = useState(0); // индекс элемента с которого показывается таблица
  let visibleData = filtredData.length > 10 ? 10 : filtredData.length; // кооличество данных которые мы видим в таблице
  const tableRefWorkload = useRef(null); //! ссылка на таблицу

  const heightTd = 150; // высота td

  const visibleDataPar = {
    startData,
    setStartData,
    visibleData,
    heightTd,
  };
  const [popupShareShow, setPopupShareShow] = useState(false); //! открываем попап для расчета часов по формуле
  const [tableDataHoursPopup, setTableDataHoursPopup] = useState(null); //! данные для таблицы редактирования ввноса часов
  const [inpValueHoursPopup, setInpValueHoursPopup] = useState(2); //! переменная на сколько разделить по часам
  const [buffDataHoursPopup, setBuffDataHoursPopup] = useState(null);
  const [inputEditValue, setInputEditValue] = useState([]);

  const tabPar = {
    selectedTable,
    setSelectedTable,
    selectedTr,
    setSelectedTr,
    setOnCheckBoxAll,
    onCheckBoxAll,
    isSamplePointsData,
    setSamplePointsData,
    spShow,
    setSpShow,
    contextMenuShow,
    setContextMenuShow,
    setContextPosition,
    contextPosition,
    allOffersData,
    setAllOffersData,
    allCommentsData,
    setAllCommentsData,
    fastenedData,
    setFastenedData,
    coloredData,
    setColoredData,
    changedDataObj,
    changedData,
    setChangedData,
    selectedFilter,
    setSelectedFilter,
    perenesenAction,
    setPerenesenAction,
    tableRefWorkload,
    popupShareShow,
    setPopupShareShow,
    tableDataHoursPopup,
    setTableDataHoursPopup,
    inpValueHoursPopup,
    setInpValueHoursPopup,
    buffDataHoursPopup,
    setBuffDataHoursPopup,
    inputEditValue,
    setInputEditValue,
  };

  //! функция обновления комментаривев
  function funUpdateAllComments() {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 37)) {
      CommentsLecktorer().then((data) => {
        setAllCommentsData(data);
      });
    } else if (
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 20)
    ) {
      Comment().then((data) => {
        setAllCommentsData(data);
      });
    }
  }

  //! функция обновления предложений преподавателей
  function funUpdateOffers() {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 17.1)) {
      getOffersLecturer().then((req) => {
        if (req && req.status === 200) {
          setAllOffersData(req.data);
        }
      });
    } else {
      getOffers().then((req) => {
        if (req && req.status === 200) {
          setAllOffersData(req.data);
        }
      });
    }
  }

  //! функция обновления истории
  function funUpdateHistory() {
    apiGetHistory().then((req) => {
      setHistoryChanges(req);
    });
  }

  //! функция получения закрепленных строк
  function funUpdateFastenedData() {
    getAllAttaches().then((data) => {
      if (data.length > 0) {
        setFastenedData(data);
      }
    });
  }
  //! Функция обновления существующих кафедр таблицы
  function funGetDepartment() {
    GetDepartment().then((response) => {
      if (response && response.status === 200) {
        settableDepartment([{ id: 99, name: "Все" }, ...response?.data]);
      }
    });
  }

  //! функция получения выделенных цветом строк
  function funUpdateAllColors() {
    getAllColors().then((data) => {
      if (data.length > 0) {
        setColoredData(data);
      }
    });
  }

  //! функция которая принимает нагрузки из апи и записывает в состояния
  const funUpdTab = (data) => {
    const dataBd = [...data];
    setWorkloadData(dataBd);
    //! функция прокида буффера для преподавателей, часов, и колличества студентов
    const fixData = UpdateWorkloadForBoofer(
      funFixEducator(dataBd, bufferAction)
    );

    //! функция прокида буффера для разделения соединения и удаления нагрузок
    const fdb = fixDataBuff(fixData, bufferAction);
    // зменяем массив преподавателя на его имя
    const fdfix = FilteredSample(fdb, isChecked);
    setWorkloadData(fdb);
    setWorkloadDataFix(fdfix);
    setFiltredData(fdfix);
  };

  //! Функция для определения цвета фона
  function WhyColor(educator) {
    const totalHours = educator?.totalHours;
    let bg;
    // let phuthicalHours = 900;
    let maxHours = educator?.maxHours;
    let minHorse = educator?.minHours;
    const recommendedMaxHours = educator?.recommendedMaxHours;

    if (totalHours === 0) {
      bg = "#e2e0e5"; // серый цвет
    } else if (totalHours > maxHours) {
      bg = "#E81414"; // Красный цвет
    } else if (totalHours < minHorse) {
      bg = "#FFD600"; // Желтый цвет
    } else if (totalHours >= minHorse && totalHours <= recommendedMaxHours) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (totalHours > recommendedMaxHours && totalHours <= maxHours) {
      bg = "#ffa600"; // оранжевый цвет
    }
    return bg;
  }

  //! функция обновления таблицы
  function funUpdateTable(param) {
    if(param === undefined){
      param = 99
    }
    console.log("param", param)
    //param = tableDepartment[0]?.id
    if (metodRole[myProfile?.role]?.some((el) => el === 15)) {
      const par = sortParamByColumn !== "" ? `?${sortParamByColumn}` : "";
      Workload(par).then((data) => {
        if (data) {
          funUpdTab(data);
        }
      });
    }
    if (metodRole[myProfile?.role]?.some((el) => el === 14)) {
      let url = "";
      if (param == 0) {
        url = "?isOid=true";
      }
      if (param == 99) {
        if (sortParamByColumn !== "") {
          url = `?${sortParamByColumn}`;
        } else {
          url = "";
        }
      } else if (param != 99 && param != 0) {
        url = `?department=${param}&${sortParamByColumn}`;
      }
      console.log(url);
      Workload(url).then((data) => {
        funUpdTab(data);
      });
    }

    // без параметров - вся абсолютно нагрузка,
    // ?isOid=true - вся ОИД нагрузка,
    // ?isOid=false - вся кафедральная нагрузка,
    // ?department={номер кафедры} - нагрузка одной кафедры
  }

  //! вызываем функцию для обновления массива данных при сортировке через tableTh
  useEffect(() => {
    funUpdateTable(
      tableDepartment.find((el) => el.name === basicTabData?.nameKaf)?.id
    );
  }, [sortParamByColumn]);

  //!функция прокида буфера
  function UpdateWorkloadForBoofer(data) {
    if (bufferAction.length !== 0) {
      const newData = [...data];
      let obj = [];
      bufferAction.map((item) => {
        let existingObj = null;
        if (Array.isArray(item.workloadId)) {
          existingObj = obj.find((el) =>
            item.workloadId.some((e) => e === el.id)
          );
        } else {
          existingObj = obj.find((el) => item.workloadId === el.id);
        }

        if (existingObj) {
          if (item.request === "addEducatorWorkload") {
            existingObj.educator = item.edicatorName.edicatorName;
          }
          if (item.request === "removeEducatorinWorkload") {
            existingObj.educator = "___";
          }
          if (item.request === "workloadUpdata") {
            if (item.data.key === "numberOfStudents") {
              existingObj.numberOfStudents = item.data.value;
            }
            if (item.data.key === "hours") {
              existingObj.hours = item.data.value;
            }
            if (item.data.key === "audienceHours") {
              existingObj.audienceHours = item.data.value;
            }
          }
        } else {
          if (item.request === "addEducatorWorkload") {
            let ob = newData.filter((el) =>
              item.workloadId?.some((e) => e === el.id)
            );
            ob = ob.map((el) => {
              return { ...el, educator: item.edicatorName.edicatorName };
            });
            obj.push(...ob);
          }
          if (item.request === "removeEducatorinWorkload") {
            let ob = newData.filter((el) =>
              item.data.workloadIds?.some((e) => e === el.id)
            );
            ob = ob.map((el) => {
              return { ...el, educator: "___" };
            });
            obj.push(...ob);
          }
          if (item.request === "workloadUpdata") {
            let o = {
              ...newData[newData.findIndex((el) => item.workloadId === el.id)],
            };
            if (item.data.key === "numberOfStudents") {
              o.numberOfStudents = item.data.value;
            }
            if (item.data.key === "hours") {
              o.hours = item.data.value;
            }
            if (item.data.key === "audienceHours") {
              o.audienceHours = item.data.value;
            }
            obj.push(o);
          }
          console.log(obj);
        }
      });
      return data.map((item) => {
        if (obj.find((e) => e.id === item.id)) {
          return obj.find((e) => e.id === item.id);
        } else if (item.educator === null || item.educator === undefined) {
          return {
            ...item,
            educator: item.educator ? item.educator.name : "___",
          };
        } else if (item.educator.name) {
          return {
            ...item,
            educator: item.educator.name,
          };
        } else {
          return item;
        }
      });
    } else {
      return data;
    }
  }
  // LECTURER: [2, 8, 15, 18, 22, 24],

  //! функция обновления всех данных
  function updateAlldata() {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 44)) {
      funUpdateTable(99);
    } else {
      if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 42)) {
        funUpdateTable(99);
      } else if (
        appData.metodRole[appData.myProfile?.role]?.some((el) => el === 28)
      ) {
        // selectISOid
        //   ? // funUpdateTable(0)
        //     funUpdateTable(99)
           funUpdateTable(
              tableDepartment.find((el) => el.name === nameKaf)?.id
            );
      } else {
        if (
          appData.metodRole[appData.myProfile?.role]?.some((el) => el === 32)
        ) {
          funUpdateTable(0);
        } else {
          funUpdateTable(99);
        }
      }
    }

    if (
      appData.metodRole[appData.myProfile?.role]?.some(
        (el) => el === 20 || el === 37
      )
    ) {
      // получаем все комментарии
      funUpdateAllComments();
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 17)) {
      // получение предложений
      funUpdateOffers();
    }
    // получение закрепленных строк
    funUpdateFastenedData();
    // получение выделенных строк
    funUpdateAllColors();
  }

  //! получаем данные нагрузок с бд
  useEffect(() => {
    if (myProfile) {
      setnameKaf(tableDepartment[0]?.name);
      updateAlldata();
      if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 52)) {
        getAllocatedAndUnallocatedWrokloadHours(
          appData.myProfile?.educator.departmentId
        ).then((resp) => {
          if (resp.status === 200) {
            setHoursWorkloadSumma(resp.data);
            console.log("hoursWorkloadSumma", hoursWorkloadSumma);
          }
        });
      }
    }
  }, [tableDepartment, myProfile]); // [myProfile, tableDepartment]

  function funFilteredFilterSelected(splitData = [...workloadDataFix]) {
    return funFilterSelected(
      splitData,
      selectedFilter,
      coloredData,
      changedData,
      fastenedData,
      allCommentsData,
      allOffersData
    );
  }
  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  //! фильтруем по FiltredRows
  useEffect(() => {
    const filterSelected = funFilteredFilterSelected();
    if (filterSelected) {
      setFiltredData(funSortedFastened(filterSelected, fastenedData));
    }

    setSelectedTr([]);
    setOnCheckBoxAll(false);
  }, [selectedFilter, workloadDataFix, selectedTable, fastenedData]);

  //! обновляем вертуальный скролл при переходе на другуюс таблицу
  useEffect(() => {
    setStartData(0);
    if (tableRefWorkload.current) {
      tableRefWorkload.current.scrollTo(0, 0);
    }
  }, [selectedFilter, selectedTable, tableRefWorkload, nameKaf]);

  //! функция сохранения данных
  function funSaveAllData() {
    appData.setLoaderAction(true);
    bufferRequestToApi(bufferAction)
      .then((action) => {
        console.log(action);
        if (action) {
          setBufferAction([0]);
          updateAlldata();
        }
        appData.setLoaderAction(false);
      })
      .catch((error) => {
        console.error("Error in bufferRequestToApi:", error);
        appData.setLoaderAction(false);
      });

    setSelectedTr([]);
    setChangedData(changedDataObj);
    console.log("выполнено и очищено", bufferAction);
    setBufferAction([0]);
  }

  //! следим за нажатием ctrl + s для сохранения изменений
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === "s" || event.key === "ы")) {
        event.preventDefault();
        funSaveAllData();
      }
    };
    // Назначьте обработчик события keydown при монтировании компонента
    document.addEventListener("keydown", handleKeyDown);

    // Удалите обработчик события keydown при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bufferAction]);

  //! функция отмены последенего действия с буффера
  function backBuffer() {
    //! отмена последнего действия
    if (bufferAction.length > 0) {
      if (
        bufferAction[0].request === "removeEducatorinWorkload" ||
        bufferAction[0].request === "addEducatorWorkload"
      ) {
        // убираем выделение с преподавателя
        setChangedData(
          delChangeData(
            changedData,
            "educator",
            bufferAction[0].data.workloadIds
          )
        );

        returnPrevState(bufferAction, workloadDataFix).then((data) => {
          setWorkloadDataFix(data);
          setBufferAction((prevItems) => prevItems.slice(1));
        });
      } else if (bufferAction[0].request === "deleteComment") {
        setAllCommentsData([...allCommentsData, ...bufferAction[0].prevState]);
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (bufferAction[0].request === "joinWorkloads") {
        // удаляем нагрузку которую обьеденили
        const dataTable = [...workloadDataFix].filter(
          (item) => !bufferAction[0].prevState.some((el) => el.id === item.id)
        );
        // сохраняем индекс удаленного элемента
        const deletedIndex = workloadDataFix.findIndex((item) =>
          bufferAction[0].prevState.some((el) => el.id === item.id)
        );
        const newArray = [...dataTable];
        newArray.splice(deletedIndex, 0, ...bufferAction[0].prevState);
        setWorkloadDataFix(newArray);
        // убираем заблокированные элементы
        let cd = { ...tabPar.changedData };
        let cdJoin = [...cd.join];
        cdJoin = cdJoin.filter(
          (el) => !bufferAction[0].prevState.some((item) => item.id !== el)
        );
        cd.join = cdJoin;
        setChangedData(cd);
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (
        bufferAction[0].request === "splitWorkload" ||
        bufferAction[0].request === "splitByHours"
      ) {
        let datMap = { ...bufferAction[0] };
        const wdfNew = [...workloadDataFix]
          .map((item) => {
            if (datMap.newIds.some((el) => el === item.id)) {
              if (item.id[item.id.length - 1] === "0") {
                return datMap.prevState.find(
                  (e) => e.id === item.id.slice(0, -1)
                );
              }
            } else return item;
          })
          .filter((el) => el !== undefined);
        setWorkloadDataFix(wdfNew);
        let changed = { ...changedData };
        changed.split = changed.split.filter(
          (item) => !datMap.newIds.some((el) => el === item)
        );
        setBufferAction((prevItems) => prevItems.slice(1));
        setChangedData(changed);
      } else if (bufferAction[0].request === "workloadUpdata") {
        //отмена изменения даннных textarea
        const newData = [...workloadDataFix];
        newData.map((item) => {
          if (item.id === bufferAction[0].data.id) {
            item[bufferAction[0].data.key] = bufferAction[0].prevState;
          }
          return item;
        });
        setWorkloadDataFix([...newData]);
        // убираем заблокированные элементы
        // убираем выделение с преподавателя
        setChangedData(
          delChangeData(changedData, bufferAction[0].data.key, [
            bufferAction[0].data.id,
          ])
        );
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (bufferAction[0].request === "deleteWorkload") {
        // возвращаем удаленную нагрузку
        let cd = changedData;
        cd.deleted = cd.deleted.filter(
          (el) => !bufferAction[0].data.ids.some((item) => item === el) && el
        );
        setChangedData(cd);
        setBufferAction((prevItems) => prevItems.slice(1));
      }
    }
  }

  //! обновление таблицы, отмена действия при ctrl+z
  useEffect(() => {
    if (bufferAction[0] === 0) {
      setBufferAction([]);
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
        backBuffer();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bufferAction]);

  return (
    <DataContext.Provider
      value={{
        appData,
        tabPar,
        visibleDataPar,
        checkPar,
        basicTabData,
      }}
    >
      <BrowserRouter basename="/client">
        <div className="Container">
          <Routes>
            <Route path="/" element={<Authorization />}></Route>
            <Route path="/HomePage" element={<HomePage />}></Route>
            <Route path="/Admin" element={<AdminMenu />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
