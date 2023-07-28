import { Alert, Button, Collapse, Divider, Input, Popover, Space, Table, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";

import { CopyOutlined } from "@ant-design/icons";
import { useAppSelector } from "src/controller/hooks";
import { fundStream as fundStreamAction, getOutgoingStreams } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import PaymentProcess from "./PaymentProcess";
import { useDate } from "src/hooks/useDate";
import { ColumnsType } from "antd/es/table";

export const Outgoing = () => {
    const { getUnlockEveryIn } = useDate();
    const { getShortAddress } = useAddress();
    const { account } = useAppSelector(state => state.account);
    const { outgoingStreams } = useAppSelector(state => state.stream);
    const [fundAmount, setFundAmount] = useState("");

    const [openFundStreamPopup, setOpenFundStreamPopup] = useState({});
    const { fundStream } = useAppSelector(state => state.process);
    const handleOpenFundStreamPopupChange = (newOpen: boolean,
        //@ts-ignore
        streamId: string) => {
        setOpenFundStreamPopup({ ...openFundStreamPopup, ...{ streamId: newOpen } });
    };


    const doFund = useCallback((stream) => {
        fundStreamAction(stream, parseFloat(fundAmount));
    }, [fundAmount])

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

    const columns: ColumnsType<any> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "Recipient",
            dataIndex: "recipient",
            key: "recipient",
            render: (_, record) => (

                <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.recipient)}>
                    {getShortAddress(record.recipient)}
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

                <Popover
                    content={
                        <>
                            <Input name='adress' value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
                            <Divider />
                            <Button disabled={
                                record.status !== 1
                            } type='primary' onClick={() => doFund(record)} loading={fundStream.processing}>Fund</Button>
                        </>
                    }
                    title="Amount"
                    trigger="click"
                    open={openFundStreamPopup[record.id]}
                    onOpenChange={() => handleOpenFundStreamPopupChange(!openFundStreamPopup[record.id], record.id)}
                >
                    <Button disabled={
                        record.status !== 1
                    } type="primary">Fund</Button>
                </Popover>

            )

        },
    ];


    useEffect(() => {
        if (account) {
            getOutgoingStreams();
        }

    }, [account])


    return (
        <Space wrap direction="vertical">
            <Alert showIcon message="Please note that the recipient can proceed with a withdrawal only if the stream balance is equal to or greater than the unlocked amount minus the previously withdrawn amount. If this requirement is not met, it is necessary for you, as the sender, to provide additional funding for the stream." type="info" />
            <Table
                pagination={{
                    pageSize: 10
                }}
                dataSource={outgoingStreams}
                columns={columns} />
        </Space>
    )
}

