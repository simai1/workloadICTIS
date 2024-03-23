import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import TableDisciplines from "../../components/TableDisciplines/TableDisciplines";
import TableTeachers from "../../components/TableTeachers/TableTeachers";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import Warnings from "../../components/Warnings/Warnings";
import TableLks from "../../components/TableLks/TableLks";
import DataContext from "../../context";
import Profile from "../../components/Profile/Profile";

function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице
  const [onenModalWind, setOpenModalWind] = useState(false); // переменная закрытия модального окна профиля
  const refProfile = React.useRef(null); // ссылка на модальное окно профиля
  const [name, setName] = useState("");
  const [post, setpost] = useState("");
  const [bet, setbet] = useState("");

  const handleButtonClick = () => {
    setName("");
  };
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const handleNameChange = (nameTeacher, postTeacher, betTeacher) => {
    setName(nameTeacher);
    setpost(postTeacher);
    setbet(betTeacher);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <Layout>
      <div className={styles.HomePage}>
        <div className={styles.header}>
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
          </div>
          <div className={styles.header_left_component}>
            <Warnings
              className={styles.Warnings}
              setSelectedComponent={setSelectedComponent}
              handleNameChange={handleNameChange}
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

        <div className={styles.Block__tables}>
          {selectedComponent === "Disciplines" &&
          (name === "" || name !== "") ? (
            <TableDisciplines
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : selectedComponent === "Teachers" && name === "" ? (
            <TableTeachers
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setEducatorData={setEducatorData}
              onNameChange={handleNameChange}
            />
          ) : selectedComponent === "Teachers" && name !== "" ? (
            <TableLks
              educatorData={educatorData}
              delNameChange={handleNameChange}
              NameTeachers={{ name, post, bet }}
            />
          ) : null}
        </div>
        <a href="#">
          <div className={styles.rocket}>
            <img
              className={styles.rocket_img}
              src="./img/rocket.png"
              alt="up"
            />
          </div>
        </a>
      </div>
    </Layout>
  );
}

export default HomePage;
