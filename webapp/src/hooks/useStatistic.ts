type DataArray = {date: string, payout: number, vesting: number};
export const useStatistic = () => {
    const getData = (payoutStatistic: any) => {
        let payoutByDate = payoutStatistic.totalPayoutByDate.map(t => {
            
                return {
                    type: t._id.type,
                    date: t._id.date,
                    amount: t.sum
                }
            
        })

        const dataMap = new Map();
        let dataArray: DataArray[] = [];

        payoutByDate.forEach(p => {
            if (dataMap.get(p.date)) {
                let value = dataMap.get(p.date);
                if (p.type == "payout") {
                    value.payout = p.amount;
                } else {
                    value.vesting = p.amount;
                }
            } else {
                dataMap.set(p.date, { payout: p.type == "payout" ? p.amount : 0, vesting: p.type == "funding" ? p.amount : 0})
            }
        })

        dataMap.forEach((value, key) => {
            dataArray.push({
                date: key, payout: value.payout, vesting: value.vesting
            })
        })

        dataArray = dataArray.sort((a, b) =>  {
            return (new Date(a.date).getTime() - new Date(b.date).getTime())
        })
        
        return dataArray;

    };
    return { getData };
};