import { Col, Divider, Form, Row, Space } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DAOCreationProgress } from "src/components/dao/DAOCreationProgress";

import { General, Governance, KYC, ReviewAndApprove, VotingConfiguration } from "src/components/dao/form";
import { WhitelistContributors } from "src/components/dao/form/WhitelistContributors";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getDaoDetailFromDB, updateDAO } from "src/core";
import { formLayout, formStyle } from "src/theme/layout";

export default function DaoAddress() {
    const {id} = useRouter().query;
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        updateDAO(values);
    };

    useEffect(() => {
        if (id) {
            getDaoDetailFromDB(id, form);
        }
    }, [id])
    return (
        <Form
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
                        <VotingConfiguration />
                        <Governance />
                        <WhitelistContributors />
                        <KYC />
                    </Space>

                </Col>
                <Col span={8}>
                    <ReviewAndApprove form={form} />
                </Col>
            </Row>
        </Form>
    )
}