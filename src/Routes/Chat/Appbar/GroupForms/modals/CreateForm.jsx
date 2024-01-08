// import { Form } from 'react-bootstrap';
import FormGenerator from 'Components/FormBuilder/Build/pages/FormGenerator';
import ModalReactstrap from 'Components/Modals/Modal';
import { lazy, useCallback, useMemo, useState } from 'react';
import { base } from 'utils/config';
import ErrorBoundary from 'Components/ErrorBoundry';
// import FormGenerator from 'Components/FormBuilder/Build/pages/FormGenerator';
// import FormPreview from 'Routes/Chat/Appbar/GroupForms/modals/FormPreview';
// import CustomForm from 'Routes/Chat/Appbar/GroupForms/modals/CustomForm';
import { LazyComponent } from 'redux/common';
import { ReactComponent as BlocksLoader } from "assets/media/BlocksLoader.svg";
import { Button } from 'react-bootstrap';
import moment from 'moment-timezone';
import { CONST } from 'utils/constants';
import { getSendToUsers } from 'redux/actions/chatAction';
import { useSelector } from 'react-redux';
import { sendMessage } from 'utils/wssConnection/Socket';
import { showSuccess } from 'utils/package_config/toast';
import { changeTask } from 'redux/actions/modelAction';
import chatTemplateService from 'services/APIs/services/chatTemplateService';
import { queryClient } from 'index';
const FormRenderer = lazy(() => import('Routes/FormBuilder/FormTemplate/Renderer/FormRenderer'));

export default function CreateForm({ onCancel, onSave, formData = null, templates = [] }) {
    const [state, setState] = useState({ formData, nodes: null });
    const { user } = useSelector(state => state.user);
    const { activeChat } = useSelector(state => state.chat);
    // const [dataJson, setDataJson] = useState(formData.JSONData);
    // const [showPreview, setShowPreview] = useState(false);
    // const [oldData, setOldData] = useState(formData.JSONData);
    // const [title, setTitle] = useState(formData.title);

    // const onSaveHandler = ({ title }) => {
    //     if (!title) return showError('Please Enter Form Title');
    //     onSave({ JSON_String: JSON.stringify(dataJson), form_title: title, id: formData?.id });
    // }

    const onNextTemplate = useCallback(async (data) => {
        // const formId = !!data.formId?.length && data.formId[0].value;
        // const res = await templateTabService.list({ payload: { query: { id: formId }, findOne: true } });
        // formTemplateService.create({ payload: { chatId: activeChat.id, templateTabId: res.data.id, description: data.description } });
        // if (res?.status === 1)
        //     setState(prev => ({ ...prev, formData: res.data }));
        const templateTabIds = data.formId.map(i => i.value);
        const res = await chatTemplateService.update({
            payload: { chatId: activeChat.id, templateTabIds }
        })
        queryClient.setQueryData(["/chatTemplate/list", user.id, activeChat?.id], (prev) => res.data);
        onCancel();
    }, [activeChat.id, user.id, onCancel]);

    const blockLoader = useMemo(() => (
        <div className='d-flex flex-column justify-content-center'>
            <BlocksLoader height={"100px"} />
            <p className='text-center text-muted'>Building Form...</p>
        </div>
    ), []);

    const onSubmit = useCallback(() => {
        let newData = "";
        state?.nodes?.map((item) => {
            const key_data = item.data.label;
            let value_data = item.data.value;
            if (item.type === "LabelNode") value_data = "";
            if (item.type === "NumberNode") value_data = Number(value_data);
            if (item.type === "DateTimeNode") value_data = moment(value_data).format("MM/DD/YYYY");
            if (value_data) newData += `\n*${key_data}*: ${value_data}`;
            return ({ label: item.data.label, value: item.data.value, type: item.type })
        })
        // console.log('newData', newData);
        const msgObject = {
            chatType: activeChat.type,
            chatId: activeChat.id,
            message: newData,
            type: CONST.MSG_TYPE.ROUTINE,
            sendTo: getSendToUsers(user.id, activeChat.type, activeChat.chatusers),
            sendBy: user.id,
            isMessage: true,
        }
        if (!newData) return;
        sendMessage(msgObject, () => onCancel());
        changeTask();
        showSuccess("Successfully Submitted Form");
    }, [state?.nodes, activeChat.chatusers, activeChat.id, activeChat.type, user.id, onCancel]);

    const renderedForm = useMemo(() => (
        <ErrorBoundary>
            {state.formData?.components &&
                <LazyComponent fallback={blockLoader}>
                    <FormRenderer
                        height="80vh"
                        form={JSON.parse(state.formData?.components)}
                        onChange={(data) => setState(prev => ({ ...prev, nodes: data.components }))}
                    />
                </LazyComponent>}
        </ErrorBoundary>
    ), [blockLoader, state.formData?.components]);

    const dataFields = useMemo(() => (
        [
            {
                "name": "formId",
                "label": "Select Template",
                "valueKey": "formId",
                "value": templates,
                "placeholder": "Form",
                "type": "select",
                "validationType": "array",
                "validations": [
                    {
                        "type": "required",
                        "params": ["Template selection is required"]
                    }
                ],
                "options": [],
                "isEditable": true,
                "optionKey": {
                    "url": base.URL + '/templateTab/list',
                    "payload": {
                        "options": {
                            //    "attributes": ["title", "id"]
                            "limit": 25
                        },
                        "keys": ["title"],
                        "value": ""
                    },
                    "method": "post",
                    "labelField": "title",
                    "valueField": "id"
                },
                "pluginConfiguration": {
                    "isAsyncSelect": true,
                    "isClearable": true,
                    "isMulti": true
                },
            },
            // {
            //     "name": "description",
            //     "label": "Description",
            //     "valueKey": "description",
            //     "value": "",
            //     "type": "text",
            //     "validationType": "string",
            //     "validations": [],
            //     "isEditable": true
            // },
            // {
            //     label: "Select form:",
            //     name: "formData",
            //     value: "",
            //     valueKey: "formData",
            //     placeholder: "Condition",
            //     type: "select",
            //     isEditable: true,
            //     pluginConfiguration: {
            //         isClearable: true,
            //     },
            //     optionKey: {url: "", method: "", payload: { } },
            //     options: conditionalOptions,
            //     validationType: "array",
            //     validations: [],
            // },
        ]
    ), [templates]);

    return (
        <ModalReactstrap
            backdrop="static"
            size={state.formData ? "xl" : "lg"}
            show={true}
            header={!state.formData && "Message Template"}
            toggle={onCancel}
            footer={
                state.formData && <div className='d-flex justify-content-end'>
                    <div className="d-flex gap-10">
                        <Button onClick={onCancel} variant="secondary">Cancel</Button>
                        <Button onClick={onSubmit}>Submit</Button>
                    </div>
                </div>}
            body={<>
                {state.formData ? <>
                    {renderedForm}
                </>
                    :
                    <FormGenerator
                        // {/* <CustomForm oldData={oldData} setOldData={setOldData} setDataJson={setDataJson} dataJson={dataJson} setShowPreview={setShowPreview} /> */}
                        className="mb-2"
                        dataFields={dataFields}
                        buttonsClass="px-0"
                        resetOnSubmit={false}
                        onSubmit={onNextTemplate}
                    />

                }
            </>}
        />
        // {showPreview && <FormPreview dataJson={dataJson} onClose={() => setShowPreview(false)} />}
    );
}

