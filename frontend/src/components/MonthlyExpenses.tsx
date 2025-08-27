import { useState } from "react";
import { Wallet, Plus, TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MonthlyExpense {
  id: string;
  category: string;
  plannedAmount: number;
  actualAmount: number;
  color: string;
  priority: "high" | "medium" | "low";
  isFixed: boolean;
  description?: string;
}

interface ExpenseGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
}

const initialExpenses: MonthlyExpense[] = [
  {
    id: "1",
    category: "Продукты",
    plannedAmount: 75000,
    actualAmount: 91000,
    color: "bg-blue-500",
    priority: "high",
    isFixed: false,
    description: "Еда и напитки"
  },
  {
    id: "2",
    category: "Транспорт",
    plannedAmount: 25000,
    actualAmount: 24000,
    color: "bg-green-500",
    priority: "high",
    isFixed: true,
    description: "Проездной, бензин"
  },
  {
    id: "3",
    category: "Коммунальные",
    plannedAmount: 40000,
    actualAmount: 37500,
    color: "bg-yellow-500",
    priority: "high",
    isFixed: true,
    description: "Электричество, газ, вода"
  },
  {
    id: "4",
    category: "Развлечения",
    plannedAmount: 50000,
    actualAmount: 60000,
    color: "bg-purple-500",
    priority: "low",
    isFixed: false,
    description: "Кино, рестораны, хобби"
  },
  {
    id: "5",
    category: "Здоровье",
    plannedAmount: 30000,
    actualAmount: 16000,
    color: "bg-orange-500",
    priority: "medium",
    isFixed: false,
    description: "Лекарства, врачи"
  }
];

const initialGoals: ExpenseGoal[] = [
  {
    id: "1",
    title: "Снизить траты на еду",
    targetAmount: 60000,
    currentAmount: 91000,
    deadline: new Date(2025, 2, 31),
    category: "Продукты"
  },
  {
    id: "2",
    title: "Экономия на развлечениях",
    targetAmount: 40000,
    currentAmount: 60000,
    deadline: new Date(2025, 1, 28),
    category: "Развлечения"
  }
];

export function MonthlyExpenses() {
  const [expenses, setExpenses] = useState<MonthlyExpense[]>(initialExpenses);
  const [goals, setGoals] = useState<ExpenseGoal[]>(initialGoals);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [expenseFormData, setExpenseFormData] = useState({
    category: "",
    plannedAmount: 0,
    priority: "medium" as MonthlyExpense["priority"],
    isFixed: false,
    description: "",
    color: "bg-blue-500"
  });
  const [goalFormData, setGoalFormData] = useState({
    title: "",
    targetAmount: 0,
    deadline: "",
    category: ""
  });

  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", 
    "bg-orange-500", "bg-pink-500", "bg-red-500",
    "bg-yellow-500", "bg-indigo-500", "bg-teal-500"
  ];

  const priorityLabels = {
    high: "Высокий",
    medium: "Средний",
    low: "Низкий"
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300",
    low: "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300"
  };

  const getTotalPlanned = () => {
    return expenses.reduce((sum, expense) => sum + expense.plannedAmount, 0);
  };

  const getTotalActual = () => {
    return expenses.reduce((sum, expense) => sum + expense.actualAmount, 0);
  };

  const getDifference = () => {
    return getTotalActual() - getTotalPlanned();
  };

  const handleAddExpense = () => {
    const newExpense: MonthlyExpense = {
      id: Date.now().toString(),
      ...expenseFormData,
      actualAmount: 0
    };
    setExpenses([...expenses, newExpense]);
    setExpenseFormData({
      category: "",
      plannedAmount: 0,
      priority: "medium",
      isFixed: false,
      description: "",
      color: "bg-blue-500"
    });
    setIsExpenseDialogOpen(false);
  };

  const handleAddGoal = () => {
    const newGoal: ExpenseGoal = {
      id: Date.now().toString(),
      title: goalFormData.title,
      targetAmount: goalFormData.targetAmount,
      currentAmount: expenses.find(e => e.category === goalFormData.category)?.actualAmount || 0,
      deadline: new Date(goalFormData.deadline),
      category: goalFormData.category
    };
    setGoals([...goals, newGoal]);
    setGoalFormData({
      title: "",
      targetAmount: 0,
      deadline: "",
      category: ""
    });
    setIsGoalDialogOpen(false);
  };

  const ExpenseOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">Запланировано</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {getTotalPlanned().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">Потрачено</span>
            </div>
            <p className="text-2xl text-purple-900 dark:text-purple-100">
              {getTotalActual().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className={`rounded-2xl ${getDifference() >= 0 ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800' : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {getDifference() >= 0 ? 
                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" /> : 
                <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
              }
              <span className={getDifference() >= 0 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}>
                {getDifference() >= 0 ? 'Превышение' : 'Экономия'}
              </span>
            </div>
            <p className={`text-2xl ${getDifference() >= 0 ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'}`}>
              {Math.abs(getDifference()).toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Категории трат</CardTitle>
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая категория трат</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название категории</Label>
                  <Input 
                    value={expenseFormData.category}
                    onChange={(e) => setExpenseFormData({...expenseFormData, category: e.target.value})}
                    placeholder="Название категории"
                  />
                </div>
                <div>
                  <Label>Планируемая сумма</Label>
                  <Input 
                    type="number"
                    value={expenseFormData.plannedAmount}
                    onChange={(e) => setExpenseFormData({...expenseFormData, plannedAmount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Приоритет</Label>
                  <Select 
                    value={expenseFormData.priority} 
                    onValueChange={(value: MonthlyExpense["priority"]) => 
                      setExpenseFormData({...expenseFormData, priority: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input 
                    value={expenseFormData.description}
                    onChange={(e) => setExpenseFormData({...expenseFormData, description: e.target.value})}
                    placeholder="Краткое описание"
                  />
                </div>
                <div>
                  <Label>Цвет</Label>
                  <div className="flex gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${color} ${
                          expenseFormData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                        }`}
                        onClick={() => setExpenseFormData({ ...expenseFormData, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFixed"
                    checked={expenseFormData.isFixed}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, isFixed: e.target.checked })}
                  />
                  <Label htmlFor="isFixed">Фиксированная трата</Label>
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  Добавить категорию
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => {
              const progressPercentage = (expense.actualAmount / expense.plannedAmount) * 100;
              const isOverBudget = expense.actualAmount > expense.plannedAmount;
              
              return (
                <div key={expense.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${expense.color}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{expense.category}</h4>
                          <Badge className={priorityColors[expense.priority]}>
                            {priorityLabels[expense.priority]}
                          </Badge>
                          {expense.isFixed && (
                            <Badge variant="outline">Фиксированная</Badge>
                          )}
                        </div>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground">{expense.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {expense.actualAmount.toLocaleString("kk-KZ")} ₸
                      </p>
                      <p className="text-sm text-muted-foreground">
                        из {expense.plannedAmount.toLocaleString("kk-KZ")} ₸
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={Math.min(progressPercentage, 100)} 
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progressPercentage.toFixed(1)}% от плана</span>
                      {isOverBudget ? (
                        <span className="text-red-600">
                          Превышение: {(expense.actualAmount - expense.plannedAmount).toLocaleString("kk-KZ")} ₸
                        </span>
                      ) : (
                        <span>
                          Остаток: {(expense.plannedAmount - expense.actualAmount).toLocaleString("kk-KZ")} ₸
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Goals = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Цели по экономии
          </CardTitle>
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить цель
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая цель экономии</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название цели</Label>
                  <Input 
                    value={goalFormData.title}
                    onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})}
                    placeholder="Например: Снизить траты на еду"
                  />
                </div>
                <div>
                  <Label>Целевая сумма</Label>
                  <Input 
                    type="number"
                    value={goalFormData.targetAmount}
                    onChange={(e) => setGoalFormData({...goalFormData, targetAmount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Срок достижения</Label>
                  <Input 
                    type="date"
                    value={goalFormData.deadline}
                    onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Select 
                    value={goalFormData.category} 
                    onValueChange={(value) => setGoalFormData({...goalFormData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenses.map((expense) => (
                        <SelectItem key={expense.id} value={expense.category}>
                          {expense.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Добавить цель
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => {
              const isAchieved = goal.currentAmount <= goal.targetAmount;
              const progressPercentage = isAchieved ? 100 : ((goal.targetAmount / goal.currentAmount) * 100);
              const difference = goal.currentAmount - goal.targetAmount;
              
              return (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={isAchieved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {isAchieved ? "Достигнута" : "В процессе"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Цель: {goal.targetAmount.toLocaleString("kk-KZ")} ₸</span>
                      <span>Текущая трата: {goal.currentAmount.toLocaleString("kk-KZ")} ₸</span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className={`h-2 ${!isAchieved ? '[&>div]:bg-red-500' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>До {goal.deadline.toLocaleDateString("ru-RU")}</span>
                      {isAchieved ? (
                        <span className="text-green-600">
                          Цель достигнута! Экономия: {Math.abs(difference).toLocaleString("kk-KZ")} ₸
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Нужно сократить на: {difference.toLocaleString("kk-KZ")} ₸
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Ежемесячные траты</TabsTrigger>
          <TabsTrigger value="goals">Цели экономии</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <ExpenseOverview />
        </TabsContent>

        <TabsContent value="goals">
          <Goals />
        </TabsContent>
      </Tabs>
    </div>
  );
}