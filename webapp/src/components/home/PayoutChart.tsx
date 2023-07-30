
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppSelector } from '../../controller/hooks';
import { useStatistic } from '../../hooks/useStatistic';


export default function PayoutChart() {


  const {payoutStatistic} = useAppSelector(state => state.statistic);
  const {getData} = useStatistic();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={getData(payoutStatistic)}
          margin={{
            top: 24
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="payout" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="vesting" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    )
}
