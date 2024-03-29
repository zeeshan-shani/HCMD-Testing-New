import FormGenerator from 'Components/FormBuilder/Build/pages/FormGenerator'
import React, { useMemo } from 'react'
import { Col } from 'react-bootstrap';
import NextofKin from 'Routes/Dashboard/components/SchedulePatient/AddNewPatient/NextOfKin';
import getpatientForm from './Form'

export default function Contacts() {

    // const formJSON = [
    //     {
    //         id: 1,
    //         title: "Address of Visit",
    //         key: "addressOfVisit",
    //         placeholder: "Select location",
    //         type: "select",
    //     },
    //     {
    //         id: 2,
    //         title: "Address of record and insurance",
    //         key: "AddressOfRecordAndInsurance",
    //         placeholder: "Select location",
    //         type: "select",
    //     },
    //     {
    //         id: 3,
    //         title: "Date of initial HCMD & contacting staff",
    //         key: "dateInitialHCMD",
    //         placeholder: "Select date",
    //         type: "date",
    //     },
    //     {
    //         id: 4,
    //         title: "Where the patient hear about us?",
    //         key: "reference",
    //         placeholder: "Select",
    //         type: "select",
    //     },
    //     {
    //         id: 5,
    //         title: "Who was the first patient spoke to?",
    //         key: "patientFirstPerson",
    //         placeholder: "Select",
    //         type: "select",
    //     },
    //     {
    //         id: 6,
    //         title: "Person who enrolled the patient?",
    //         key: "patientEnrollBy",
    //         placeholder: "Select",
    //         type: "select",
    //     },
    //     {
    //         id: 7,
    //         title: "Family Contact",
    //         key: "familyContact",
    //         type: "phone",
    //     },
    // ]

    const dataFields = useMemo(() => {
        const formdata = getpatientForm();
        return formdata;
    }, []);

    const NextOfKin = useMemo(() => {
        return (
            <Col xs={12} className="mb-2">
                <NextofKin mainState={{}} setMainState={() => { }} />
            </Col>)
    }, []);

    return (
        <FormGenerator
            className="m-0"
            // formButtons={<>
            //     <div className='d-flex justify-content-end gap-10'>
            //         <Button variant='secondary' onClick={toggleTransferModel}>Cancel</Button>
            //         <Button type="submit" variant='primary'>Save</Button>
            //     </div>
            // </>}
            extraFields={NextOfKin}
            formClassName={"row"}
            resetOnSubmit={false}
            dataFields={dataFields}
            onSubmit={e => console.log('e', e)}
        />
    )
}
