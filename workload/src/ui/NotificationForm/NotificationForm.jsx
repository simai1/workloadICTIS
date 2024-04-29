import React, { useEffect, useState } from "react";
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
  const [workloadComments, setWorkloadComments] = useState([]);
  const { appData, tabPar } = React.useContext(DataContext);

  useEffect(() => {
    const allComments = [...tabPar.allCommentsData];
    setWorkloadComments(
      allComments.filter((item) => item.id === tabPar.selectedTr[0])
    );
  }, []);

  //! кнопка отправить
  const onCheckmarkClick = () => {
    if (textarea.trim() === "") {
      setError(true);
    } else {
      //удалить, заменить id пользователя
      const data = {
        educatorId: appData.myProfile.id,
        workloadId: tabPar.selectedTr[0],
        text: textarea,
      };
      // createComment(data).then(() =>
      //   props.getDataAllComment(props.setCommentAllData)
      // );
      createComment(data);
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
  };
  const notisStales = {
    top: props.contextPosition.y,
    left: props.contextPosition.x + 270,
  };
  return (
    <main ref={props.refHoverd} className={styles.notification}>
      <div className={styles.hovered_notice} style={notisStales}>
        <div className={styles.comment_top}>
          {/* отображение всех комментарие начиная с последнего по первый */}
          {isCommentsSheetOpen && workloadComments.length > 1 ? (
            <div className={styles.CommentsSheet}>
              <div className={styles.container}>
                {workloadComments.map((item) => (
                  <div key={item?.id}>
                    <h4>{item?.educator?.name}</h4>
                    <p>{item?.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.headComment}>
              <h4>{workloadComments[0]?.educator?.name}</h4>
              <p>{workloadComments[0]?.text}</p>
            </div>
          )}
          {workloadComments.length > 0 && (
            <div className={styles.hovered_notice_img}>
              <div className={styles.left} onClick={onClickAllComment}>
                {workloadComments.length > 1 && (
                  <>
                    <span>{workloadComments.length}</span>

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
            isComment || workloadComments.length === 0
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
          <button onClick={onCheckmarkClick}>Отправить</button>
        </div>
      </div>
    </main>
  );
}
