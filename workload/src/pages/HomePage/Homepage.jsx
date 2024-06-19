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
  apiGetUser,
  getAllWarningMessage,
} from "../../api/services/ApiRequest";
import ConfirmSaving from "../../ui/ConfirmSaving/ConfirmSaving";
import socketConnect from "../../api/services/socket";
import PopUpGoodMessage from "../../ui/PopUpGoodMessage/PopUpGoodMessage";
import TableHistory from "../../components/TableHistory/TableHistory";
import ErrorHelper from "../../components/ErrorHelper/ErrorHelper";

function HomePage() {
  const { appData, tabPar, visibleDataPar, basicTabData } =
    React.useContext(DataContext);
  //! заголовки таблиц
  const workloadTableHeaders = headers; // заголовок таблицы на главной странице
  const educatorTableHeaders = headersEducator; // заголовок таблтиц преподавателей
  const educatorLkHeaders = tableHeadersLks; // заголовок страницы личного кабинета
  const [tableHeaders, setTableHeaders] = useState(workloadTableHeaders);
  const [filePopUp, setfilePopUp] = useState(false);
  // const [appData.selectedComponent, appData.setSelectedComponent] = useState("Disciplines");
  const [tableMode, setTableMode] = useState("cathedrals"); //выбранный компонент
  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const [onenModalWind, setOpenModalWind] = useState(false); // переменная закрытия модального окна профиля
  const refProfile = React.useRef(null); // ссылка на модальное окно профиля
  const [educatorIdforLk, setEducatorIdforLk] = useState(""); // id для вывода LK, если пустое то LK не отображается
  const [popupSaveAll, setPopupSaveAll] = useState(false); // открыть/закрыть попап подтверждения сохранения
  const [popupExport, setPopupExport] = useState(false); // открыть/закрыть попап подтверждения блокировки таблицы
  const [departments, setdepartments] = useState([]);
  const [kafedralIsOpen, setKafedralIsOpen] = useState(false);
  const [cafedral, setCafedral] = useState(false);
  const [blockTable, setBlockTable] = useState(false);
  const handleButtonClick = () => {
    setEducatorIdforLk("");
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 28)) {
      basicTabData.funUpdateTable("0");
    } else {
      basicTabData.funUpdateTable("14");
    }
    basicTabData.setnameKaf("ОИД");
    setKafedralIsOpen(false);
    tabPar.setSelectedFilter("Все дисциплины");
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
  }, [basicTabData.tableDepartment]);

  useEffect(() => {
    GetDepartment().then((response) => {
      setdepartments([{ id: 14, name: "Все" }, ...response.data]);
    });
  }, [basicTabData.tableDepartment]);

  //! получаем и записываем данные usera
  useEffect(() => {
    apiGetUser().then((data) => {
      appData.setMyProfile(data);
    });
  }, []);

  const handleComponentChange = (component) => {
    appData.setSelectedComponent(component);
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
    basicTabData.setSearchTerm(event.target.value);
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

  //! при нажатии на подтвердить сохранение изменений
  const confirmClick = (action) => {
    if (action) {
      //! отправляем все запросы на обработку
      console.log("Сохранено", appData.bufferAction);
      bufferRequestToApi(appData.bufferAction).then((act) => {
        if (act) {
          appData.setBufferAction([0]);
          basicTabData.updateAlldata();
        }
      });
      tabPar.setSelectedTr([]);
      tabPar.setChangedData(tabPar.changedDataObj);
      console.log("выполнено и очищено", appData.bufferAction);
    } else {
      setPopupSaveAll(false);
    }
  };
  const [confirmationSave, setConfirmationSave] = useState(false); // флаг открывается если не сохранили данные и блокируем

  //! при клике на подтверждение блокировки таблицы
  const exportClick = (action) => {
    if (appData.bufferAction.length === 0) {
      if (action) {
        if (
          appData.metodRole[appData.myProfile?.role]?.some((el) => el === 33)
        ) {
          const id = basicTabData.tableDepartment.find(
            (el) => el.name === appData.myProfile.educator.department
          ).id;
          WorkloadBlocked(id).then((resp) => {
            if (resp.status == 200) {
              basicTabData.funUpdateTable(0);
              appData.setgodPopUp(true);
            }
          });
        } else {
          if (basicTabData.selectISOid) {
            WorkloadBlocked(0).then((resp) => {
              if (resp.status == 200) {
                basicTabData.funUpdateTable("0");
                appData.setgodPopUp(true);
                basicTabData.funGetDepartment();
              }
            });
          } else {
            console.log("tableDepartment", basicTabData.tableDepartment);
            const index = basicTabData.tableDepartment.find(
              (el) => el.name === basicTabData.nameKaf
            ).id;
            WorkloadBlocked(index).then((resp) => {
              if (resp.status == 200) {
                basicTabData.funUpdateTable(index);
                appData.setgodPopUp(true);
                basicTabData.funGetDepartment();
              }
            });
          }
        }
      } else {
        setPopupExport(false);
      }
    } else {
      setPopupExport(false);
      setConfirmationSave(true);
    }
  };

  //! функции для импорта файла
  const OpenPoPUpFile = () => {
    setfilePopUp(!filePopUp);
  };

  //! при нажатии на ракету
  const raketClick = () => {
    visibleDataPar.setStartData(0);
    const table = document.querySelector("table");
    table.scrollIntoView(true);
  };

  //! ФУНКЦИЯ ПРОВЕРКИ НА БЛОКИРОВАННЫЕ
  const checkBlocked = () => {
    let blocked = false;
    if (
      appData.selectedComponent === "History" ||
      appData.selectedComponent === "Teachers"
    ) {
      return false;
    }
    if (
      appData.selectedComponent != "History" ||
      appData.selectedComponent != "Teachers"
    ) {
      basicTabData.filtredData.map((el) =>
        el.isBlocked === true ? (blocked = true) : (blocked = false)
      );
      return blocked;
    }
  };
  useEffect(() => {
    setBlockTable(checkBlocked);
  }, [
    basicTabData.tableDepartment,
    basicTabData.filtredData,
    appData.selectedComponent,
    tabPar.setSelectedFilter,
  ]);

  return (
    <Layout>
      <div className={styles.HomePage}>
        {confirmationSave && (
          <div className={styles.nosavedData}>
            <div className={styles.nosavedDataInner}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                У вас есть несохраненные данные
              </div>
              <button
                style={{ marginTop: "25px", width: "150px" }}
                onClick={() => setConfirmationSave(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
        {appData.loaderAction && (
          <div className={styles.nosavedData}>
            <div className={styles.nosavedDataInner}>
              <div className={styles.loader}>
                <span className={styles.loaderInner}></span>
              </div>
              <span>Загружаем данные...</span>
            </div>
          </div>
        )}
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
                    <div className={styles.text}>Отменить</div>

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
                ) &&
                  basicTabData.nameKaf != "Все" &&
                  !blockTable &&
                  appData.selectedComponent !== "History" && (
                    <div
                      style={{ marginRight: "15px" }}
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
              <div
                className={styles.header_search}
                style={
                  basicTabData?.searchTerm
                    ? { backgroundColor: "#fff", border: "none" }
                    : null
                }
              >
                <input
                  type="text"
                  placeholder="Поиск..."
                  id="search"
                  name="search"
                  onChange={handleSearch}
                  value={basicTabData?.searchTerm}
                  className={styles.hedaer_search_inner}
                  style={
                    basicTabData?.searchTerm
                      ? { backgroundColor: "#fff" }
                      : null
                  }
                />
                <img src="./img/search.svg"></img>
              </div>
            </div>
            <div className={styles.header_button}>
              <Button
                Bg={
                  appData.selectedComponent === "Disciplines" ||
                  appData.selectedComponent === "History"
                    ? "#3B28CC"
                    : "#efedf3"
                }
                textColot={
                  appData.selectedComponent === "Disciplines" ||
                  appData.selectedComponent === "History"
                    ? "#efedf3"
                    : "#000000"
                }
                onClick={() => {
                  handleComponentChange("Disciplines");
                  handleButtonClick();
                  basicTabData.setselectISOid(true);
                }}
                text="Дисциплины"
              />

              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 3
              ) && (
                <Button
                  Bg={
                    appData.selectedComponent === "Teachers"
                      ? "#3B28CC"
                      : "#efedf3"
                  }
                  textColot={
                    appData.selectedComponent === "Disciplines" ||
                    appData.selectedComponent === "History"
                      ? "#000000"
                      : "#efedf3"
                  }
                  onClick={() => {
                    handleComponentChange("Teachers");
                    handleButtonClick();
                    basicTabData.setselectISOid(false);
                  }}
                  text="Преподаватели"
                />
              )}
              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 24
              ) && (
                <Button
                  text="Моя нагрузка"
                  onClick={() => {
                    setEducatorIdforLk(appData.myProfile.educator.id);
                    appData.setSelectedComponent("Teachers");
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
              <ErrorHelper />
              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 30
              ) && (
                <Warnings
                  setEducatorIdforLk={setEducatorIdforLk}
                  educatorIdforLk={educatorIdforLk}
                  className={styles.Warnings}
                  setSelectedComponent={appData.setSelectedComponent}
                  setEducatorData={setEducatorData}
                />
              )}
              <Profile
                className={styles.Profile}
                setOpenModalWind={setOpenModalWind}
                onenModalWind={onenModalWind}
                refProfile={refProfile}
              />
            </div>
          </div>
          {blockTable && (
            <div className={styles.blockedTextTable}>
              <div>
                <img src="./img/errorTreangle.svg" />
              </div>
              <div>
                <p>
                  Таблица находится в состоянии "Блокировки", редактирование
                  временно отключено!
                </p>
              </div>
            </div>
          )}

          {educatorIdforLk === "" && (
            <div className={styles.header_bottom}>
              <div className={styles.header_bottom_button}>
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 28
                ) &&
                  (appData.selectedComponent === "Disciplines" ||
                    appData.selectedComponent === "History") && (
                    <>
                      <ListKaf
                        dataList={departments}
                        setTableMode={setTableMode}
                      />
                      {appData.selectedComponent === "History" && (
                        <div className={styles.perenesen}>
                          <button
                            onClick={() => {
                              tabPar.setPerenesenAction(
                                !tabPar.perenesenAction
                              );
                            }}
                          >
                            {!tabPar.perenesenAction
                              ? "Не перенесенные"
                              : "Перенесенные"}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                {appData.selectedComponent === "Disciplines" &&
                  appData.selectedComponent !== "History" && <FiltredRows />}
              </div>

              <div className={styles.right_button}>
                <div className={styles.EditInput}>
                  {educatorIdforLk === "" && (
                    <EditInput
                      selectedComponent={appData.selectedComponent}
                      originalHeader={
                        appData.selectedComponent === "Disciplines"
                          ? workloadTableHeaders
                          : educatorTableHeaders
                      }
                    />
                  )}
                </div>

                {(appData.selectedComponent === "Disciplines" ||
                  appData.selectedComponent === "History") &&
                  appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 35
                  ) && (
                    <div className={styles.import}>
                      <button onClick={OpenPoPUpFile}>
                        <p>Импорт файла</p>
                        <img src="./img/import.svg" alt=">"></img>
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.Block__tables}>
          {appData.selectedComponent === "Disciplines" ? (
            <TableWorkload
              tableMode={tableMode}
              tableHeaders={tableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : appData.selectedComponent === "Teachers" &&
            educatorIdforLk === "" ? (
            <TableTeachers
              setEducatorIdforLk={setEducatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={setTableHeaders}
              tableHeaders={tableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              setEducatorData={setEducatorData}
            />
          ) : appData.selectedComponent === "Teachers" &&
            educatorIdforLk !== "" ? (
            <TableLks
              setEducatorIdforLk={setEducatorIdforLk}
              educatorIdforLk={educatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              educatorData={educatorData}
            />
          ) : appData.selectedComponent === "History" ? (
            <TableHistory
              tableMode={tableMode}
              tableHeaders={tableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
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
        {appData.selectedComponent !== "Teachers" && (
          <div className={styles.countSet}>
            Кол-во выделенных нагрузок: {new Set(tabPar.selectedTr).size}
          </div>
        )}
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
