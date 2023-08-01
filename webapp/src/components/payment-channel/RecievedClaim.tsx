import { Alert, Button, Collapse, Descriptions, Divider, Space, Tag } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { acceptClaim as acceptClaimAction, rejectClaim as RejectClaimAction } from "src/core";

export const RecievedClaims = () => {

    const { currentClaims } = useAppSelector(state => state.channel);
    const { acceptClaim } = useAppSelector(state => state.process);

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
        <Space direction={"vertical"} style={{width: "100%"}}> {
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
                                    <Button disabled={claim.status !== 1} type="primary" loading={acceptClaim.processing} onClick={() => acceptClaimAction(claim)}>Accept</Button>
                                    <Button disabled={claim.status !== 1}>Reject</Button>
                                </Space.Compact>
                            </Descriptions.Item>

                        </Descriptions>
                    }]} />
                )
            })
        }
        </Space>

    )
}