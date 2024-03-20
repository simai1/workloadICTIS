import React, { useEffect, useState } from "react";
import styles from "./NotificationForm.module.scss";
import DataContext from "../../context";
import { createComment, deleteComment } from "../../api/services/ApiGetData";

import { ReactComponent as LogoAllComment } from "./../../img/arrow_down.svg";
import { ReactComponent as CommentsSvg } from "./../../img/comments.svg";
import { ReactComponent as CommentsSvgActive } from "./../../img/commentsOn.svg";
import { ReactComponent as Checkmark } from "./../../img/checkmark.svg";

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
        educatorId: "ca05e456-0cc0-4b57-b656-729dc3412412",
        workloadId: props.workloadId,
        text: textarea,
      };
      console.log(data);
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
    // if (isComment) {
    //   setPositionMenu({ y: props.position.y, x: props.position.x });
    // } else {
    //   setPositionMenu({ y: props.position.y - 150, x: props.position.x });
    // }
    setIsComment(!isComment);
  };

  //! нажатие на стрелку открытия всех комментариев
  const onClickAllComment = () => {
    setCommentsSheetOpen(!isCommentsSheetOpen);
    setIsComment(false);
    // if (isCommentsSheetOpen) {
    //   setPositionMenu({ y: props.position.y, x: props.position.x });
    // } else {
    //   setPositionMenu({ y: props.position.y - 168, x: props.position.x });
    // }
  };

  //! нажатие галочки удаление комментариев
  const onCheckmarkClickDelet = (data) => {
    console.log(data[0].id);
    //удаление коммента по id
    deleteComment(data[0].id).then(() => props.getDataAllComment());
  };

  return (
    <main ref={props.refHoverd} className={styles.notification}>
      <div
        className={styles.hovered_notice}
        style={{
          top: positionMenu.y + 65,
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
                    <h4>{item?.educator?.name}</h4>
                    <p>{item?.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.headComment}>
              <h4>{props.commentData[0]?.educator?.name}</h4>
              <p>{props.commentData[0]?.text}</p>
            </div>
          )}
          {props.commentData.length > 0 && (
            <div className={styles.hovered_notice_img}>
              <div className={styles.left} onClick={onClickAllComment}>
                {props.commentData.length > 1 && (
                  <>
                    <span>{props.commentData.length}</span>

                    <LogoAllComment
                      height={8}
                      className={styles.logosvg}
                      style={
                        isCommentsSheetOpen
                          ? {
                              transform: " rotate(180deg)",
                              transition: "transform 0.4s",
                            }
                          : { transition: "transform 0.3s" }
                      }
                    />
                  </>
                )}
              </div>

              <div className={styles.left_2}>
                {isComment ? (
                  <CommentsSvgActive
                    className={styles.logosvg}
                    onClick={handleClickComment}
                  />
                ) : (
                  <CommentsSvg
                    className={styles.logosvg}
                    onClick={handleClickComment}
                  />
                )}

                <Checkmark
                  className={styles.logosvg}
                  onClick={() => onCheckmarkClickDelet(props.commentData)}
                />
              </div>
            </div>
          )}
        </div>

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
      </div>
    </main>
  );
}
