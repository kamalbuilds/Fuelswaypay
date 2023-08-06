import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Space } from "antd";
import { useEffect } from "react";

import { Typography } from 'antd';
import { useRouter } from "next/router";
import { FeatureImageSlides } from "src/components/home/FeatureImageSlides";

const { Title, Text } = Typography;
const { Meta } = Card;

export default function Index() {
    const router = useRouter();

    return (
        <div style={{ maxWidth: 1440, margin: "auto", padding: 10 }}>
            <div style={{ textAlign: "center", maxWidth: 600, margin: "auto" }}>
                <Text style={{ color: "blue" }} strong>OUR BEST FEATURES &#128293;</Text >
                <Title level={2} style={{ fontWeight: 700 }}>Unlocking the Potential of DAOs and Seamless Payments!</Title>
            </div>
            <br />
            <Row gutter={16}>

                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides key={"dao-slides"} imageUrls={["/DAO.png", "/PROPOSAL.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary" onClick={() => router.push("/dao/list")}>VIEW MORE</Button>,
                            <Button size="large" onClick={() => router.push("/dao/new")}>NEW DAO</Button>
                        ]}
                    >
                        <Meta
                            style={{ minHeight: 140 }}
                            title={<Text strong style={{ fontSize: 18 }}>DAO Management</Text>}
                            description="This module grants users the ability to effectively oversee DAOs, treasuries, members, and payment proposals. It can be utilized to manage member payments or provide funding for other DAOs."
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides key={"stream-slides"} imageUrls={["/STREAMS.png", "/STREAM.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary" onClick={() => router.push("/my-account/crypto-streaming/outgoing")}>VIEW MORE</Button>,
                            <Button size="large" onClick={() => router.push("/my-account/crypto-streaming/new")}>NEW STREAM</Button>
                        ]}
                    >
                        <Meta
                            style={{ minHeight: 140 }}
                            title={<Text strong style={{ fontSize: 18 }}>Crypto Streaming</Text>}
                            description="This module offers a solution for salary or wage scheduling, providing transparency to both the sender and recipient regarding the money flow, stream balance changes."
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides key={"channel-slides"} imageUrls={["/CHANNEL.png", "/CLAIM.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary" onClick={() => router.push("/my-account/payment-channel/payer")}>VIEW MORE</Button>,
                            <Button size="large" onClick={() => router.push("/my-account/payment-channel/new")}>NEW CHANNEL</Button>
                        ]}
                    >
                        <Meta
                            style={{ minHeight: 140 }}
                            title={<Text strong style={{ fontSize: 18 }}>Payment Channel</Text>}
                            description="This module facilitates a payment channel between a payer and payee, enabling multiple payments through individual claims, often used for customers making multiple payouts to service or product providers."
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}