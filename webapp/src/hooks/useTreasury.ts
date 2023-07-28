export const useTreasury = () => {
    const getFundStatistic = (contributorFunds: {address: string, amount: number}[], members: string[]) => {
        let totalFunds = 0;
        let memberFunds = 0;
        let notMemberFunds = 0;
        contributorFunds.forEach(({address, amount}) => {
            totalFunds += amount;
            if (members.indexOf(address) !== -1) {
                memberFunds += amount;
            } else {
                notMemberFunds += amount;
            }
        })

        return {
            totalFunds, memberFunds, notMemberFunds
        }
    };

   

    return { getFundStatistic };
};