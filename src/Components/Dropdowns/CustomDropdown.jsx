import React from 'react'
import { Dropdown } from 'react-bootstrap'

export default function CustomDropdown({
    id = `dropdown-custom-${Date.now()}`,
    buttonText = "Custom toggle",
    selected,
    customToggle,
    customMenu,
    menuContent
}) {
    return (
        <Dropdown>
            <Dropdown.Toggle as={customToggle} id={id}>
                {buttonText}
            </Dropdown.Toggle>
            <Dropdown.Menu as={customMenu}>
                {menuContent}
            </Dropdown.Menu>
        </Dropdown>
    )
}
