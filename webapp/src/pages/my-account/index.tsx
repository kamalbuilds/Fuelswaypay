import { Button, Card, Col, Input, Modal, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import { OwnerDAOItems } from "src/components/dao/OwnerDaoItems";
import { useAppSelector } from "src/controller/hooks";
import { getCountDAOAndProposal } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import { statisticCard } from "src/theme/layout";

export default function Dashboard() {
    const { getShortAddress } = useAddress();
    const {countOwnerProposal, countOwnerDaos} = useAppSelector(state => state.dao);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {account} = useAppSelector(state => state.account)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // setIsModalOpen(false);
        //createName(wallet, name)
    };

    useEffect(() => {
        //getNames();
        getCountDAOAndProposal(account);
    }, [account])
    return (<>
        <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard}>
                    <Statistic title="DAOs" value={countOwnerDaos} />
                </Card>

            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard}>
                    <Statistic title="Proposals" value={countOwnerProposal} />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard}>
                    <Statistic title="Streams" value={0} />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card style={statisticCard} >
                    <Statistic title="Channels" value={0}/>
                </Card>
            </Col>
        </Row>
        <OwnerDAOItems />
    </>)
}