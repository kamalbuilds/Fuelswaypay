import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Proposal from 'src/database/models/Proposal';
import DAO from 'src/database/models/DAO';
import Stream from 'src/database/models/Stream';
import Channel from 'src/database/models/Channel';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        let { owner } = req.body;
        if (owner) {

            let countDAOs = await DAO.count({ owner: owner });
            let countProposals = await Proposal.count({ owner: owner });
            let countStreams = await Stream.count({ owner: owner });
            let countChannels = await Channel.count({ payer: owner });

            res.json({ countDAOs: countDAOs, countProposals: countProposals, countStreams: countStreams, countChannels: countChannels })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);