import { Alert, Button, Drawer, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";

import { CopyOutlined } from "@ant-design/icons";
import { useAppSelector } from "src/controller/hooks";
import { closeChannel as closeChannelAction, getClaims, getIncomingChannels } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import { RecievedClaims } from "./RecievedClaim";

export const Incoming = () => {
    const {account} = useAppSelector(state => state.account);
    const { getShortAddress } = useAddress();
    const { incomingChannels } = useAppSelector(state => state.channel);
    const [openDetail, setOpenDetail] = useState(false);


    const showDrawerDetail = () => {
        setOpenDetail(true);
    };

    const onCloseDetail = () => {
        setOpenDetail(false);
    };


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
            title: 'Payer',
            dataIndex: 'payer',
            key: 'payer',
            render: (_, record) => (

                <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.payer)}>
                    {getShortAddress(record.payer)}
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
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (_, record) => (
                <Tag>{new Date(record.created_at).toLocaleString()}</Tag>
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
        // {
        //     title: 'Actions',
        //     key: 'actions',
        //     render: (_, record) => (
        //         <Space wrap>
        //             <Button disabled={record.status !== 1} type="dashed" onClick={() => {
        //                 // closeChannelAction(wallet, record.id)
        //             }}>Close</Button>
        //         </Space>

        //     )

        // },
    ];

    useEffect(() => {
        if (account) {
            getIncomingChannels();
        }
      
    }, [account])


    return (
        <Space wrap direction="vertical">
            <Alert type="success" showIcon message="Prior to accepting a claim, it is essential to verify the channel balance. If the channel balance is not greater than the claim amount, the transaction will not succeed, and the SUI coins will not be transferred to your wallet. In such a situation, it is recommended to contact the payer and request additional funding for the channel to ensure a successful transaction." />
             <Table
                pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"]
                }}
                dataSource={incomingChannels}
                columns={columns} />

            <Drawer title={"Recieved Claims"} size="large" placement="right" onClose={onCloseDetail} open={openDetail}>
                <RecievedClaims />
            </Drawer>
        </Space>
    )
}

