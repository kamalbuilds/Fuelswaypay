import { Col, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { DaoStatistic } from "src/components/dao/detail/DaoStatistic";
import { DaoTabs } from "src/components/dao/detail/DaoTabs";
import { DetailItem } from "src/components/dao/detail/DetailItem";
import { useAppSelector } from "src/controller/hooks";
import { getDaoDetail, getDaoDetailFromDB, getNames } from "src/core";

export default function DAODetail() {
    const {id} = useRouter().query;
  

    useEffect(() => {
        if (id) {
            getDaoDetail(id);
        }
    }, [id])


    return (
        <Row gutter={16}>
            <Col span={6}>
                <DetailItem />
            </Col>
            <Col span={18}>

                <DaoStatistic />
                <DaoTabs />
            </Col>
        </Row>
    )
}