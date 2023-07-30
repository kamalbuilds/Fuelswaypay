import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Drawer, Dropdown, Input, MenuProps, Popover, Row, Space, Statistic } from 'antd';
import { useCallback, useState } from 'react';
import { AiOutlineWallet } from 'react-icons/ai';
import { NewPayout } from 'src/components/proposal/NewPayout';
import { useAppSelector } from 'src/controller/hooks';
import { addMember as addMemberAction, fundDao } from 'src/core';

export const DaoStatistic = () => {
  const { daoOnchain } = useAppSelector(state => state.daoDetail);
  const { addFund, addMember } = useAppSelector(state => state.process);

  const [fundAmount, setFundAmount] = useState("");
  const [newMember, setNewMember] = useState<`fuel${string}`>();

  const [openFundPopup, setOpenFundPopup] = useState(false);
  const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false);

  const handleOpenFundPopupChange = (newOpen: boolean) => {
    setOpenFundPopup(newOpen);
  };


  const handleOpenAddMemberPopupChange = (newOpen: boolean) => {
    setOpenAddMemberPopup(newOpen);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const fund = useCallback(() => {
    fundDao(parseFloat(fundAmount));
  }, [fundAmount])


  const doAddMember = useCallback(() => {
    addMemberAction(newMember);
  }, [newMember])


  const items: MenuProps['items'] = [
    {
      label: 'Payment',
      key: '1',
      //icon: <UserOutlined />,
      onClick: () => showDrawer()
    },
    {
      label: 'Governance',
      key: '3',
      // icon: <UserOutlined />,
      danger: true,
    }
  ];

  const menuProps = {
    items,
    onClick: () => { },
  };
  return (
    <Row gutter={8}>
      <Col span={3}>
        <Statistic title="Members" value={daoOnchain.count_member} />
      </Col>
      <Col span={3}>
        <Statistic title="Proposals" value={daoOnchain.count_proposal} />
      </Col>
      <Col span={3}>
        <Statistic title="Treasury (ETH)" value={daoOnchain.balance} precision={3} />
      </Col>
      <Col span={3}>
        <Statistic title="Status" value={daoOnchain.status == 1 ? "Active" : "Inactive"} />
      </Col>
      <Col span={12}>
        <p>Actions</p>
        <Space direction="horizontal">
          <Dropdown menu={menuProps}>
            <Button type="primary" ghost>
              <Space>
                New Proposal
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Popover
            content={
              <>
                <Input name='adress' addonBefore={<AiOutlineWallet />} size='large' value={newMember} onChange={(e) => 
                  //@ts-ignore
                  setNewMember(e.target.value)} />
                <Divider />
                <Button type='primary' onClick={() => doAddMember()} loading={addMember.processing}>Add</Button>
              </>
            }
            title="Address"
            trigger="click"
            open={openAddMemberPopup}
            onOpenChange={handleOpenAddMemberPopupChange}
          >

            <Button type="primary" ghost>Add Member</Button>
          </Popover>

          <Popover
            content={
              <>

                <Input name='amount' size='large' type='number' suffix={"ETH"} value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
                <Divider />
                <Button type='primary' onClick={() => fund()} loading={addFund.processing}>Send</Button>
              </>
            }
            title="Amount"
            trigger="click"
            open={openFundPopup}
            onOpenChange={handleOpenFundPopupChange}
          >
            <Button type="primary">Send Fund</Button>
          </Popover>
        </Space>

      </Col>
      <Drawer title="New Proposal" size="large" placement="right" onClose={onClose} open={open}>
        <NewPayout />
      </Drawer>
    </Row>
  )
}