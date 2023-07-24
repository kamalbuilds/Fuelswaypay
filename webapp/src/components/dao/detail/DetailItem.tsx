import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Space } from 'antd';
import { DetailItemSekeleton } from 'src/components/common/DetailItemSkeleton';
import { DAO } from 'src/controller/dao/daoSlice';
import { useAppSelector } from 'src/controller/hooks';
import { daoTypeMap } from 'src/core/constant';
import { useAddress } from 'src/hooks/useAddress';
import { headStyle } from 'src/theme/layout';


export const DetailItem = () => {
  const { getShortAddress } = useAddress();
  const { daoFromDB, daoOnchain } = useAppSelector(state => state.daoDetail)

  return (
   <Card title={daoFromDB.title} style={{ backgroundColor: "#f5f5f5" }} headStyle={headStyle}>

      <Descriptions layout={"vertical"} column={{ xs: 1, md: 1, lg: 1 }}>
        <Descriptions.Item label={"Description"}>{daoFromDB.description}</Descriptions.Item>
        <Descriptions.Item label={"Contract ID"}>
          <Space wrap>
            <Button icon={<LinkOutlined />}>{getShortAddress(daoFromDB.address)}</Button>
            <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(daoFromDB.address)}></Button>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={"Created Date"}>{daoOnchain.created_date.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label={"Type"}>{daoTypeMap[daoOnchain.dao_type]}</Descriptions.Item>
        <Descriptions.Item label={"Open"}>{daoOnchain.open ? "Yes (Open to all)" : "No (Invited members only)"}</Descriptions.Item>
        <Descriptions.Item label={"KYC"}>
          {/* {dao.socialLinks.length ? <Space wrap direction='vertical'>
            {dao.socialLinks.map((s) => <a key={`social-link-index`} href={s}>{s}</a>)}
          </Space> : <>No</>} */}
        </Descriptions.Item>
      </Descriptions>
      {/* <Space wrap>
        {
          dao.open && <Button type='primary' loading={join.processing} onClick={() => joinDao(wallet, dao.id)} ghost>Join</Button>
        }
      </Space> */}
    </Card>
  );
}