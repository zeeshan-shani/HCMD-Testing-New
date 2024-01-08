// import React, { useState, useEffect, useCallback } from 'react'
// import useDebounce from 'services/hooks/useDebounce';
// import { Button } from 'antd';
// import { Search } from 'react-bootstrap-icons';
// import { dispatch } from 'redux/store';
// import { LazyComponent } from 'redux/common';
// import { useSelector } from 'react-redux/es/hooks/useSelector';
// import { ISSUE_CONST } from 'redux/constants/issuesConstants';

// import ErrorBoundary from 'Components/ErrorBoundry';
// import PageHeader from 'Routes/SuperAdmin/components/PageHeader';
// import KBSearch from 'Routes/KnowledgeBase/KBSearch';
// import CategoryDetails from 'Routes/KnowledgeBase/CategoryDetails';
// import GenerateRequest from 'Routes/KnowledgeBase/GenerateRequest';
// import { RequestDetails } from 'Routes/KnowledgeBase/RequestDetail/RequestDetails';
// import { AssignedRequestDetail } from 'Routes/KnowledgeBase/AssignedRequestDetail';
// import { useNavigate } from 'react-router-dom';

// // import { CategoryData } from './CategoryData';
// // import { GenerateRequest } from './MyRequests/NewRequest/GenerateRequest';
// // import { RequestDetails } from './RequestDetail/RequestDetails';
// // import { AssignedRequestDetail } from './AssignedRequest/AssignedRequestDetail';
// // import { SearchTable } from './SearchTable/SearchTable';

// const defaultState = {
//     search: '',
//     newRequest: false,
//     subCategory: null,
//     isLoading: false
// }
// export default function KnowledgeBase() {
//     const { user } = useSelector((state) => state.user);
//     const navigate = useNavigate();
//     const { taskLabels: categories } = useSelector((state) => state.task);
//     const { issueDetails, assignIssueDetails, activeCard, issueList } = useSelector((state) => state.issues);
//     const [state, setState] = useState(defaultState);
//     const { search, newRequest, subCategory, isLoading } = state;
//     const newSearch = useDebounce(search, 500);

//     useEffect(() => () => {
//         dispatch({ type: ISSUE_CONST.CLEAR_ISSUE_STATE, payload: [] });
//     }, []);

//     useEffect(() => {
//         if (activeCard?.id) {
//             const newActivedata = categories.find(item => item.id === activeCard.id);
//             dispatch({ type: ISSUE_CONST.UPDATE_ACTIVE_CARD, payload: newActivedata });
//         }
//     }, [activeCard?.id, categories]);

//     useEffect(() => {
//         (async () => {
//             if (!newSearch) return;
//             setState(prev => ({ ...prev, isLoading: true }));
//             const { data } = await .post('/issue/list/search', { search: newSearch });
//             if (data.status) dispatch({ type: ISSUE_CONST.RES_LIST_ISSUES_CATEGORY, payload: data.data });
//             setState(prev => ({ ...prev, isLoading: false }));
//         })();
//     }, [newSearch]);

//     const setCardItem = (item) => dispatch({ type: ISSUE_CONST.SET_ISSUE_CARD_ITEM, payload: item });

//     const onCategory = useCallback(() => {
//         setCardItem(null);
//         dispatch({ type: ISSUE_CONST.RES_GET_REQUEST_DETAILS, payload: null });
//         dispatch({ type: ISSUE_CONST.RES_GET_ASSIGNED_REQUEST_DETAILS, payload: null });
//         newRequest && setState(prev => ({ ...prev, newRequest: false, subCategory: false }));
//     }, [newRequest]);

//     const onActivecard = useCallback(() => {
//         dispatch({ type: ISSUE_CONST.RES_GET_REQUEST_DETAILS, payload: null });
//         dispatch({ type: ISSUE_CONST.RES_GET_ASSIGNED_REQUEST_DETAILS, payload: null });
//         setState(prev => ({ ...prev, newRequest: false, subCategory: false }));
//     }, []);

//     try {
//         return (
//             <ErrorBoundary>
//                 <div className="w-100 custom-page-layout p-2 vh-100 limit-scroll overflow-auto">
//                     <PageHeader title='HCMD Knowledge Based' />
//                     <div>
//                         {categories && <>
//                             {/* <div className="d-flex flex-wrap issues-category-cards mb-2">
//                                 <nav aria-label="breadcrumb">
//                                     <ol className="breadcrumb p-1 my-1 transparent-bg">
//                                         <li className="breadcrumb-item" onClick={onCategory}>
//                                             <h5>{`Categories`}</h5>
//                                         </li>
//                                         {activeCard &&
//                                             <li className="breadcrumb-item" onClick={onActivecard}>
//                                                 <h5>{activeCard.name}</h5>
//                                             </li>}
//                                         {subCategory &&
//                                             <li className="breadcrumb-item">
//                                                 <h5>{subCategory.name}</h5>
//                                             </li>}
//                                         {newRequest &&
//                                             <li className="breadcrumb-item">
//                                                 <h5>{'New Request'}</h5>
//                                             </li>}
//                                         {issueDetails &&
//                                             <li className="breadcrumb-item">
//                                                 <h5 className='text-info'>{`#${issueDetails.id} ${!issueDetails.subcategory ? `(Created)` : ''}`}</h5>
//                                             </li>}
//                                         {assignIssueDetails &&
//                                             <li className="breadcrumb-item">
//                                                 <h5 className='text-info'>
//                                                     {`#${assignIssueDetails.id} (Assigned)`}
//                                                 </h5>
//                                                 {!assignIssueDetails?.issuesAssignedUsers?.shift()?.isRead &&
//                                                     <span className='new_issue_badge mx-1 align-items-center'>new</span>}
//                                             </li>}
//                                     </ol>
//                                 </nav>
//                             </div> */}
//                             {!activeCard && <>
//                                 {/* <div className={`issues-search-category py-2`}>
//                                     <div className="d-flex search-input category justify-content-around w-100">
//                                         <div className={`input-group w-75`}>
//                                             <input
//                                                 type="text"
//                                                 defaultValue={search}
//                                                 className="form-control search border-right-0 pr-0 light-text-70"
//                                                 placeholder="Search Category, Request..."
//                                                 onChange={(e) => setState(prev => ({ ...prev, search: e.target.value }))} />
//                                             <div className="input-group-append">
//                                                 <Button className="btn btn-primary h-100" loading={isLoading}>
//                                                     <Search />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div> */}
//                                 {/* <div className="row d-flex flex-wrap issues-category-cards m-1">
//                                     {!newSearch && categories
//                                         .map((card, index) => {
//                                             return (
//                                                 <div key={index} className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 my-1">
//                                                     <div
//                                                         className="card cursor-pointer position-relative"
//                                                         title={`Click to open ${card.name} category`}
//                                                         onClick={() => {
//                                                             navigate(`category/${card.id}`)
//                                                             // setCardItem(card)
//                                                         }}
//                                                     >
//                                                         {!!card?.issuesAssignedUsers?.length &&
//                                                             <div className="category_noti_count position-absolute">
//                                                                 {card.issuesAssignedUsers.length}
//                                                             </div>}
//                                                         <div className="card-body text-center">
//                                                             <h5 className="card-title my-1">{card.name}</h5>
//                                                         </div>
//                                                     </div>
//                                                 </div>);
//                                         })}
//                                 </div> */}
//                             </>}
//                             <LazyComponent>
//                                 {/* {!activeCard && !issueDetails && newSearch && <>
//                                     <KBSearch
//                                         categories={categories}
//                                         issueList={issueList}
//                                         newSearch={newSearch}
//                                         user={user}
//                                     />
//                                 </>} */}
//                                 {/* {activeCard && !issueDetails && !assignIssueDetails && !newRequest &&
//                                     <CategoryDetails
//                                         setMainState={setState}
//                                         categories={categories}
//                                         activeCard={activeCard}
//                                         setCardItem={setCardItem} />} */}
//                                 {/* {activeCard && !issueDetails && newRequest &&
//                                     <GenerateRequest />} */}
//                                 {/* {!newRequest && issueDetails && (<>
//                                     <RequestDetails requestData={issueDetails} />
//                                 </>)} */}
//                                 {!newRequest && assignIssueDetails && (<>
//                                     <AssignedRequestDetail requestData={assignIssueDetails} />
//                                 </>)}
//                             </LazyComponent>
//                         </>}
//                     </div>
//                 </div>
//             </ErrorBoundary>
//         );
//     } catch (error) {
//         console.error(error);
//     }
// }
