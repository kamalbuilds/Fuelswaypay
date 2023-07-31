
import { Alert, Button, Card, Descriptions, Divider, Form, FormInstance, Space, Tag } from "antd";
import { useRouter } from "next/router";
import { useAppSelector } from "src/controller/hooks";
import { deployDAO as deployDAOAction, initializeDAO as initializeDAOAction} from "src/core";
import { useAddress } from "src/hooks/useAddress";
import { headStyle } from "src/theme/layout";

export const ReviewAndApprove = ({ form }: { form: FormInstance<any> }) => {
    const router = useRouter();
    const { quorum, status, address, _id } = useAppSelector(state => state.daoForm);
    const { createDao, deployDao, initializeDao } = useAppSelector(state => state.process);
    const { getShortAddress } = useAddress();

    return (
        <Card title="Summary" headStyle={headStyle}>
            <Descriptions layout={"vertical"} column={{ xs: 1, lg: 1 }}>
                <Descriptions.Item label={"Title"}>{form.getFieldValue("title")}</Descriptions.Item>
                <Descriptions.Item label={"Description"}>{form.getFieldValue("description")}</Descriptions.Item>
                <Descriptions.Item label={"Governance"}>{form.getFieldValue("open") ? "Open to all" : "Invited Member Only"}</Descriptions.Item>
                <Descriptions.Item label={"Voting Configuration"}>{form.getFieldValue("quorum") === 100 ? "All-member vote required for proposal execution." : `Above ${quorum} %`}</Descriptions.Item>
                <Descriptions.Item label={"Members"} contentStyle={{ display: "block" }}>

                    {
                        form.getFieldValue("members").map((member, index) => {
                            return (

                                <Tag key={`address-${index}`} color="blue" style={{ marginBottom: "5px" }}>{getShortAddress(member?.address ?? "")}</Tag>

                            )

                        })
                    }

                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Form.Item>
                {
                    (status === undefined) && <Button type="primary" htmlType="submit" size="large" loading={createDao.processing}>
                        Save & Continue
                    </Button>
                }
                {
                    (status == -1) && <Space  style={{width: "100%"}}>
                        <Button type="primary" htmlType="submit" size="large" loading={createDao.processing}>
                            Update
                        </Button>
                        <span>or</span>
                        <Button type="primary" htmlType="button" size="large" onClick={() => deployDAOAction("dao", form)} loading={deployDao.processing}>
                            Deploy DAO onchain
                        </Button>
                    </Space>
                }
                {
                    (status == 0) && <Space  style={{width: "100%"}}>
                        <Button type="primary"  style={{width: "100%"}} htmlType="button" size="large" onClick={() => initializeDAOAction(address, form)} loading={initializeDao.processing}>
                            Initialize DAO
                        </Button>
                    </Space>
                }
                {
                    (status == 1) && <Space  style={{width: "100%"}}  direction="vertical">
                        <Alert style={{width: "100%"}} message="Your DAO is deployed onchain" type="success" />
                        <Button  style={{width: "100%"}}  type="primary" htmlType="button" size="large" onClick={() => router.push(`/dao/onchain/${_id}`)}>
                            View your DAO
                        </Button>
                    </Space>
                }

            </Form.Item>
        </Card>
    )
}
