import React, { useState } from "react";
import styles from "./NotificationForm.module.scss";
import DataContext from "../../context";
import { createComment } from "../../api/services/ApiRequest";

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
  const { appData } = React.useContext(DataContext);

  //! кнопка отправить
  const onCheckmarkClick = () => {
    if (textarea.trim() === "") {
      setError(true);
    } else {
      //удалить, заменить id пользователя
      const data = {
        educatorId: appData.myProfile.id,
        workloadId: props.workloadId,
        text: textarea,
      };
      createComment(data).then(() =>
        props.getDataAllComment(props.setCommentAllData)
      );
      setIsComment(false);
    }
  };

  const onChangeTextarea = (event) => {
    setError(false);
    setTextarea(event.target.value);
  };

  //! открытие textarea для ввода комментраия
  const handleClickComment = () => {
    setCommentsSheetOpen(false);
    setIsComment(!isComment);
  };

  //! нажатие на стрелку открытия всех комментариев
  const onClickAllComment = () => {
    setCommentsSheetOpen(!isCommentsSheetOpen);
    setIsComment(false);
  };

  //! нажатие галочки удаление комментариев
  const onCheckmarkClickDelet = () => {
    const prevObj = props.commentAllData.filter(
      (item) => item.workloadId === props.workloadId
    );
    props.setCommentAllData(
      props.commentAllData.filter(
        (item) => item.workloadId !== props.workloadId
      )
    );
    //! буфер
    appData.setBufferAction([
      { request: "deleteComment", data: props.workloadId, prevState: prevObj },
      ...appData.bufferAction,
    ]);
    props.setIsHovered(false);
    //удаление коммента по id
    // deleteComment(props.workloadId).then(() =>
    //   props.getDataAllComment(props.setCommentAllData)
    // );
  };
  return (
    <main ref={props.refHoverd} className={styles.notification}>
      <div
        className={styles.hovered_notice}
        style={{
          top: positionMenu.y,
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
                  onClick={onCheckmarkClickDelet}
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
            style={isError ? { borderColor: "red" } : { height: "73%" }}
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
