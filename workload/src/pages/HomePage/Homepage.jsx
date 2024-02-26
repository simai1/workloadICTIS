import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import TableDisciplines from "../../components/TableDisciplines/TableDisciplines";
import TableTeachers from "../../components/TableTeachers/TableTeachers";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import Warnings from "../../components/Warnings/Warnings";
import TableLks from "../../components/TableLks/TableLks";
import axios from "axios";

function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };
  const [name, setName] = useState("");
  const [post, setpost] = useState("");
  const [bet, setbet] = useState("");

  // useEffect(() => {
  //   console.log(name); // Этот код будет выполняться каждый раз, когда изменяется значение name
  // }, [name]); // Указываем зависимость от переменной name

  // обращение к API

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://workload.sfedu.ru/educator",
          {}
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  //----------------

  const handleButtonClick = () => {
    setName("");
  };

  const handleNameChange = (nameTeacher, postTeacher, betTeacher) => {
    setName(nameTeacher);
    setpost(postTeacher);
    setbet(betTeacher);
  };

  return (
    <Layout>
      <div className={styles.HomePage}>
        <div className={styles.button}>
          <div className={styles.button__inner}>
            <Button
              Bg={selectedComponent === "Disciplines" ? "#DDDDDD" : "#ffffff"}
              onClick={() => {
                handleComponentChange("Disciplines");
                handleButtonClick();
              }}
              text="Дисциплины"
            />
            <Button
              Bg={selectedComponent === "Teachers" ? "#DDDDDD" : "#ffffff"}
              onClick={() => {
                handleComponentChange("Teachers");
                handleButtonClick();
              }}
              text="Преподователи"
            />
          </div>
        </div>
        <div className={styles.Warnings}>
          <Warnings />
        </div>
        <div className={styles.Block__tables}>
          {selectedComponent === "Disciplines" &&
          (name === "" || name !== "") ? (
            <TableDisciplines />
          ) : selectedComponent === "Teachers" && name === "" ? (
            <TableTeachers onNameChange={handleNameChange} />
          ) : selectedComponent === "Teachers" && name !== "" ? (
            <TableLks
              delNameChange={handleNameChange}
              NameTeachers={{ name, post, bet }}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
