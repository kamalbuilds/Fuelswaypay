import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Space } from 'antd';
import { headStyle } from 'src/theme/layout';

export const Governance = () => {
    return (
        <Card title="Governance configuration" headStyle={headStyle}>
            <Form.Item name="open" initialValue={1}>
                <Radio.Group>
                    <Radio value={1}>Invited Members Only</Radio>
                    <Radio value={2}>Open to all</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.List name="members" initialValue={[]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    label={`Member (${index + 1})`}
                                    {...restField}
                                    name={[name, 'address']}
                                    rules={[{ required: true, message: 'Missing address' }]}
                                >
                                    <Input size='large' placeholder="Member Address" />
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
