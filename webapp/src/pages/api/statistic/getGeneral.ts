import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Statistic from 'src/database/models/Statistic';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        let statistic = await Statistic.findOne()
        return res.status(200).send(statistic);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export default connect(handler);