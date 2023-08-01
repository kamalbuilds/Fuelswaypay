import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Claim from "src/database/models/Claim";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            payer
        } = req.body;
        if (payer) {
        
            try {
                let claims = await Claim.find({payer: payer}).sort({created_at: -1});
                return res.status(200).send(claims);
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