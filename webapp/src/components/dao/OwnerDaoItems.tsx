import { Col, List, Row, Typography } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getOwnerDaos } from "src/core";
import { Item } from "./Item";

const { Title } = Typography;

export const OwnerDAOItems = () => {
    const { account } = useAppSelector(state => state.account);
    const { ownerDaos } = useAppSelector(state => state.dao)
    useEffect(() => {
        if (account) {
            getOwnerDaos()
        }
    }, [account])
    return (
        <List
            grid={{
                gutter: 12,
                column: 2
            }}
            size="large"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 4,
                align: "center",
                pageSizeOptions: [4, 8, 12]
            }}
            dataSource={ownerDaos}
            renderItem={(item, index) => (
                <Item index={index} dao={item} />
            )}
        />


    )
}