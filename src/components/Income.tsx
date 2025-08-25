import { useState } from "react";
import { TrendingUp, Plus, Calendar, DollarSign, PieChart, BarChart3, Edit, Trash2, Target, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

// Справочник категорий доходов (берем из References)
const incomeCategoriesReference = [
  { id: "1", name: "Зарплата", color: "bg-green-500", description: "Основная заработная плата" },
  { id: "2", name: "Фриланс", color: "bg-blue-500", description: "Дополнительные проекты" },
  { id: "3", name: "Инвестиции", color: "bg-purple-500", description: "Доходы от инвестиций" },
  { id: "4", name: "Подарки", color: "bg-pink-500", description: "Денежные подарки" },
  { id: "5", name: "Бизнес", color: "bg-orange-500", description: "Доходы от бизнеса" },
  { id: "6", name: "Аренда", color: "bg-cyan-500", description: "Доходы от аренды" },
  { id: "7", name: "Продажа", color: "bg-red-500", description: "Продажа имущества" },
  { id: "8", name: "Стипендия", color: "bg-indigo-500", description: "Стипендия или пособие" }
];

interface IncomeRecord {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringType?: "weekly" | "monthly" | "yearly";
  tags?: string[];
}

interface IncomeGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  categoryId?: string;
  isActive: boolean;
}

const initialIncomes: IncomeRecord[] = [
  {
    id: "1",
    categoryId: "1",
    amount: 350000,
    description: "Основная зарплата за январь",
    date: new Date(2025, 0, 25),
    isRecurring: true,
    recurringType: "monthly"
  },
  {
    id: "2",
    categoryId: "2",
    amount: 75000,
    description: "Разработка веб-сайта для клиента",
    date: new Date(2025, 0, 20),
    isRecurring: false,
    tags: ["веб-разработка", "проект"]
  },
  {
    id: "3",
    categoryId: "3",
    amount: 12500,
    description: "Дивиденды от акций",
    date: new Date(2025, 0, 15),
    isRecurring: true,
    recurringType: "monthly"
  },
  {
    id: "4",
    categoryId: "4",
    amount: 50000,
    description: "День рождения от родителей",
    date: new Date(2025, 0, 10),
    isRecurring: false
  },
  // Прошлый месяц
  {
    id: "5",
    categoryId: "1",
    amount: 350000,
    description: "Основная зарплата за декабрь",
    date: new Date(2024, 11, 25),
    isRecurring: true,
    recurringType: "monthly"
  },
  {
    id: "6",
    categoryId: "2",
    amount: 95000,
    description: "Консультация по IT проектам",
    date: new Date(2024, 11, 18),
    isRecurring: false,
    tags: ["консультация", "IT"]
  }
];

const initialGoals: IncomeGoal[] = [
  {
    id: "1",
    title: "Месячная цель по доходам",
    targetAmount: 500000,
    currentAmount: 487500,
    deadline: new Date(2025, 0, 31),
    isActive: true
  },
  {
    id: "2",
    title: "Фриланс доходы в квартал",
    targetAmount: 200000,
    currentAmount: 75000,
    deadline: new Date(2025, 2, 31),
    categoryId: "2",
    isActive: true
  }
];

export function Income() {
  const [incomes, setIncomes] = useState<IncomeRecord[]>(initialIncomes);
  const [goals, setGoals] = useState<IncomeGoal[]>(initialGoals);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [editingGoal, setEditingGoal] = useState<IncomeGoal | null>(null);
  
  const [incomeFormData, setIncomeFormData] = useState({
    categoryId: "",
    amount: 0,
    description: "",
    isRecurring: false,
    recurringType: "monthly" as "weekly" | "monthly" | "yearly",
    tags: ""
  });

  const [goalFormData, setGoalFormData] = useState({
    title: "",
    targetAmount: 0,
    deadline: "",
    categoryId: ""
  });

  const getCategoryById = (id: string) => {
    return incomeCategoriesReference.find(cat => cat.id === id);
  };

  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return incomes
      .filter(income => {
        const incomeDate = income.date;
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      })
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const getTotalYearIncome = () => {
    const currentYear = new Date().getFullYear();
    return incomes
      .filter(income => income.date.getFullYear() === currentYear)
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const getRecurringMonthlyIncome = () => {
    return incomes
      .filter(income => income.isRecurring && income.recurringType === "monthly")
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const resetIncomeForm = () => {
    setIncomeFormData({
      categoryId: "",
      amount: 0,
      description: "",
      isRecurring: false,
      recurringType: "monthly",
      tags: ""
    });
    setEditingIncome(null);
  };

  const resetGoalForm = () => {
    setGoalFormData({
      title: "",
      targetAmount: 0,
      deadline: "",
      categoryId: ""
    });
    setEditingGoal(null);
  };

  const handleAddIncome = () => {
    if (!incomeFormData.categoryId || incomeFormData.amount <= 0 || !incomeFormData.description) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const newIncome: IncomeRecord = {
      id: Date.now().toString(),
      categoryId: incomeFormData.categoryId,
      amount: incomeFormData.amount,
      description: incomeFormData.description,
      date: new Date(),
      isRecurring: incomeFormData.isRecurring,
      recurringType: incomeFormData.isRecurring ? incomeFormData.recurringType : undefined,
      tags: incomeFormData.tags ? incomeFormData.tags.split(',').map(tag => tag.trim()) : undefined
    };

    setIncomes([newIncome, ...incomes]);
    resetIncomeForm();
    setIsIncomeDialogOpen(false);

    const category = getCategoryById(incomeFormData.categoryId);
    toast.success("Доход добавлен", {
      description: `${category?.name}: ${incomeFormData.amount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const handleEditIncome = () => {
    if (!editingIncome || !incomeFormData.categoryId || incomeFormData.amount <= 0 || !incomeFormData.description) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const updatedIncome: IncomeRecord = {
      ...editingIncome,
      categoryId: incomeFormData.categoryId,
      amount: incomeFormData.amount,
      description: incomeFormData.description,
      isRecurring: incomeFormData.isRecurring,
      recurringType: incomeFormData.isRecurring ? incomeFormData.recurringType : undefined,
      tags: incomeFormData.tags ? incomeFormData.tags.split(',').map(tag => tag.trim()) : undefined
    };

    setIncomes(incomes.map(inc => inc.id === editingIncome.id ? updatedIncome : inc));
    resetIncomeForm();
    setIsIncomeDialogOpen(false);

    const category = getCategoryById(incomeFormData.categoryId);
    toast.success("Доход обновлен", {
      description: `${category?.name}: ${incomeFormData.amount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const handleDeleteIncome = (incomeId: string) => {
    setIncomes(incomes.filter(inc => inc.id !== incomeId));
    toast.success("Доход удален");
  };

  const openEditIncomeDialog = (income: IncomeRecord) => {
    setEditingIncome(income);
    setIncomeFormData({
      categoryId: income.categoryId,
      amount: income.amount,
      description: income.description,
      isRecurring: income.isRecurring,
      recurringType: income.recurringType || "monthly",
      tags: income.tags?.join(", ") || ""
    });
    setIsIncomeDialogOpen(true);
  };

  const handleAddGoal = () => {
    if (!goalFormData.title || goalFormData.targetAmount <= 0 || !goalFormData.deadline) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const newGoal: IncomeGoal = {
      id: Date.now().toString(),
      title: goalFormData.title,
      targetAmount: goalFormData.targetAmount,
      currentAmount: 0,
      deadline: new Date(goalFormData.deadline),
      categoryId: goalFormData.categoryId === "all" ? undefined : goalFormData.categoryId || undefined,
      isActive: true
    };

    setGoals([newGoal, ...goals]);
    resetGoalForm();
    setIsGoalDialogOpen(false);

    toast.success("Цель добавлена", {
      description: `${goalFormData.title}: ${goalFormData.targetAmount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const RecentIncomes = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">Текущий месяц</span>
            </div>
            <p className="text-2xl text-green-900 dark:text-green-100">
              {getCurrentMonthTotal().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">За год</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {getTotalYearIncome().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">Регулярные</span>
            </div>
            <p className="text-2xl text-purple-900 dark:text-purple-100">
              {getRecurringMonthlyIncome().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Последние доходы</CardTitle>
          <Dialog open={isIncomeDialogOpen} onOpenChange={(open) => {
            setIsIncomeDialogOpen(open);
            if (!open) resetIncomeForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить доход
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingIncome ? "Редактировать доход" : "Новый доход"}
                </DialogTitle>
                <DialogDescription>
                  {editingIncome ? "Внесите изменения в существующий доход" : "Добавьте новый источник дохода"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Категория *</Label>
                  <Select 
                    value={incomeFormData.categoryId} 
                    onValueChange={(value) => setIncomeFormData({...incomeFormData, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategoriesReference.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Сумма (₸) *</Label>
                  <Input 
                    type="number"
                    value={incomeFormData.amount}
                    onChange={(e) => setIncomeFormData({...incomeFormData, amount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>Описание *</Label>
                  <Input 
                    value={incomeFormData.description}
                    onChange={(e) => setIncomeFormData({...incomeFormData, description: e.target.value})}
                    placeholder="Описание дохода"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={incomeFormData.isRecurring}
                    onChange={(e) => setIncomeFormData({ ...incomeFormData, isRecurring: e.target.checked })}
                  />
                  <Label htmlFor="isRecurring">Регулярный доход</Label>
                </div>

                {incomeFormData.isRecurring && (
                  <div>
                    <Label>Периодичность</Label>
                    <Select 
                      value={incomeFormData.recurringType} 
                      onValueChange={(value: "weekly" | "monthly" | "yearly") => setIncomeFormData({...incomeFormData, recurringType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Еженедельно</SelectItem>
                        <SelectItem value="monthly">Ежемесячно</SelectItem>
                        <SelectItem value="yearly">Ежегодно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Теги (через запятую)</Label>
                  <Input 
                    value={incomeFormData.tags}
                    onChange={(e) => setIncomeFormData({...incomeFormData, tags: e.target.value})}
                    placeholder="проект, консультация, бонус"
                  />
                </div>

                <Button 
                  onClick={editingIncome ? handleEditIncome : handleAddIncome} 
                  className="w-full"
                  disabled={!incomeFormData.categoryId || incomeFormData.amount <= 0 || !incomeFormData.description}
                >
                  {editingIncome ? "Сохранить изменения" : "Добавить доход"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {incomes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Категория</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.slice(0, 10).map((income) => {
                  const category = getCategoryById(income.categoryId);
                  return (
                    <TableRow key={income.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category?.color}`} />
                          <div>
                            <p className="font-medium">{category?.name}</p>
                            {income.isRecurring && (
                              <Badge variant="secondary" className="text-xs">
                                {income.recurringType === "weekly" ? "Еженедельно" :
                                 income.recurringType === "monthly" ? "Ежемесячно" : "Ежегодно"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{income.description}</p>
                          {income.tags && income.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {income.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        +{income.amount.toLocaleString("kk-KZ")} ₸
                      </TableCell>
                      <TableCell>{income.date.toLocaleDateString("ru-RU")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditIncomeDialog(income)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteIncome(income.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Доходы не добавлены</p>
              <Button 
                onClick={() => setIsIncomeDialogOpen(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить доход
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const IncomeGoals = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Цели по доходам</CardTitle>
          <Dialog open={isGoalDialogOpen} onOpenChange={(open) => {
            setIsGoalDialogOpen(open);
            if (!open) resetGoalForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить цель
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая цель по доходам</DialogTitle>
                <DialogDescription>
                  Поставьте цель по доходам и отслеживайте ее выполнение
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название цели *</Label>
                  <Input 
                    value={goalFormData.title}
                    onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})}
                    placeholder="Месячная цель по доходам"
                  />
                </div>

                <div>
                  <Label>Целевая сумма (₸) *</Label>
                  <Input 
                    type="number"
                    value={goalFormData.targetAmount}
                    onChange={(e) => setGoalFormData({...goalFormData, targetAmount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>Срок достижения *</Label>
                  <Input 
                    type="date"
                    value={goalFormData.deadline}
                    onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Категория (необязательно)</Label>
                  <Select 
                    value={goalFormData.categoryId} 
                    onValueChange={(value) => setGoalFormData({...goalFormData, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выбе��ите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {incomeCategoriesReference.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAddGoal} 
                  className="w-full"
                  disabled={!goalFormData.title || goalFormData.targetAmount <= 0 || !goalFormData.deadline}
                >
                  Добавить цель
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.filter(goal => goal.isActive).map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const category = goal.categoryId ? getCategoryById(goal.categoryId) : null;
              const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-medium">{goal.title}</h4>
                        {category && (
                          <Badge variant="outline" className={`${category.color} text-white`}>
                            {category.name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {daysLeft > 0 ? `${daysLeft} дней осталось` : "Просрочено"}
                        </p>
                        <p className="font-medium">
                          {goal.currentAmount.toLocaleString("kk-KZ")} / {goal.targetAmount.toLocaleString("kk-KZ")} ₸
                        </p>
                      </div>
                    </div>
                    
                    <Progress value={Math.min(100, progress)} className="h-2" />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{progress.toFixed(1)}% выполнено</span>
                      <span>До {goal.deadline.toLocaleDateString("ru-RU")}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Analytics = () => {
    const currentYear = new Date().getFullYear();
    const yearlyIncomes = incomes.filter(income => income.date.getFullYear() === currentYear);
    
    // Группируем по месяцам для графика
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const monthIncomes = yearlyIncomes.filter(income => income.date.getMonth() === month);
      const total = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
      return {
        month: new Date(currentYear, month, 1).toLocaleDateString("ru-RU", { month: "short" }),
        amount: total
      };
    });

    // Анализ по категориям
    const categoryStats = incomeCategoriesReference.map(category => {
      const categoryIncomes = yearlyIncomes.filter(income => income.categoryId === category.id);
      const total = categoryIncomes.reduce((sum, income) => sum + income.amount, 0);
      const count = categoryIncomes.length;
      const average = count > 0 ? total / count : 0;
      
      return {
        ...category,
        total,
        count,
        average,
        percentage: getTotalYearIncome() > 0 ? (total / getTotalYearIncome()) * 100 : 0
      };
    }).filter(stat => stat.total > 0)
      .sort((a, b) => b.total - a.total);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300">Средний месяц</span>
              </div>
              <p className="text-2xl text-green-900 dark:text-green-100">
                {yearlyIncomes.length > 0 
                  ? Math.round(getTotalYearIncome() / 12).toLocaleString("kk-KZ")
                  : 0
                } ₸
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">Категорий активных</span>
              </div>
              <p className="text-2xl text-blue-900 dark:text-blue-100">
                {categoryStats.length}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700">Активных целей</span>
              </div>
              <p className="text-2xl text-purple-900">
                {goals.filter(goal => goal.isActive).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Структура доходов по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${stat.color}`} />
                      <span>{stat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{stat.total.toLocaleString("kk-KZ")} ₸</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({stat.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={stat.percentage} className="h-2" />
                  <div className="text-sm text-muted-foreground ml-6">
                    {stat.count} поступлени{stat.count > 1 ? 'й' : 'е'} • 
                    Средний: {stat.average.toLocaleString("kk-KZ")} ₸
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="incomes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incomes">Доходы</TabsTrigger>
          <TabsTrigger value="goals">Цели</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="incomes">
          <RecentIncomes />
        </TabsContent>

        <TabsContent value="goals">
          <IncomeGoals />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}