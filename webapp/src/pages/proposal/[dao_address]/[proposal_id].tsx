import { Button, Card, Col, Descriptions, Divider, Row, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ProposalCreationProgress } from "src/components/proposal/ProposalProcess";
import { useAppSelector } from "src/controller/hooks";
import { executeProposal as executeProposalAction, getProposalDetail, vote as voteAction } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import { useDate } from "src/hooks/useDate";
import { headStyle } from "src/theme/layout";
const { Title } = Typography;
export default function ProposalDetail() {
    const router = useRouter();
    const { proposalFromDB } = useAppSelector(state => state.proposal);
    const { getShortAddress } = useAddress();
    const { vote, executeProposal } = useAppSelector(state => state.process)
    const {getLocalString} = useDate();

    useEffect(() => {
        if (router.query.dao_address) {
            let { dao_address, proposal_id } = router.query;
            getProposalDetail(dao_address, parseInt(proposal_id.toString()));
        }
    }, [router.query.dao_address])
    return (
        <>
            <ProposalCreationProgress />
            <Divider />
            <Row gutter={16}>
                <Col span={16}>
                    <Title level={2}>{proposalFromDB.title}</Title>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        {proposalFromDB.content}
                    </Space>

                </Col>
                <Col span={8}>
                    <Space direction="vertical">
                        {
                            proposalFromDB.content_type === 2 && <Card title={"Proposal Discussion"}>
                                <p>Check out the discussion history and actions made on this proposal.</p>
                                <Button type="primary">View on Github</Button>
                            </Card>
                        }

                        <Card title={"Voting Status"}>

                            <Space wrap>
                                <Button type="primary" loading={vote.processing} onClick={() => voteAction(true)}>Agree</Button>
                                <Button loading={vote.processing}>Disagree</Button>
                                <Button type="primary" loading={executeProposal.processing} onClick={() => executeProposalAction()}>Execute</Button>
                            </Space>
                        </Card>
                        {router.query.dao_address && <Card title={"Detail"}>
                            <Descriptions column={{ xs: 1, lg: 1 }}>
                                <Descriptions.Item label="Proposer">
                                    {getShortAddress(proposalFromDB.owner)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Voting Start">
                                    {getLocalString(proposalFromDB.start_date)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Voting End">
                                    {getLocalString(proposalFromDB.end_date)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card> }
                        <Card title={"Payout/Funding information"}>
                            <Descriptions column={{ xs: 1, lg: 1 }}>
                                <Descriptions.Item label="Token">
                                    ETH
                                </Descriptions.Item>
                                <Descriptions.Item label="Token Amount">
                                    {proposalFromDB.amount}
                                </Descriptions.Item>
                                <Descriptions.Item label="Reciever">
                                    {getShortAddress(proposalFromDB.recipient)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Space>

                </Col>
            </Row>
        </>
    )
}