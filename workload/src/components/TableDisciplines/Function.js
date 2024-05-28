export function BackState(
  bufferAction,
  setBufferAction,
  updatedData,
  returnPrevState,
  setUpdatedData,
  setCommentAllData,
  commentAllData,
  event,
  setBlockedCheckboxes
) {
  //! следим за нажатием ctrl + z для отмены последнего действияы
  if (
    (event.ctrlKey || event.comand) &&
    (event.key === "z" ||
      event.key === "я" ||
      event.key === "Z" ||
      event.key === "Я")
  ) {
    console.log("отеменено последнее действие", bufferAction);
    //! отмена последнего действия
    if (bufferAction.length > 0) {
      if (
        bufferAction[0].request === "removeEducatorinWorkload" ||
        bufferAction[0].request === "addEducatorWorkload"
      ) {
        returnPrevState(bufferAction, updatedData).then((data) => {
          setUpdatedData(data);
          setBufferAction((prevItems) => prevItems.slice(1));
        });
      } else if (bufferAction[0].request === "deleteComment") {
        setCommentAllData([...commentAllData, ...bufferAction[0].prevState]);
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (bufferAction[0].request === "joinWorkloads") {
        // удаляем нагрузку которую обьеденили
        const dataTable = updatedData.filter(
          (item) => !bufferAction[0].prevState.some((el) => el.id === item.id)
        );
        // сохраняем индекс удаленного элемента
        const deletedIndex = updatedData.findIndex((item) =>
          bufferAction[0].prevState.some((el) => el.id === item.id)
        );
        const newArray = [...dataTable];
        newArray.splice(deletedIndex, 0, ...bufferAction[0].prevState);
        setUpdatedData(newArray);
        // убираем заблокированные элементы
        setBlockedCheckboxes((prev) =>
          prev.filter(
            (el) => !bufferAction[0].prevState.some((item) => item.id !== el)
          )
        );
      } else if (bufferAction[0].request === "splitWorkload") {
        // отмена разделения нагрузки
        setUpdatedData(
          updatedData.filter(
            (item) => !bufferAction[0].newIds.includes(item.id)
          )
        );
        setUpdatedData((prev) => [bufferAction[0].prevState[0], ...prev]);
      } else if (bufferAction[0].request === "workloadUpdata") {
        //отмена изменения даннных textarea
        const newData = [...updatedData];
        newData.map((item) => {
          if (item.id === bufferAction[0].data.id) {
            item[bufferAction[0].data.key] = bufferAction[0].prevState;
          }
          return item;
        });
        setUpdatedData([...newData]);
        setBufferAction((prevItems) => prevItems.slice(1));
      }
    }
  }
}
