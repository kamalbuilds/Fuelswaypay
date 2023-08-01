import { Card, Col, Row, Statistic } from "antd";
import { useEffect } from "react";
import PayoutChart from "src/components/home/PayoutChart";
import { useAppSelector } from "src/controller/hooks";
import { getStatistic } from "src/core";
import { statisticCard, statisticCardRight } from "src/theme/layout";

export default function Statistics() {
    const {generalStatistic, payoutStatistic} = useAppSelector(state => state.statistic);

    useEffect(() => {
        getStatistic();
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
                        <Statistic title="Channel" value={generalStatistic.channel}/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard} >
                        <Statistic title="Stream" value={generalStatistic.stream}/>
                    </Card>
                </Col>
            </Row>
            <Row gutter={24} style={{marginTop: 24}}>
                <Col xs={24} lg={6}>

                    <Card  style={statisticCardRight}>
                        <Statistic title="Payout" value={(payoutStatistic.totalPayout && payoutStatistic.totalPayout[0])? payoutStatistic.totalPayout[0].sum : 0} precision={3} suffix="ETH" />
                    </Card>
                    <Card  style={statisticCardRight}>
                        <Statistic title="Funding" value={(payoutStatistic.totalPayout && payoutStatistic.totalPayout[1])? payoutStatistic.totalPayout[1].sum : 0} precision={3} suffix="ETH" />
                    </Card>
                    <Card  style={statisticCardRight}>
                        <Statistic title="Members" value={generalStatistic.members}/>
                    </Card>
                    <Card  style={statisticCardRight}>
                        <Statistic title="Executed Proposals" value={generalStatistic.executedProposal} />
                    </Card>
                   
                </Col>
                <Col xs={24} lg={18}>
                    <PayoutChart />
                </Col>
            </Row>
        </>
    )
}