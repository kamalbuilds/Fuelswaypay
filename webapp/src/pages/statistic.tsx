import { Card, Col, Row, Statistic } from "antd";
import { useEffect } from "react";
import PayoutChart from "src/components/home/PayoutChart";
import { useAppSelector } from "src/controller/hooks";
import { getStatistic } from "src/core";
import { statisticCard, statisticCardRight } from "src/theme/layout";

export default function Statistics() {
    const {generalStatistic, payoutStatistic} = useAppSelector(state => state.statistic);

    useEffect(() => {
        //getStatistic();
    }, [])
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="DAOs" value={generalStatistic.dao} />
                    </Card>

                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="Proposals" value={generalStatistic.proposal} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="Sub-DAOs" value={generalStatistic.subDAO}/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard} >
                        <Statistic title="Funds" value={generalStatistic.fund} precision={3} suffix="SUI"/>
                    </Card>
                </Col>
            </Row>
            <Row gutter={24} style={{marginTop: 24}}>
                <Col xs={24} lg={6}>

                    <Card  style={statisticCardRight}>
                        <Statistic title="Payout" value={(payoutStatistic.totalPayout && payoutStatistic.totalPayout[0])? payoutStatistic.totalPayout[0].sum : 0} precision={3} suffix="SUI" />
                    </Card>
                    <Card  style={statisticCardRight}>
                        <Statistic title="Vesting" value={(payoutStatistic.totalPayout && payoutStatistic.totalPayout[1])? payoutStatistic.totalPayout[1].sum : 0} precision={3} suffix="SUI" />
                    </Card>
                    <Card  style={statisticCardRight}>
                        <Statistic title="Executed Proposals" value={generalStatistic.executedProposal} />
                    </Card>
                    <Card  style={statisticCardRight}>
                        <Statistic title="Members" value={generalStatistic.members} />
                    </Card>
                </Col>
                <Col xs={24} lg={18}>
                    <PayoutChart />
                </Col>
            </Row>
        </>
    )
}