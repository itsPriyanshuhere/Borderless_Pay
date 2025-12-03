import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface OwnerChartData {
    name: string;
    spent: number;
    funded: number;
}

interface OwnerChartProps {
    data: OwnerChartData[];
}

const OwnerChart = ({ data }: OwnerChartProps) => {
    return (
        <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFunded" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0aff60" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0aff60" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }} />
                    <Area type="monotone" dataKey="spent" name="Amount Spent" stroke="#ff6b6b" fillOpacity={1} fill="url(#colorSpent)" />
                    <Area type="monotone" dataKey="funded" name="Amount Funded" stroke="#0aff60" fillOpacity={1} fill="url(#colorFunded)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OwnerChart;
