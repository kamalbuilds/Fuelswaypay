import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space, Switch } from "antd";
import { useRef } from "react";
import { AiOutlineWallet } from "react-icons/ai";
import { useAppSelector } from "src/controller/hooks";
import { createPayoutProposal } from "src/core";

export const NewPayout = () => {
    const { createProposal } = useAppSelector(state => state.process)
    const editorRef = useRef(null);
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        let correctedValues = { ...values, allow_early_execution: values.allow_early_execution === 1 ? true : false };
        createPayoutProposal(correctedValues);
    };

    const defaultContent = "Your proposal content here";
    return (
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ proposal_type: 1, allow_early_execution: 1, content: `<p>${defaultContent}</p>` }}
            layout="vertical">
            <Card title="General">
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input size={"large"} placeholder="Title" />
                </Form.Item>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label="Start Time" name="start_date" rules={[{ required: true, message: 'Missing start date' }]}>
                            <Input size="large" type="datetime-local" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="End Time" name="end_date" rules={[{ required: true, message: 'Missing end date' }]}>
                            <Input size="large" type="datetime-local" />
                        </Form.Item>
                    </Col>

                </Row>


            </Card>
            <Divider />
            <Card title="Execution Settings">
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item required={true} label="Proposal type" name="proposal_type" rules={[{ required: true, message: 'Missing proposal type' }]}>
                            <Select size="large" options={[
                                { label: "Payout to an user", value: 1 },
                                { label: "Funding another DAO", value: 2 }
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item required={true} label="Allow early exection" name="allow_early_execution">
                            <Select size="large" options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 2 }
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

            </Card>
            <Divider />
            <Card title="Recipient">

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label="Address or Contract ID" name="recipient" rules={[{ required: true, message: 'Address or Contract ID' }]}>
                            <Input size="large" placeholder="Address" addonBefore={<AiOutlineWallet />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Missing amount' }]}>
                            <Input size="large" type="number" suffix="ETH" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Divider />
            <Card size="default" title="Description">
                <Form.Item label="Content" name="content" noStyle>
                    <Input size={"large"} placeholder="Content" type="hidden" />
                </Form.Item>

                <Editor
                    apiKey='1n11uzr2bd1kkoxh5dtycsp075phj3ivlopf4veknfhgxfyo'
                    onChange={() => form.setFieldValue("content", editorRef.current.getContent())}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={`<p>${defaultContent}</p>`}
                    init={{
                        height: 350,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                <br />
                <Form.Item label="Content referrence" initialValue={1} name="content_type" rules={[{ required: true, message: 'Missing content type' }]}>
                    <Select size="large" options={[
                        { label: "No", value: 1 },
                        { label: "From a Github issue", value: 2 }
                    ]} />
                </Form.Item>

                <Form.Item label="Proposal Discussion URL" name="external_url">
                    <Input size="large" placeholder="Proposal Discussion URL" />
                </Form.Item>
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