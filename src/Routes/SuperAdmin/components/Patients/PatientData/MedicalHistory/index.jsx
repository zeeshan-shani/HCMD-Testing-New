import React, { useMemo } from 'react'
import FormGenerator from 'Components/FormBuilder/Build/pages/FormGenerator'
import getForm from './Form'

export default function MedicalHistory() {

    const dataFields = useMemo(() => {
        const formdata = getForm();
        return formdata;
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
            formClassName={"row"}
            resetOnSubmit={false}
            dataFields={dataFields}
            onSubmit={e => console.log('e', e)}
        />
    )
}
