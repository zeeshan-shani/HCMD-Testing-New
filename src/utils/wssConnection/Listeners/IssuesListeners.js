import { dispatch } from "redux/store";
import { ISSUE_CONST } from "redux/constants/issuesConstants";
import { SOCKET } from "utils/constants";
import { SocketListener } from "utils/wssConnection/Socket";
import { getIssueList } from "redux/actions/IssuesAction";

export const listenAddRequest = (activeCardId, newSearch) => {
	SocketListener(SOCKET.RESPONSE.CREATE_ISSUE, async (data) => {
		if (activeCardId) {
			getIssueList(activeCardId, newSearch);
		}
	});
};
export const ListenIssueCommentCreated = (requestData) => {
	SocketListener(SOCKET.RESPONSE.ISSUE_ADD_COMMENT, (data) => {
		if (data.status && data.data && data.data.issueId === requestData.id)
			dispatch({ type: ISSUE_CONST.RES_CREATE_ISSUE_COMMENT, payload: data.data });
	});
};
export const ListenIssueDeleted = (requestData) => {
	SocketListener(SOCKET.RESPONSE.ISSUE_DELETE, (data) => {
		dispatch({ type: ISSUE_CONST.RES_DELETE_ISSUE, payload: data.data });
	});
};
export const ListenAddIssueSolution = (requestId) => {
	SocketListener(SOCKET.RESPONSE.ISSUE_ADD_SOLUTION, (data) => {
		dispatch({ type: ISSUE_CONST.RES_ADD_ISSUE_SOLUTION, payload: data });
	});
};
export const ListenUpdateIssueSolution = (requestId) => {
	SocketListener(SOCKET.RESPONSE.ISSUE_UPDATE_SOLUTION, (data) => {
		dispatch({ type: ISSUE_CONST.RES_UPDATE_ISSUE_SOLUTION, payload: data.data });
	});
};
export const ListenUpdateIssue = (requestId) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_ISSUE, (data) => {
		if (requestId === data?.data?.id) dispatch({ type: ISSUE_CONST.RES_UPDATE_REQUEST, payload: data.data });
	});
};
export const ListenUpdateIssueComment = (requestId) => {
	SocketListener(SOCKET.RESPONSE.ISSUE_UPDATE_COMMENT, (data) => {
		if (requestId === data?.data?.issueId) dispatch({ type: ISSUE_CONST.UPDATE_ISSUE_COMMENT, payload: data.data });
	});
};
export const ListenDeleteIssueComment = (requestId) => {
	SocketListener(SOCKET.RESPONSE.ISSUE_DELETE_COMMENT, (data) => {
		dispatch({ type: ISSUE_CONST.RES_DELETE_ISSUE_COMMENT, payload: data.data });
	});
};

export const ListenNewRequest = (activeCardId, body) => {
	SocketListener(SOCKET.RESPONSE.UPDATE_NEW_ISSUE, (data) => {
		// getCategories();
		if (activeCardId) getIssueList(activeCardId, body);
	});
};
