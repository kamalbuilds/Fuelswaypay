import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Stream from "src/database/models/Stream";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            owner,
            _id
        } = req.body;
        if (owner && _id) {
        
            try {
                let stream = await Stream.findById(_id);
                return res.status(200).send(stream);
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