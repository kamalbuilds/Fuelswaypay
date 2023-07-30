import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Divider, Progress, Row, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ProposalCreationProgress } from "src/components/proposal/ProposalProcess";
import { VotingStatusSlider } from "src/components/proposal/VotingStatusSlider";
import { useAppSelector } from "src/controller/hooks";
import { executeProposal as executeProposalAction, getProposalDetail, vote as voteAction } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import { useDate } from "src/hooks/useDate";
const { Title } = Typography;
export default function ProposalDetail() {
    const router = useRouter();
    const { account } = useAppSelector(state => state.account);
    const { proposalFromDB, daoFromDB, daoOnchain, proposalOnchain, isMember, voted } = useAppSelector(state => state.proposal);
    const { getShortAddress } = useAddress();
    const { vote, executeProposal } = useAppSelector(state => state.process)
    const { getLocalString } = useDate();

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

                        <div
                            dangerouslySetInnerHTML={{ __html: proposalFromDB.content }}
                        />
                    </Space>

                </Col>
                <Col span={8}>
                    <Space direction="vertical">
                        {
                            proposalFromDB.content_type !== 1 && <Card title={"Proposal Discussion"}>
                                <p>Check out the discussion history and actions made on this proposal.</p>
                                <Button type="primary" onClick={() => window.open(proposalFromDB.external_url, "_blank")}>View on Github</Button>
                            </Card>
                        }

                        <Card title={"Voting Status"}>
                            <Descriptions>
                                <Descriptions.Item label="Members">{daoOnchain.count_member}</Descriptions.Item>
                                <Descriptions.Item label="Executed">{proposalOnchain.executed ? "yes" : "no"}</Descriptions.Item>
                                <Descriptions.Item label="Agree">
                                    <div style={{ width: "60px" }}>
                                        <Progress showInfo={true} format={() => proposalOnchain.agree} percent={100} size="small" />
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Disagree">{proposalOnchain.disagree}</Descriptions.Item>
                                <Descriptions.Item label="Quorum">
                                    <div style={{ width: "60px" }}>
                                        <Progress showInfo={true} success={{ percent: 0 }} format={() => daoFromDB.quorum + "%"} percent={100} size={"small"} />

                                    </div>

                                </Descriptions.Item>
                                
                            </Descriptions>
                            <VotingStatusSlider proposalOnChain={proposalOnchain} daoOnchain={daoOnchain} />
                            {
                                isMember && <Space.Compact block>
                                    <Button disabled={voted === true || proposalOnchain.executed} type="primary" loading={vote.processing} onClick={() => voteAction(true)}>Agree</Button>
                                    <Button disabled={voted === false || proposalOnchain.executed} onClick={() => voteAction(false)} loading={vote.processing}>Disagree</Button>
                                    <Button disabled={(proposalOnchain.agree / daoOnchain.count_member) * 100 !== daoFromDB.quorum || proposalOnchain.executed} type="primary" loading={executeProposal.processing} onClick={() => executeProposalAction()}>Execute</Button>

                                </Space.Compact>}
                        </Card>
                        {router.query.dao_address && <Card title={"Detail"}>
                            <Descriptions column={{ xs: 1, lg: 1 }}>
                                <Descriptions.Item label="Proposer">
                                    <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(proposalFromDB.owner)}>
                                        {getShortAddress(proposalFromDB.owner)}
                                    </Button>

                                </Descriptions.Item>
                                <Descriptions.Item label="DAO">
                                    <Link href={`/dao/onchain/${daoFromDB._id}`}>{daoFromDB.title}</Link>

                                </Descriptions.Item>
                                <Descriptions.Item label="Voting Start">
                                    {getLocalString(proposalFromDB.start_date)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Voting End">
                                    {getLocalString(proposalFromDB.end_date)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>}
                        <Card title={"Payment information"}>
                            <Descriptions column={{ xs: 1, lg: 1 }}>
                                <Descriptions.Item label="Token">
                                    ETH
                                </Descriptions.Item>
                                <Descriptions.Item label="Token Amount">
                                    {proposalFromDB.proposal_type === 1 ? "Payout" : "Funding"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Token Amount">
                                    {proposalFromDB.amount}
                                </Descriptions.Item>
                                <Descriptions.Item label="Recipient Type">
                                    {proposalFromDB.proposal_type === 1 ? "User" : "A DAO"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Reciever">
                                    <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(proposalFromDB.recipient)}>
                                        {getShortAddress(proposalFromDB.recipient)}
                                    </Button>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Space>

                </Col>
            </Row>
        </>
    )
}