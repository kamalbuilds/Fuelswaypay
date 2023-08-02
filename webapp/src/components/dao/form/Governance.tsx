import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Radio, Row, Space } from 'antd';
import { AiOutlineWallet } from 'react-icons/ai';
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
                            <Row key={key} style={{ display: 'flex', marginBottom: 8}}>
                                <Col span={20}>
                                <Form.Item
                                    label={`Member (${index + 1})`}
                                    {...restField}
                                    name={[name, 'address']}
                                    rules={[{ required: true, message: 'Missing address' }]}
                                >
                                    <Input size='large' addonBefore={<AiOutlineWallet />} placeholder="Member Address" />
                                </Form.Item>
                                </Col>
                                <Col span={4}>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                                </Col>
                               
                                
                            </Row>
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
