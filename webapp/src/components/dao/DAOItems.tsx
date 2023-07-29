import { Col, Row, List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getDaos } from "src/core";
import { Item } from "./Item";

export const DAOItems = () => {
    const { daos } = useAppSelector(state => state.dao)
    useEffect(() => {
        getDaos()
    }, [])
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
            }}
            dataSource={daos}
            renderItem={(item, index) => (
                <Item index={index} dao={item} />
            )}
        />

    )
}

