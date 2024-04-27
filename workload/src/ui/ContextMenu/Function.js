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
      }
    }
  }
  return { updatedData, newIds, blocked };
}
