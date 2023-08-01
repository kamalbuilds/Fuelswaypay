import { Card, Col, Row, Statistic } from "antd";
import { Items } from "src/components/proposal/Items";
import { useAppSelector } from "src/controller/hooks";
import { statisticCard } from "src/theme/layout";

export default function MyProposals() {
    const {myProposals} = useAppSelector(state => state.proposal);
    return (
        <div style={{ margin: "auto" }}>
            <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="Total" value={myProposals.length} />
                    </Card>

                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="Payout" value={myProposals.filter(i => i.proposal_type === 1).length} />
                    </Card>

                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="Funding" value={myProposals.filter(i => i.proposal_type === 2).length} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={statisticCard}>
                        <Statistic title="Requested Amount" value={myProposals.reduce((a, proposal) => a + proposal.amount, 0)} suffix={"ETH"} />
                    </Card>
                </Col>
            </Row>
            <br />
            <Items />
        </div>
    )
}