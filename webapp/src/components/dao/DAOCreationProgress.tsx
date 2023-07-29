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
                        title: 'Start',
                        description: "Input DAO settings",
                    },
                    {
                        title: 'Saved',
                        description: "Settings is saved to database",
                    },
                    {
                        title: 'Created DAO contract',
                        description: "A smart contract is deployed onchain"
                    },
                    {
                        title: 'Updated DAO state',
                        description: "Initialized DAO with settings"
                    },
                ]}
            />
        </Card>

    )
}