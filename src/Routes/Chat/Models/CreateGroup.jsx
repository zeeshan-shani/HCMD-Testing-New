import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { changeModel } from 'redux/actions/modelAction';
import { CreateGroupChat, getUsersList } from 'redux/actions/chatAction';
import { getPresignedUrl, uploadToS3 } from 'utils/AWS_S3/s3Connection';
import { ConnectInNewChat, notifyUsers, SocketEmiter } from 'utils/wssConnection/Socket';
import useDebounce from 'services/hooks/useDebounce';
import { generatePayload, getImageURL } from 'redux/common';
import { MuiTooltip } from 'Components/components';
import { Check } from 'react-bootstrap-icons';
import { SOCKET } from 'utils/constants';
import { useClickAway } from 'react-use';

const defaultState = {
    currStep: 1,
    groupName: '',
    usersList: [],
    searchUser: '',
    checked: [],
    isGroupCreating: false,
    profileImage: { name: "Choose File" },
    selectAll: false,
    assignMembers: [],
    assignDesignation: [],
    showMembers: false,
}
export default function CreateGroup() {
    const { user } = useSelector((state) => state.user);
    const { userDesignations } = useSelector((state) => state.chat);
    const [state, setState] = useState(defaultState);
    const {
        currStep,
        groupName,
        usersList,
        searchUser,
        checked,
        isGroupCreating,
        profileImage,
        selectAll,
        assignMembers,
        assignDesignation,
        showMembers,
    } = state;
    const memberRef = useRef();
    const newUser = useDebounce(searchUser, 500);
    const dropdownTaskRef = useRef();
    useClickAway(dropdownTaskRef, (e) => setState(prev => ({ ...prev, showMembers: false })))

    const onCancelHandler = () => {
        setState(defaultState);
        changeModel("");
    }
    const onFinishHandler = () => onCancelHandler();

    useEffect(() => {
        // Get User List on Search
        const getData = async () => {
            const payload = await generatePayload({
                keys: ["name", "firstName", "lastName"], value: newUser,
                rest: { includeOwn: false, isActive: true },
                options: {
                    populate: ["designations", "companyRoleData", "users:own"],
                    sort: [["name", "ASC"]],
                }
            });
            const res = await getUsersList(payload);
            if (res?.status)
                setState(prev => ({ ...prev, usersList: res.data }));
        }
        getData();
    }, [newUser]);
    try {
        const inputChange = e => {
            const { name, value } = e.target;
            setState(prev => ({ ...prev, [name]: value }));
        }

        // Add/Remove checked item from list
        const handleCheck = async (event) => {
            let updatedList = [...checked];
            if (event.target.checked)
                updatedList = [...checked, Number(event.target.value)];
            else {
                const index = updatedList.findIndex((itemId) => itemId === Number(event.target.value));
                updatedList.splice(index, 1);
            }
            setState(prev => ({ ...prev, checked: updatedList }));
        };

        const onchangeSelectAll = (e) => {
            const selectChecked = e.target.checked;
            let updatedList = checked;
            for (const item of usersList) {
                if (selectChecked) {
                    updatedList = updatedList.filter((itemId) => itemId !== Number(item.id));
                    updatedList = [...updatedList, Number(item.id)];
                } else {
                    if (updatedList.includes(item.id))
                        updatedList = updatedList.filter((itemId) => itemId !== Number(item.id));
                }
            }
            setState(prev => ({ ...prev, selectAll: e.target.checked, checked: updatedList }));
        }
        const onUploadImage = async () => {
            if (profileImage && profileImage.name !== "Choose File") {
                const res = await getPresignedUrl({
                    fileName: profileImage.name,
                    fileType: profileImage.type
                });
                return res.data.url;
            } return null;
        }

        const onCreateGroupHandler = async () => {
            const presignedUrl = await onUploadImage();
            const uploadedImageUrl = await uploadToS3(presignedUrl, profileImage);
            const res = await CreateGroupChat([], user.id, groupName, uploadedImageUrl);
            if (res?.status === 1) {
                setState(prev => ({ ...prev, currStep: prev.currStep + 1, isGroupCreating: false }));
                SocketEmiter(SOCKET.REQUEST.ADD_MEMBER, { chatId: res.data.id, users: checked });
                // loadUserChatList(user.id, false, true);
                notifyUsers(res.data.createdBy, res.data.id, res.data.users, res.data.type);
                // setUserHandler(res.data, activeChat.id, user.id);
                ConnectInNewChat(res.data, user.id);
            }
        }

        const OnProfileImageChangeHandler = (e) => {
            if (e.target.files && e.target.files.length > 0)
                setState(prev => ({ ...prev, profileImage: e.target.files[0] }));
        }

        const addMemberHandler = (member) => {
            if (assignMembers.some((mem) => mem.id === member.id))
                setState(prev => ({ ...prev, assignMembers: prev.assignMembers.filter((mem) => mem.id !== member.id), checked: prev.checked.filter((memId) => memId !== member.id) }));
            else
                setState(prev => ({ ...prev, assignMembers: [member, ...prev.assignMembers], checked: [member.id, ...prev.checked] }));
        };
        const addDesgMembers = (desg) => {
            if (assignDesignation.some((item) => item.id === desg.id)) {
                usersList.forEach(usr => {
                    if (usr?.userDesignations &&
                        usr?.userDesignations.map(item => item.designationId).includes(desg.id) &&
                        assignMembers.some((mem) => mem.id === usr.id))
                        addMemberHandler(usr);
                });
                setState(prev => ({ ...prev, assignDesignation: prev.assignDesignation.filter((item) => item.id !== desg.id) }));
            } else {
                usersList.forEach(usr => {
                    if (usr?.userDesignations &&
                        usr?.userDesignations.map(item => item.designationId).includes(desg.id) &&
                        !assignMembers.some((mem) => mem.id === usr.id))
                        addMemberHandler(usr);
                });
                setState(prev => ({ ...prev, assignDesignation: [desg, ...prev.assignDesignation] }));
            }
        };

        return (<>
            <div className="modal modal-lg-fullscreen fade show" id="createGroup" tabIndex={-1} role="dialog" aria-labelledby="createGroupLabel" aria-modal="true" style={{ display: 'block' }}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title js-title-step" id="createGroupLabel">&nbsp;<span className="label label-success">1</span> Create a New Group</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => changeModel("")}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body py-0 hide-scrollbar">
                            {/* Step: 1 - Create a new group  */}
                            <div className={`row pt-2 ${currStep !== 1 ? 'hide' : ''}`} data-step={1} data-title="Create a New Group">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="groupName">Group name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-md"
                                            id="groupName"
                                            name="groupName"
                                            placeholder="Type group name here"
                                            autoComplete='off'
                                            onChange={inputChange}
                                            maxLength={25}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Choose profile picture</label>
                                        <div className="custom-file">
                                            <input
                                                type="file"
                                                className="custom-file-input"
                                                id="profilePictureInput"
                                                accept="image/jpeg, image/jpg, image/png"
                                                onChange={OnProfileImageChangeHandler}
                                            />
                                            <label className="custom-file-label" htmlFor="profilePictureInput">
                                                {profileImage?.name}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Step: 2 - Add group members  */}
                            <div className={`row ${currStep !== 2 ? 'hide' : ''}`} data-step={2} data-title="Add Group Members">
                                <div className="col-12 px-0">
                                    {/* Search Start */}
                                    <form className="form-inline w-100 p-2 border-bottom" onSubmit={e => e.preventDefault()}>
                                        <div className="input-group w-100">
                                            <div className="input-group-append">
                                                <div className="input-group-text p-0" role="button">
                                                    <div className="dropdown show select-group-dropdown transparent-bg" ref={dropdownTaskRef}>
                                                        <MuiTooltip title={`${!!assignDesignation.length ? `Assigned to: ${assignDesignation.map((item) => item.name).join(", ")}` : 'Click to select designation'}`}>
                                                            <button className="dropdown-toggle btn btn-sm border-0 light-text-70 p-4_8"
                                                                // bg-dark-f
                                                                onClick={() => setState(prev => ({ ...prev, showMembers: !prev.showMembers }))}
                                                                ref={memberRef}>
                                                                <span>{`Designation (${assignDesignation?.length})`}</span>
                                                            </button>
                                                        </MuiTooltip>
                                                        {showMembers &&
                                                            <ul className="dropdown-menu text-light show">
                                                                {userDesignations?.map((item) => (
                                                                    <li key={'d-' + item.id} className={`dropdown-item cursor-pointer`} onClick={() => addDesgMembers(item)}>
                                                                        <div className="d-flex justify-content-between w-100">
                                                                            <span>{item.name}</span>
                                                                            <span>
                                                                                {!!assignDesignation.filter((desg) => desg.id === item.id).length ? (<Check size={16} />) : ("")}
                                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>}
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control form-control-md search br-0"
                                                placeholder="Search User"
                                                value={searchUser}
                                                id="searchUser"
                                                name="searchUser"
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="col-12 px-0">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item border-0" key={-1}>
                                            <div className="media justify-content-between">
                                                <div>
                                                    <p className='mb-0'>Select all</p>
                                                </div>
                                                <div className="media-options">
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            className="custom-control-input"
                                                            id={`select-all`}
                                                            name={`select-all`}
                                                            type="checkbox"
                                                            value={-2}
                                                            checked={selectAll}
                                                            onChange={onchangeSelectAll}
                                                        />
                                                        <label className="custom-control-label" htmlFor={`select-all`} />
                                                    </div>
                                                </div>
                                            </div>
                                            <label className="media-label" htmlFor={`select-all`} />
                                        </li>
                                        {usersList.map((item, index) => {
                                            const subline = (item?.companyRoleData?.name && item?.companyName) ? `${item.companyRoleData.name} at ${item.companyName}` : item?.companyName;
                                            return (
                                                <li className="list-group-item" key={item.id}>
                                                    <div className="media">
                                                        <div className={`avatar avatar-${item.profileStatus} mr-2`}>
                                                            <img src={getImageURL(item.profilePicture, '50x50')} alt="" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="text-truncate">
                                                                <div className="text-reset username-text">{item.name}</div>
                                                            </h6>
                                                            <p className="mb-0 text-truncate in-one-line">{subline}</p>
                                                        </div>
                                                        <div className="media-options">
                                                            <div className="custom-control custom-checkbox">
                                                                <input
                                                                    className="custom-control-input"
                                                                    id={`chx-user-${item.id}`}
                                                                    name={`chx-users`}
                                                                    type="checkbox"
                                                                    value={item.id}
                                                                    checked={checked.includes(item.id)}
                                                                    onChange={handleCheck}
                                                                />
                                                                <label className="custom-control-label" htmlFor={`chx-user-${item.id}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <label className="media-label" htmlFor={`chx-user-${item.id}`} />
                                                </li>)
                                        })}
                                    </ul>
                                </div>
                            </div>
                            {/* Step: 3 - Finished  */}
                            <div className={`row pt-2 h-100 ${currStep !== 3 ? 'hide' : ''}`} data-step={3} data-title="Finished">
                                <div className="col-12">
                                    <div className="d-flex justify-content-center align-items-center flex-column h-100">
                                        <div className="btn btn-success btn-icon rounded-circle text-light mb-3">
                                            <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h6>Group Created Successfully</h6>
                                        <p className="text-muted text-center">Happy chatting!!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {currStep !== 3 && <>
                                <button
                                    className="btn btn-link text-muted js-btn-step mr-auto"
                                    data-orientation="cancel"
                                    data-dismiss="modal"
                                    onClick={() => onCancelHandler()}>Cancel</button>
                                <button
                                    className="btn btn-secondary  js-btn-step"
                                    data-orientation="previous"
                                    data-step={currStep}
                                    disabled={currStep === 1}
                                    onClick={() => setState(prev => ({ ...prev, currStep: prev.currStep - 1 }))}>Previous</button></>}
                            {!isGroupCreating ? <button
                                className="btn btn-primary js-btn-step"
                                data-orientation="next"
                                data-step={(currStep === 3) ? 'complete' : currStep}
                                onClick={() => {
                                    if (currStep < 3 && groupName !== "") {
                                        if (currStep === 2) {
                                            // setCreatingStatus(true);
                                            setState(prev => ({ ...prev, isGroupCreating: true }));
                                            onCreateGroupHandler();
                                        } else {
                                            setState(prev => ({ ...prev, currStep: prev.currStep + 1 }))
                                        }
                                    }
                                    else if (currStep === 3) onFinishHandler();
                                }}
                                disabled={groupName === "" || groupName.length < 3}
                            >
                                {currStep === 3 ? 'Finish' : 'Next'}
                            </button> :
                                <button
                                    className="btn btn-primary js-btn-step"
                                    data-orientation="next"
                                    data-step={2}
                                    disabled
                                >
                                    {`Creating Group...`}
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <input type="hidden" id="actual-step" defaultValue={currStep} /></div>
        </>);
    } catch (error) {
        console.error(error);
    }
}
