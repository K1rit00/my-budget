import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const pieData = [
  { name: "Кредиты", value: 20000, color: "#8b5cf6" },
  { name: "Аренда", value: 25000, color: "#06b6d4" },
  { name: "Отложенные траты", value: 15000, color: "#10b981" },
  { name: "Прочее", value: 10000, color: "#f59e0b" },
];

const lineData = [
  { month: "Янв", доходы: 450000, расходы: 350000, накопления: 100000 },
  { month: "Фев", доходы: 420000, расходы: 380000, накопления: 40000 },
  { month: "Мар", доходы: 480000, расходы: 420000, накопления: 60000 },
  { month: "Апр", доходы: 460000, расходы: 390000, накопления: 70000 },
  { month: "Май", доходы: 500000, расходы: 450000, накопления: 50000 },
  { month: "Июн", доходы: 520000, расходы: 480000, накопления: 40000 },
];

export function BudgetCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Распределение бюджета</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toLocaleString("kk-KZ")} ₸`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Финансовая динамика</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis formatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString("kk-KZ")} ₸`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="доходы" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="расходы" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="накопления" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}