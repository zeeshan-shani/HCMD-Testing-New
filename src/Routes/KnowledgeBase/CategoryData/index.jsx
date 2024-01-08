import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as Loader } from "assets/media/messageLoader.svg";
import { extractKeysAndValues } from '..';
import { dispatch } from 'redux/store';
import { ISSUE_CONST } from 'redux/constants/issuesConstants';
import knowledgebaseService from 'services/APIs/services/knowledgebaseService';

export default function CategoryData() {
    const location = useLocation();
    const navigate = useNavigate();
    const { taskLabels: categories, loadingTasklabel } = useSelector((state) => state.task);
    const { activeCard } = useSelector((state) => state.issues);
    const [isCategoryAvailable, setIsCategoryAvailable] = useState(false);

    useEffect(() => {
        const { category = "", request = "", assignedRequest = "" } = extractKeysAndValues(location.pathname);
        const categoryId = category ? Number(category) : null;
        const requestId = request || assignedRequest || null;
        if (categoryId && !!categories.length) {
            const isAvailable = categories.findIndex(i => i?.id === categoryId) !== -1;
            if (isAvailable) {
                setIsCategoryAvailable(true);
                if (Number(requestId)) {
                    (async () => {
                        const payload = {
                            id: Number(requestId),
                            verifyAssigned: Boolean(assignedRequest)
                        }
                        const data = await knowledgebaseService.requestData({ payload })
                        if (data?.status === 1) {
                            if (data.data.category === categoryId) {
                                dispatch({
                                    type: ISSUE_CONST.RES_GET_REQUEST_DETAILS, payload: data.data,
                                    request: request ? true : (assignedRequest ? false : true)
                                });
                            } else
                                navigate('/knowledge/category/' + categoryId);
                        } else if (data?.status === 2)
                            navigate('/knowledge/category/' + categoryId);
                    })();
                }
            }
            else navigate('/knowledge/home');
        }
    }, [location.pathname, categories, navigate]);

    return (
        <div>
            {!activeCard && loadingTasklabel &&
                <div className='text-center'>
                    <Loader height={"80px"} />
                    <p>Fetching Category data</p>
                </div>}
            {(activeCard && isCategoryAvailable &&
                <Outlet />)}
        </div>
    )
}
