
import { CopyOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getMembers } from "src/core";
import { removeMember as removeMemberAction } from "src/core";
import { useAddress } from "src/hooks/useAddress";

export const Members = () => {
    const { daoFromDB, members } = useAppSelector(state => state.daoDetail);
    const {account} = useAppSelector(state => state.account);
    const { getShortAddress } = useAddress();
    const { removeMember, leave } = useAppSelector(state => state.process);
    useEffect(() => {
        if (daoFromDB.address) {
            getMembers(0)
        }
    
    }, [daoFromDB.address])

    const columns = [
        {
            title: 'Address',
            key: 'address',
            dataIndex: "address",
            render: (_, record) => (

                <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.address)}>
                    {getShortAddress(record.address)}
                </Button>

            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                if (daoFromDB.open && account === record.address) {
                    return <Button loading={leave.processing} onClick={() => {}} danger>Leave</Button>
                } else {
                    return <Button loading={removeMember.processing} onClick={() => removeMemberAction(record.address)} danger>Remove</Button>
                }

            }

        },
    ];

    return (
      
            <Table
                pagination={{
                    pageSize: 6
                }}
                dataSource={
                    members.map((address, index) => {
                        return {
                            key: index,
                            address: address
                        }
                    })
                } columns={columns} />
        
    )
}