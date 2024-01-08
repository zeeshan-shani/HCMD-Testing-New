import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { changeModel } from "redux/actions/modelAction";
import { CHAT_CONST, } from "redux/constants/chatConstants";
import { MessageContent } from "Routes/Chat/Main/UserChat/message/Contents/MessageContent";
import { FileContent } from "Routes/Chat/Main/UserChat/message/Contents/FileContent";
import { AudioContent } from "Routes/Chat/Main/UserChat/message/Contents/AudioContent";
import { DeletedContent } from "Routes/Chat/Main/UserChat/message/Contents/DeletedContent";
import { getBackgroundColorClass } from "redux/common";
import { ImageVideoContent } from "Routes/Chat/Main/UserChat/message/Contents/ImageVideoContent";
import { MessageOptions } from "Routes/Chat/Main/UserChat/message/Options/MessageOptions";
import { CONST } from "utils/constants";
import { dispatch } from "redux/store";
import { CHAT_MODELS } from "Routes/Chat/Models/models";
import * as Framer from 'framer-motion';
import { isMobile } from "react-device-detect";
import { useClickAway } from "react-use";

const AnimatePresence = Framer.AnimatePresence;
const MotionUL = Framer.motion.ul;

const reactions = [
    { id: 6, label: '✅' },
    { id: 1, label: '👍' },
    { id: 2, label: '❤️' },
    { id: 3, label: '😂' },
    { id: 4, label: '😉' },
    { id: 5, label: '😥' },
    { id: 5, label: '🙏' },
]

export const onImageGalleryOpen = (id, taskAttachments = []) => {
    changeModel(CHAT_MODELS.IMAGE_GALLERY);
    dispatch({ type: CHAT_CONST.IMAGE_INDEX, payload: id, taskAttachments });
    dispatch({ type: CHAT_CONST.UPDATE_TASK_ATTACHMENTS, payload: taskAttachments });
}

const CheckUnread = ({ isUnread = false, unreadMessageRef }) => {
    if (isUnread)
        return (<div ref={unreadMessageRef} className="pt-4 pb-2" id="unread-tag">
            <div className="unread-messages">
                <div className="text-white msg-box p-1 m-auto">
                    {`New Messages`}
                </div>
            </div>
        </div>);
}

export const Message = ({
    item,
    prevMsg,
    ReadOnly,
    user,
    pTime,
    isUnread,
    unreadMessageRef,
    ReqforQuotedMessage,
    moveToOrigin,
    messageRef,
    isAdmin,
    ViewTaskHandler,
    onCloseTaskDeatails,
    isPrivateChat,
    setInspectUser,
    onPopupView,
    searchKey,
    ghostOn = false,
    isBufferMsg = false,
    reactOnMessage,
    SetUserChatState,
    isGroupAdmin,
    hideReactions }) => {

    const { activeChat } = useSelector((state) => state.chat);
    messageRef[item?.id] = useRef();
    const [isMenu, setIsMenu] = useState(false);
    // const defaultOptions = {
    //     shouldPreventDefault: true,
    //     delay: 200,
    // };
    const onDoubleClick = () => { !item.isDeleted && activeChat.id !== -1 && setIsMenu(true) };

    // const onClick = (e) => { }
    // const longPressEvent = useLongPress(onDoubleClick, onClick, defaultOptions);
    const dropdownRef = useRef();
    useClickAway(dropdownRef, () => setIsMenu(false))

    try {
        const selfMessage = item.sendBy === user.id;
        const messageClass = `message ${selfMessage ? ' self ' : ' '} ${isMenu ? 'reaction-menu-on' : ''}`;
        const isDeleted = item?.isDeleted && !item?.isViewable;
        const mediaType = item?.mediaType;
        return (<>
            <div className={`message-container content-visibility-visible position-relative ${!item.isDeleted && !!item?.messageEmojis?.length ? 'mb-3' : ''}`}
                // {...longPressEvent}
                onDoubleClick={onDoubleClick}
                ref={dropdownRef}>
                <CheckUnread isUnread={isUnread} unreadMessageRef={unreadMessageRef} />
                <div className={messageClass} key={item.id} ref={messageRef[item.id]}>
                    {!isPrivateChat &&
                        <MessageOptions
                            user={user}
                            item={item}
                            prevMsg={prevMsg}
                            activeChat={activeChat} />}
                    <div className="message-wrapper">
                        {isDeleted ?
                            <DeletedContent
                                item={item}
                                classes={getBackgroundColorClass(item.type)}
                                user={user}
                                isAdmin={isAdmin}
                                prevMsg={prevMsg}
                                setInspectUser={setInspectUser}
                                pTime={prevMsg?.createdAt} /> :
                            <>
                                {!mediaType ?
                                    <MessageContent
                                        item={item}
                                        classes={getBackgroundColorClass(item.type)}
                                        isPrivateChat={isPrivateChat}
                                        user={user}
                                        ReadOnly={ReadOnly}
                                        SetUserChatState={SetUserChatState}
                                        moveToOrigin={moveToOrigin}
                                        activeChat={activeChat}
                                        setInspectUser={setInspectUser}
                                        prevMsg={prevMsg}
                                        searchKey={searchKey}
                                        ghostOn={ghostOn}
                                        isBufferMsg={isBufferMsg}
                                        isGroupAdmin={isGroupAdmin}
                                        hideReactions={hideReactions}
                                        pTime={prevMsg?.createdAt} />
                                    :
                                    <MessageMedia
                                        item={item}
                                        classes={getBackgroundColorClass(item.type)}
                                        user={user}
                                        ReadOnly={ReadOnly}
                                        isPrivateChat={isPrivateChat}
                                        prevMsg={prevMsg}
                                        SetUserChatState={SetUserChatState}
                                        messageRef={messageRef[item.id]}
                                        pTime={prevMsg?.createdAt}
                                        activeChat={activeChat}
                                        setInspectUser={setInspectUser}
                                        moveToOrigin={moveToOrigin}
                                        isAdmin={isAdmin}
                                        ViewTaskHandler={ViewTaskHandler}
                                        searchKey={searchKey}
                                        ghostOn={ghostOn}
                                        onPopupView={onPopupView}
                                        isBufferMsg={isBufferMsg}
                                        isGroupAdmin={isGroupAdmin}
                                        onCloseTaskDeatails={onCloseTaskDeatails}
                                        hideReactions={hideReactions}
                                    />
                                }
                            </>
                        }
                    </div>
                </div>
                {activeChat?.id !== -1 && !item.isDeleted && !hideReactions &&
                    <AnimatePresence>
                        {isMenu && (
                            <MotionUL
                                initial={{ opacity: 0, x: selfMessage ? "-50%" : "-50%" }}
                                animate={{ opacity: 1, x: selfMessage ? "30%" : "30%" }}
                                exit={{ opacity: 0, x: selfMessage ? "30%" : "-50%", transition: { duration: "0.15" } }}
                                transition={{ type: "spring", stiffness: "100", duration: "0.05" }}
                                className="reactions-menu p-1 d-flex gap-10 emoji-font"
                                style={{ right: isMobile ? 'auto' : (selfMessage ? '15%' : undefined), left: isMobile ? 'auto' : (!selfMessage ? '0' : undefined), }}
                            >
                                {reactions.map((react, index) => (
                                    <li className="item cursor-pointer fs-18" key={index} onClick={() => {
                                        reactOnMessage({ "chatId": item.chatId, "messageId": item.id, "emojiCode": react.label });
                                        setIsMenu(false);
                                    }}>
                                        {react.label}
                                    </li>
                                ))}
                            </MotionUL>
                        )}
                    </AnimatePresence>}
            </div>
        </>);
    } catch (error) {
        console.error(error);
    }
}

const MessageMedia = ({
    item,
    classes = '',
    user,
    prevMsg,
    SetUserChatState,
    pTime,
    setInspectUser,
    activeChat,
    onPopupView,
    searchKey,
    ReadOnly,
    ghostOn = false,
    isBufferMsg,
    isGroupAdmin,
    hideReactions
}) => {
    const mediaType = item.mediaType;
    const isImage = (mediaType.startsWith(CONST.MEDIA_TYPE.IMAGE) || mediaType.startsWith(CONST.MEDIA_TYPE.VIDEO)) && "image";
    const isDoc = (mediaType.startsWith(CONST.MEDIA_TYPE.APPLICATION) || mediaType.startsWith(CONST.MEDIA_TYPE.TEXT)) && "document";
    const isAudio = mediaType.startsWith(CONST.MEDIA_TYPE.AUDIO) && "audio";
    const type = isImage || isDoc || isAudio;
    switch (type) {
        case "image":
            return <ImageVideoContent
                item={item}
                classes={classes}
                user={user}
                prevMsg={prevMsg}
                pTime={pTime}
                activeChat={activeChat}
                SetUserChatState={SetUserChatState}
                setInspectUser={setInspectUser}
                onPopupView={onPopupView}
                searchKey={searchKey}
                ghostOn={ghostOn}
                ReadOnly={ReadOnly}
                isBufferMsg={isBufferMsg}
                isGroupAdmin={isGroupAdmin}
                hideReactions={hideReactions}
            />
        case "document":
            return <FileContent
                item={item}
                user={user}
                classes={classes}
                prevMsg={prevMsg}
                activeChat={activeChat}
                pTime={pTime}
                SetUserChatState={SetUserChatState}
                setInspectUser={setInspectUser}
                onPopupView={onPopupView}
                searchKey={searchKey}
                ghostOn={ghostOn}
                ReadOnly={ReadOnly}
                isBufferMsg={isBufferMsg}
                isGroupAdmin={isGroupAdmin}
                hideReactions={hideReactions}
            />
        case "audio":
            return <AudioContent
                item={item}
                user={user}
                classes={classes}
                prevMsg={prevMsg}
                activeChat={activeChat}
                pTime={pTime}
                SetUserChatState={SetUserChatState}
                setInspectUser={setInspectUser}
                searchKey={searchKey}
                ghostOn={ghostOn}
                ReadOnly={ReadOnly}
                isBufferMsg={isBufferMsg}
                isGroupAdmin={isGroupAdmin}
                hideReactions={hideReactions}
            />
        default: return <></>;
    }
}