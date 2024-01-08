import { useQuery } from '@tanstack/react-query';
import { Select, Space } from 'antd'
import { forwardRef, useCallback, useMemo } from 'react'
import taskCategoryService from 'services/APIs/services/taskCategoryService';
import { CONST } from 'utils/constants';

const CategoryAssign = forwardRef(function CategoryAssign({ messageText, setMessageText }, ref) {

    const { categoryIds = [] } = messageText;

    const { data: taskCategories = [] } = useQuery({
        queryKey: ["/taskCategory/list"],
        queryFn: async () => {
            const data = await taskCategoryService.list({});
            if (data?.status === 1) return data.data
            return [];
        },
        keepPreviousData: false,
        staleTime: CONST.QUERY_STALE_TIME.L2,
    });

    const options = useMemo(() => {
        return taskCategories.map(i => ({ ...i, label: i.name, value: i.id })) || []
    }, [taskCategories]);

    const onSelect = useCallback((id) => {
        setMessageText(prev => ({ ...prev, categoryIds: [...prev.categoryIds, id] }))
    }, [setMessageText]);

    const onDeselect = useCallback((id) => {
        setMessageText(prev => ({ ...prev, categoryIds: prev.categoryIds.filter(item => item !== id) }))
    }, [setMessageText]);

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Select
                ref={ref}
                mode="multiple"
                size={"middle"}
                value={categoryIds || []}
                virtual={true}
                onSelect={onSelect}
                onDeselect={onDeselect}
                style={{ width: "100%" }}
                placement="topLeft"
                placeholder="Select Category"
                options={options}
            >
            </Select>
        </Space>
    )
})
export default CategoryAssign