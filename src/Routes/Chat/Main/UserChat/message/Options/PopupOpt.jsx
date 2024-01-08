import { MuiTooltip } from 'Components/components'
import React from 'react'
import { BoxArrowUpLeft } from 'react-bootstrap-icons'

export const PopupOpt = ({ user, onPopupView, item }) => {
    return (
        <MuiTooltip title='pop-up view'>
            <div className='popup-opt-media cursor-pointer text-color' onClick={() => onPopupView(item)}>
                <BoxArrowUpLeft size={user?.fontSize} />
            </div>
        </MuiTooltip>
    )
}