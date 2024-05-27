import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import { bufferRequestToApi, returnPrevState } from "./bufferFunction";
import { headers } from "./components/TableWorkload/Data";
import {
  Comment,
  Workload,
  apiGetUser,
  apiGetWorkloadDepartment,
  getAllAttaches,
  getAllColors,
  getOffers,
} from "./api/services/ApiRequest";
import {
  funFilterSelected,
  funFixEducator,
  funSortedFastened,
  funSplitData,
} from "./components/TableWorkload/Function";
import { delChangeData } from "./ui/ContextMenu/Function";
import { getDataEducator } from "./api/services/AssignApiData";

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
    METHODIST: [1, 3, 4, 8, 9, 10, 13, 14, 17, 20, 21],
    LECTURER: [2, 8, 15, 18, 22],
    DEPARTMENT_HEAD: [2, 3, 4, 8, 9, 10, 11, 12, 13, 15, 17, 18, 22],
    DIRECTORATE: [1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21],
    EDUCATOR: [15],
  };
  // appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)

  //! буфер последних действий. Выполняется после кнопки сохранить
  const [bufferAction, setBufferAction] = useState([]);
  const [errorPopUp, seterrorPopUp] = useState(false); //popUp error visible
  const [createEdicatorPopUp, setcreateEdicatorPopUp] = useState(false); //popUp error visible

  const appData = {
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
  };

  // ! параметры таблицы
  const [tableHeaders, setTableHeaders] = useState(headers);
  const [workloadData, setWorkloadData] = useState([]); // данные с бд нагрузок
  const [workloadDataFix, setWorkloadDataFix] = useState([]); //данные с убранным массиовм преподавателя
  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные
  const [allCommentsData, setAllCommentsData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]); // предложения
  const [actionUpdTabTeach, setActionUpdTabTeach] = useState(false); // при изменении обновляется таблицы преподавателей

  const basicTabData = {
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
    actionUpdTabTeach,
    setActionUpdTabTeach,
  };

  const [coloredData, setColoredData] = useState([]); // выделенные цветом
  const [fastenedData, setFastenedData] = useState([]); // закрепленные строки (храним их id)
  const [selectedTable, setSelectedTable] = useState("Disciplines");
  const [dataIsOid, setDataIsOid] = useState(false); // состояние при котором открываются общеинститутские или кафедральные
  const [selectedFilter, setSelectedFilter] = useState("Все дисциплины"); // текст в FiltredRows
  const [selectedTr, setSelectedTr] = useState([]); //выбранные tr
  const [onCheckBoxAll, setOnCheckBoxAll] = useState(false); //выбранные tr
  const [isSamplePointsData, setSamplePointsData] = useState([]); // данные фильтрации по th
  const [spShow, setSpShow] = useState(null); // отображение модального окна th
  const [contextMenuShow, setContextMenuShow] = useState(false); // показать скрыть контекст меню
  const [contextPosition, setContextPosition] = useState({ x: 300, y: 300 }); // позиция контекст меню в таблице
  const [changedData, setChangedData] = useState({
    // храним id и ключь измененных td для подсвечивания
    splitjoin: [],
    educator: [],
    hours: [],
    numberOfStudents: [],
    deleted: [],
  });
  const [isChecked, setIsChecked] = useState([]); // состояние инпутов в SamplePoints
  const [isAllChecked, setAllChecked] = useState(true); // инпут все в SamplePoints
  const checkPar = {
    isChecked,
    setIsChecked,
    isAllChecked,
    setAllChecked,
  };
  //! для виртуального скролла
  const [startData, setStartData] = useState(0); // индекс элемента с которого показывается таблица
  const visibleData = filtredData.length > 10 ? 10 : filtredData.length; // кооличество данных которые мы видим в таблице
  const heightTd = 150; // высота td

  const visibleDataPar = {
    startData,
    setStartData,
    visibleData,
    heightTd,
  };

  const tabPar = {
    dataIsOid,
    setDataIsOid,
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
    changedData,
    setChangedData,
    selectedFilter,
    setSelectedFilter,
  };

  //! функция обновления комментаривев
  function funUpdateAllComments() {
    Comment().then((data) => {
      console.log("comments", data);
      setAllCommentsData(data);
    });
  }

  //! функция обновления предложений преподавателей
  function funUpdateOffers() {
    getOffers().then((data) => {
      console.log("предложения", data);
      setAllOffersData(data);
    });
  }

  //! функция получения закрепленных строк
  function funUpdateFastenedData() {
    getAllAttaches().then((data) => {
      console.log("закрепленные", data);
      setFastenedData(data);
    });
  }

  //! функция получения выделенных цветом строк
  function funUpdateAllColors() {
    getAllColors().then((data) => {
      console.log("выделенные", data);
      setColoredData(data);
    });
  }

  //! функция обновления таблицы
  function funUpdateTable(param = "") {
    if (metodRole[myProfile?.role]?.some((el) => el === 15)) {
      apiGetWorkloadDepartment().then((data) => {
        console.log("нагрузки по кафедре", data);
        const dataBd = [...data];
        setWorkloadData(dataBd);
        // зменяем массив преподавателя на его имя
        const fixData = funFixEducator(dataBd);
        setWorkloadDataFix(fixData);
        setFiltredData(fixData);
      });
    }
    // без параметров - вся абсолютно нагрузка,
    // ?isOid=true - вся ОИД нагрузка,
    // ?isOid=false - вся кафедральная нагрузка,
    // ?department=номер кафедры - нагрузка одной кафедры

    if (metodRole[myProfile?.role]?.some((el) => el === 14)) {
      Workload(param).then((data) => {
        console.log("нагрузки", data);
        const dataBd = [...data];
        setWorkloadData(dataBd);
        // зменяем массив преподавателя на его имя
        const fixData = funFixEducator(dataBd);
        setWorkloadDataFix(fixData);
        setFiltredData(fixData);
      });
    }
  }

  //! функция обновления всех данных
  function updateAlldata() {
    // получаем данные таблицы
    funUpdateTable();
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 20)) {
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

  //! получаем и записываем данные usera
  useEffect(() => {
    apiGetUser().then((data) => {
      console.log("user", data);
      setMyProfile(data);
    });
  }, []);

  //! получаем данные нагрузок с бд
  useEffect(() => {
    if (myProfile) {
      updateAlldata();
    }
  }, [myProfile]);

  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  //! фильтруем по FiltredRows
  useEffect(() => {
    const splitData = funSplitData(workloadDataFix, dataIsOid);
    const filterSelected = funFilterSelected(
      splitData,
      selectedFilter,
      coloredData,
      changedData,
      fastenedData
    );
    // setFiltredData(filterSelected);
    setFiltredData(funSortedFastened(filterSelected, fastenedData));
    setSelectedTr([]);
    setOnCheckBoxAll(false);
  }, [dataIsOid, selectedFilter, workloadDataFix, selectedTable]);

  //! обновляем вертуальный скролл при переходе на другуюс таблицу
  useEffect(() => {
    setStartData(0);
  }, [dataIsOid, selectedFilter, selectedTable]);

  // useEffect(() => {
  //   setFiltredData([...workloadDataFix]);
  // }, [workloadDataFix]);

  //! при изменении закрпеленных перемещаем их наверх и сортируем массив
  useEffect(() => {
    setFiltredData(funSortedFastened(filtredData, fastenedData));
  }, [fastenedData, filtredData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + s для сохранения изменений
      if (event.ctrlKey && (event.key === "s" || event.key === "ы")) {
        event.preventDefault();
        console.log("Сохранено", bufferAction);
        bufferRequestToApi(bufferAction).then(() => {
          setBufferAction([0]);
          updateAlldata();
        });
        setSelectedTr([]);
        setChangedData({
          splitjoin: [],
          educator: [],
          hours: [],
          numberOfStudents: [],
          deleted: [],
        });
        console.log("выполнено и очищено", bufferAction);
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
    console.log("отеменено последнее действие", bufferAction);
    //! отмена последнего действия
    if (bufferAction.length > 0) {
      if (
        bufferAction[0].request === "removeEducatorinWorkload" ||
        bufferAction[0].request === "addEducatorWorkload"
      ) {
        // убираем выделение с преподавателя
        setChangedData(
          delChangeData(changedData, "educator", [
            bufferAction[0].data.workloadId,
          ])
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
        const dataTable = workloadDataFix.filter(
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
        setChangedData((prev) =>
          prev.filter(
            (el) => !bufferAction[0].prevState.some((item) => item.id !== el)
          )
        );
      } else if (bufferAction[0].request === "splitWorkload") {
        // отмена разделения нагрузки
        setWorkloadDataFix(
          workloadDataFix.filter(
            (item) => !bufferAction[0].newIds.includes(item.id)
          )
        );
        setWorkloadDataFix((prev) => [bufferAction[0].prevState[0], ...prev]);
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
          </Routes>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
