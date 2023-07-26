import { Card, Form, Input, Radio } from 'antd';
import { useAppSelector } from 'src/controller/hooks';
import { headStyle } from 'src/theme/layout';

export const General = () => {

    return (
        <Card title="Pick a DAO type and name it" headStyle={headStyle}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Missing title' }]}>
                <Input size='large' />
            </Form.Item>
            <Form.Item name="description"  label="Description" rules={[{ required: true, message: 'Missing description' }]}>
                <Input.TextArea size='large' />
            </Form.Item>

            <Form.Item name="dao_type">
                <Radio.Group>
                    <Radio value={1}>Membership DAO (Multisig)</Radio>
                    <Radio disabled value={2}>Token-based DAO (coming soon)</Radio>
                </Radio.Group>
            </Form.Item>
            <p><strong>Membership DAO (Multisig):</strong> Small organization with a few members who are likely to stick around. Members can be added and removed by a vote of existing members.</p>
            <p><strong>Token-based DAO:</strong> Fluid organization with many members who can join and leave as they wish. Members can alter their governance power and participation by exchanging tokens.</p>
        </Card>
    )
}
