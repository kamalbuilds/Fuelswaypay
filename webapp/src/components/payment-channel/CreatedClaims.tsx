import { Collapse, Descriptions, Table, Tag } from "antd";
import { useAppSelector } from "../../controller/hooks";

export const CreatedClaims = () => {

    const { currentClaims } = useAppSelector(state => state.channel);

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

    return (


        currentClaims.map((claim, index) => {
            return (
                <Collapse key={`claim-${index}`} items={[{ 
                    key: '1', 
                    label: claim.title, 
                    children: <Descriptions column={1}>
                    <Descriptions.Item label="Document">{claim.meta_url}</Descriptions.Item>
                    <Descriptions.Item label="Amount">{claim.amount} ETH</Descriptions.Item>
                    <Descriptions.Item label="Signature">{claim.signature}</Descriptions.Item>
                    <Descriptions.Item label="Created At">{claim.created_at}</Descriptions.Item>
                    <Descriptions.Item label="Status">{statusMap(claim.status)}</Descriptions.Item>
                </Descriptions> }]} />
            )
        })


    )
}