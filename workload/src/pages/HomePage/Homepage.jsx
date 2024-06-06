import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import TableTeachers from "../../components/TableTeachers/TableTeachers";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import Warnings from "../../components/Warnings/Warnings";
import TableLks from "../../components/TableLks/TableLks";
import Profile from "../../components/Profile/Profile";
import EditInput from "../../components/EditInput/EditInput";
import DataContext from "../../context";
import { bufferRequestToApi } from "../../bufferFunction";
import FiltredRows from "../../ui/FiltredRows/FiltredRows";
import TableWorkload from "../../components/TableWorkload/TableWorkload";
import {
  headers,
  headersEducator,
  tableHeadersLks,
} from "../../components/TableWorkload/Data";
import { PopUpFile } from "../../ui/PopUpFile/PopUpFile";
import { PopUpError } from "../../ui/PopUpError/PopUpError";
import List from "../../ui/List/List";
import ListKaf from "../../ui/ListKaf/ListKaf";
import { PopUpCreateEmploy } from "../../ui/PopUpCreateEmploy/PopUpCreateEmploy";
import {
  GetDepartment,
  WorkloadBlocked,
  getAllWarningMessage,
} from "../../api/services/ApiRequest";
import ConfirmSaving from "../../ui/ConfirmSaving/ConfirmSaving";
import socketConnect from "../../api/services/socket";
import PopUpGoodMessage from "../../ui/PopUpGoodMessage/PopUpGoodMessage";
import { Link } from "react-router-dom";

function HomePage() {
  const { appData, tabPar, visibleDataPar, basicTabData } =
    React.useContext(DataContext);
  //! заголовки таблиц
  const workloadTableHeaders = headers; // заголовок таблицы на главной странице
  const educatorTableHeaders = headersEducator; // заголовок таблтиц преподавателей
  const educatorLkHeaders = tableHeadersLks; // заголовок страницы личного кабинета
  const [tableHeaders, setTableHeaders] = useState(workloadTableHeaders);
  const [filePopUp, setfilePopUp] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [tableMode, setTableMode] = useState("cathedrals"); //выбранный компонент
  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице
  const [onenModalWind, setOpenModalWind] = useState(false); // переменная закрытия модального окна профиля
  const refProfile = React.useRef(null); // ссылка на модальное окно профиля
  const [educatorIdforLk, setEducatorIdforLk] = useState(""); // id для вывода LK, если пустое то LK не отображается
  const [popupSaveAll, setPopupSaveAll] = useState(false); // открыть/закрыть попап подтверждения сохранения
  const [popupExport, setPopupExport] = useState(false); // открыть/закрыть попап подтверждения блокировки таблицы
  const [departments, setdepartments] = useState([]);
  const [kafedralIsOpen, setKafedralIsOpen] = useState(false);
  const [IsBlocked, setisBlocked] =  useState(true);
  const handleButtonClick = () => {
    setEducatorIdforLk("");
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 28)) {
      basicTabData.funUpdateTable("0");
    } else {
      basicTabData.funUpdateTable("14");
    }
    tabPar.setDataIsOid(true);
    basicTabData.setselectISOid(true);
    basicTabData.setnameKaf("Все");
    tabPar.setSelectedFilter("Все Дисциплины");
  };

  //! связь с сокетом
  useEffect(() => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 23)) {
      socketConnect();
      getAllWarningMessage().then((res) => {
        console.log("Все предупреждения", res);
        appData.setAllWarningMessage(res);
      });
    }
  }, []);

  useEffect(() => {
    GetDepartment().then((response) => {
      setdepartments([...response.data, { id: 14, name: "Все" }]);
    });
  }, [basicTabData.tableDepartment]);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    tabPar.setSelectedTable(component);
    if (component === "Disciplines") {
      basicTabData.setTableHeaders(workloadTableHeaders);
    } else if (component === "Teachers") {
      console.log(component);
      basicTabData.setTableHeaders(educatorTableHeaders);
    } else {
      basicTabData.setTableHeaders(educatorLkHeaders);
    }
  };

  const changeInput = () => {
    setTableHeaders(educatorTableHeaders);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const EditTableData = (tableMode) => {
    tabPar.setDataIsOid(tableMode === "genInstitute");
  };
  useEffect(() => {
    basicTabData.funGetDepartment();
  }, []);

  //! открыть попап
  const onSaveClick = () => {
    setPopupSaveAll(!popupSaveAll);
    popupExport == true && setPopupExport(false);
  };
  //! открыть попап
  const onExportClick = () => {
    setPopupExport(!popupExport);
    popupSaveAll == true && setPopupSaveAll(false);
  };

  //! при клике на подтверждение блокировки таблицы
  const exportClick = (action) => {
    if (action) {
     
      if(basicTabData.selectISOid){
        WorkloadBlocked(0).then((resp)=>{
          if(resp.status == 200){
            basicTabData.funUpdateTable("0");
            appData.setgodPopUp(true)
          }
        })
      }else{
        console.log('tableDepartment', basicTabData.tableDepartment)
        const index = basicTabData.tableDepartment.find((el)=>el.name === basicTabData.nameKaf).id
        WorkloadBlocked(index).then((resp)=>{
          if(resp.status == 200){
            basicTabData.funUpdateTable(index);
            appData.setgodPopUp(true)
          }
        })
      }

    } else {
      setPopupExport(false);
    }
  };

  //! при нажатии на подтвердить сохранение изменений
  const confirmClick = (action) => {
    if (action) {
      // //! отправляем все запросы на обработку
      // console.log("Сохранено", appData.bufferAction);
      // bufferRequestToApi(appData.bufferAction).then(() => {
      //   appData.setBufferAction([0]);
      //   basicTabData.updateAlldata();
      // });
      // tabPar.setSelectedTr([]);
      // tabPar.setChangedData({
      //   splitjoin: [],
      //   educator: [],
      //   hours: [],
      //   numberOfStudents: [],
      //   deleted: [],
      // });
      // console.log("выполнено и очищено", appData.bufferAction);
      console.log("Сохранено", appData.bufferAction);
      bufferRequestToApi(appData.bufferAction).then(() => {
        appData.setBufferAction([0]);
        basicTabData.updateAlldata();
      });
      tabPar.setSelectedTr([]);
      tabPar.setChangedData(tabPar.changedDataObj);
      console.log("выполнено и очищено", appData.bufferAction);
    } else {
      setPopupSaveAll(false);
    }
  };

  // //! функции для импорта файла
  const OpenPoPUpFile = () => {
    setfilePopUp(!filePopUp);
  };

  //! при нажатии на ракету
  const raketClick = () => {
    visibleDataPar.setStartData(0);
    const table = document.querySelector("table");
    table.scrollIntoView(true);
  };

  return (
    <Layout>
      <div className={styles.HomePage}>
        <div className={styles.header}>
          <div className={styles.header_top}>
            <div className={styles.header_top_save_search}>
              <div className={styles.saveBuffre}>
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 25
                ) && (
                  <div
                    className={styles.btnMenuBox}
                    onClick={appData.backBuffer}
                  >
                    <img src="./img/backBuffer.svg" />
                  </div>
                )}
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 26
                ) && (
                  <div className={styles.btnMenuBox} onClick={onSaveClick}>
                    <img
                      className={styles.btnLeft}
                      src="./img/saveButton.svg"
                    />
                    {popupSaveAll && (
                      <ConfirmSaving
                        title={"Вы уверены, что хотите сохранить изменения?"}
                        confirmClick={confirmClick}
                        setShow={setPopupSaveAll}
                      />
                    )}
                  </div>
                )}

                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 27
                ) && (
                  <div
                    style={{ marginRight: "20px" }}
                    className={styles.btnMenuBox}
                    onClick={onExportClick}
                  >
                    <img className={styles.btnLeft} src="./img/export.svg" />
                    {popupExport && (
                      <ConfirmSaving
                        title={"Вы уверены, что хотите отправить таблицу?"}
                        confirmClick={exportClick}
                        setShow={setPopupExport}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={styles.header_search}>
                <input
                  type="text"
                  placeholder="Поиск"
                  id="search"
                  name="search"
                  onChange={handleSearch}
                  className={styles.hedaer_search_inner}
                />
                <img src="./img/search.svg"></img>
              </div>
            </div>
            <div className={styles.header_button}>
              <Button
                Bg={selectedComponent === "Disciplines" ? "#3B28CC" : "#efedf3"}
                textColot={
                  selectedComponent === "Disciplines" ? "#efedf3" : "#000000"
                }
                onClick={() => {
                  handleComponentChange("Disciplines");
                  handleButtonClick();
                }}
                text="Дисциплины"
              />

              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 3
              ) && (
                <Button
                  Bg={selectedComponent === "Teachers" ? "#3B28CC" : "#efedf3"}
                  textColot={
                    selectedComponent === "Disciplines" ? "#000000" : "#efedf3"
                  }
                  onClick={() => {
                    handleComponentChange("Teachers");
                    handleButtonClick();
                  }}
                  text="Преподователи"
                />
              )}
              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 24
              ) && (
                <Button
                  text="Моя нагрузка"
                  onClick={() => {
                    setEducatorIdforLk(appData.myProfile.educator.id);
                    setSelectedComponent("Teachers");
                    console.log("myProfilea", appData.myProfile.id);
                  }}
                  Bg={educatorIdforLk.length != 0 ? "#3B28CC" : "#efedf3"}
                  textColot={
                    educatorIdforLk.length === 0 ? "#000000" : "#efedf3"
                  }
                />
              )}
            </div>
            <div className={styles.header_left_component}>
              <Warnings
                setEducatorIdforLk={setEducatorIdforLk}
                educatorIdforLk={educatorIdforLk}
                className={styles.Warnings}
                setSelectedComponent={setSelectedComponent}
                setEducatorData={setEducatorData}
              />
              <Profile
                className={styles.Profile}
                setOpenModalWind={setOpenModalWind}
                onenModalWind={onenModalWind}
                refProfile={refProfile}
              />
            </div>
          </div>
          { IsBlocked &&
            <div className={styles.blockedTextTable}>
              <div> <img src="./img/errorTreangle.svg" /></div>
              <div> <p>В таблицу вносятся изменения, редактирование временно отключено!</p></div>
            </div>
          }
         
          <div className={styles.header_bottom}>
            <div className={styles.header_bottom_button}>
              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 28
              ) &&
                selectedComponent === "Disciplines" && (
                  <>
                    <Button
                      Bg={!kafedralIsOpen ? "#3B28CC" : "#efedf3"}
                      textColot={kafedralIsOpen ? "#000000" : "#efedf3"}
                      text="Общеинститутские"
                      onClick={() => {
                        setTableMode("genInstitute");
                        EditTableData("genInstitute");
                        basicTabData.setselectISOid(true);
                        basicTabData.funUpdateTable("0");
                        setKafedralIsOpen(false);
                        tabPar.setDataIsOid(true);
                        tabPar.setSelectedFilter("Все Дисциплины");
                      }}
                    />
                    <Button
                      Bg={kafedralIsOpen ? "#3B28CC" : "#efedf3"}
                      textColot={!kafedralIsOpen ? "#000000" : "#efedf3"}
                      text="Кафедральные"
                      onClick={() => {
                        basicTabData.funUpdateTable("14");
                        tabPar.setDataIsOid(false);
                        setKafedralIsOpen(true);
                        basicTabData.setselectISOid(false);
                        console.log(basicTabData.selectISOid);
                        basicTabData.setnameKaf("Все");
                        tabPar.setSelectedFilter("Все Дисциплины");
                      }}
                    />
                    {!basicTabData.selectISOid && (
                      <ListKaf
                        dataList={departments}
                        defaultValue={"Все"}
                        setTableMode={setTableMode}
                      />
                    )}
                  </>
                )}

              {selectedComponent === "Disciplines" && <FiltredRows />}
            </div>

            <div className={styles.right_button}>
              <div className={styles.EditInput}>
                {educatorIdforLk === "" && (
                  <EditInput
                    selectedComponent={selectedComponent}
                    originalHeader={
                      selectedComponent === "Disciplines"
                        ? workloadTableHeaders
                        : educatorTableHeaders
                    } //! исправить не обновляется
                  />
                )}
              </div>
              {selectedComponent === "Disciplines" && (
                <div className={styles.import}>
                  <button onClick={OpenPoPUpFile}>
                    <p>Импорт файла</p>
                    <img src="./img/import.svg" alt=">"></img>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.Block__tables}>
          {selectedComponent === "Disciplines" ? (
            <TableWorkload
              tableMode={tableMode}
              tableHeaders={tableHeaders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : selectedComponent === "Teachers" && educatorIdforLk === "" ? (
            <TableTeachers
              setEducatorIdforLk={setEducatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={setTableHeaders}
              tableHeaders={tableHeaders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setEducatorData={setEducatorData}
            />
          ) : selectedComponent === "Teachers" && educatorIdforLk !== "" ? (
            <TableLks
              setEducatorIdforLk={setEducatorIdforLk}
              educatorIdforLk={educatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={setTableHeaders}
              searchTerm={searchTerm}
              educatorData={educatorData}
            />
          ) : null}
        </div>
        <div onClick={raketClick}>
          <div className={styles.rocket}>
            <img
              className={styles.rocket_img}
              src="./img/rocket.png"
              alt="up"
            />
          </div>
        </div>
      </div>
      {filePopUp && (
        <PopUpFile
          setfilePopUp={setfilePopUp}
          // handleFileClear={handleFileClear}
        />
      )}
      {appData.createEdicatorPopUp && <PopUpCreateEmploy />}
      {appData.errorPopUp && <PopUpError />}
      {appData.godPopUp && <PopUpGoodMessage />}
    </Layout>
  );
}

export default HomePage;
