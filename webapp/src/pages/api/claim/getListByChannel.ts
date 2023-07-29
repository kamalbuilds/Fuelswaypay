import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Claim from "src/database/models/Claim";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            channel_address
        } = req.body;
        if (channel_address) {
        
            try {
                let claims = await Claim.find({channel_address: channel_address});
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