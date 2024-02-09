import React, { useState } from 'react';
import styles from "./HomePage.module.scss";
import TableDisciplines from '../../components/TableDisciplines/TableDisciplines';
import TableTeachers from '../../components/TableTeachers/TableTeachers';
import Button from '../../ui/Button/Button';
import Layout from '../../ui/Layout/Layout';
import Warnings from '../../components/Warnings/Warnings';

function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  return (
    <Layout>
    <div className={styles.HomePage}> 
      <div className={styles.button}>
        <div className={styles.button__inner}>
          <Button Bg={selectedComponent === "Disciplines" ? "#DDDDDD": "#ffffff"} onClick={() => handleComponentChange("Disciplines")} text="Дисциплины"/>
          <Button Bg={selectedComponent === "Teachers" ? "#DDDDDD": "#ffffff"} onClick={() => handleComponentChange("Teachers")} text="Преподователи"/>
        </div>
      </div>
      <div className={styles.Warnings}>
        <Warnings/>
      </div>
      <div className={styles.Block__tables}>
        {selectedComponent === "Disciplines" ? <TableDisciplines /> : <TableTeachers />}
      </div>
    </div>
    </Layout>
  );
}

export default HomePage;
