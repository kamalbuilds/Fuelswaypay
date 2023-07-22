import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Address from "src/database/models/Address";
import AddressGroup from 'src/database/models/AddressGroup';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            owner
        } = req.body;
        if (owner) {
        
            try {
                let addresses = await Address.find({owner: owner});
                return res.status(200).send(addresses);
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