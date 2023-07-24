
import { CopyOutlined } from "@ant-design/icons";
import { useWallet } from "@suiet/wallet-kit";
import { Button, Table } from "antd";
import { useAppSelector } from "../../../controller/hooks";
import { leaveDao, removeMember as removeMemberAction } from "../../../core";
import { useAddress } from "../../../hooks/useAddress";

export const Members = () => {
    const { dao } = useAppSelector(state => state.daoDetail);
    const wallet = useWallet();
    const { getShortAddress, getFriendlyName } = useAddress();
    const { removeMember, leave } = useAppSelector(state => state.process);
    const { nameMap } = useAppSelector(state => state.name);

    const columns = [
        {
            title: 'Address',
            key: 'address',
            dataIndex: "address",
            render: (_, record) => (

                <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.address)}>
                    {getShortAddress(record.address)}
                </Button>

            )
        },
        {
            title: '.SDAO Name',
            key: 'sdao_name',
            dataIndex: "sdao_name",
            render: (_, record) => {
                let friendlyName = getFriendlyName(nameMap, record.address);
                return (<>
                    {friendlyName ? <Button type="primary">{friendlyName}</Button> : <Button>Unknown</Button>}
                </>
                )
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                if (dao.open && wallet.address === record.address) {
                    return <Button loading={leave.processing} onClick={() => leaveDao(wallet)} danger>Leave</Button>
                } else {
                    return <Button loading={removeMember.processing} onClick={() => removeMemberAction(wallet, record.address)} danger>Remove</Button>
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
                    dao.members.map((address, index) => {
                        return {
                            key: index,
                            address: address
                        }
                    })
                } columns={columns} />
        
    )
}