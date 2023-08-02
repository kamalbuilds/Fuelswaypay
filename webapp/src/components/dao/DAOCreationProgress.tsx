import { Card, Steps } from 'antd';
import { useAppSelector } from '../../controller/hooks';

export const DAOCreationProgress = () => {
    const { status } = useAppSelector(state => state.daoForm)
    const checkStep = (currentStatus: number) => {
        let step = 0;
        switch (currentStatus) {
            case -1:
                step = 1;
                break;
            case 0:
                step = 2;
                break;
            case 1:
                step = 3;
                break;
            default:
                break;

        }

        return step;
    }
    return (
        <Card style={{ backgroundColor: "#f5f5f5" }}>
            <Steps
                current={checkStep(status)}
                items={[
                    {
                        title: 'Setup',
                        description: "Input DAO settings",
                    },
                    {
                        title: 'DAO info is saved',
                        description: "Settings is saved to database",
                    },
                    {
                        title: 'DAO is deployed',
                        description: "A smart contract is deployed onchain"
                    },
                    {
                        title: 'DAO is initialized',
                        description: "DAO is initialized with settings"
                    },
                ]}
            />
        </Card>

    )
}