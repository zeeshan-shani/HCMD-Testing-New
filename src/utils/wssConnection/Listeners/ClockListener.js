import { CHAT_CONST } from "redux/constants/chatConstants";
import { MODEL_CONST } from "redux/constants/modelConstants";
import { TASK_CONST } from "redux/constants/taskConstants";
import { USER_CONST } from "redux/constants/userContants";
import { dispatch } from "redux/store";
import { SOCKET } from "utils/constants";
import { SocketListener } from "utils/wssConnection/Socket";
import { ListenSingleChat } from "utils/wssConnection/Listeners/messageListener";

export const listenClockEvents = (userId) => {
	ListenSingleChat({ userId });
	ListenCreateUserLog();
	ListenCreateTaskLog();
	ListenCreateSuperAdmin();
	ListenDeactivateAccount();
	ListenRolesList();
	ListenDeleteUser();
	ListenAllUsersList();
};

export const ListenCreateUserLog = () => {
	SocketListener(SOCKET.RESPONSE.USER_LOGS, (data) => {
		if (data?.isToday) {
			dispatch({ type: USER_CONST.RECEIVED_USER_CLOCK_DATA, payload: data.data });
			dispatch({ type: USER_CONST.RECEIVED_DATE_USER_CLOCK_DATA, payload: data.data });
		} else {
			if (!data.isDate) dispatch({ type: USER_CONST.RECEIVED_USER_CLOCK_DATA, payload: data.data });
			else dispatch({ type: USER_CONST.RECEIVED_DATE_USER_CLOCK_DATA, payload: data.data });
		}
	});
};
export const ListenCreateTaskLog = () => {
	SocketListener(SOCKET.RESPONSE.CREATE_TASK_LOG, (data) => {
		dispatch({ type: TASK_CONST.RECEIVED_TASK_CLOCK_DATA, payload: data.data });
	});
};
export const ListenCreateSuperAdmin = () => {
	SocketListener(SOCKET.RESPONSE.CHANGE_USER_ROLE, (data) => {
		dispatch({ type: USER_CONST.CREATED_NEW_SUPER_ADMIN, payload: data });
		dispatch({ type: USER_CONST.UPDATE_USER_DATA, payload: { id: data.userId, roleData: data.roleData, ghostUser: false, isGhostActive: false } });
	});
};
export const ListenDeactivateAccount = () => {
	SocketListener(SOCKET.RESPONSE.DEACTIVATE_ACCOUNT, (data) => {
		dispatch({ type: CHAT_CONST.SET_ACCOUNT_STATUS, payload: data });
	});
};
export const ListenRolesList = () => {
	SocketListener(SOCKET.RESPONSE.USER_ROLE_LIST, (data) => {
		dispatch({ type: MODEL_CONST.SET_USER_ROLE_LIST, payload: data.data });
	});
};

export const ListenDeleteUser = () => {
	SocketListener(SOCKET.RESPONSE.DELETE_USER, (data) => {
		dispatch({ type: CHAT_CONST.SET_USER_ROLE_LIST_DELETE, payload: data });
	});
};
export const ListenAllUsersList = () => {
	// TODO: socket is commented from backend
	SocketListener("res-get-chat-users", (data) => {
		dispatch({ type: USER_CONST.SET_ALL_USERS_DATA, payload: data.users });
	});
};
