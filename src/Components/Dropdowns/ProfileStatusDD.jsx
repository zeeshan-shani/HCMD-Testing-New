import React from 'react'
// import AsyncSelect from 'react-select/async';
import { CONST } from 'utils/constants';
import { changeProfileStatus } from 'utils/wssConnection/Socket';
import { CircleFill, DashCircleFill, MoonFill, RecordCircleFill } from 'react-bootstrap-icons';

// const statusOptions = [
//     { label: 'Online', value: CONST.PROFILE.ONLINE },
//     { label: 'Busy', value: CONST.PROFILE.BUSY },
//     { label: 'Break', value: CONST.PROFILE.BREAK },
//     { label: 'onCall', value: CONST.PROFILE.ONCALL },
//     { label: 'Available', value: CONST.PROFILE.AVAILABLE },
//     { label: 'Offline', value: CONST.PROFILE.OFFLINE },
// ];

// export default function ProfileStatusDD() {
//     const promiseOptions = (inputValue) =>
//         new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve(statusOptions.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
//             }, 500);
//         });
//     return (
//         <AsyncSelect
//             // cacheOptions
//             isClearable
//             defaultOptions
//             className='react-select-dd'
//             classNamePrefix='react-select-dd'
//             placeholder="Status"
//             loadOptions={promiseOptions} />)
// }

export const ProfileStatusAvailable = ({ user, isClockOut, clockOutHandler }) => {
    const onChangeStatus = (change) => {
        if (user.profileStatus === change) return;
        if ((change === CONST.PROFILE.BREAK || change === CONST.PROFILE.ONCALL) && isClockOut === true) return;
        if (change === CONST.PROFILE.BREAK) onBreak();
        else changeProfileStatus(change);
    }
    const onBreak = () => {
        changeProfileStatus(CONST.PROFILE.BREAK);
        clockOutHandler();
    }
    return (
        <div className="dropdown">
            <small className="dropdown-toggle text-capitalize cursor-pointer text-color" id="userStatusDropdown" data-bs-toggle="dropdown">{user?.profileStatus}</small>
            <ul className="dropdown-menu m-0" aria-labelledby="userStatusDropdown">
                <li className="dropdown-item" onClick={() => onChangeStatus(CONST.PROFILE.ONLINE)}>
                    <CircleFill fill="#45a675" size={12} className="mr-1" />
                    <span className="ml-1">Online</span>
                </li>
                <li className="dropdown-item" onClick={() => onChangeStatus(CONST.PROFILE.BUSY)}>
                    <DashCircleFill color="#ff337c" size={12} className="mr-1" />
                    <span className="ml-1">Busy</span>
                </li>
                {!isClockOut && <>
                    <li className="dropdown-item" onClick={() => onChangeStatus(CONST.PROFILE.BREAK)}>
                        <CircleFill fill="#fdff00" size={12} className="mr-1" />
                        <span className="ml-1">Break</span>
                    </li>
                    <li className="dropdown-item" onClick={() => onChangeStatus(CONST.PROFILE.ONCALL)}>
                        <CircleFill fill="#fdff00" size={12} className="mr-1" />
                        <span className="ml-1">On Call</span>
                    </li></>}
                <li className="dropdown-item" onClick={() => onChangeStatus(CONST.PROFILE.AVAILABLE)}>
                    <MoonFill fill="#f3a81b" size={12} className="mr-1" />
                    <span className="ml-1">Available</span>
                </li>
                <li className="dropdown-item" onClick={() => onChangeStatus(CONST.PROFILE.OFFLINE)}>
                    <RecordCircleFill fill="#747f8d" size={12} className="mr-1" />
                    <span className="ml-1">Offline</span>
                </li>
            </ul>
        </div>
    )
}
