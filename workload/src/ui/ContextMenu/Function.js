export function upDateEducator(data, ItemSelectedTr, name) {
  const updatedData = data.map((obj) =>
    obj.id === ItemSelectedTr ? { ...obj, educator: name } : obj
  );
  const prevState = data.find((obj) => obj.id === ItemSelectedTr)?.educator;
  return { newData: updatedData, prevState };
}

export function splitWorkloadCount(data, selectedTr, count) {
  const updatedData = [...data];
  const newIds = [];
  const blocked = [];
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
        };
        updatedData.splice(workloadIndex + i, 0, newWorkload);
        newIds.push(newWorkload.id);
        blocked.push(newWorkload.id);
        console.log('blocked', blocked)
      }
    }
  }
  return { updatedData, newIds, blocked };
}

export function combineData(data, selectedTr) {
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
      const newUpdatedData = [
        ...upData.slice(0, index),
        updatedObject,
        ...upData.slice(index + 1),
      ];
      return { newUpdatedData, prevState };
    }
  }
  return null;
}

//! работа с измененныеми данными changedData
//! добавление данных
export function addСhangedData(changedData, dataKey, ids) {
  const cd = { ...changedData };
  console.log('cd', cd)
  // const existingIds = new Set(cd[dataKey]);
  // const uniqueIds = ids.filter((id) => !cd[dataKey]);
  // const uniqueIds = ids.filter((id) => !cd[dataKey].has(id));

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
