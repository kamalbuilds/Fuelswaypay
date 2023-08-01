import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks"
import { Button, List, Table, Tag } from "antd";
import { getMyProposals } from "src/core";
import { useRouter } from "next/router";

export const Items = () => {
    const router = useRouter();
    const { account } = useAppSelector(state => state.account);
    const { myProposals } = useAppSelector(state => state.proposal);
    useEffect(() => {
        if (account) {
            getMyProposals();
        }
    }, [account])

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

    const paymentTypeMap = (pt: number) => {
        let ptype = "Instant payout"
        if (!pt) return ptype;
        switch (parseInt(pt.toString())) {
            case 1:
                ptype = "Payout"
                break;
            case 2:
                ptype = "Funding";
                break;
            case 3:
                ptype = "streaming";
                break
            default:
                break;
        }

        return ptype;

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
            case 3:
                st = "completed";
                break
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
            title: 'Type',
            key: 'proposal_type',
            render: (_, record) => (
                <Tag color={colorMap(record.proposalType)}>{paymentTypeMap(record.proposal_type)}</Tag>
            )
        },
        {
            title: "ETH",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag color={colorMap(record.executed ? 2 : record.status)}>{statusMap(record.executed ? 2 : record.status)}</Tag>
            )
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (_, record) => (
                new Date(record.created_at).toLocaleString()
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => {
                    //dispatch(setDaoDetailProps({att: "currentProposal", value: record}))
                    // showDrawerDetail()
                    router.push(`/proposal/${record.dao_address}/${record.id}`)

                }}>Detail</Button>
            )

        },
    ];
    return (
        <Table
            pagination={{
                pageSize: 6,
                position: ["bottomCenter"]
            }}
            dataSource={myProposals}
            columns={columns} />
    )
}