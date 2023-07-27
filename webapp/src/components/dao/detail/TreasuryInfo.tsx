import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Statistic, Table } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { useTreasury } from "src/hooks/useTreasury";
import { useAddress } from "src/hooks/useAddress";
import { useEffect } from "react";
import { getContributorFunds } from "src/core";

export const TreasuryInfo = () => {

  const { daoFromDB, treasury } = useAppSelector(state => state.daoDetail);
  const { nameMap } = useAppSelector(state => state.name);
  const { getShortAddress, getFriendlyName } = useAddress();
  const { getFundStatistic } = useTreasury();

  // const { totalFunds, memberFunds, notMemberFunds } = getFundStatistic(dao.contributorFunds, dao.members);
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.address)}>{getShortAddress(record.address)}</Button>
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
        {/* <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total"
              value={totalFunds}
              valueStyle={{ color: '#3f8600' }}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Members"
              value={memberFunds}
              valueStyle={{ color: '#3f8600' }}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Contributors"
              value={notMemberFunds}
              valueStyle={{ color: '#3f8600' }}
              precision={3}
            />
          </Card>
        </Col> */}
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