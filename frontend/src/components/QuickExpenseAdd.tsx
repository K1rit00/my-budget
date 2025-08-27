import { useState } from "react";
import { Plus, Calculator, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

const categories = [
  "Продукты", "Транспорт", "Развлечения", "Здоровье", 
  "Одежда", "Кредиты", "Аренда", "Коммунальные", "Прочее"
];

export function QuickExpenseAdd() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState({
    amount: 0,
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [quickAmounts] = useState([500, 2500, 5000, 10000, 25000]);

  const handleAddExpense = () => {
    if (!formData.amount || !formData.category) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date)
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({
      amount: 0,
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleQuickAmount = (amount: number) => {
    setFormData({ ...formData, amount });
  };

  const getTodayExpenses = () => {
    const today = new Date().toDateString();
    return expenses.filter(expense => expense.date.toDateString() === today);
  };

  const todayTotal = getTodayExpenses().reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Быстрое добавление расхода
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Сумма (₸)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ""}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              placeholder="0"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className="text-xs"
                >
                  {amount.toLocaleString("kk-KZ")}₸
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Категория</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Краткое описание расхода"
              rows={2}
            />
          </div>

          <Button onClick={handleAddExpense} className="w-full" disabled={!formData.amount || !formData.category}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить расход
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Расходы за сегодня
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {todayTotal.toLocaleString("kk-KZ")} ₸
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {getTodayExpenses().length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Сегодня ещё нет расходов
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {getTodayExpenses().map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      {expense.description && (
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      -{expense.amount.toLocaleString("kk-KZ")} ₸
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expense.date.toLocaleTimeString("ru-RU", { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}