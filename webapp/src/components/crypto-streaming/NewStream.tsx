import { Alert, Button, Card, Col, Collapse, Descriptions, Divider, Form, Input, Row, Select, Space } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { createStream as createStreamAction } from "src/core";
import { AiOutlineWallet } from "react-icons/ai";
import { StreamCreationProcess } from "./StreamCreationProgress";

export const NewStream = () => {
    const { createStream } = useAppSelector(state => state.process);
    const { status } = useAppSelector(state => state.createStream);

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
        createStreamAction(values);
    };

    const previlegeOptions = [
        { label: "Sender", value: 1 },
        { label: "Recipient", value: 2 },
        { label: "Both", value: 3 },
        { label: "None", value: 4 }
    ];

    const payoutSettingsGuide = () => {
        return (
            <Descriptions title="Payout Settings" column={1} layout="vertical">
                <Descriptions.Item label="Address">Recipient Address</Descriptions.Item>
                <Descriptions.Item label="Amount">The amount of ETH that will be unlocked with each occurrence</Descriptions.Item>
                <Descriptions.Item label="Release frequency">Refers to the duration (seconds) between two occurrences of unlocks.</Descriptions.Item>
                <Descriptions.Item label="Number of unlocks">The maximum number of unlocks allowed.</Descriptions.Item>
                <Descriptions.Item label="Example">If the amount is 0.1, the release frequency is 5 seconds, and the number of unlocks is 4, it implies that every 5 seconds, the stream will unlock 0.1 ETH, and this process will occur 4 times.</Descriptions.Item>
            </Descriptions>
        )
    }
    return (
        <Form onFinish={onFinish} style={{ maxWidth: 600, margin: "auto" }} layout="vertical">
            <Alert
                message="Crypto Streaming"
                description="Token amount will be released every second. Recipient or Member can executed the proposal multitime, each calculated amount of token will be sent to each recipient"
                type="success"
                showIcon
            />

            <br />
            <StreamCreationProcess />
            <br />
            <Card title="General Settings" >
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input size={"large"} placeholder="Title" />
                </Form.Item>
                <Form.Item label="Start Date" name="start_date" rules={[{ required: true, message: 'Missing start time' }]}>
                    <Input size={"large"} type="datetime-local" />
                </Form.Item>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name={"cancel_previlege"} label="Cancel Previlege" initialValue={1}>
                            <Select size={"large"} options={previlegeOptions} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={"transfer_previlege"} label="Transfer Previlege" initialValue={1}>
                            <Select size={"large"} options={previlegeOptions} />
                        </Form.Item>
                    </Col>

                </Row>
            </Card>
            <Divider />
            <Collapse
                items={[{ key: '1', label: 'Payout Settings Guide', children: payoutSettingsGuide() }]}
            />
            <Divider />
            <Card title="Payout Settings">
                <Row gutter={12}>
                    <Col span={24}>
                        <Form.Item
                            label="Wallet Address"
                            name={'recipient'}
                            rules={[{ required: true, message: 'Missing address' }]}
                        >
                            <Input size='large' placeholder="Address" addonBefore={<AiOutlineWallet />} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Unlock Number"
                            name={'unlock_number'}
                            rules={[{ required: true, message: 'Number of unlocks' }]}
                        >
                            <Input size='large' type="number" placeholder="Number of unlocks" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={"Amount per Time"}
                            name={'unlock_amount_each_time'}
                            rules={[{ required: true, message: 'Missing amount' }]}
                        >
                            <Input size='large' type="number" placeholder="Amount" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Space direction="horizontal">
                            <Form.Item
                                label="Unlock Every"
                                name={'unlock_every'}
                                rules={[{ required: true, message: 'Missing frequency' }]}
                            >
                                <Input size='large' type="number" placeholder="Release frequency in seconds" />

                            </Form.Item>
                            <Form.Item label=" " initialValue={1} name={'unlock_every_type'}>
                                <Select size="large" options={[
                                    { label: "Seconds", value: 1 },
                                    { label: "Minutes", value: 2 },
                                    { label: "Hours", value: 3 },
                                    { label: "Days", value: 4 },
                                    { label: "Weeks", value: 5 },
                                    { label: "Month", value: 6 },
                                    { label: "Year", value: 7 },
                                ]} />
                            </Form.Item>
                        </Space>

                    </Col>



                    <Col span={12}>
                        <Form.Item
                            label={"Prepaid"}
                            name={'prepaid'}
                            rules={[{ required: true, message: 'Number of unlocks' }]}
                        >
                            <Input size='large' type="number" placeholder="Prepaid" addonAfter="ETH" />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />


            </Card>
            <Divider />
            <Form.Item>
                {
                    status === 0 && <Button type="primary" htmlType="submit" loading={createStream.processing}>
                        Deploy Stream Onchain
                    </Button>
                }
                {
                    status === 1 && <Button type="primary" htmlType="submit" loading={createStream.processing}>
                        Initialize Stream
                    </Button>
                }
                {
                    status === 2 && <Space style={{ width: "100%" }} direction="vertical">
                        <Alert style={{ width: "100%" }} message="Your Stream is deployed onchain" type="success" />
                    </Space>
                }
            </Form.Item>
        </Form>
    )
}