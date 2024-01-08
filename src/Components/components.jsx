// This is a JavaScript code written in the file components.jsx.
// It includes various components and functions related to notifications and select inputs.

import React from 'react';
import CreatableSelect from 'react-select/creatable';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { CONST } from 'utils/constants';
import { VolumeMuteFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { Modal } from 'antd';
import { reject } from 'lodash';
import { dispatch } from 'redux/store';
import { CHAT_CONST } from 'redux/constants/chatConstants';
// import { defaultTagStyles } from 'Routes/SuperAdmin/components/Facility/CreateEditFacility';
const { confirm } = Modal;

// MuiTooltip component for displaying tooltips
export const MuiTooltip = (props) => {
    try {
        return (
            <Tooltip
                TransitionComponent={Zoom}
                classes={{ popper: "z-index-2000" }}
                className={props?.className ? props.className : ''}
                {...props}
            >
                {props.children}
            </Tooltip>
        );
    } catch (error) {
        console.error(error);
    }
}

// Notification Badge component for displaying notification badges
export const NotificationBadge = ({ myChatDetails }) => {
    const { user } = useSelector(state => state.user);
    try {
        const MAX_COUNT_SHOW = CONST.MAX_MESSAGE_COUNT;
        return (
            <div className='d-flex'>
                {!myChatDetails?.isPatientMentionCountMute && !!myChatDetails?.hasPatientMentionCount &&
                    <div className="d-flex align-items-center badge badge-rounded bg-dr-patient text-white ml-50 position-relative badge-custom">
                        {myChatDetails.hasPatientMentionCount <= MAX_COUNT_SHOW ?
                            <span>&#x002B;{` ${myChatDetails?.hasPatientMentionCount}`}</span>
                            : <span>&#x002B;{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
                    </div>}
                {!myChatDetails?.atTheRateMentionMessageCountMute && !!myChatDetails?.atTheRateMentionMessageCount &&
                    <MuiTooltip title="Mention message">
                        <div className="d-flex align-items-center badge badge-rounded bg-at-the-rate text-white ml-50 position-relative badge-custom"
                            onClick={() => dispatch({ type: CHAT_CONST.SET_SEARCH_TAGGED, payload: true })}>
                            {myChatDetails.atTheRateMentionMessageCount <= MAX_COUNT_SHOW ?
                                <span>{`@ ${myChatDetails?.atTheRateMentionMessageCount}`}</span>
                                : <span>{'@' + MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
                        </div>
                    </MuiTooltip>}
                {!myChatDetails?.isMentionMessageCountMute && !!myChatDetails?.hasMentionMessageCount &&
                    <div className="d-flex align-items-center badge badge-rounded bg-hashtag text-white ml-50 position-relative badge-custom">
                        {myChatDetails.hasMentionMessageCount <= MAX_COUNT_SHOW ?
                            <span>{`# ${myChatDetails?.hasMentionMessageCount}`}</span> :
                            <span>{'#' + MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
                    </div>}
                {!user?.isEmergencyNotificationMute && !!myChatDetails?.emergencyUnreadMessageCount &&
                    <div className="d-flex align-items-center badge badge-rounded bg-emergency text-white ml-50 position-relative badge-custom">
                        {myChatDetails.emergencyUnreadMessageCount <= MAX_COUNT_SHOW ?
                            <span>{myChatDetails?.isEmergencyNotificationMute && <VolumeMuteFill size={14} fill='#fff' />}{myChatDetails.emergencyUnreadMessageCount}</span> :
                            <span>{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
                    </div>}
                {!user?.isUrgentNotificationMute && !!myChatDetails?.urgentUnreadMessageCount &&
                    <div className="d-flex align-items-center badge badge-rounded bg-urgent text-white ml-50 position-relative badge-custom">
                        {myChatDetails.urgentUnreadMessageCount <= MAX_COUNT_SHOW ?
                            <span>{myChatDetails?.isUrgentNotificationMute && <VolumeMuteFill size={14} fill='#fff' />}{myChatDetails.urgentUnreadMessageCount}</span> :
                            <span>{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
                    </div>}
                {!user?.isRoutineNotificationMute && !!myChatDetails?.routineUnreadMessageCount &&
                    <div className="d-flex align-items-center badge badge-rounded bg-routine text-white ml-50 position-relative badge-custom">
                        {myChatDetails.routineUnreadMessageCount <= MAX_COUNT_SHOW ?
                            <span>{myChatDetails?.isRoutineNotificationMute && <VolumeMuteFill size={14} fill='#fff' />}{myChatDetails.routineUnreadMessageCount}</span> :
                            <span>{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
                    </div>}
            </div>
        );
    } catch (error) {
        console.error(error);
    }
}

// MultiSelectTextInput component for displaying a multi-select input field
export const MultiSelectTextInput = (props) => {
    const components = { DropdownIndicator: props.DropdownIndicator };
    const createOption = (label) => ({ label, value: label });
    const handleChange = (value, actionMeta) => props.setValue(value);
    const handleInputChange = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") props.setInputValue(inputValue);
    };
    const handleKeyDown = (event) => {
        if (!props.inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                if (props.value.map(v => v.label.trim()).includes(props.inputValue.trim())) {
                    props.setInputValue('');
                }
                else {
                    // if (!props.customizedSetter && props.inputValue.trim().indexOf(',') > -1) {
                    //     props.setInputValue('');
                    //     const values = props.inputValue.trim().split(',').filter(iv => !props.value.map(v => v.label.trim()).includes(iv.trim()));
                    //     for (let i = 0; i < values.length; i++) {
                    //         props.setValue((oldValue) => [...oldValue, createOption(values[i].trim())]);
                    //     }
                    // }
                    // else {
                    props.setInputValue('');
                    props.setValue([...props.value, createOption(props.inputValue.trim())]);
                    // }
                }
                event.preventDefault();
                break;
            default: break;
        }
    };
    try {
        return (
            <CreatableSelect
                isMulti
                id={props.id}
                instanceId={props.id}
                className={props.className}
                components={components}
                isClearable
                menuIsOpen={false}
                placeholder={props.placeholder}
                onChange={handleChange}
                inputValue={props.inputValue}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={props.value}
                classNamePrefix={props.innerClass}
                onFocus={props.onClick}
                onBlur={props.onBlur}
                blurInputOnSelect={false}
                isDisabled={props?.disabled}
                autoFocus={props?.autoFocus}
                styles={{
                    // ...defaultTagStyles,
                    input: (css) => ({
                        ...css,
                        /* expand the Input Component div */
                        width: "100% !important",
                        // width: "auto !important",
                        /* expand the Input Component child div */
                        "> div": {
                            width: "100%"
                        },
                        /* expand the Input Component input */
                        input: {
                            width: "100% !important",
                            textAlign: "left",
                            minWidth: '170px',
                            zIndex: 1500
                        }
                    })
                }}
            />
        );
    } catch (error) {
        console.error(error);
    }
};

// TakeConfirmation component for displaying a confirmation modal
export const TakeConfirmation = ({
    title,
    content = undefined,
    onDone = () => { },
    onCancel = () => { },
    delay = 500,
    ...props
}) => {
    return confirm({
        title,
        content,
        async onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    onDone();
                    resolve(1);
                }, delay);
            }).catch(() => {
                reject(0);
            });
        },
        onCancel() { onCancel() },
        ...props,
    });
}