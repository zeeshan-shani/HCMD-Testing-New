import { CHAT_CONST } from "redux/constants/chatConstants";
import { USER_CONST } from "redux/constants/userContants";
import { dispatch } from "redux/store";
import { SOCKET } from "utils/constants";
import { SocketEmiter, SocketListener } from "utils/wssConnection/Socket";
import {
	ListenAllowMessage,
	ListenDeleteChatMsg,
	ListenEditChatMsg,
	ListenMakeGroupAdmin,
	ListenRemoveGroupAdmin,
	ListenTimerNotification,
	ListenUnreadUsersToAdmin,
	ListenUpdateChatList,
	ListenUpdateMember,
	ListenViewDeletedMsg
} from "utils/wssConnection/Listeners/messageListener";

export const listenChatActivities = async (activeChatId, userId) => {
	ListenAllowMessage(activeChatId);
	ListenUpdateMember(activeChatId);
	ListenMakeGroupAdmin(activeChatId);
	ListenRemoveGroupAdmin(activeChatId);
	ListenEditChatMsg(activeChatId);
	ListenDeleteChatMsg(activeChatId);
	ListenViewDeletedMsg(activeChatId);
	ListenUpdateChatList();
	ListenTimerNotification(activeChatId);
	ListenUnreadUsersToAdmin(activeChatId);
	listenUpdateBackground(activeChatId);
	listenMessageToTask(activeChatId);
	listenMessageReadBySomeone(activeChatId, userId);
};

export const ListenNewChat = async () => {
	// Listen new Chat added by someone
	SocketListener(SOCKET.RESPONSE.NEW_CHAT_RECIEVED, (data) => {
		SocketEmiter(SOCKET.JOIN_CHAT, { chatId: [data.id] });
		dispatch({ type: CHAT_CONST.NEW_CHAT_RECEIVED, payload: data });
	});
};
export const ListenUserToOnline = async (userId) => {
	// Listen User went Online
	SocketListener(SOCKET.USER_ONLINE, (data) => {
		if (data.userId === userId) dispatch({ type: CHAT_CONST.SET_MY_STATUS, payload: data });
		else if (data.userId !== userId) {
			dispatch({ type: CHAT_CONST.SET_USER_ONLINE, payload: data });
			dispatch({ type: CHAT_CONST.UPDATE_USERLIST_STATUS, payload: data });
		}
	});
};
export const ListenUserToOffline = async (userId) => {
	// Listen User went Offline
	SocketListener(SOCKET.USER_OFFLINE, (data) => {
		if (data.userId === userId) dispatch({ type: CHAT_CONST.SET_MY_STATUS, payload: data });
		else if (data.userId !== userId) {
			dispatch({ type: CHAT_CONST.SET_USER_OFFLINE, payload: data });
			dispatch({ type: CHAT_CONST.UPDATE_USERLIST_STATUS, payload: data });
		}
	});
};
export const ListenUserStatus = async (userId) => {
	// Listen User went Offline
	SocketListener(SOCKET.USER_STATUS_CHANGED, (data) => {
		if (data.userId === userId) dispatch({ type: CHAT_CONST.SET_MY_STATUS, payload: data });
		else dispatch({ type: CHAT_CONST.SET_USER_STATUS, payload: data });
		dispatch({ type: CHAT_CONST.UPDATE_USERLIST_STATUS, payload: data });
	});
};
export const ListenRemoveUserFromChat = async () => {
	// Listen removed me from group
	SocketListener(SOCKET.RESPONSE.REMOVE_MEMBER, (data) => {
		dispatch({ type: CHAT_CONST.REMOVE_CHAT, payload: data.chatId });
		SocketEmiter(SOCKET.REQUEST.DISCONNECT_CHAT, { chatId: data.chatId });
	});
};
export const listenUpdateprofile = async () => {
	SocketListener(SOCKET.RESPONSE.UPDATE_PROFILE_PIC, (data) => {
		dispatch({ type: USER_CONST.UPDATE_USER_PROFILE_PICTURE, payload: data });
	});
};
export const listenUpdateGroup = async () => {
	SocketListener(SOCKET.RESPONSE.UPDATE_GROUP_DATA, (data) => {
		dispatch({ type: USER_CONST.UPDATE_GROUP_DATA, payload: data });
	});
};

export const listenUpdateBackground = async () => {
	SocketListener(SOCKET.RESPONSE.UPDATE_CHAT_BACKGROUND, (data) => {
		dispatch({ type: CHAT_CONST.UPDATE_CHAT_BACKGROUND, payload: data });
	});
};
export const listenMessageToTask = async () => {
	SocketListener(SOCKET.RESPONSE.ADD_TO_TASK, (data) => {
		if (data.data.messageId) {
			dispatch({ type: CHAT_CONST.UPDATE_ISMESSAGE, payload: { messageId: data.data.messageId, isMessage: data.data?.isMessage, task: data.data } });
			dispatch({ type: "UPDATE_ISMESSAGE_GlobalSearch", payload: { messageId: data.data.messageId, isMessage: data.data?.isMessage } });
		}
	});
};
export const listenMessageReadBySomeone = async (activeChatId, userId) => {
	SocketListener(SOCKET.RESPONSE.MARK_READ_CHAT, (data) => {
		if (activeChatId === data.messageRead.chatId) dispatch({ type: CHAT_CONST.READ_BY_RECEIPIENT, payload: data.messageRead });
	});
};
