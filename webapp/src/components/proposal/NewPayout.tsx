import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Select, Space, Switch } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { createPayoutProposal } from "src/core";

export const NewPayout = () => {
    const { createProposal } = useAppSelector(state => state.process)

    const onFinish = (values: any) => {
        // console.log('Received values of form:', values);
        createPayoutProposal(values);
    };
    return (
        <Form onFinish={onFinish} layout="vertical">
            <Card size="small" title="General">
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input size={"large"} placeholder="Title" />
                </Form.Item>
                <Form.Item label="Content" name="content" rules={[{ required: true, message: 'Missing content' }]}>
                    <Input size={"large"} placeholder="Content" />
                </Form.Item>
                <Form.Item label="Content source" initialValue={1} name="content_type" rules={[{ required: true, message: 'Missing content type' }]}>
                    <Select options={[
                        { label: "Simple Text", value: 1 },
                        { label: "From a Github issue", value: 2 }
                    ]} />
                </Form.Item>

            </Card>
            <Divider />
            <Card size="small" title="Time Settings">
                <Space wrap>
                    <Form.Item label="Start Time" name="start_date" rules={[{ required: true, message: 'Missing start date' }]}>
                        <Input type="datetime-local" />
                    </Form.Item>
                    <Form.Item label="Stop Time" name="end_date" rules={[{ required: true, message: 'Missing end date' }]}>
                        <Input type="datetime-local" />
                    </Form.Item>
                </Space>
            </Card>
            <Divider />
            <Card size="small" title="Execution Settings">

                <Form.Item required={true} label="Proposal type" name="proposal_type" initialValue={1} rules={[{ required: true, message: 'Missing proposal type' }]}>
                    <Select defaultValue={1} options={[
                        { label: "Payout", value: 1 },
                        { label: "Funding another DAO", value: 2 }
                    ]} />
                </Form.Item>
                <Form.Item required={true} label="Allow early exection" name="allow_early_execution" initialValue={true}>
                    <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
                </Form.Item>


            </Card>
            <Divider />
            <Card size="small" title="Recipient">

                <Space wrap>
                    <Form.Item label="Address or Contract ID" name="recipient" rules={[{ required: true, message: 'Address or Contract ID' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Missing amount' }]}>
                        <Input type="number" />
                    </Form.Item>
                </Space>
            </Card>
            <Divider />
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={createProposal.processing}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}