import { Card, Col, Row, Statistic } from "antd";
import { useEffect } from "react";
import { OwnerDAOItems } from "src/components/dao/OwnerDaoItems";
import { useAppSelector } from "src/controller/hooks";
import { getCountOwnerContracts } from "src/core";
import { statisticCard } from "src/theme/layout";

export default function Dashboard() {
    const {countDAOs, countChannels, countStreams, countProposals} = useAppSelector(state => state.statistic);
    const {account} = useAppSelector(state => state.account)

    useEffect(() => {
        getCountOwnerContracts(account);
    }, [account])
    return (<>
        <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard}>
                    <Statistic title="DAOs" value={countDAOs} />
                </Card>

            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard}>
                    <Statistic title="Proposals" value={countProposals} />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard}>
                    <Statistic title="Streams" value={countStreams} />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard} >
                    <Statistic title="Channels" value={countChannels}/>
                </Card>
            </Col>
        </Row>
        <OwnerDAOItems />
    </>)
}