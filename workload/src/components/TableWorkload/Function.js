//! функция замены преподавательского массива на его имя
export function funFixEducator(data) {
  return data.map((item) => ({
    ...item,
    educator: item.educator ? item.educator.name : "___",
  }));
}
// if(data && bufferAction.length >0){
//   console.log('bufferAction', bufferAction)
//   const newData = [...data]
//   let obj = []
//   bufferAction.map((item)=>{
//     if(item.request === "addEducatorWorkload"){
//     let o = {...newData[newData.findIndex((el)=>(el.id === item.data.workloadId))]};
//     o.educator = item.edicatorName.edicatorName;
//     obj.push(o)
//     }
//   })

//   return data.map((item) => {
//     // let i = findex.some((el)=> el === index)
//     if(obj.find((e)=> e.id === item.id)){
//       return obj.find((e)=> e.id === item.id)
//     }else if(item.educator === null || item.educator === undefined){
//       return {
//         ...item,
//         educator: item.educator ? item.educator.name : "___",
//       }
//     }
//     else if(item.educator.name){
//       return {
//         ...item,
//         educator: item.educator.name
//       }
//     }else{
//       return item;
//     }
//   });

//! фильтрация массива нагрузок
export function filteredWorkload(data, text) {
  const fd = [...data];
  return fd.filter((row) => {
    return Object.values(row).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(text.toLowerCase())
    );
  });
}

//! функция поднятия закрпепленных наверх таблицы
export function funSortedFastened(data, fastenedData) {
  if (fastenedData) {
    const fd = [];
    fastenedData?.map((item) => {
      fd.push(item.workloadId);
    });
    const sortedArray = data.sort((a, b) => {
      const isAInSecondArray = fd.includes(a.id);
      const isBInSecondArray = fd.includes(b.id);
      if (isAInSecondArray && !isBInSecondArray) {
        return -1; // Переместить a вперед
      }
      if (!isAInSecondArray && isBInSecondArray) {
        return 1; // Переместить b вперед
      }
      return 0; // Не изменять порядок, если оба элемента в secondArray или оба не в secondArray
    });

    return sortedArray;
  } else {
    return data;
  }
}

//! функция разделения на кафедральный и общеинститутские и сортировки
export function funSplitData(data, isOid) {
  const origData = [...data];
  const sortedUsers = origData.slice();
  // .sort((a, b) => a.discipline.localeCompare(b.discipline));
  // закрепленные переносим в начало таблицы
  const filteredData = sortedUsers.filter((item) => item?.isOid === isOid);
  return filteredData;
}

//! функция фильтрации на все измененные выделенные и тд
export function funFilterSelected(
  data,
  selectedFilter,
  colored,
  changedData,
  fastenedData,
  allCommentsData,
  allOffersData
) {
  const origData = [...data];
  if (selectedFilter === "Выделенные") {
    let fd = [];
    fd = origData.filter((item) =>
      colored.some((el) => el.workloadId === item.id)
    );
    return fd;
  } else if (selectedFilter === "Измененные") {
    let fd = [];
    const massId = Object.values(changedData).flat();
    fd = origData.filter((item) => massId.some((el) => el === item.id));
    return fd;
  } else if (selectedFilter === "Закрепленные") {
    let fd = [];
    fd = origData.filter((item) =>
      fastenedData.some((el) => el.workloadId === item.id)
    );
    return fd;
  } else if (selectedFilter === "Комментарии") {
    let fd = [];
    fd = origData.filter((item) =>
      allCommentsData.some((el) => el.workloadId === item.id)
    );
    return fd;
  } else if (selectedFilter === "Предложения") {
    let fd = [];
    fd = origData.filter((item) =>
      allOffersData.some((el) => el.offer.workloadId === item.id)
    );
    return fd;
  } else {
    return data;
  }
}

export function getTextForNotData(selectedFilter) {
  console.log("selectedFilter", selectedFilter);
  if (selectedFilter === "Измененные") {
    return "Нет измененных данных";
  } else if (selectedFilter === "Закрепленные") {
    return "Нет закрепленных данных";
  } else if (selectedFilter === "Выделенные") {
    return "Нет выделенных данных";
  } else if (selectedFilter === "Все дисциплины") {
    return "В таблице нет данных";
  } else if (selectedFilter === "Комментарии") {
    return "В таблице нет комментариев";
  } else if (selectedFilter === "Предложения") {
    return "В таблице нет предложений";
  } else {
    return "В таблице нет данных";
  }
}

//! закрепленные строки поднимаем вверх
export function funfastenedDataSort(data, fastenedData) {
  let newData = [...data];
  let items = [];
  fastenedData?.forEach((itemId) => {
    const index = newData.findIndex((el) => el.id === itemId);
    if (index !== -1) {
      items.push(newData.splice(index, 1)[0]);
    }
  });

  return [...items, ...newData];
}

//! функция удаления обьекта по id при нажатии на применить удаление
export function deleteItemBuffer(buff, itemId, type) {
  console.log("fundata", buff, itemId, type);

  let itemData = null;
  let newBuffer = buff
    .map((item) => {
      if (item.request === type) {
        console.log("item.request true", type, "id");
        let p = { ...item };
        itemData = p;
        p.data.ids = p.data.ids.filter((id) => id !== itemId.slice(0, -1));
        p.data.ids = p.data.ids.filter((id) => id !== itemId);
        if (p.data.ids.length > 0) {
          return p;
        } else {
          return null;
        }
      } else {
        return item;
      }
    })
    .filter(Boolean);
  console.log("newBuffer", newBuffer);
  return { buffer: newBuffer, item: itemData };
}

//! функция опредления заблокирован ли tr, чтобы вывести кнопки отмены подтверждения
export const funGetConfirmation = (itemId, changedData, bufferAction) => {
  // при удалении строки
  if (changedData.deleted.find((el) => el === itemId)) {
    return { blocked: true, height: "150px", top: "0", type: 1, data: itemId };
  }
  // при разделении строки
  else if (changedData.split?.includes(itemId)) {
    // получим нужную строку из буффера
    const buff = [...bufferAction].filter(
      (el) =>
        el.request === "splitWorkload" && el.newIds.some((e) => e === itemId)
    )[0];
    let data = { ...buff };
    if (data.data) {
      data.data = { ...data.data, ids: [itemId.slice(0, -1)] };
      data.newIds = data.newIds.filter(
        (el) => el.slice(0, -1) === itemId.slice(0, -1)
      );
      data.prevState = [
        data.prevState.find((e) => e.id === itemId.slice(0, -1)),
      ];

      const length = data.data.n;
      const index = data.newIds.findIndex((e) => e === itemId);
      if (data.data.n) {
        return {
          blocked: true,
          height: `${150 * length}px`,
          top: `${-150 * index}px`,
          type: 2,
          data: data,
        };
      } else {
        return { blocked: false, height: "150px", top: "0", type: 0 };
      }
    } else {
      return { blocked: false, height: "150px", top: "0", type: 0 };
    }
  } else if (changedData.join?.includes(itemId)) {
    const buff = [...bufferAction].filter(
      (el) =>
        el.request === "joinWorkloads" && el.data.ids.some((e) => e === itemId)
    )[0];
    return {
      blocked: true,
      height: "150px",
      top: "0",
      type: 3,
      data: buff,
      workloadId: itemId,
    };
  } else return { blocked: false, height: "150px", top: "0", type: 0 };
};
