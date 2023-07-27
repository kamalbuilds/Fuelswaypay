import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Select, Space } from 'antd';
import { headStyle } from 'src/theme/layout';

export const WhitelistContributors = () => {
    return (
        <Card title="Whitelist Contributors" headStyle={headStyle}>
            {/* <Form.Item name="whitelist_mode">
                <Radio.Group>
                    <Radio value={1}>Members Only</Radio>
                    <Radio value={2}>Predefined List</Radio>
                </Radio.Group>
            </Form.Item> */}
            <Form.List name="whitelist" initialValue={[]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8, width: "100%" }} align="baseline">
                                <Form.Item
                                    label={`Contributor (${index + 1})`}
                                    {...restField}
                                    name={[name, 'address']}
                                    rules={[{ required: true, message: 'Missing address' }]}
                                >
                                    <Input size='large' placeholder="Member Address" />
                                </Form.Item>
                                <Form.Item
                                    label={`Type (${index + 1})`}
                                    {...restField}
                                    name={[name, 'type']}
                                    initialValue={1}
                                    rules={[{ required: true, message: 'Missing Type' }]}
                                >
                                    <Select size='large' options={[
                                        {
                                            label: "Address",
                                            value: 1
                                        },
                                        {
                                            label: "Contract Id",
                                            value: 2
                                        }
                                    ]} />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add member
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Card>
    )
}
