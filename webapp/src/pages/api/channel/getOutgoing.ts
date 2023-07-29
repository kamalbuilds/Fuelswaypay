import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Channel from "src/database/models/Channel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            payer
        } = req.body;
        if (payer) {
        
            try {
                let channels = await Channel.find({payer: payer});
                return res.status(200).send(channels);
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