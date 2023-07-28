import { Alert, Button, Collapse, Space, Table, Tag } from "antd";
import { useEffect } from "react";

import { CopyOutlined } from "@ant-design/icons";
import { Stream } from "src/controller/stream/streamSlice";
import { useAppSelector } from "src/controller/hooks";
import { getIncomingStreams, withdrawStream as withdrawStreamAction } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import PaymentProcess from "./PaymentProcess";
import { useDate } from "src/hooks/useDate";


export const Incoming = () => {
    const { getUnlockEveryIn } = useDate();
    const { getShortAddress } = useAddress();
    const { account } = useAppSelector(state => state.account);
    const { incomingStreams } = useAppSelector(state => state.stream);
    const { withdrawStream } = useAppSelector(state => state.process)


    const doWithdraw = (streamId: string) => {
        // withdrawStreamAction( streamId);
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
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Sender',
            dataIndex: 'owner',
            key: 'owner',
            render: (_, record) => (

                <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.owner)}>
                    {getShortAddress(record.owner)}
                </Button>

            )
        },
        {
            title: "Unlock Progress",
            key: "unlockAmount",
            render: (_, record) => (
                <PaymentProcess stream={record} key={`payment-process-${record.id}`} />
            )
        },
        {
            title: "Settings",
            key: "unlock_every",
            render: (dataIndex, record) => (
                <Collapse
                    items={[{
                        key: `dataIndex`,
                        label: `${record.unlock_amount_each_time} ETH / ${record.unlock_every} ${getUnlockEveryIn(record.unlock_every_type)}`,
                        children: <>
                            Unlock: {record.unlock_amount_each_time} ETH / {record.unlock_every} {getUnlockEveryIn(record.unlock_every_type)}
                            <br />
                            Max Unlocked: {record.unlock_number}
                            <br />
                            Start Date: {new Date(record.start_date).toLocaleString()}
                        </>
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
                        key: `dataIndex`,
                        label: `${record.total_fund - record.withdrew}`,
                        children: <>
                            Balance: {record.total_fund - record.withdrew}
                            <br />
                            Funds: {record.total_fund}
                            <br />
                            Withdrew: {record.withdrew}
                        </>
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
                <Button disabled={
                    record.status !== 1
                } type="primary" onClick={() => doWithdraw(record.id)} loading={withdrawStream.processing}>Withdraw</Button>

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
            <Alert showIcon message="Kindly be aware that you can initiate a withdrawal only if the stream balance is greater than or equal to the unlocked amount minus the amount already withdrawn. If this condition is not met, it is advisable to contact the sender and request additional funding for the stream" type="info" />
            <Table
                pagination={{
                    pageSize: 10
                }}
                dataSource={incomingStreams.map((stream: Stream, index: number) => ({
                    ...stream,
                    key: index
                }))}
                columns={columns} />
        </Space>
    )
}

