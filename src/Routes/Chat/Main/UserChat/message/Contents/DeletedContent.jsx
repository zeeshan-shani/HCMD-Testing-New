import React from 'react'
import { SOCKET } from 'utils/constants'
import { getSuperAdminAccess } from 'utils/permission'
import { SocketEmiter } from 'utils/wssConnection/Socket'
import MessageFooter from '../Options/MessageFooter'
import MessageHeader from '../Options/MessageHeader'

export const DeletedContent = ({ item, classes = '', user, prevMsg, pTime, setInspectUser }) => {
    const onClickShow = () => {
        SocketEmiter(SOCKET.REQUEST.VIEW_DELETED_MESSAGE, { chatId: item.chatId, messageId: item.id });
    }
    const isSA = getSuperAdminAccess(user);
    const deleteMsg = `This ${item.isMessage ? 'Message' : 'Task'} was Deleted`;
    return (
        <div className={`message-content ${classes}`} style={{ fontSize: user?.fontSize }}>
            <MessageHeader user={user} item={item} prevMsg={prevMsg} pTime={pTime} setInspectUser={setInspectUser} />
            <p className='deleted-message text-secondary mr-1 font-weight-normal mb-0'>
                {deleteMsg}
                {isSA &&
                    <span className='show-deleted-message ml-1 cursor-pointer font-weight-semibold message-text' onClick={onClickShow} style={{ fontSize: user?.fontSize }}>show</span>}
            </p>
            <MessageFooter user={user} item={item} />
        </div>
    )
}
