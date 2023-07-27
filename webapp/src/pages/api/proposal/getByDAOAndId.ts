import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Proposal from "src/database/models/Proposal";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            dao_address,
            id
        } = req.body;
        if (dao_address) {
        
            try {
                let proposal = await Proposal.findOne({dao_address: dao_address, id});
                return res.status(200).send(proposal);
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);