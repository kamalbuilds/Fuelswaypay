import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Divider, Form, Input, Space } from "antd";
import { AiOutlineWallet } from "react-icons/ai";
import { useAppSelector } from "src/controller/hooks";
import { doBatch } from "src/core";
import { headStyle } from "src/theme/layout";

export const BatchForm = () => {
    const { createBatchPayment } = useAppSelector(state => state.process)

    const onFinish = (values: any) => {
        doBatch(values);
    };
    return (
        <Form onFinish={onFinish} initialValues={{
            recipients: [
                { address: "", amount: "" },
                { address: "", amount: "" },
                { address: "", amount: "" },
            ]
        }}>
            <Alert
                message="Batch Payments"
                description="This feature is experimental and functional but contains some inaccuracies. Instead of signing only once for multiple transfers, you are required to sign each time you make a payment."
                type="warning"
                showIcon
            />
            <br />
            <Card size="default" headStyle={headStyle} title="RECIPIENTS">
                <Form.List name="recipients">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'address']}
                                        rules={[{ required: true, message: 'Missing address' }]}
                                    >
                                        <Input addonBefore={<AiOutlineWallet />} size='large' placeholder="Address" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'amount']}
                                        rules={[{ required: true, message: 'Missing amount' }]}
                                    >
                                        <Input size='large' type="number" addonAfter={"ETH"} placeholder="Amount" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" size="large" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Recipient
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

            </Card>
            <Divider />
            <Button size="large" style={{ width: "100%" }} htmlType="submit" type="primary" loading={createBatchPayment.processing}>
                Transfer
            </Button>
        </Form>
    )
}