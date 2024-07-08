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

export function splitWorkloadCount(data, selectedTr, count) {
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
        const newWorkload = {
          ...workload,
          numberOfStudents: studentsPerGroup + (i < remainder ? 1 : 0),
          educator: null,
          id: `${workload.id}${i + 1}`,
          isMerged: false,
          isSplit: true,
          ratingControlHours: rch.toFixed(2),
          hours: (rch + workload?.audienceHours).toFixed(2),
        };
        const hoursDataObj = {
          numberOfStudents: studentsPerGroup + (i < remainder ? 1 : 0),
          hours: (rch + workload?.audienceHours).toFixed(2),
          audienceHours: workload?.audienceHours,
          ratingControlHours: rch,
        };
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
          item.semester === prevState[0].semester
      )) ||
    (action === "h" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.numberOfStudents === prevState[0].numberOfStudents &&
          item.isSplit === true &&
          item.semester === prevState[0].semester
      )) ||
    (action === "vkr" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.numberOfStudents === prevState[0].numberOfStudents &&
          item.semester === prevState[0].semester
      )) ||
    (action === "add" &&
      prevState.every(
        (item) =>
          item.workload === prevState[0].workload &&
          item.discipline === prevState[0].discipline &&
          item.semester === prevState[0].semester
      ))
  ) {
    const sumOfStudents = prevState.reduce(
      (total, el) => total + el.numberOfStudents,
      0
    );
    console.log(prevState);
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
          : action === "add" && {
              ...upData[index],
              numberOfStudents: sumOfStudents,
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
      }

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
