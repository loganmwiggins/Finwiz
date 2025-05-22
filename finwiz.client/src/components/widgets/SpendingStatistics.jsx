import { useState } from 'react';
import { formatCurrency } from '../../utils/CurrencyFormatter';

function SpendingStatistics({ statements }) {
    const [velocityRange, setVelocityRange] = useState(3); // default to 3 months

    if (!statements || statements.length === 0) return <p>No spending data available.</p>;

    // Total and average
    const totalSpend = statements.reduce((sum, s) => sum + s.amount, 0);
    const averageSpend = totalSpend / statements.length;

    // Min/max
    const minStatement = statements.reduce((min, s) => s.amount < min.amount ? s : min, statements[0]);
    const maxStatement = statements.reduce((max, s) => s.amount > max.amount ? s : max, statements[0]);

    // Spending velocity (over last N months)
    const sortedStatements = [...statements].sort((a, b) => new Date(b.statementEnd) - new Date(a.statementEnd));
    const recentN = sortedStatements.slice(0, velocityRange);
    const velocity = recentN.length > 0
        ? recentN.reduce((sum, s) => sum + s.amount, 0) / recentN.length
        : 0;

    const formatMonthYear = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };

    return (
        <>
            <div className="stat-row">
                <div>Total Lifetime Spend <span className="p-4">({statements.length} statements)</span></div>
                <div className="stat">{formatCurrency(totalSpend)}</div>
            </div>

            <div className="stat-row">
                <div>Average Monthly Spend</div>
                <div className="stat">{formatCurrency(averageSpend)}</div>
            </div>

            <div className="stat-row">
                <div className="stat-label">
                    Spending Velocity
                    <select 
                        value={velocityRange} 
                        onChange={(e) => setVelocityRange(Number(e.target.value))}
                    >
                        <option value={3}>Last 3 months</option>
                        <option value={6}>Last 6 months</option>
                        <option value={12}>Last 12 months</option>
                    </select>
                </div>
                <div className="stat">{formatCurrency(velocity)}</div>
            </div>

            <div className="stat-row">
                <div>Lowest Monthly Spend <span className="p-4">({formatMonthYear(minStatement.statementEnd)})</span></div>
                <div className="stat">{formatCurrency(minStatement.amount)}</div>
            </div>

            <div className="stat-row">
                <div>Highest Monthly Spend <span className="p-4">({formatMonthYear(maxStatement.statementEnd)})</span></div>
                <div className="stat">{formatCurrency(maxStatement.amount)}</div>
            </div>
        </>
    );
}

export default SpendingStatistics;