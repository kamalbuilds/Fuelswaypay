import { Button, Card, Descriptions } from 'antd';
import { useAppSelector } from 'src/controller/hooks';
// import { joinDao } from 'src/core';
import { useRouter } from 'next/router';
import { daoTypeMap } from 'src/core/constant';
import { useAddress } from 'src/hooks/useAddress';
import { headStyle } from 'src/theme/layout';

export const Item = ({ index, dao }) => {
  const router = useRouter();
  const { getShortAddress, getObjectExplorerURL, editDaoLinkWithStatus } = useAddress();
  const { join } = useAppSelector(state => state.process)

  return (
    <Card key={`dao-${index}`} title={dao.title}
      extra={
        <Button type='primary' onClick={() => router.push(editDaoLinkWithStatus(dao))}>View Detail</Button>
      }
      style={{ margin: 5, backgroundColor: "#f5f5f5" }}
      headStyle={headStyle}>

      <Descriptions layout={"vertical"} column={{ xs: 1, md: 2, lg: 2 }}>

        <Descriptions.Item label={"Type"}>{daoTypeMap[dao.dao_type]}</Descriptions.Item>
        <Descriptions.Item label={"Open"}>{dao.open ? "Yes (Open to all)" : "No (Invited members only)"}</Descriptions.Item>
        <Descriptions.Item label={"Description"}>{dao.description}</Descriptions.Item>
        {/* <Descriptions.Item label={"Object ID"}>
        <Space wrap>
          <Button icon={<LinkOutlined />} onClick={() => window.open(getObjectExplorerURL(dao.id), "_blank")}>{getShortAddress(dao.id)}</Button>
          <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(dao.id)}></Button>
        </Space>
        </Descriptions.Item>
        <Descriptions.Item label={"Balance"}>{dao.balance} SUI</Descriptions.Item>
        <Descriptions.Item label={"Members"}>{dao.countMembers}</Descriptions.Item>
        <Descriptions.Item label={"Parent DAO"}>{!dao.parentDao ? "No" : 
        <Space wrap>
        <Button icon={<LinkOutlined />} onClick={() => window.open(getObjectExplorerURL(dao.parentDao), "_blank")}>{getShortAddress(dao.parentDao)}</Button>
        <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(dao.parentDao)}></Button>
        </Space>
        }
        </Descriptions.Item>
        <Descriptions.Item label={"Proposals"}>{dao.countProposals}</Descriptions.Item>
        <Descriptions.Item label={"Created Date"}>{new Date(parseInt(dao.createdDate)).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label={"Type"}>{daoTypeMap[dao.daoType]}</Descriptions.Item>
        <Descriptions.Item label={"Open"}>{dao.open ? "Yes (Open to all)" : "No (Invited members only)"}</Descriptions.Item>
       */}
      </Descriptions>
      {/* <Space wrap>
        <Button type='primary' onClick={() => navigate(`/dao/object/${dao.id}`)}>View Detail</Button>
        {
          dao.open && <Button type='primary' loading={join.processing} onClick={() => joinDao(wallet, dao.id)} ghost>Join</Button>
        }
      </Space> */}
    </Card>
  );
}