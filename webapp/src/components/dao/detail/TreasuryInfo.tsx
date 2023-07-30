import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Statistic, Table } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { useTreasury } from "src/hooks/useTreasury";
import { useAddress } from "src/hooks/useAddress";
import { useEffect } from "react";
import { getContributorFunds } from "src/core";

export const TreasuryInfo = () => {

  const { daoFromDB, daoOnchain, treasury } = useAppSelector(state => state.daoDetail);
  const { getShortAddress } = useAddress();
  const { getFundStatistic } = useTreasury();

  // const { totalFunds, memberFunds, notMemberFunds } = getFundStatistic(dao.contributorFunds, dao.members);
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (index, record) => (
        <Button key={`address-${index}`} type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.address)}>{getShortAddress(record.address)}</Button>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount (ETH)',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  useEffect(() => {
       if (daoFromDB.address) {
        getContributorFunds(0);
       }
  }, [daoFromDB.address])
  return (
    <Card title="Funding History" size="default">
      <Row gutter={8}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Funds"
              value={treasury.reduce((a,b) => a + b.amount, 0)}
              valueStyle={{ color: '#3f8600' }}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Remaining Balance"
              value={daoOnchain.balance}
              valueStyle={{ color: '#3f8600' }}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Whitelist Contributors"
              value={treasury.length}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
      <Divider />
      <Table
        pagination={{
          pageSize: 6
        }}
        dataSource={
          treasury.map(({ address, amount }, i) => {
            return {
              key: `c-${i}`,
              address: address,
              type: "Contributor",
              amount: amount,
            }
          })

        } columns={columns} />

    </Card>
  )
}