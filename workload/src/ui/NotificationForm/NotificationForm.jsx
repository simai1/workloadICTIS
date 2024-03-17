import React, { useEffect, useState } from "react";
import styles from "./NotificationForm.module.scss";
import DataContext from "../../context";
import { createComment } from "../../api/services/ApiGetData";

export function NotificationForm(props) {
  const [isCommentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const [isError, setError] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [textarea, setTextarea] = useState("");
  const [positionMenu, setPositionMenu] = useState(props.position);

  //! кнопка отправить
  const onCheckmarkClick = () => {
    if (textarea.trim() === "") {
      setError(true);
    } else {
      const data = {
        educatorId: "3d3d0074-3697-42ea-90f4-e8c034376fcf",
        workloadId: props.workloadId,
        text: textarea,
      };
      createComment(data).then(() => props.getDataAllComment());
      setIsComment(false);
      setPositionMenu({ y: props.position.y, x: props.position.x });
      //обновление модального окна комментариев
    }
  };

  const onChangeTextarea = (event) => {
    setError(false);
    setTextarea(event.target.value);
  };

  //! открытие textarea для ввода комментраия
  const handleClickComment = () => {
    setCommentsSheetOpen(false);
    var y = 0;
    if (isComment) {
      setPositionMenu({ y: props.position.y, x: props.position.x });
    } else {
      setPositionMenu({ y: props.position.y - 150, x: props.position.x });
    }
    setIsComment(!isComment);
  };

  //! нажатие на стрелку открытия всех комментариев
  const onClickAllComment = () => {
    setCommentsSheetOpen(!isCommentsSheetOpen);
    setIsComment(false);
    if (isCommentsSheetOpen) {
      setPositionMenu({ y: props.position.y, x: props.position.x });
    } else {
      setPositionMenu({ y: props.position.y - 168, x: props.position.x });
    }
  };

  return (
    <main ref={props.refHoverd} className={styles.notification}>
      <div
        className={styles.hovered_notice}
        style={{
          top: positionMenu.y - 90,
          left: positionMenu.x + 70,
        }}
      >
        <div className={styles.comment_top}>
          {/* отображение всех комментарие начиная с последнего по первый */}
          {isCommentsSheetOpen && props.commentData.length > 1 ? (
            <div className={styles.CommentsSheet}>
              <div className={styles.container}>
                {props.commentData.map((item) => (
                  <div key={item?.id}>
                    <h4>{item?.educator.name}</h4>
                    <p>{item?.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.headComment}>
              <h4>{props.commentData[0]?.educator.name}</h4>
              <p>{props.commentData[0]?.text}</p>
            </div>
          )}
          {props.commentData.length > 0 && (
            <div className={styles.hovered_notice_img}>
              <div className={styles.left} onClick={onClickAllComment}>
                <span>{props.commentData.length}</span>
                <img
                  style={
                    isCommentsSheetOpen
                      ? { transform: " rotate(180deg)" }
                      : null
                  }
                  src="./img/arrow_down.svg"
                  alt="^"
                ></img>
              </div>

              <div className={styles.left}>
                <img
                  onClick={handleClickComment}
                  src={
                    isComment ? "./img/commentsOn.svg" : "./img/comments.svg"
                  }
                  alt="comments"
                ></img>
                <img
                  onClick={onCheckmarkClick}
                  src="./img/checkmark.svg"
                  alt="checkmark"
                ></img>
              </div>
            </div>
          )}
        </div>

        {
          <div
            className={
              isComment || props.commentData.length === 0
                ? styles.comment
                : styles.comment_show
            }
          >
            <textarea
              style={isError ? { borderColor: "red" } : null}
              id="textareaNotificationForm"
              type="text"
              onChange={onChangeTextarea}
            />
            {isError && <span>Заполните текстовое поле</span>}
            <button onClick={onCheckmarkClick}>Отправать</button>
          </div>
        }
      </div>
    </main>
  );
}
