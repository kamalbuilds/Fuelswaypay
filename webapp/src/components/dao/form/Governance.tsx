import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Radio, Row, Space } from 'antd';
import { AiOutlineWallet } from 'react-icons/ai';
import { headStyle } from 'src/theme/layout';

export const Governance = () => {
    return (
        <Card title="Governance configuration" headStyle={headStyle}>
            <Alert showIcon type='success' message={"The maximum number of members that can be added during this initialization phase is 5."} />
            <br/>
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
                            <Button type="dashed" disabled={fields.length >= 5} onClick={() => fields.length < 5 ? add() : {}} block icon={<PlusOutlined />}>
                                Add member
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Card>
    )
}
