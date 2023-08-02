import { Alert, Button, Card, Collapse, Descriptions, Divider, Form, Input, Space } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { createChannel as createChannelAction } from "src/core";
import { AiOutlineWallet } from "react-icons/ai";
import { ChannelCreationProgress } from "./ChannelCreationProgress";

export const NewChannel = () => {
    const { createChannel } = useAppSelector(state => state.process)
    const { status } = useAppSelector(state => state.createChannel)

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
        createChannelAction(values);
    };

    const channelSettingsGuide = () => {
        return (
            <Descriptions column={1} layout="vertical">
                <Descriptions.Item>
                    This feature enables users to establish a payment channel between a payer and a payee,
                    facilitating multiple payments through individual claims.
                    It is commonly utilized when customers need to make multiple payouts to service or product providers,
                    similar to processing invoices in a traditional context.
                </Descriptions.Item>
            </Descriptions>
        )
    }
    return (
        <Form onFinish={onFinish} style={{ maxWidth: 600, margin: "auto" }} layout="vertical">

            <Alert
                message="Payment Channel"
                description={<p>A payment channel has been established between the payer and payee, enabling the payee to withdraw money from the channel multiple times. Each withdrawal is secured by a claim containing a signed signature from the payer. <br/><br/>This payment channel setup reduces transaction fees for the payer, and the payee is responsible for paying the transaction fees. This method facilitates micro payments on the blockchain, making small transactions more efficient and cost-effective.</p>}
                type="success"
                showIcon
            />

            <br />
            <ChannelCreationProgress />
            <br />
            <Card size="default" title="Settings">
                <Form.Item name="title" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input size={"large"} placeholder="Title" />
                </Form.Item>
                <Form.Item name="description" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input.TextArea size={"large"} placeholder="Description" />
                </Form.Item>
                <Form.Item name="payee" rules={[{ required: true, message: 'Missing payee address' }]}>
                    <Input addonBefore={<AiOutlineWallet />} size={"large"} placeholder="Payee address" />
                </Form.Item>
            </Card>
            <Divider />
            <Collapse
                items={[{ key: '1', label: 'How to use payment channel?', children: channelSettingsGuide() }]}
            />
            <Divider />
            <Form.Item>
                {
                    status === 0 && <Button type="primary" htmlType="submit" loading={createChannel.processing}>
                        Deploy Channel Onchain
                    </Button>
                }
                {
                    status === 1 && <Button type="primary" htmlType="submit" loading={createChannel.processing}>
                        Initialize Channel
                    </Button>
                }
                {
                    status === 2 && <Space style={{ width: "100%" }} direction="vertical">
                        <Alert style={{ width: "100%" }} message="Your Channel is deployed onchain" type="success" />
                    </Space>
                }
            </Form.Item>
        </Form>
    )
}