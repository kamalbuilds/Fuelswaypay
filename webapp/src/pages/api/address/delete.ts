import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Address from "src/database/models/Address";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            id,
        } = req.body;
        if (id) {
            try {
                await Address.findByIdAndRemove(id);
                return res.status(200).send("deleted");
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