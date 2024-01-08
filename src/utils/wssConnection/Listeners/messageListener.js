import { CHAT_CONST } from "redux/constants/chatConstants";
import { dispatch } from "redux/store";
import { CONST, SOCKET } from "utils/constants";
import { SocketListener } from "utils/wssConnection/Socket";

export const listenMessageUpdates = (activeChatId, userId) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_MESSAGE, (data) => {
		if (activeChatId === data.chatId) dispatch({ type: CHAT_CONST.RECIVE_MESSAGE_UPDATE, payload: data });
		if (data?.assignedUsers?.includes(userId) && window.location.pathname === CONST.APP_ROUTES.DASHBOARD)
			dispatch({ type: "DO_DASHBOARD_UPDATE", payload: null });
	});
};

export const ListenAllowMessage = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.ALLOW_SEND_MESSAGE, (data) => {
		if (activeChatId === data.id) dispatch({ type: CHAT_CONST.UPDATE_ACTIVE_CHAT, payload: data });
	});
};
export const ListenUpdateMember = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_GROUP_MEMBER, (data) => {
		// if (activeChatId === data.id) 
		dispatch({ type: CHAT_CONST.ADD_REMOVE_CHAT_USER_GROUP, payload: data });
	});
};
export const ListenMakeGroupAdmin = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.MAKE_GROUP_ADMIN, (data) => {
		if (activeChatId === data.chatId) dispatch({ type: CHAT_CONST.ADD_GROUP_ADMIN, payload: data });
	});
};
export const ListenRemoveGroupAdmin = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.REMOVE_GROUP_ADMIN, (data) => {
		if (activeChatId === data.chatId) dispatch({ type: CHAT_CONST.REMOVE_GROUP_ADMIN, payload: data });
	});
};
export const ListenEditChatMsg = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.EDIT_CHAT_MESSAGE, (data) => {
		if (activeChatId === data.chatId) dispatch({ type: CHAT_CONST.UPDATE_EDITED_MESSAGE, payload: data });
	});
};
export const ListenDeleteChatMsg = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.DELETE_CHAT_MESSAGE, (data) => {
		dispatch({ type: CHAT_CONST.DELETE_GLOBAL_MESSAGE, payload: data });
		if (activeChatId === data.chatId) dispatch({ type: CHAT_CONST.DELETE_MESSAGE, payload: data });
	});
};
export const ListenViewDeletedMsg = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.VIEW_DELETED_MESSAGE, (data) => {
		if (activeChatId === data.chatId) dispatch({ type: CHAT_CONST.UPDATE_DELETE_MESSAGE, payload: data });
	});
};
export const ListenUpdateChatList = () => {
	SocketListener(SOCKET.RESPONSE.UPDATE_CHATLIST, (data) => {
		dispatch({ type: CHAT_CONST.UPDATE_CHAT_LIST, payload: data });
	});
};
export const ListenUnreadUsersToAdmin = () => {
	SocketListener(SOCKET.RESPONSE.UNREAD_USER_TO_ADMIN, (data) => {
		dispatch({ type: CHAT_CONST.SET_UNREAD_USERS_ADMIN, payload: data });
	});
};
export const ListenTimerNotification = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.SETTIME_ADMIN_NOTIFICAION, (data) => {
		if (activeChatId === data.chatInfo.id) {
			dispatch({
				type: CHAT_CONST.SET_CHAT_TIMER_SETTINGS,
				payload: {
					chatId: data.chatInfo.id,
					data: {
						routineHour: Number(data.chatInfo.routineHour),
						routineMinute: Number(data.chatInfo.routineMinute),
						emergencyHour: Number(data.chatInfo.emergencyHour),
						emergencyMinute: Number(data.chatInfo.emergencyMinute),
						urgentHour: Number(data.chatInfo.urgentHour),
						urgentMinute: Number(data.chatInfo.urgentMinute),
					},
				},
			});
		}
	});
};

export const ListenSingleChat = async ({ activechatId, userId }) => {
	SocketListener(SOCKET.RESPONSE.SINGLE_CHATLIST, (data) => {
		dispatch({ type: "DO_DASHBOARD_UPDATE", payload: null });
		if (data && (activechatId !== data.id || !activechatId || activechatId === -1)) {
			// if (data.chatusers.find(i => i.userId === userId)?.isImportantChat) // Done at redux state "single-chat-list"
			dispatch({ type: CHAT_CONST.UPDATE_SINGLE_CHAT_LIST, payload: data, userId });
		}
	});
};
