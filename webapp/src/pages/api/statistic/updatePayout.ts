import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Payout from 'src/database/models/Payout';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        let { field, value, date } = req.body;
        if (field) {
            let payout = await Payout.findOne({ date: date, type: field });
            if (!payout) {
                let proposalPayout = new Payout({
                    amount: value,
                    type: field,
                    date: date
                })
               payout = await proposalPayout.save();
            } 
            let data = { amount: payout.amount + value };
            await Payout.findOneAndUpdate({ _id: payout._id }, data);
            
            res.json({ success: true })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);