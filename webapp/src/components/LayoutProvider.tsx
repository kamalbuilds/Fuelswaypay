import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    GithubOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TwitterOutlined
} from '@ant-design/icons';

import { AiOutlineDashboard } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import { LiaDiscord } from "react-icons/lia";
import { MdOutlineWaterDrop } from "react-icons/md";
import { TfiLoop } from "react-icons/tfi";

import { Button, Form, Image, Layout, Menu, Space, theme } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from "react";
import AutoSearch from './common/AutoSearch';
import { ConnectButton } from './common/ConnectButton';
const { Header, Sider, Content, Footer } = Layout;

interface Props {
    children: React.ReactNode | React.ReactNode[];
}

export const LayoutProvider = (props: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onSearch = (value: string) => console.log(value);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} style={{ background: colorBgContainer }}>
                <div style={{ height: 50, margin: 16 }}>
                    {
                        !collapsed ? <Image src={"/logo.png"} alt="dpay" preview={false} width={150} /> : <Image src={"/ICON.png"} alt="dpay" preview={false} width={50} height={50} />
                    }
                </div>

                <Menu
                    inlineIndent={10}
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <HomeOutlined />,
                            label: "Home",
                            onClick: () => { }
                        },
                        {
                            key: '2',
                            icon: <AppstoreOutlined />,
                            label: "All DAOs",
                            onClick: () => router.push("/dao/list")
                        },
                        {
                            key: '3',
                            icon: <AppstoreAddOutlined />,
                            label: "New DAO",
                            onClick: () => router.push("/dao/new")
                        },
                        { type: 'divider' },
                        {
                            key: '4',
                            type: "group",
                            label: !collapsed ? 'My Account' : '',
                            children: [
                                {
                                    key: '5',
                                    label: "Dashboard",
                                    icon: <AiOutlineDashboard />,
                                    onClick: () => router.push("/my-account")
                                },
                                {
                                    key: '6',
                                    label: "Batch Payment",
                                    icon: <GrGroup />
                                },
                                {
                                    key: '7',
                                    label: "Crypto Streaming",
                                    icon: <MdOutlineWaterDrop />,
                                    children: [
                                        {
                                            key: '7_1',
                                            label: "New Stream",
                                            onClick: () => router.push("/my-account/crypto-streaming/new")
                                        },
                                        {
                                            key: '7_2',
                                            label: "Outgoing",
                                            onClick: () => router.push("/my-account/crypto-streaming/outgoing")
                                        },
                                        {
                                            key: '7_3',
                                            label: "Incoming",
                                            onClick: () => router.push("/my-account/crypto-streaming/incoming")
                                        },
                                    ]

                                },
                                {
                                    key: '8',
                                    label: "Payment Channel",
                                    icon: <TfiLoop />,
                                    children: [
                                        {
                                            key: '8_1',
                                            label: "New channel",
                                            onClick: () => router.push("/my-account/payment-channel/new")
                                        },
                                        {
                                            key: '8_2',
                                            label: "Payer's channels",
                                            onClick: () => router.push("/my-account/payment-channel/payer")
                                        },
                                        {
                                            key: '8_3',
                                            label: "Payee's channels",
                                            onClick: () => router.push("/my-account/payment-channel/payer")
                                        },
                                    ]
                                }
                            ]
                        },
                        { type: "divider" },
                        {
                            key: "9",
                            type: "group",
                            label: !collapsed ? 'SWAYPAY v1.0.0' : "",
                            children: [
                                {
                                    key: '11',
                                    icon: <GithubOutlined />,
                                    label: 'Github',
                                    onClick: () => window.open("https://github.com/a2nfinance/swaypay", "_blank")
                                },
                                {
                                    key: '12',
                                    icon: <TwitterOutlined />,
                                    label: 'Twitter',
                                    onClick: () => window.open("https://twitter.com/swaypay", "_blank")
                                },
                                {
                                    key: '13',
                                    icon: <LiaDiscord />,
                                    label: 'Discord',
                                    onClick: () => window.open("https://twitter.com/swaypay", "_blank")
                                },
                            ]
                        }
                    ]}
                />
            </Sider>
            <Layout>

                <Header //@ts-ignore
                    style={{ padding: 0, backgroundColor: colorBgContainer }}>
                    <Space align="center" style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Form layout="inline">

                            <Form.Item >


                                <AutoSearch />
                            </Form.Item>

                            {/* <Form.Item>
                                <Switch checkedChildren={<Image src={"/light.svg"} width={16} height={16} alt="Light"/>}
                                 
                                    unCheckedChildren={<Image src={"/dark.svg"} width={16} height={16} alt="Dark"/>}
                                    defaultChecked />
                            </Form.Item> */}
                            <Form.Item>
                                <ConnectButton />
                            </Form.Item>
                        </Form>



                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        boxSizing: "border-box",
                        background: colorBgContainer
                    }}
                >
                    {props.children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>SWAYPAY ©2023 Created by A2N Finance</Footer>
            </Layout>
        </Layout>
    )

}
