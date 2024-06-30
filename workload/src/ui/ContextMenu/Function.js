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
  const updatedData = [...data];
  const newIds = [];
  const blocked = [];
  const newState = [];
  for (const id of selectedTr) {
    const workloadIndex = updatedData.findIndex((item) => item.id === id);
    if (workloadIndex !== -1) {
      const workload = updatedData[workloadIndex];
      const studentsPerGroup = Math.floor(workload.numberOfStudents / count);
      const remainder = workload.numberOfStudents % count;
      updatedData.splice(workloadIndex, 1);
      for (let i = 0; i < count; i++) {
        const newWorkload = {
          ...workload,
          numberOfStudents: studentsPerGroup + (i < remainder ? 1 : 0),
          educator: null,
          id: `${workload.id}${i}`,
          isMerged: false,
          isSplit: true,
        };
        newState.push(newWorkload);
        updatedData.splice(workloadIndex + i, 0, newWorkload);
        newIds.push(newWorkload.id);
        blocked.push(newWorkload.id);
      }
    }
  }
  return { updatedData, newIds, blocked, newState };
}

export function combineData(data, selectedTr) {
  let newState = null;
  const prevState = data.filter((item) =>
    Object.values(selectedTr).includes(item.id)
  );
  if (
    prevState.every(
      (item) =>
        item.workload === prevState[0].workload &&
        item.discipline === prevState[0].discipline &&
        item.hours === prevState[0].hours
    )
  ) {
    const sumOfStudents = prevState.reduce(
      (total, el) => total + el.numberOfStudents,
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
      const updatedObject = {
        ...upData[index],
        groups,
        numberOfStudents: sumOfStudents,
      };
      newState = updatedObject;
      const newUpdatedData = [
        ...upData.slice(0, index),
        updatedObject,
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
