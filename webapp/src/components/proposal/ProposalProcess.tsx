import { Card, Steps } from 'antd';
import { useAppSelector } from 'src/controller/hooks';

export const ProposalCreationProgress = () => {
    const { status } = useAppSelector(state => state.daoForm)
    const checkStep = (currentStatus: number) => {
        let step = 0;
        switch (currentStatus) {
            case 1:
                step = 1;
                break;
            case 2:
                step = 2;
                break;
            case 3:
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
                        title: 'Onchain',
                    },
                    {
                        title: 'Voting',
                    },
                    {
                        title: 'Execute',
                    }
                ]}
            />
        </Card>

    )
}