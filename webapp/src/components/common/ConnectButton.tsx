import { CopyOutlined, DisconnectOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { setAccountProps } from "src/controller/dao/accountSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";
export const ConnectButton = () => {
    const {getShortAddress} = useAddress();
    const dispatch = useAppDispatch();
    const [connected, setConnected] = useState<boolean>(false);
    const {account} = useAppSelector(state => state.account)
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
      setTimeout(() => {
        checkConnection();
        setLoaded(true);
      }, 200)
    }, [connected])
  
    async function connect() {
      if (window.fuel) {
       try {
         await window.fuel.connect();
         const [account] = await window.fuel.accounts();
         dispatch(setAccountProps({att: "account", value: account}))
         setConnected(true);
       } catch(err) {
         console.log("error connecting: ", err);
       }
      }
     }
  
    async function checkConnection() {
      if (window.fuel) {
        const isConnected = await window.fuel.isConnected();
        if (isConnected) {
          const [account] = await window.fuel.accounts();
          dispatch(setAccountProps({att: "account", value: account}))
          setConnected(true);
        }
      }
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                    Copy address 
                </a>
            ),
            icon: <CopyOutlined />,
            onClick: () => navigator.clipboard.writeText(account)
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                    Disconnect
                </a>
            ),
            icon: <DisconnectOutlined />,
            onClick: () => {} 
        }
    ];
    return (
        connected ? <Dropdown menu={{ items }} placement="bottomLeft" arrow>
             <Button icon={<Image alt="ae" width={30} height={30} src={"/fuel-icon.png"} style={{paddingRight: "5px"}} />} type="primary" size="large">{getShortAddress(account)}</Button>
        </Dropdown> : <Button type="primary" size="large" onClick={() => connect()}>Connect Wallet</Button>
    
    )
}