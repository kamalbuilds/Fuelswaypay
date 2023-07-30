import { Alert, Space } from "antd";
import { DAOItems } from "src/components/dao/DAOItems";

export default function List() {
    return (
        <Space direction="vertical">
            <Alert
                message="DAOS"
                description="A DAO (Decentralized Autonomous Organization) is a digital organization run by smart contracts on a blockchain, where decisions and actions are made collectively by its members rather than a central authority. It operates transparently and autonomously, enabling decentralized governance, asset management, and decision-making."
                type="success"
                showIcon
            />

            <DAOItems />
        </Space>
    )
}