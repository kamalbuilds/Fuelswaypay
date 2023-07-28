export const useProposal = () => {
    
    const countVote = (votes: { address: string, value: boolean}[]) => {
        let count = 0;
        // @ts-ignore
        votes.forEach(vote => {
           if (vote.value) count++; 
        })

        return count;
    }

    const countUnvote = (votes: { address: string, value: boolean}[]) => {
        let count = 0;
        // @ts-ignore
        votes.forEach(vote => {
           if (!vote.value) count++; 
        })

        return count;
    }



    const checkUserVoted = (votes: { address: string, value: boolean}[], address: string) => {
        let flag = false;
        // @ts-ignore
        votes.forEach((vote, key) => {
           if (vote.address == address) flag = true; 
        })

        return flag;
    }

    const checkUserAgree = (votes: { address: string, value: boolean}[], address: string) => {
        let flag = false;
        // @ts-ignore
        votes.forEach(vote => {
           if (vote.address == address && vote.value) flag = true; 
        })

        return flag;
    }

    return { countVote, countUnvote, checkUserVoted, checkUserAgree };
};