import { useQuery } from '@tanstack/react-query';
import ModalReactstrap from 'Components/Modals/Modal';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react'
import { Card, Col, ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { generatePayload } from 'redux/common';
import reminderService from 'services/APIs/services/reminderService';
import { CONST } from 'utils/constants';
import ReminderModal from './Modal';

export default function UpcomingReminders() {
    const { user } = useSelector(state => state.user);
    const [state, setState] = useState({ showReminders: false });

    const { data: reminders = [] } = useQuery({
        queryKey: ["/reminders/list", user.id],
        queryFn: async () => {
            const payload = await generatePayload({
                rest: { userId: user.id },
                options: {
                    pagination: true,
                    populate: ["message"],
                    page: 1,
                    limit: 2
                },
            })
            const data = await reminderService.list({ payload });
            if (data?.status === 1) return data.data
            return [];
        },
        keepPreviousData: false,
        refetchInterval: 1000 * 60 * 5,
        staleTime: CONST.QUERY_STALE_TIME.L_1,
    });

    const onReminderView = useCallback(() => {
        setState(prev => ({ ...prev, showReminders: true }))
    }, []);

    if (!!reminders?.length)
        return (
            <Col xs={12} lg={6} className="mt-1">
                <Card className="border-0 text-color">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>Upcoming Reminders</div>
                        <div className='text-link' onClick={onReminderView}>View all</div>
                    </Card.Header>
                    <ListGroup>
                        {reminders.map((item, index) => {
                            return (
                                <ListGroup.Item className='d-flex justify-content-between align-items-center' key={index}>
                                    <div className='text-truncate in-one-line'>
                                        {item.message.message}
                                    </div>
                                    <div className='min-width-160 text-right text-capitalize'>
                                        {moment(item.triggerTime).fromNow()}
                                    </div>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Card>
                <ModalReactstrap
                    header={"Upcoming Reminders"}
                    show={state.showReminders}
                    toggle={() => setState(prev => ({ ...prev, showReminders: !prev.showReminders }))}
                    body={<ReminderModal />}
                />
            </Col>
        )
}
