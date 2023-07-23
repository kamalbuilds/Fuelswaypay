import { Col, Divider, Form, Row, Space } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DAOCreationProgress } from "src/components/dao/DAOCreationProgress";

import { General, Governance, KYC, ReviewAndApprove, VotingConfiguration } from "src/components/dao/form";
import { convertStepForm } from "src/controller/dao/daoFormSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getDaoDetailFromDB, updateDAO } from "src/core";
import { formLayout, formStyle } from "src/theme/layout";

export default function DaoAddress() {
    const {id} = useRouter().query;
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const {daoForm} = useAppSelector(state => state);
    const onFinish = (values: any) => {
        dispatch(convertStepForm(values));
        updateDAO();
    };

    useEffect(() => {
        if (id) {
            getDaoDetailFromDB(id, form);
        }
    }, [id])
    return (
        <Form
            initialValues={{title: "Demo"}}
            form={form}
            layout="vertical"
            {...formLayout}
            name="dao_from"
            onFinish={onFinish}
            style={formStyle}
            autoComplete="off"
        >
            <DAOCreationProgress />
            <Divider />
            <Row gutter={16}>
                <Col span={16}>

                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <General />
                        <KYC />
                        <Governance />
                        <VotingConfiguration />
                    </Space>

                </Col>
                <Col span={8}>
                    <ReviewAndApprove form={form} />
                </Col>
            </Row>
        </Form>
    )
}