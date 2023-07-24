
import { Button, Drawer, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { Details } from "../../../components/proposal/Detail";
import { setDaoDetailProps } from "../../../controller/dao/daoDetailSlice";
import { useAppDispatch, useAppSelector } from "../../../controller/hooks";
import { getDaoProposals } from "../../../core";
import { useProposal } from "../../../hooks/useProposal";

export const Proposals = () => {
    const dispatch = useAppDispatch();
    const { proposals, currentProposal, dao } = useAppSelector(state => state.daoDetail);
    // const { convertDataToArray } = useProposal();
    const [openDetail, setOpenDetail] = useState(false);
    const {convertPayoutProposalDataToArray} = useProposal();

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

    const paymentTypeMap = (pt: number) => {
        let ptype = "Instant payout"
        if (!pt) return ptype;
        switch (parseInt(pt.toString())) {
            case 1:
                ptype = "Instant payout"
                break;
            case 2:
                ptype = "Vesting";
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Type',
            key: 'proposalType',
            render: (_, record) => (
                <Tag color={colorMap(record.proposalType)}>{paymentTypeMap(record.proposalType)}</Tag>
            )
        },
        {
            title: "SUI",
            dataIndex: "totalPayout",
            key: "totalPayout"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag color={colorMap(record.executed  ? 2: record.status)}>{statusMap(record.executed ? 2 : record.status)}</Tag>
            )
        },
        {
            title: "Executed",
            dataIndex: "executed",
            key: "executed",
            render: (_, record) => (
                <Tag>{record.executed ? "Yes" : "No"}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => {
                    dispatch(setDaoDetailProps({att: "currentProposal", value: record}))
                    showDrawerDetail()
                }}>Vote</Button>
            )

        },
    ];


    useEffect(() => {
        getDaoProposals(dao);
    }, [dao])

    return (
        <>
           <Table 
           pagination={{
            pageSize: 6
           }}
           dataSource={convertPayoutProposalDataToArray(proposals)} 
           columns={columns} />

             <Drawer title={currentProposal.title} size="large" placement="right" onClose={onCloseDetail} open={openDetail}>
                <Details />
            </Drawer>
        </>
    )
}