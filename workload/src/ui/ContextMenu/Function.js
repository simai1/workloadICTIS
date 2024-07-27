import { addWorkload } from "./ContextMenuData";

export function upDateEducator(data, ItemSelectedTr, name) {
  const updatedData = data.map((obj) =>
    obj.id === ItemSelectedTr ? { ...obj, educator: name } : obj
  );
  const prevState = data.find((obj) => obj.id === ItemSelectedTr)?.educator;
  return { newData: updatedData, prevState };
}

export function upDateEducators(data, ItemSelectedTr, name) {
  const updatedData = data.map((obj) =>
    ItemSelectedTr.some((e) => e === obj.id) ? { ...obj, educator: name } : obj
  );
  let prevState = [];
  data.map((obj) => {
    if (ItemSelectedTr.some((e) => e === obj.id)) {
      prevState.push({ workloadId: obj.id, state: obj.educator });
    }
  });
  return { newData: updatedData, prevState };
}

export function splitWorkloadCount(data, selectedTr, count, typeSplit) {
  let updatedData = [...data];
  const newIds = [];
  const blocked = [];
  const newState = [];
  const hoursData = [];
  for (const id of selectedTr) {
    const workloadIndex = updatedData.findIndex((item) => item.id === id);
    if (workloadIndex !== -1) {
      const workload = updatedData[workloadIndex];
      const studentsPerGroup = Math.floor(workload.numberOfStudents / count);
      const remainder = workload.numberOfStudents % count;
      // updatedData.splice(workloadIndex, 1);
      // updatedData[workloadIndex] = { ...workload, id: workload.id + "0" };

      blocked.push(workload.id + "0");
      newIds.push(workload.id + "0");
      const origDat = {
        ...workload,
        id: workload.id + 0,
        isSplit: false,
        isSplitArrow: true,
        isMerged: false,
      };
      newState.push(origDat);

      //! расчитаем рейтинг контроль

      let newValue = [];
      let workloadsData = [];

      for (let i = 0; i < count; i++) {
        const rch =
          workload?.audienceHours *
          (studentsPerGroup + (i < remainder ? 1 : 0)) *
          0.01;

        let newWorkload = {};

        let hoursDataObj = {};
        if (typeSplit === "splitCandidatesExam") {
          newWorkload = {
            ...workload,
            numberOfStudents: workload.numberOfStudents,
            educator: null,
            id: `${workload.id}${i + 1}`,
            isMerged: false,
            isSplit: true,
            ratingControlHours: 0,
            hours: workload.numberOfStudents,
            audienceHours: workload.numberOfStudents,
          };
          hoursDataObj = {
            numberOfStudents: workload.numberOfStudents,
            hours: workload.numberOfStudents,
            audienceHours: workload.numberOfStudents,
            ratingControlHours: 0,
          };
        } else {
          newWorkload = {
            ...workload,
            numberOfStudents: studentsPerGroup + (i < remainder ? 1 : 0),
            educator: null,
            id: `${workload.id}${i + 1}`,
            isMerged: false,
            isSplit: true,
            ratingControlHours: rch.toFixed(2),
            hours: (rch + workload?.audienceHours).toFixed(2),
          };
          hoursDataObj = {
            numberOfStudents: studentsPerGroup + (i < remainder ? 1 : 0),
            hours: (rch + workload?.audienceHours).toFixed(2),
            audienceHours: workload?.audienceHours,
            ratingControlHours: rch,
          };
        }
        workloadsData.push(hoursDataObj);
        newValue.push(newWorkload);
        newState.push(newWorkload);
        newIds.push(newWorkload.id);
        blocked.push(newWorkload.id);
      }
      hoursData.push({
        workloadId: workload.id,
        workloadsData: workloadsData,
      });

      updatedData = [
        ...updatedData.slice(0, workloadIndex),
        origDat,
        ...newValue,
        ...updatedData.slice(workloadIndex + 1),
      ];
    }
  }
  return { updatedData, newIds, blocked, newState, hoursData };
}

export function combineDataIdentify(data, selectedTr, action) {
  const prevState = data.filter((item) =>
    Object.values(selectedTr).includes(item.id)
  );
  let text = "Не совпадает: ";
  if (!prevState.every((el) => el.discipline === prevState[0].discipline)) {
    text = text + "дисциплина, ";
  }
  if (!prevState.every((el) => el.workload === prevState[0].workload)) {
    text = text + "нагрузка, ";
  }
  if (!prevState.every((el) => el.period === prevState[0].period)) {
    text = text + "период, ";
  }
  if (
    !prevState.every(
      (el) => el.formOfEducation === prevState[0].formOfEducation
    )
  ) {
    text = text + "форма обучения";
  }

  if (action === "g") {
    if (
      !prevState.every((el) => el.audienceHours === prevState[0].audienceHours)
    ) {
      text = text + "аудиторные часы ";
    }
    return text;
  } else if (action === "h") {
    if (
      !prevState.every(
        (el) => el.numberOfStudents === prevState[0].numberOfStudents
      )
    ) {
      text = text + "количество студентов ";
    }
    return text;
  } else if (action === "vkr") {
    if (
      !prevState.every(
        (el) => el.numberOfStudents === prevState[0].numberOfStudents
      )
    ) {
      text = text + "количество студентов ";
    }
    return text;
  }
  // else if (action === "add") {
  //   if (prevState.every((el) => el.period !== prevState[0].period)) {
  //     text = text + "период, ";
  //   }
  //   return text;
  // }
  // else if (action === "candidatesExam") {
  //   if (prevState.every((el) => el.period !== prevState[0].period)) {
  //     text = text + "период, ";
  //   }
  //   return text;
  // }
}

export function combineData(data, selectedTr, action = "") {
  let newState = null;
  const prevState = data.filter((item) =>
    Object.values(selectedTr).includes(item.id)
  );

  if (
    (action === "g" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.audienceHours === prevState[0].audienceHours &&
          item.period === prevState[0].period &&
          item.formOfEducation === prevState[0].formOfEducation
      )) ||
    (action === "h" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.numberOfStudents === prevState[0].numberOfStudents &&
          item.isSplit === true &&
          item.period === prevState[0].period &&
          item.formOfEducation === prevState[0].formOfEducation
      )) ||
    (action === "vkr" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.numberOfStudents === prevState[0].numberOfStudents &&
          item.period === prevState[0].period &&
          item.formOfEducation === prevState[0].formOfEducation
      )) ||
    (action === "add" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.period === prevState[0].period &&
          item.formOfEducation === prevState[0].formOfEducation
      )) ||
    (action === "candidatesExam" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.period === prevState[0].period &&
          item.formOfEducation === prevState[0].formOfEducation
      ))
  ) {
    const sumOfStudents = prevState.reduce(
      (total, el) => total + el.numberOfStudents,
      0
    );
    const audienceHours = prevState.reduce(
      (total, el) => total + el.audienceHours,
      0
    );
    const groups = prevState.reduce((total, el) => {
      if (!total.includes(el.groups)) {
        return total + " " + el.groups;
      }
      return total;
    }, "");

    const individualCB = Object.values(selectedTr).slice(1);
    const upData = data.filter((item) => !individualCB.includes(item.id));
    const index = upData.findIndex((item) => item.id === selectedTr[0]);
    if (index !== -1) {
      const updatedObject =
        action === "g"
          ? {
              ...upData[index],
              groups,
              numberOfStudents: sumOfStudents,
              isSplit: false,
              isMerged: true,
              educator: "___",
            }
          : action === "h"
          ? {
              ...upData[index],
              audienceHours,
              groups,
              isSplit: false,
              isMerged: true,
              educator: "___",
            }
          : action === "vkr"
          ? {
              ...upData[index],
              audienceHours,
              groups,
              isSplit: false,
              isMerged: true,
              educator: "___",
            }
          : action === "add"
          ? {
              ...upData[index],
              numberOfStudents: sumOfStudents,
              groups,
              isSplit: false,
              isMerged: true,
              educator: "___",
            }
          : action === "candidatesExam" && {
              ...upData[index],
              groups,
              isSplit: false,
              isMerged: true,
              educator: "___",
            };

      if (action === "g") {
        const rc =
          updatedObject.audienceHours * updatedObject.numberOfStudents * 0.01;
        const updatedObjectFix = {
          ...updatedObject,
          ratingControlHours: rc,
          hours: rc + updatedObject.audienceHours,
        };
        newState = updatedObjectFix;
      } else if (action === "h") {
        const rc =
          updatedObject.audienceHours * updatedObject.numberOfStudents * 0.01;
        const updatedObjectFix = {
          ...updatedObject,
          ratingControlHours: rc,
          hours: rc + updatedObject.audienceHours,
        };
        newState = updatedObjectFix;
      } else if (action === "vkr") {
        const updatedObjectFix = {
          ...updatedObject,
          ratingControlHours: 0,
          hours: updatedObject.numberOfStudents * 0.5,
          audienceHours: updatedObject.numberOfStudents * 0.5,
        };
        newState = updatedObjectFix;
      } else if (action === "add") {
        const addHours = addWorkload.find(
          (el) => el.name === updatedObject.workload
        );
        const h = updatedObject.numberOfStudents * addHours?.hors;

        const updatedObjectFix = {
          ...updatedObject,
          ratingControlHours: h,
          hours: h,
        };
        newState = updatedObjectFix;
      } else if (action === "candidatesExam") {
        newState = { ...updatedObject };
      }

      //! рассчитываем учебный план, берем все учебные планы добалвяем в массив выбираем уникальные переводим в текст
      let cursum = prevState
        .map((el) => el.curriculum.split(", "))
        .flat()
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .reduce((acc, curr) => (acc === "" ? curr : `${acc}, ${curr}`), "");
      // console.log("curmass", cursum);

      let semestersem = prevState
        .map((el) => el.semester.split(", "))
        .flat()
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .reduce((acc, curr) => (acc === "" ? curr : `${acc}, ${curr}`), "");
      // console.log("semestersem", semestersem);

      // let groups = prevState
      //   .map((el) => el.groups.split(", "))
      //   .flat()
      //   .filter((v, i, arr) => arr.indexOf(v) === i)
      //   .reduce((acc, curr) => (acc === "" ? curr : `${acc}, ${curr}`), "");
      // console.log("groups", groups);

      let block = prevState
        .map((el) => el.block.split(", "))
        .flat()
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .reduce((acc, curr) => (acc === "" ? curr : `${acc}, ${curr}`), "");
      console.log("block", block);

      newState = {
        ...newState,
        curriculum: cursum,
        semester: semestersem,
        block: block,
      };

      const newUpdatedData = [
        ...upData.slice(0, index),
        newState,
        ...upData.slice(index + 1),
      ];
      return { newUpdatedData, prevState, newState };
    }
  }
  return null;
}

//! работа с измененныеми данными changedData
//! добавление данных
export function addСhangedData(changedData, dataKey, ids) {
  const cd = { ...changedData };
  cd[dataKey] = [...cd[dataKey], ...ids];
  return cd;
}
//! удаление данных с changedData
export function delChangeData(changedData, dataKey, ids) {
  const cd = { ...changedData };
  const dataArray = cd[dataKey];
  ids.forEach((id) => {
    const indexToRemove = dataArray.findIndex((item) => item === id);

    if (indexToRemove !== -1) {
      dataArray.splice(indexToRemove, 1);
    }
  });
  return cd;
}

//! применяется всместе с нижней функцией
// const [menuWidth, setMenuWidth] = useState(300);
// const menuRef = useRef(null);
// useEffect(() => {
//   if (menuRef.current) {
//     setMenuWidth(menuRef.current.clientWidth);
//   }
// }, [menuRef.current]);

// ref={menuRef}
// style={getStylePosition(
//   tabPar.contextPosition,
//   window.innerWidth,
//   menuWidth,
//   props.conxextMenuRef
// )}
//! функция которая возвращает стиль для положения меню
export function getStylePosition(
  contextPosition,
  innerWidth,
  menuWidth,
  conxextMenuRef
) {
  console.log("menuWidth", menuWidth);
  console.log("clientWidth", conxextMenuRef);
  const cmw = conxextMenuRef.current?.clientWidth + 20 || 280;
  if (contextPosition?.x + cmw + menuWidth > innerWidth) {
    return {
      top: contextPosition?.y,
      left: contextPosition?.x - menuWidth - 15,
      transition: "all 0.15s ease",
    };
  } else {
    return {
      top: contextPosition?.y,
      left: contextPosition?.x + cmw,
      transition: "all 0.15s ease",
    };
  }
}
