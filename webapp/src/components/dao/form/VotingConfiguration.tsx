import { Card, Form, Input, Radio } from 'antd';
import { setDaoFormProps } from 'src/controller/dao/daoFormSlice';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { headStyle } from "src/theme/layout";

export const VotingConfiguration = () => {
    const {quorum, voting_mode} = useAppSelector(state => state.daoForm)
    const dispatch = useAppDispatch();
    return (
        <Card title="Voting configuration" headStyle={headStyle}>
            <Form.Item name="voting_mode" initialValue={voting_mode}>
                <Radio.Group onChange={(e) => dispatch(setDaoFormProps({att: "voting_mode", value: e.target.value}))}>
                    <Radio value={1}>All-member vote required for proposal execution.</Radio>
                    <Radio value={2}>Above a percentage number</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="quorum" initialValue={quorum} rules={[{ required: voting_mode !== 1, message: 'Missing quorum' }]}>
                <Input type='number' size='large' disabled={voting_mode === 1} placeholder='Percentage Number of Accepted Proposal (quorum)' suffix="%" />
            </Form.Item>
        </Card>
    )
}
