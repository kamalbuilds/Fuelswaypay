import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Radio, Row, Select, Space } from 'antd';
import { AiOutlineWallet } from 'react-icons/ai';
import { headStyle } from 'src/theme/layout';

export const WhitelistContributors = () => {
    return (
        <Card title="Whitelist Contributors" headStyle={headStyle}>
            <Alert showIcon type='success' message={`The whitelist contributors consist of a list of addresses and contract IDs authorized to fund this DAO. If anyone else attempts to call the "send fund" function, that action will result in failure and will not be executed. The maximum number of contributors that can be added during this initialization phase is 5.`}/>
            <br />
            <Form.List name="whitelist" initialValue={[]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => (
                            <Row key={key} style={{ display: 'flex', marginBottom: 8, width: "100%" }} gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label={`Contributor (${index + 1})`}
                                        {...restField}
                                        name={[name, 'address']}
                                        rules={[{ required: true, message: 'Missing address' }]}
                                    >
                                        <Input addonBefore={<AiOutlineWallet />} size='large' placeholder="Address or Contract Id" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={`Type`}
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
                                </Col>
                                <Col span={4}>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Col>

                            </Row>
                        ))}
                        <Form.Item>
                            <Button type="dashed" disabled={fields.length >= 5} onClick={() => fields.length < 5 ? add() : {}} block icon={<PlusOutlined />}>
                                Add contributor
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Card>
    )
}
