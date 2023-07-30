import { Card, Form, Input, Radio } from 'antd';
import { useAppSelector } from 'src/controller/hooks';
import { headStyle } from 'src/theme/layout';

export const KYC = () => {
    const {twitter, github, discord } = useAppSelector(state => state.daoForm);
    return (
        <Card title="Social Networks (KYC)" headStyle={headStyle}>
            <Form.Item name="twitter" initialValue={twitter} label="Twitter" rules={[{ required: false, type: "url" }]}>
                <Input size='large' />
            </Form.Item>

            <Form.Item name="github" initialValue={github} label="Github" rules={[{ required: false, type: "url" }]}>
                <Input size='large' />
            </Form.Item>

            <Form.Item name="discord" initialValue={discord} label="Discord" rules={[{ required: false, type: "url" }]}>
                <Input size='large' />
            </Form.Item>
        </Card>
    )
}
