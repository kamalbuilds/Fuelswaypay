import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Statistic, Table } from "antd";
import { useAppSelector } from "../../../controller/hooks";
import { useTreasury } from "../../../hooks/useTreasury";
import { useAddress } from "../../../hooks/useAddress";

export const TreasuryInfo = () => {

  const { dao } = useAppSelector(state => state.daoDetail);
  const { nameMap } = useAppSelector(state => state.name);
  const { getShortAddress, getFriendlyName } = useAddress();
  const { getFundStatistic } = useTreasury();

  const { totalFunds, memberFunds, notMemberFunds } = getFundStatistic(dao.contributorFunds, dao.members);
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
      title: '.SDAO Name',
      key: 'contributor_sdao_name',
      dataIndex: "contributor_sdao_name",
      render: (_, record) => {
        let friendlyName = getFriendlyName(nameMap, record.address);
        return (<>
          {friendlyName ? <Button type="primary">{friendlyName}</Button> : <Button>Unknown</Button>}
        </>
        )
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount (SUI)',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <Card title="Funding History" size="default">
      <Row gutter={8}>
        <Col span={8}>
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
        </Col>
      </Row>
      <Divider />
      <Table
        pagination={{
          pageSize: 6
        }}
        dataSource={
          dao.contributorFunds.map(({ address, amount }, i) => {
            return {
              key: `c-${i}`,
              address: address,
              type: dao.members.indexOf(address) !== -1 ? "Member" : "Contributor",
              amount: amount,
            }
          })

        } columns={columns} />;

    </Card>
  )
}