import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./../TableWorkload.module.scss";
import { ReactComponent as LogoAllComment } from "./../../../img/arrow_down.svg";
import { ReactComponent as CommentsSvg } from "./../../../img/comments.svg";
import { ReactComponent as Checkmark } from "./../../../img/checkmark.svg";
import DataContext from "../../../context";
import { createComment, deleteComment } from "../../../api/services/ApiRequest";

function Comments(props) {
  const { appData, basicTabData } = useContext(DataContext);
  const [commentWindowShow, setCommentWindowShow] = useState(false);
  const [allCommentsShow, setAllCommentsShow] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [isError, setError] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [confirmation, setConfirmation] = useState(false); // показать/скрыть окно подтверждения удаления комментария

  const circleClick = () => {
    setCommentWindowShow(!commentWindowShow);
    setTextArea(false);
    setError(false);
    setAllCommentsShow(false);
  };
  const allCommentsClick = () => {
    setAllCommentsShow(!allCommentsShow);
    setTextArea(false);
    setError(false);
  };
  const onTextArea = () => {
    setAllCommentsShow(false);
    setTextArea(!textArea);
  };
  const textAreaChange = (e) => {
    setTextAreaValue(e.target.value);
    setError(false);
  };
  const buttonClick = () => {
    if (textAreaValue.trim() === "") {
      setError(true);
    } else {
      const data = {
        educatorId: appData.myProfile.id,
        workloadId: props.commentData[0].workloadId,
        text: textAreaValue,
      };
      //создаем комментарий и обновляем комментарии
      if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 20)) {
        createComment(data).then(() => {
          console.log("1 Вариант")
          basicTabData.funUpdateAllComments();
        });
      }else{
        console.log("2 Вариант")
        createComment(data);
      }
    }
  };

  //! при клике на галочку удаляем все комментарии
  const checkmarkClick = () => {
    setConfirmation(true);
  };

  //! При клике отменить или подтвердить удаление комментариев
  const onClickDel = (action) => {
    if (action) {
      // удалим коммент
      deleteComment(props.commentData[0].workloadId).then(() => {
        // обновим состояние комментов
        basicTabData.funUpdateAllComments();
      });
    } else {
      setConfirmation(false);
    }
  };

  //! закрытие модального окна при нажати вне него
  const commentRef = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setCommentWindowShow(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div
      ref={commentRef}
      className={styles.Comments}
      onClick={(e) => e.stopPropagation()}
    >
      {props.commentData.length > 0 && (
        <div>
          <div className={styles.circle} onClick={circleClick}>
            {props.commentData.length}
          </div>
        </div>
      )}
      {commentWindowShow && (
        <div className={styles.commentWindow}>
          {confirmation ? (
            <div className={styles.confirmationDel}>
              <div className={styles.text}>Удалить все комментарии?</div>
              <div className={styles.btn}>
                <button
                  className={styles.btn_left}
                  onClick={() => onClickDel(false)}
                >
                  Отменить
                </button>
                <button
                  className={styles.btn_rig}
                  onClick={() => onClickDel(true)}
                >
                  Подтвердить
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.commentContainer}>
              <div className={styles.containerScroll}>
                {allCommentsShow ? (
                  props.commentData.map((item) => (
                    <div key={item.id}>
                      <div className={styles.commentTitle}>
                        {item.educator.name}
                      </div>
                      <div className={styles.commentBody}>{item.text}</div>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className={styles.commentTitle}>
                      {props.commentData[0].educator.name}
                    </div>
                    <div className={styles.commentBody}>
                      {props.commentData[0].text}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.commentButton}>
                <div className={styles.btn_left} onClick={allCommentsClick}>
                  {props.commentData.length > 1 && (
                    <>
                      <span className={allCommentsShow ? styles.blue : null}>
                        {props.commentData.length}
                      </span>
                      <LogoAllComment
                        className={allCommentsShow ? styles.svg : null}
                        height={10}
                        width={15}
                      />
                    </>
                  )}
                </div>
                <div className={styles.btn_rigth}>
                  {appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 22
                  ) && (
                    <CommentsSvg
                      onClick={onTextArea}
                      className={textArea ? styles.svg : null}
                      height={16}
                      width={16}
                    />
                  )}

                  {appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 21
                  ) && (
                    <Checkmark
                      onClick={checkmarkClick}
                      height={16}
                      width={16}
                    />
                  )}
                </div>
              </div>
              {textArea && (
                <div className={styles.textAreaBox}>
                  <textarea
                    style={isError ? { border: "1px solid red" } : null}
                    onChange={textAreaChange}
                    className={styles.textArea}
                  ></textarea>
                  {isError && <span>Заполните текстовое поле!</span>}
                  <button onClick={buttonClick}>Отправить</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Comments;
