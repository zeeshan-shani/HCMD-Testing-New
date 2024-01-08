import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { Col, Row } from 'react-bootstrap'
import { getDateXDaysAgoEndOf, getDateXDaysAgoStartOf } from 'redux/common';
import taskService from 'services/APIs/services/taskService';
import AnalyticsByStatus from './AnalyticsByStatus'
import AnalyticsForToday from './AnalyticsForToday'

export const timeRange = [
    { id: 1, label: "Today", key: "today" },
    { id: 2, label: "Last Week", key: "lastweek" },
    { id: 3, label: "Last Month", key: "lastmonth" }];

export default function TaskAnalytics({
    userId,
    chatId,
    showAnalyticsToday = true,
    label
}) {
    const [range, setRange] = useState(timeRange[0]);

    const { data: analytics = [] } = useQuery({
        queryKey: ["/task/analytics", chatId ? `chat/${chatId}` : `user/${userId}`, range.key],
        queryFn: async () => {
            let startDate, endDate;
            if (range.key === timeRange[1].key) {
                startDate = getDateXDaysAgoStartOf(7).format();
                endDate = getDateXDaysAgoEndOf(0).format();
            } else if (range.key === timeRange[2].key) {
                startDate = getDateXDaysAgoStartOf(30).format();
                endDate = getDateXDaysAgoEndOf(0).format();
            } else {
                startDate = getDateXDaysAgoStartOf().format();
                endDate = getDateXDaysAgoEndOf().format();
            }
            let payload = { dateFilter: [startDate, endDate] }
            if (chatId) payload.chatId = chatId;
            else if (userId) payload.userId = userId;
            const data = await taskService.analytics({ payload });
            if (data?.status === 1) return data.data;
            return null;
        },
        keepPreviousData: false,
        // refetchOnMount: true,
        enabled: Boolean(chatId || userId)
    });

    return (
        <div className='mx-1 my-2'>
            {label &&
                <div className="header mx-1">
                    <h5>{label}</h5>
                </div>}
            <Row className='mx-1'>
                <Col lg={showAnalyticsToday ? 9 : 12} md={12} sm={12} className="mb-2 px-0">
                    <AnalyticsByStatus analytics={analytics} range={range} setRange={setRange} />
                </Col>
                {showAnalyticsToday &&
                    <Col lg={3} md={12} sm={12} className="mb-2">
                        <AnalyticsForToday analytics={analytics} range={range} />
                    </Col>}
            </Row>
        </div>
    )
}