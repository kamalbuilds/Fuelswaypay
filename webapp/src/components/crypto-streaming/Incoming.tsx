import { Alert, Button, Collapse, Descriptions, Space, Table, Tag } from "antd";
import { useEffect } from "react";

import { CopyOutlined } from "@ant-design/icons";
import { Stream } from "src/controller/stream/streamSlice";
import { useAppSelector } from "src/controller/hooks";
import { getIncomingStreams, withdrawStream as withdrawStreamAction } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import PaymentProcess from "./PaymentProcess";
import { useDate } from "src/hooks/useDate";
import { useStream } from "src/hooks/useStream";


export const Incoming = () => {
    const { getUnlockEveryIn, getLocalString } = useDate();
    const { getShortAddress } = useAddress();
    const { getPrevilegeText } = useStream()
    const { account } = useAppSelector(state => state.account);
    const { incomingStreams } = useAppSelector(state => state.stream);
    const { withdrawStream } = useAppSelector(state => state.process)


    const doWithdraw = (stream: Stream) => {
        withdrawStreamAction(stream);
    }

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
                st = "completed";
                break;
            default:
                break;
        }

        return st;

    }

    const columns = [
        {
            title: 'Sender',
            dataIndex: 'owner',
            key: 'owner',
            render: (_, record) => (

                <Button icon={<CopyOutlined />} type="primary" onClick={() => navigator.clipboard.writeText(record.owner)}>
                    {getShortAddress(record.owner)}
                </Button>

            )
        },
        {
            title: "Payout Progress",
            key: "progress",
            render: (_, record) => (
                <PaymentProcess stream={record} key={`payment-progress-${record.id}`} />
            )
        },
        {
            title: "Settings",
            key: "unlock_every",
            render: (dataIndex, record) => (
                <Collapse
                    items={[{
                        key: `${dataIndex}`,
                        label: `${record.unlock_amount_each_time} ETH / ${record.unlock_every} ${getUnlockEveryIn(record.unlock_every_type)}`,
                        children: <Descriptions column={1} size="small" style={{ maxWidth: 250 }}>
                            <Descriptions.Item label="Title">
                                {record.title}
                            </Descriptions.Item>
                            <Descriptions.Item label="Max Unlocked">
                                {record.unlock_number}
                            </Descriptions.Item>
                            <Descriptions.Item label="Start Date">
                                {getLocalString(record.start_date)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cancel Previlege">
                                {getPrevilegeText(record.cancel_previlege)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Transfer Previlege">
                                {getPrevilegeText(record.transfer_previlege)}
                            </Descriptions.Item>
                        </Descriptions>
                    }]}
                />

            )
        },
        {
            title: "Balance (ETH)",
            dataIndex: "balance",
            key: "balance",
            render: (dataIndex, record) => (

                <Collapse
                    items={[{
                        key: `${dataIndex}`,
                        label: `${record.total_fund - record.withdrew}`,
                        children: <Descriptions column={1} size="small" style={{maxWidth: 150}}>
                            <Descriptions.Item label="Balance">{record.total_fund - record.withdrew}</Descriptions.Item>
                            <Descriptions.Item label="Funds">{record.total_fund}</Descriptions.Item>
                            <Descriptions.Item label="Withdrew">{record.withdrew}</Descriptions.Item>
                        </Descriptions>
                    }]}
                />

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
                    <Button disabled={
                        record.status !== 1
                    } type="primary" onClick={() => doWithdraw(record)} loading={withdrawStream.processing}>Withdraw</Button>
                    <Button disabled={
                        record.status === 3 || [2, 3].indexOf(record.cancel_previlege) === -1
                    } type="default" onClick={() => { }} loading={withdrawStream.processing}>Cancel</Button>
                    <Button disabled={
                        record.status === 3 || [2, 3].indexOf(record.transfer_previlege) === -1
                    } type="default" onClick={() => { }} loading={withdrawStream.processing}>Transfer</Button>
                </Space.Compact>
            )

        },
    ];


    useEffect(() => {
        if (account) {
            getIncomingStreams();
        }

    }, [account])

    return (
        <Space wrap direction="vertical">
            <Alert showIcon message="Kindly be aware that you can initiate a withdrawal only if the stream balance is greater than or equal to the unlocked amount minus the amount already withdrawn. If this condition is not met, it is advisable to contact the sender and request additional funding for the stream" type="success" />
            <Table
                pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"]
                }}
                dataSource={incomingStreams.map((stream: Stream, index: number) => ({
                    ...stream,
                    key: index
                }))}
                columns={columns} />
        </Space>
    )
}

