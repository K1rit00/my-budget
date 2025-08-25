import { TrendingUp, TrendingDown, DollarSign, CreditCard, Home, Target, Calendar, PieChart, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Wallet, Building, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// Данные для аналитики
const monthlyTrends = [
  { month: "Авг", доходы: 487500, расходы: 351200, экономия: 136300, кредиты: 272500 },
  { month: "Сен", доходы: 520000, расходы: 378900, экономия: 141100, кредиты: 272500 },
  { month: "Окт", доходы: 495000, расходы: 362400, экономия: 132600, кредиты: 272500 },
  { month: "Ноя", доходы: 510000, расходы: 389750, экономия: 120250, кредиты: 272500 },
  { month: "Дек", доходы: 545000, расходы: 412300, экономия: 132700, кредиты: 272500 },
  { month: "Янв", доходы: 487500, расходы: 358900, экономия: 128600, кредиты: 272500 },
];

const expenseCategories = [
  { name: "Кредиты", value: 272500, color: "#ef4444", percentage: 43.2 },
  { name: "Коммунальные", value: 87500, color: "#f59e0b", percentage: 13.9 },
  { name: "Продукты", value: 65000, color: "#10b981", percentage: 10.3 },
  { name: "Транспорт", value: 45000, color: "#3b82f6", percentage: 7.1 },
  { name: "Развлечения", value: 38000, color: "#8b5cf6", percentage: 6.0 },
  { name: "Прочее", value: 122900, color: "#6b7280", percentage: 19.5 },
];

const creditProgress = [
  { name: "Ипотека", current: 12500000, total: 15000000, payment: 185000, color: "bg-purple-500" },
  { name: "Потребительский", current: 850000, total: 2000000, payment: 87500, color: "bg-orange-500" },
  { name: "Рассрочка iPhone", current: 180000, total: 450000, payment: 45000, color: "bg-green-500" },
];

const goalProgress = [
  { name: "Отпуск в Дубай", current: 750000, target: 1200000, deadline: "Июль 2025", color: "bg-blue-500" },
  { name: "Новый автомобиль", current: 2100000, target: 8500000, deadline: "Декабрь 2025", color: "bg-purple-500" },
  { name: "Резервный фонд", current: 850000, target: 1500000, deadline: "Июнь 2025", color: "bg-green-500" },
];

const upcomingPayments = [
  { name: "Ипотека Казком", amount: 185000, date: "15 фев", type: "credit", urgent: false },
  { name: "Потребительский кредит", amount: 87500, date: "20 фев", type: "credit", urgent: false },
  { name: "Аренда квартиры", amount: 120000, date: "1 мар", type: "rent", urgent: true },
  { name: "Интернет", amount: 4500, date: "15 мар", type: "utility", urgent: false },
  { name: "Электричество", amount: 3200, date: "25 мар", type: "utility", urgent: false },
];

const incomeStreams = [
  { source: "Основная зарплата", amount: 350000, percentage: 71.8, trend: "stable" },
  { source: "Фриланс", amount: 75000, percentage: 15.4, trend: "up" },
  { source: "Инвестиции", amount: 37500, percentage: 7.7, trend: "up" },
  { source: "Подарки", amount: 25000, percentage: 5.1, trend: "down" },
];

export function Dashboard() {
  const currentBalance = 1250000;
  const monthlyIncome = 487500;
  const monthlyExpenses = 358900;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const totalDebt = 13530000;
  const creditPayments = 272500;

  const savingsRate = (monthlySavings / monthlyIncome) * 100;
  const debtToIncomeRatio = (creditPayments / monthlyIncome) * 100;

  const KPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 mb-1">Текущий баланс</p>
              <p className="text-2xl text-green-900 dark:text-green-100">{currentBalance.toLocaleString("kk-KZ")} ₸</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400">+12.3% за месяц</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-200 dark:bg-green-800/50 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-700 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Доходы за месяц</p>
              <p className="text-2xl text-blue-900 dark:text-blue-100">{monthlyIncome.toLocaleString("kk-KZ")} ₸</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-600 dark:text-blue-400">+5.2% к прошлому</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800/50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 dark:text-orange-400 mb-1">Расходы за месяц</p>
              <p className="text-2xl text-orange-900 dark:text-orange-100">{monthlyExpenses.toLocaleString("kk-KZ")} ₸</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                <span className="text-xs text-orange-600 dark:text-orange-400">-3.1% к прошлому</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800/50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-700 dark:text-orange-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-400 mb-1">Накопления</p>
              <p className="text-2xl text-purple-900 dark:text-purple-100">{monthlySavings.toLocaleString("kk-KZ")} ₸</p>
              <div className="flex items-center gap-1 mt-1">
                <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-purple-600 dark:text-purple-400">{savingsRate.toFixed(1)}% от дохода</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800/50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-700 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FinancialHealthMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Финансовое здоровье
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Коэффициент сбережений</span>
              <span className="text-sm font-medium">{savingsRate.toFixed(1)}%</span>
            </div>
            <Progress value={savingsRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {savingsRate >= 20 ? "Отличный показатель" : savingsRate >= 10 ? "Хороший показатель" : "Требует улучшения"}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Долговая нагрузка</span>
              <span className="text-sm font-medium">{debtToIncomeRatio.toFixed(1)}%</span>
            </div>
            <Progress value={debtToIncomeRatio} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {debtToIncomeRatio <= 30 ? "Безопасный уровень" : debtToIncomeRatio <= 50 ? "Умеренный риск" : "Высокий риск"}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Ликвидность (месяцы покрытия)</span>
              <span className="text-sm font-medium">{(currentBalance / monthlyExpenses).toFixed(1)}</span>
            </div>
            <Progress value={Math.min(100, (currentBalance / (monthlyExpenses * 6)) * 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Рекомендуется 6+ месяцев расходов
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            ��тру��тура расходов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${Number(value).toLocaleString("kk-KZ")} ₸`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {category.name} {category.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TrendsChart = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Финансовые тренды (6 месяцев)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--muted-foreground))" 
              opacity={0.5}
            />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis 
              formatter={(value) => `${(value / 1000).toFixed(0)}K`} 
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => `${Number(value).toLocaleString("kk-KZ")} ₸`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="доходы" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#10b981" }}
            />
            <Line 
              type="monotone" 
              dataKey="расходы" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#f59e0b" }}
            />
            <Line 
              type="monotone" 
              dataKey="экономия" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const CreditOverview = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Прогресс по кредитам
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {creditProgress.map((credit, index) => {
          const progress = ((credit.total - credit.current) / credit.total) * 100;
          const remaining = credit.current;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${credit.color}`} />
                  <span className="font-medium">{credit.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{remaining.toLocaleString("kk-KZ")} ₸</p>
                  <p className="text-xs text-muted-foreground">
                    {credit.payment.toLocaleString("kk-KZ")} ₸/мес
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Выплачено {progress.toFixed(1)}%</span>
                <span>Осталось {(100 - progress).toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  const GoalsProgress = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Прогресс по мечтам
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goalProgress.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${goal.color}`} />
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">{goal.deadline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {goal.current.toLocaleString("kk-KZ")} ₸
                  </p>
                  <p className="text-xs text-muted-foreground">
                    из {goal.target.toLocaleString("kk-KZ")} ₸
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.toFixed(1)}% достигнуто</span>
                <span>Осталось {(goal.target - goal.current).toLocaleString("kk-KZ")} ₸</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  const UpcomingPayments = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Ближайшие платежи
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingPayments.map((payment, index) => {
            const getIcon = (type: string) => {
              switch(type) {
                case "credit": return <CreditCard className="w-4 h-4 text-red-500 dark:text-red-400" />;
                case "rent": return <Building className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
                case "utility": return <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
                default: return <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
              }
            };

            return (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                payment.urgent 
                  ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800' 
                  : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
                <div className="flex items-center gap-3">
                  {getIcon(payment.type)}
                  <div>
                    <p className="font-medium">{payment.name}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount.toLocaleString("kk-KZ")} ₸</p>
                  {payment.urgent && (
                    <Badge variant="destructive" className="text-xs">Срочно</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const IncomeBreakdown = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Источники доходов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incomeStreams.map((stream, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{stream.source}</span>
                {stream.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                {stream.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
              </div>
              <div className="text-right">
                <p className="font-medium">{stream.amount.toLocaleString("kk-KZ")} ₸</p>
                <p className="text-xs text-muted-foreground">{stream.percentage}%</p>
              </div>
            </div>
            <Progress value={stream.percentage} className="h-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards />

      {/* Financial Health & Expense Structure */}
      <FinancialHealthMetrics />

      {/* Trends Chart */}
      <TrendsChart />

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreditOverview />
        <GoalsProgress />
      </div>

      {/* Upcoming Payments & Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingPayments />
        <IncomeBreakdown />
      </div>
    </div>
  );
}