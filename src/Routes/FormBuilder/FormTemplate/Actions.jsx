import React from 'react'
import { CheckBox } from '@mui/icons-material'
import { Button } from 'react-bootstrap'
import { PencilFill } from 'react-bootstrap-icons'

const actions = [
    { action: 'edit', label: <><PencilFill /> Form Builder</> },
    { action: 'use', label: <><CheckBox /> Form Preview</> },
];
export default function Actions({ templateState, setTemplateState }) {
    return (
        <div className="d-flex gap-10">
            {actions.map((item) => {
                return (
                    <Button key={item.action} variant={templateState.action === item?.action ? 'dark' : 'transparent'}
                        onClick={() => setTemplateState(prev => ({ ...prev, action: item.action }))}>
                        {item.label}
                    </Button>
                )
            })}
        </div>
    )
}
