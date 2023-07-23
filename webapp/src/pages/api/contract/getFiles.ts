import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from "fs";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
            let {name} = req.body;
            try {
                let jsonFile = fs.readFileSync(`contract-files/${name}/${name}-contract-abi.json`);
                let binFile = fs.readFileSync(`contract-files/${name}/${name}-contract.bin`);

                return res.status(200).send({success: true, jsonFile: `${jsonFile}`, binFile: binFile});
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);