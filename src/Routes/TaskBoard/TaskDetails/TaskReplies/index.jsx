import React, { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getResponseofThread, getSendToUsers } from 'redux/actions/chatAction';
import { fnBrowserDetect, getChatBackgroudClass } from 'redux/common';
import { CHAT_CONST } from 'redux/constants/chatConstants';
import { dispatch } from 'redux/store';
import { Thread } from 'Routes/Chat/Appbar/ThreadView/Thread';
import { messageRef, pageScroll } from 'Routes/Chat/Main/UserChat/message/ChatMessages';
import { ReactComponent as Loader } from 'assets/media/messageLoader.svg';
import Input from 'Components/FormBuilder/components/Input';
import { CONST } from 'utils/constants';
import { MessageSendButton } from 'Routes/Chat/Main/UserChat/footer/SendButton';
import { showError } from 'utils/package_config/toast';
import { sendMessage } from 'utils/wssConnection/Socket';

const defaultState = {
    message: '',
    messageType: CONST.MSG_TYPE.ROUTINE,
}
export default function TaskReplies({ taskDetails, onClose }) {
    const { user, connected } = useSelector((state) => state.user);
    const [state, setState] = useState(defaultState);
    const [messageType, setMessageType] = useState(CONST.MSG_TYPE.ROUTINE);
    const endRef = useRef();

    const { data: resMessages = [], isFetching, refetch } = useQuery({
        queryKey: ["/message/threadMessageList", taskDetails.messageId],
        queryFn: async () => {
            const res = await getResponseofThread(taskDetails.messageId);
            if (res?.status) return res.data.rows;
            return;
        },
        keepPreviousData: false,
        enabled: taskDetails.messageId && taskDetails.messageId !== -1,
        // staleTime: 30 * 1000,
    });

    const onQuote = useCallback((item) => {
        dispatch({ type: CHAT_CONST.SET_QUOTE_MESSAGE, payload: item.id });
        onClose();
    }, [onClose]);

    const onClickTaskHandler = useCallback((task) => {
        if (messageRef[task.id] !== undefined) {
            onClose();
            pageScroll(messageRef[task.id], { behavior: "smooth" });
            const classes = messageRef[task.id].current.className;
            messageRef[task.id].current.classList += " blink-quote-message ";
            setTimeout(() => {
                messageRef[task.id].current.classList = classes;
            }, 2000);
        } else {
            // console.error(task, " is not in the scope");
        }
    }, [onClose]);

    const bgclass = getChatBackgroudClass(user?.chatWallpaper);

    const sendMessageHandler = useCallback(() => {
        // e?.preventDefault();
        if (!connected) return showError("You're offline, Please check your connection and try again", { id: "offline-error" });
        const { message } = state;
        const { messageId, chatDetails, patient, subject } = taskDetails;
        if (message && message.trim() !== "") {
            const msgObject = {
                chatType: chatDetails.type,
                chatId: chatDetails.id,
                message: message,
                type: messageType,
                sendTo: getSendToUsers(user.id, chatDetails.type, chatDetails.chatusers),
                sendBy: user.id,
                quotedMessageId: messageId || null,
                patient: patient || null,
                subject: subject || null,
                isMessage: true,
                // ccText: messageText.ccText,
                // ccMentions: messageText.ccMentions,
                // bccText: messageText.bcc,
                // bccMentions: messageText.bccMentions,
                // patientIds: messageText.patientIds,
                // frontMsgId,
                // label: messageText.categoryIds || []
            }
            setState(defaultState);
            sendMessage(msgObject, async () => {
                await refetch();
                setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 300)
            });
            // if (!msgObject.quotedMessageId) scrollDown();
            // clearFooterData();
        }
        // else
        //     inputRef?.current?.focus();
    }, [taskDetails, connected, messageType, state, user.id, refetch]);

    const checkKey = useCallback((e) => {
        if (navigator?.userAgentData?.mobile) return;
        if (fnBrowserDetect() === 'safari') return;
        if (e.key === "Enter" && !e.shiftKey) {
            sendMessageHandler();
        };
    }, [sendMessageHandler]);

    return (<>
        {!!resMessages?.length &&
            <div className={`todo-container thread-container overflow-auto ${bgclass}`} style={{ maxHeight: '75vh' }}>
                {resMessages.map((item, index) => {
                    return (
                        <Thread
                            key={item.id}
                            item={item}
                            isTaskView={true}
                            onClickTaskHandler={onClickTaskHandler}
                            onQuote={onQuote}
                        />)
                })}
                <div ref={endRef} />
            </div>}
        {!resMessages?.length && (isFetching ? <Loader height={'80px'} /> :
            <div className='d-flex justify-content-center my-5 text-color'>No Replies Found</div>
        )}
        <div className="d-flex align-items-center gap-10 mt-2 w-100">
            <Input
                rootClassName='mb-0 w-100'
                placeholder='Reply here'
                value={state.message}
                handleChange={(e) => setState(prev => ({ ...prev, message: e.target.value }))}
                onkeydown={checkKey}
            />
            {/* <TypesButton
                messageType={messageType}
                setMessageType={setMessageType}
            /> */}
            <MessageSendButton
                sendMessageHandler={sendMessageHandler}
                messageType={messageType}
                setMessageType={setMessageType}
            />
        </div>
    </>)
}