import React from 'react';
import { Progress, Slider, Tooltip } from 'antd';
import type { SliderMarks } from 'antd/es/slider';



export const VotingStatusSlider = ({ proposalOnChain, daoOnchain }) => {

    // return (daoOnchain.count_member !== 0 && <Slider  defaultValue={(proposalOnChain.agree / daoOnchain.count_member) * 100} />)

    return (
        <Tooltip title={`${proposalOnChain.agree} agree / ${proposalOnChain.disagree} disagree`}>
            <Progress percent={daoOnchain.quorum} success={{ percent: (proposalOnChain.agree / daoOnchain.count_member) * 100 }} />
        </Tooltip>
    )

}
