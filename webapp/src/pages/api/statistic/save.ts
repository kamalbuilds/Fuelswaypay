import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Statistic from 'src/database/models/Statistic';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        let { field, value } = req.body;
        if (field) {
            let statistic = await Statistic.findOne();

            if (!statistic) {
                let statistic = new Statistic({
                    dao: 0,
                    fund: 0,
                    proposal: 0,
                    executedProposal: 0,
                    members: 0,
                    stream: 0,
                    channel: 0,
                    claim: 0
                })
                
                statistic = await statistic.save();

            }

            let update = {};
            switch (field) {
                case "dao":
                    update = { dao: statistic.dao + 1 }
                    break;
                case "fund":
                    update = { fund: statistic.fund + value }
                    break;
                case "proposal":
                    update = { proposal: statistic.proposal + 1 }
                    break;
                case "executedProposal":
                    update = { executedProposal: statistic.executedProposal + 1 }
                    break;
                case "members":
                    update = { members: statistic.members + value }
                    break;
                case "stream":
                    update = { stream: statistic.stream + value }
                    break;
                case "channel":
                    update = { channel: statistic.channel + value }
                    break;
                case "claim":
                    update = { claim: statistic.claim + value }
                    break;
            }
            await Statistic.findOneAndUpdate({ _id: statistic._id }, update);

            res.json({ success: true })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);