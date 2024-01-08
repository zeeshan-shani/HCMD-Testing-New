import { CONST, SOCKET } from "utils/constants";
import { showError, showSuccess } from "utils/package_config/toast";
import { getChatTaskList } from "Routes/TaskBoard/TaskPage";
import { SocketListener } from "utils/wssConnection/Socket";
import { showNotificationfunc } from "redux/common";
import { cmmtUpdateToast, customTaskAlertToast } from "utils/package_config/hot-toast";
import { TASK_CONST } from "redux/constants/taskConstants";
import { dispatch, getState } from "redux/store";

export const listenTaskActivities = (activeChatId) => {
	ListenCreateTask(activeChatId);
	ListenDeleteTask(activeChatId);
	ListenTaskUpdate();
};

export const ListenCreateTask = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.CREATE_TASK, (data) => {
		if (activeChatId === data.taskInfo.taskCreated.chatId || activeChatId === 0)
			dispatch({ type: TASK_CONST.RECEIVED_TASK_ADDED, payload: data });
	});
};

export const ListenDeleteTask = (activeChatId) => {
	SocketListener(SOCKET.RESPONSE.DELETE_TASK, (data) => {
		if (activeChatId === data.chatId || activeChatId === 0)
			dispatch({ type: TASK_CONST.RECEIVE_TASK_DELETED, payload: data });
	});
};

export const ListenTaskUpdate = () => {
	SocketListener(SOCKET.RESPONSE.UPDATE_TASK, (data) => {
		if (data && data.status === 0 && data.message) return showError(data.message)
		if (data && data.status === 1 && getState().task?.taskDetails?.id === data?.data?.id) {
			dispatch({ type: TASK_CONST.UPDATE_TASK_DETAILS, payload: data.data });
			dispatch({ type: TASK_CONST.UPDATE_ACTIVITY_LOGS });
		}
		// for task alert list, if any task finishes and exist in alert list it will be removed
		if (data && data.status === 1 && data.data.status === CONST.TASK_STATUS[3].value) {
			dispatch({ type: TASK_CONST.FINISHED_TASK_ID_FOR_ALERTLIST, payload: data.data.id });
		}
	});
};

export const ListenUpdateAssignMember = (taskInfo) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_ASSIGN_MEMBER, (data) => {
		if (taskInfo && taskInfo.id) {
			dispatch({ type: TASK_CONST.UPDATE_TASK_MEMBERS, payload: data.data });
			dispatch({ type: TASK_CONST.UPDATE_ACTIVITY_LOGS });
		}
	});
};

export const ListenNewAssign = (filterObj, chatList, activeTaskChatId) => {
	SocketListener("update-task-list-data", (data) => {
		getChatTaskList(activeTaskChatId, chatList, filterObj);
	});
};

export const ListenTaskCommentAdd = (taskId) => {
	SocketListener(SOCKET.RESPONSE.ADD_TASK_COMMENT, (data) => {
		if (data.status === 1 && data.data.taskId === taskId) {
			if (data.data?.subTaskId) {
				dispatch({
					type: TASK_CONST.ADD_NEW_SUBTASK_COMMENT,
					payload: {
						subTaskId: data.data?.subTaskId,
						taskId: taskId,
						newComment: data.data,
					},
				});
			} else {
				if (data?.data?.replyCommentId) dispatch({ type: TASK_CONST.ADD_NEW_REPLY_COMMENT, payload: data.data });
				else dispatch({ type: TASK_CONST.ADD_NEW_TASK_COMMENT, payload: data.data });
			}
		}
	});
};

export const ListenTaskCommentMention = () => {
	SocketListener(SOCKET.RESPONSE.MENTION_TASK_COMMENT, (data) => {
		showNotificationfunc({ msg: data.message });
		showSuccess(data.message);
	});
};

export const ListenTaskCommentUpdate = (taskId) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_TASK_COMMENT, (data) => {
		if (data.data.taskId === taskId && data.status === 1)
			dispatch({ type: TASK_CONST.UPDATE_TASK_COMMENT, payload: data.data });
	});
};

export const ListenTaskCommentDelete = (taskId) => {
	SocketListener(SOCKET.RESPONSE.DELETE_TASK_COMMENT, (data) => {
		if (data?.data?.isSubTask)
			dispatch({ type: TASK_CONST.DELETE_SUBTASK_COMMENT, payload: data.data });
		else
			dispatch({ type: TASK_CONST.DELETE_TASK_COMMENT, payload: data.data });
	});
};

export const ListenTaskReviewUpdate = (taskId) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_REVIEW_STATUS, (data) => {
		if (taskId !== -1 && taskId === data.provider.taskId) {
			dispatch({ type: TASK_CONST.UPDATE_REVIEW_STATUS, payload: data });
		}
	});
};

export const ListenTaskDetailUpdate = (taskId) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_TASK_DATA, (data) => {
		if (data.data.id === taskId) {
			dispatch({ type: TASK_CONST.UPDATE_TASK_DETAILS, payload: data.data });
			dispatch({ type: TASK_CONST.UPDATE_ACTIVITY_LOGS });
		}
	});
};

export const ListenTaskNotification = (task) => {
	SocketListener(SOCKET.RESPONSE.GET_TASK_NOTIFICATION, (data) => {
		if (task !== -1 && task.taskId === data.data.taskId)
			cmmtUpdateToast(data, task.userId, task.chatId, task.chatList);
	});
};

export const getTaskAlerts = () => {
	SocketListener("res-alert", (data) => {
		customTaskAlertToast({ data });
		dispatch({ type: TASK_CONST.UPDATE_TASK_NOTIFICATION, payload: true });
	});
}