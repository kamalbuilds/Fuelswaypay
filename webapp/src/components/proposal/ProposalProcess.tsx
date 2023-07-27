import { Card, Steps } from 'antd';
import { useAppSelector } from 'src/controller/hooks';

export const ProposalCreationProgress = () => {
    const { proposalOnchain, proposalFromDB } = useAppSelector(state => state.proposal)
    const checkStep = (currentStatus: number) => {
        let step = 0;
        let currentTime = new Date().getTime();
        switch (currentStatus) {
            case 1:
                if (proposalFromDB.start_date < currentTime && proposalFromDB.end_date > currentTime ) {
                    step = 1;
                } else {
                    step = 0;
                }
              
                break;
            case 2:
                step = 2;
                break;
            default:
                break;

        }

        return step;
    }
    return (
        <Card style={{ backgroundColor: "#f5f5f5" }}>
            <Steps
                current={checkStep(proposalOnchain.status)}
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