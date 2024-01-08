import React, { useEffect } from 'react'
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { getUsersList } from 'redux/actions/chatAction';
import { generatePayload } from 'redux/common';
import { USER_CONST } from 'redux/constants/userContants';
import { dispatch } from 'redux/store';

export default function AssignToUsers({ assignMembers, setAssignMem, placeholder, label = true }) {
    const { AllUsers } = useSelector((state) => state.chat);

    useEffect(() => {
        const getData = async () => {
            const payload = await generatePayload({
                keys: ["name", "firstName", "lastName"],
                rest: { isActive: true },
                options: {
                    sort: [["name", "ASC"]],
                    populate: ["designations", "roleData"],
                }
            });
            const res = await getUsersList(payload);
            if (res?.status === 1)
                dispatch({ type: USER_CONST.SET_ALL_USERS_DATA, payload: res.data });
        }
        getData();
    }, []);

    if (AllUsers) {
        const options = AllUsers.map(user => ({ id: user.id, value: user.id, label: user.name }));
        return (<>
            <div className="form-group w-100">
                {label && <label htmlFor="assignUserInput">Assign to: </label>}
                <ReactSelect
                    isMulti
                    name="user"
                    options={options}
                    defaultValue={assignMembers}
                    placeholder={placeholder ? placeholder : 'Select Users...'}
                    onChange={setAssignMem}
                    menuPlacement='auto'
                    className="basic-multi-select issue-multi-select_user-dropdown input-border"
                    classNamePrefix="select"
                />
            </div>
        </>)
    }
}
