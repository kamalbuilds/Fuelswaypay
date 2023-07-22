import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Channel from 'src/database/models/Channel';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            owner,
            title,
        } = req.body;
        if (owner && title) {
            try {
                let channel = new Channel(req.body);
                let savedChannel = await channel.save();
                return res.status(200).send(savedChannel);
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