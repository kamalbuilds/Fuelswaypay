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
            <div style={{textAlign: "center", maxWidth: 600, margin: "auto"}}>
                <Text style={{color: "blue"}} strong>OUR BEST FEATURES &#128293;</Text >
                <Title level={2} style={{fontWeight: 700}}>Unleash your full finance potential with our best features</Title>
            </div>
            <br/>
            <Row gutter={16}>

                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides imageUrls={["/DAO.png", "/STREAM.png"]}/>
                        }
                        actions={[
                            <Button size="large" type="primary">VIEW MORE</Button>,
                            <Button size="large">NEW DAO</Button>
                        ]}
                    >
                        <Meta
                            title={<Text strong style={{fontSize: 18}}>DAO Management</Text>}
                            description="This module empowers users to efficiently manage DAOs, treasuries, members, and payment proposals."
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                           <FeatureImageSlides imageUrls={["/STREAM.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary">VIEW MORE</Button>,
                            <Button size="large">NEW STREAM</Button>
                        ]}
                    >
                        <Meta
                            title={<Text strong style={{fontSize: 18}}>Crypto Streaming</Text>}
                            description="This module offers a solution for salary or wage scheduling, providing transparency to both the sender and recipient regarding the money flow, stream balance changes."
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides imageUrls={["/CHANNEL.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary">VIEW MORE</Button>,
                            <Button size="large">NEW CHANNEL</Button>
                        ]}
                    >
                        <Meta
                              title={<Text strong style={{fontSize: 18}}>Payment Channel</Text>}
                            description="This module enables users to establish a payment channel between a payer and a payee, facilitating multiple payments through individual claims."
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}