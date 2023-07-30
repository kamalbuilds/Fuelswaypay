import { Alert, Button, Collapse, Descriptions, Space, Tag } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { acceptClaim as acceptClaimAction, rejectClaim as RejectClaimAction } from "src/core";

export const RecievedClaims = () => {

    const { currentClaims } = useAppSelector(state => state.channel);
    const {acceptClaim} = useAppSelector(state => state.process);
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
            case 3:
                st = "rejected";
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
                    children: <Descriptions column={1} layout="vertical">
                        <Descriptions.Item label="Document">
                            <a href={claim.meta_url} target="_blank">Document Link</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount">{claim.amount} ETH</Descriptions.Item>
                        <Descriptions.Item label="Signature">
                            <Alert type="info" showIcon={false} message={claim.signature} />                        
                            </Descriptions.Item>
                        <Descriptions.Item label="Created At">{new Date(claim.created_at).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Status"><Tag color="blue">{statusMap(claim.status)}</Tag></Descriptions.Item>
                        <Descriptions.Item>
                            <Space.Compact block>
                                <Button type="primary" loading={acceptClaim.processing} onClick={() => acceptClaimAction(claim)}>Accept</Button>
                                <Button>Reject</Button>
                            </Space.Compact>
                        </Descriptions.Item>

                    </Descriptions>
                }]} />
            )
        })





    )
}