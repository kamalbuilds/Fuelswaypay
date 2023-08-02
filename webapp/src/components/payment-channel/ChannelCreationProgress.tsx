import { Card, Steps } from 'antd';
import { useAppSelector } from 'src/controller/hooks';

export const ChannelCreationProgress = () => {

    const { status } = useAppSelector(state => state.createStream);

    const checkStep = (currentStatus: number) => {
        let step = 0;
        switch (currentStatus) {
            case 1:
                step = 1;
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
                current={checkStep(status)}
                items={[
                    {
                        title: 'Setup',
                    },
                    {
                        title: 'Onchain',
                    },
                    {
                        title: 'Initialized',
                    }
                ]}
            />
        </Card>

    )
}