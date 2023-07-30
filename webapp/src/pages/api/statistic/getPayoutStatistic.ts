import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Payout from 'src/database/models/Payout';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

        try {
            let totalPayout = await Payout.aggregate([
                { $group: { _id: "$type", sum: { $sum: "$amount" } } },

            ])

            let totalPayoutByDate = await Payout.aggregate([
                { $group: { _id: { type: "$type", date: "$date" }, sum: { $sum: "$amount" } } },
            ])
            return res.status(200).send({ success: true, totalPayout: totalPayout, totalPayoutByDate: totalPayoutByDate });
        } catch (error) {
            return res.status(500).send(error.message);
        }

};

export default connect(handler);