import React from 'react'
import { Form } from "@formio/react";

export default function FormioRenderer(props) {
    return (
        <Form {...props} />
    )
}
