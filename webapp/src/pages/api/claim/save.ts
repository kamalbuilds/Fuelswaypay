import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Claim from 'src/database/models/Claim';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            payer,
            payee,
            amount,
        } = req.body;
        if (payer && payee && amount) {
            try {
                let claim = new Claim(req.body);
                let savedClaim = await claim.save();
                return res.status(200).send(savedClaim);
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