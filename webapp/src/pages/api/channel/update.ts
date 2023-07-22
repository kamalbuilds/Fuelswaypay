import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Channel from 'src/database/models/Channel';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            owner,
            _id,
        } = req.body;
        if (owner && _id) {
            try {
                await Channel.findOneAndUpdate({ owner: owner, _id: _id, status: -1 }, req.body);
                res.json({ success: true });
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