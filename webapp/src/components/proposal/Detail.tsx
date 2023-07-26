import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Form, Row, Space, Statistic, Table } from "antd";
import { useAppSelector } from "../../controller/hooks";
import { executeProposal as executeProposalAction, vote as voteAction } from "../../core";
import { useProposal } from "../../hooks/useProposal";
import { useWallet } from "@suiet/wallet-kit";
import { useAddress } from "../../hooks/useAddress";
import moment from "moment";

export const Details = () => {
    const { currentProposal, dao } = useAppSelector(state => state.daoDetail);
    const { nameMap } = useAppSelector(state => state.name)
    const wallet = useWallet()
    const { convertRecipientToArray, convertDisbursementToArray, countUnvote, countVote, checkUserVoted, checkUserAgree } = useProposal();
    const { vote, executeProposal } = useAppSelector(state => state.process);
    const { getShortAddress, getFriendlyName } = useAddress();
    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };

    const columns = [
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.address)}>{getShortAddress(record.address)}</Button>
            )
        },
        {
            title: '.SDAO Name',
            key: 'proposal_sdao_name',
            dataIndex: "proposal_sdao_name",
            render: (_, record) => {
                let friendlyName = getFriendlyName(nameMap, record.address);
                return (<>
                    {friendlyName ? <Button type="primary">{friendlyName}</Button> : <Button>Unknown</Button>}
                </>
                )
            }
        },
        {
            title: 'Amount (SUI)',
            dataIndex: 'amount',
            key: 'amount',
        }
    ];


    const disbursementColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (_, record) => (
                <Button>{record.date}</Button>
            )
        },
        {
            title: 'Amount (SUI)',
            dataIndex: 'amount',
            key: 'amount',
        }
    ];
    return (
        <Form onFinish={onFinish}>
            <Card title="Voting Status" size="small">
                <Row gutter={8}>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Members"
                                value={dao.countMembers}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Agree"
                                value={countVote(currentProposal.votes)}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Disagree"
                                value={countUnvote(currentProposal.votes)}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Divider />
                {(currentProposal.endDate >= moment().unix()) ? <Space wrap>
                    {
                        checkUserVoted(currentProposal.votes, wallet.address) ? (<>
                            <Button disabled={checkUserAgree(currentProposal.votes, wallet.address)} onClick={() => voteAction(wallet, true)} type="primary">Agree</Button>
                            <Button disabled={vote.processing || currentProposal.executed || !checkUserAgree(currentProposal.votes, wallet.address)} onClick={() => voteAction(wallet, false)}>Disagree</Button>
                            {
                                ((countVote(currentProposal.votes) * 100 / parseInt(dao.countMembers.toString())) >= parseInt(dao.quorum.toString())) ? (<>
                                    <Button disabled={currentProposal.executed} type="primary" loading={executeProposal.processing} onClick={() => executeProposalAction(wallet)}>Execute Proposal</Button>
                                </>) : (<></>)
                            }
                        </>) : (<>
                            <Button disabled={vote.processing || currentProposal.executed} type="primary" onClick={() => voteAction(wallet, true)}>Agree</Button>
                            <Button disabled={vote.processing || currentProposal.executed} onClick={() => voteAction(wallet, false)}>Disagree</Button>
                        </>)
                    }

                </Space> : <Button type="dashed">Voting time has ended</Button>}

            </Card>
            <Divider />
            <Card title="Start Date - End Date" size="small">
                <Space wrap>
                    <Button>{new Date(currentProposal.startDate).toLocaleString()}</Button>
                    <Button>{new Date(currentProposal.endDate).toLocaleString()}</Button>
                </Space>
            </Card>
            <Divider />
            {
                currentProposal.proposalType === 2 ? <Card size="small" title="Recipient">
                    <Space wrap>
                        <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(currentProposal.recipients[0])}>{getShortAddress(currentProposal.recipients[0])}</Button>

                        {getFriendlyName(nameMap, currentProposal.recipients[0]) ? <Button type="primary">{getFriendlyName(nameMap, currentProposal.recipients[0])}</Button> : <Button>Unknown</Button>}


                    </Space>
                </Card> : ""
            }
            <Divider />
            {
                currentProposal.proposalType === 1 ? <Card size="small" title="Recipients">
                    <Table pagination={{ pageSize: 6 }} dataSource={convertRecipientToArray(currentProposal.recipients, currentProposal.amounts)} columns={columns} />
                </Card>
                    : <Card size="small" title="Disbursement Settings">
                        <Table pagination={{ pageSize: 6 }} dataSource={convertDisbursementToArray(currentProposal.disbursementDates, currentProposal.disbursementAmounts)} columns={disbursementColumns} />
                    </Card>
            }


        </Form>
    )
}