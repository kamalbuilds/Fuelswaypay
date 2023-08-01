import { Alert, Button, Divider, Drawer, Input, Popover, Space, Table, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";

import { CopyOutlined } from "@ant-design/icons";
import { useAppSelector } from "src/controller/hooks";
import { closeChannel as closeChannelAction, createClaim as createClaimAction, fundChannel as fundChannelAction, getClaims, getOutgoingChannels } from "../../core";
import { useAddress } from "src/hooks/useAddress";
import { CreatedClaims } from "./CreatedClaims";
import { Channel } from "src/controller/channel/channelSlice";

export const Outgoing = () => {
    const { getShortAddress } = useAddress();
    const { account } = useAppSelector(state => state.account);
    const [openFundChannelPopup, setOpenFundChannelPopup] = useState({});

    const [openCreateClaimPopup, setOpenCreateClaimPopup] = useState({});
    const [claimAmount, setClaimAmount] = useState("");
    const [claimTitle, setClaimTitle] = useState("");
    const [claimMetaURL, setClaimMetaURL] = useState("");

    const [fundAmount, setFundAmount] = useState("");
    const { fundChannel, createClaim } = useAppSelector(state => state.process)
    const { outgoingChannels } = useAppSelector(state => state.channel);

    const [openDetail, setOpenDetail] = useState(false);


    const showDrawerDetail = () => {
        setOpenDetail(true);
    };

    const onCloseDetail = () => {
        setOpenDetail(false);
    };


    const handleOpenFundChannelPopupChange = (newOpen: boolean,
        //@ts-ignore
        channelId: string) => {
        setOpenFundChannelPopup({ ...openFundChannelPopup, ...{ channelId: newOpen } });
    };


    const handleOpenCreateClaimPopupChange = (newOpen: boolean, channelId: string) => {
        setOpenCreateClaimPopup({ ...openCreateClaimPopup, ...{ channelId: newOpen } });
    };

    const handleFundChannel = useCallback((channel: Channel) => {
        fundChannelAction(channel, parseFloat(fundAmount));
    }, [fundAmount])

    const handleCreateClaim = useCallback((channel: Channel) => {
        createClaimAction(channel, {
            title: claimTitle,
            meta_url: claimMetaURL,
            amount: parseFloat(claimAmount)
        });
    }, [claimTitle, claimAmount, claimMetaURL])

    const colorMap = (pt: number) => {
        let color = "blue";
        if (!pt) return color;
        switch (parseInt(pt.toString())) {
            case 1:
                color = "blue"
                break;
            case 2:
                color = "geekblue";
                break;
            case 3:
                color = "purple";
                break
            default:
                break;
        }
        return color;
    }

    const statusMap = (status: number) => {
        let st = "active"
        if (!status) return st;
        switch (parseInt(status.toString())) {
            case 1:
                st = "active"
                break;
            case 2:
                st = "closed";
                break;
            default:
                break;
        }

        return st;

    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Payee',
            dataIndex: 'payee',
            key: "payee",
            render: (_, record) => (

                <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.payee)}>
                    {getShortAddress(record.payee)}
                </Button>

            )
        },
        {
            title: "Claims",
            dataIndex: "claims",
            key: "claims",
            render: (_, record) => (

                <Button type="primary" onClick={() => {
                    getClaims(record);
                    showDrawerDetail()
                }}>
                    Details
                </Button>

            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag color={colorMap(record.status)}>{statusMap(record.status)}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space.Compact block>
                    <Popover
                        content={
                            <>

                                <Input size="large" name='amount' type='number' value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} addonAfter={"ETH"} />
                                <Divider />
                                <Button disabled={record.status !== 1} type='primary' onClick={() => handleFundChannel(record)} loading={fundChannel.processing}>Send</Button>
                            </>
                        }
                        title="Amount"
                        trigger="click"
                        open={openFundChannelPopup[record.id]}
                        onOpenChange={() => handleOpenFundChannelPopupChange(!openFundChannelPopup[record._id], record._id)}
                    >
                        <Button disabled={record.status !== 1} type="primary">Fund</Button>
                    </Popover>
                    <Popover
                        content={
                            <Space direction="vertical">
                                <Input size="large" placeholder="Title" name='title' value={claimTitle} onChange={(e) => setClaimTitle(e.target.value)} />
                                <Input size="large" placeholder="Document URL" type="URL" name='meta_url' value={claimMetaURL} onChange={(e) => setClaimMetaURL(e.target.value)} />
                                <Input size="large" placeholder="Amount" name='amount' type='number' suffix="ETH" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} />
                                <Divider />
                                <Button disabled={record.status !== 1} type='primary' onClick={() => handleCreateClaim(record)} loading={createClaim.processing}>Submit</Button>
                            </Space>
                        }
                        title="Create Claim"
                        trigger="click"
                        open={openCreateClaimPopup[record.id]}
                        onOpenChange={() => handleOpenCreateClaimPopupChange(!openCreateClaimPopup[record._id], record._id)}
                    >
                        <Button disabled={record.status !== 1}>New Claim</Button>
                    </Popover>
                    <Button disabled={record.status !== 1} onClick={() => {
                        // closeChannelAction(wallet, record.id)
                    }}>Close</Button>
                </Space.Compact>

            )

        },
    ];

    useEffect(() => {
        if (account) {
            getOutgoingChannels();
        }

    }, [account])



    return (
        <Space direction="vertical">
            <Alert type="success" showIcon message="As the payer, it is crucial to maintain a channel balance that is sufficient to cover the created claim amounts. This will enable payees to accept claims, ensuring successful transactions. Please ensure that the channel balance is adequate to facilitate seamless claim acceptance by the payees." />
            <Table
                pagination={{
                    pageSize: 10
                }}
                dataSource={outgoingChannels}
                columns={columns} />

            <Drawer title={"Claims"} size="large" placement="right" onClose={onCloseDetail} open={openDetail}>
                <CreatedClaims />
            </Drawer>
        </Space>
    )
}

