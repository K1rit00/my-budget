import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BudgetEditor } from "./BudgetEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Edit, Trash2, Plus, DollarSign, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface IncomeCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  isDefault: boolean;
}

interface UtilityType {
  id: string;
  name: string;
  unit: string;
  color: string;
  description?: string;
}

const initialCurrencies: Currency[] = [
  { id: "1", code: "KZT", name: "Казахстанский тенге", symbol: "₸", rate: 1 },
  { id: "2", code: "USD", name: "Доллар США", symbol: "$", rate: 477.50 },
  { id: "3", code: "EUR", name: "Евро", symbol: "€", rate: 520.20 },
  { id: "4", code: "RUB", name: "Российский рубль", symbol: "₽", rate: 4.85 },
];

const initialIncomeCategories: IncomeCategory[] = [
  { id: "1", name: "Зарплата", color: "bg-green-500", description: "Основная заработная плата" },
  { id: "2", name: "Фриланс", color: "bg-blue-500", description: "Дополнительные проекты" },
  { id: "3", name: "Инвестиции", color: "bg-purple-500", description: "Доходы от инвестиций" },
  { id: "4", name: "Подарки", color: "bg-pink-500", description: "Денежные подарки" },
];

const initialExpenseCategories: ExpenseCategory[] = [
  { id: "1", name: "Продукты", color: "bg-blue-500", isDefault: true },
  { id: "2", name: "Транспорт", color: "bg-green-500", isDefault: true },
  { id: "3", name: "Развлечения", color: "bg-purple-500", isDefault: false },
  { id: "4", name: "Здоровье", color: "bg-orange-500", isDefault: true },
  { id: "5", name: "Одежда", color: "bg-pink-500", isDefault: false },
  { id: "6", name: "Коммунальные", color: "bg-yellow-500", isDefault: true },
  { id: "7", name: "Образование", color: "bg-indigo-500", isDefault: false },
];

const initialUtilityTypes: UtilityType[] = [
  { id: "1", name: "Электричество", unit: "кВт⋅ч", color: "bg-yellow-500", description: "Расход электроэнергии" },
  { id: "2", name: "Газ", unit: "м³", color: "bg-orange-500", description: "Природный газ" },
  { id: "3", name: "Горячая вода", unit: "м³", color: "bg-red-500", description: "Горячее водоснабжение" },
  { id: "4", name: "Холодная вода", unit: "м³", color: "bg-blue-500", description: "Холодное водоснабжение" },
  { id: "5", name: "Отопление", unit: "Гкал", color: "bg-gray-500", description: "Центральное отопление" },
  { id: "6", name: "Водоотведение", unit: "м³", color: "bg-purple-500", description: "Канализация" },
  { id: "7", name: "Вывоз мусора", unit: "услуга", color: "bg-green-500", description: "Утилизация отходов" },
  { id: "8", name: "Интернет", unit: "услуга", color: "bg-indigo-500", description: "Интернет-подключение" },
  { id: "9", name: "Домофон", unit: "услуга", color: "bg-pink-500", description: "Обслуживание домофона" },
  { id: "10", name: "Консьерж", unit: "услуга", color: "bg-teal-500", description: "Услуги консьержа" }
];

export function References() {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(initialIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(initialExpenseCategories);
  const [utilityTypes, setUtilityTypes] = useState<UtilityType[]>(initialUtilityTypes);
  const [selectedCurrency, setSelectedCurrency] = useState("KZT");

  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", 
    "bg-orange-500", "bg-pink-500", "bg-red-500",
    "bg-yellow-500", "bg-indigo-500", "bg-teal-500",
    "bg-gray-500", "bg-slate-500", "bg-cyan-500"
  ];

  // Валюта
  const CurrencySettings = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ code: "", name: "", symbol: "", rate: 0 });

    const handleAddCurrency = () => {
      const newCurrency: Currency = {
        id: Date.now().toString(),
        ...formData
      };
      setCurrencies([...currencies, newCurrency]);
      setFormData({ code: "", name: "", symbol: "", rate: 0 });
      setIsDialogOpen(false);
    };

    return (
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Настройки валюты
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить валюту
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить валюту</DialogTitle>
                <DialogDescription>
                  Добавьте новую валюту в систему с курсом к тенге
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Код валюты</Label>
                    <Input 
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="USD"
                    />
                  </div>
                  <div>
                    <Label>Символ</Label>
                    <Input 
                      value={formData.symbol}
                      onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                      placeholder="$"
                    />
                  </div>
                </div>
                <div>
                  <Label>Название</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Доллар США"
                  />
                </div>
                <div>
                  <Label>Курс к тенге</Label>
                  <Input 
                    type="number" 
                    value={formData.rate}
                    onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
                    placeholder="477.50"
                  />
                </div>
                <Button onClick={handleAddCurrency} className="w-full">
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Основная ��алюта</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h4>Доступные валюты:</h4>
            {currencies.map((currency) => (
              <div key={currency.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <span className="font-medium">{currency.symbol} {currency.code}</span>
                  <span className="text-muted-foreground ml-2">{currency.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">1 {currency.code} = {currency.rate} ₸</Badge>
                  {currency.code !== "KZT" && (
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Категории доходов
  const IncomeCategories = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", color: "bg-green-500", description: "" });

    const handleAdd = () => {
      const newCategory: IncomeCategory = {
        id: Date.now().toString(),
        ...formData
      };
      setIncomeCategories([...incomeCategories, newCategory]);
      setFormData({ name: "", color: "bg-green-500", description: "" });
      setIsDialogOpen(false);
    };

    return (
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Категории доходов
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая кат��гория дохода</DialogTitle>
                <DialogDescription>
                  Создайте новую категорию для классификации доходов
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Название категории"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full">
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incomeCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Категории расходов
  const ExpenseCategories = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", color: "bg-blue-500", description: "", isDefault: false });

    const handleAdd = () => {
      const newCategory: ExpenseCategory = {
        id: Date.now().toString(),
        ...formData
      };
      setExpenseCategories([...expenseCategories, newCategory]);
      setFormData({ name: "", color: "bg-blue-500", description: "", isDefault: false });
      setIsDialogOpen(false);
    };

    return (
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Категории расходов
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая категория расхода</DialogTitle>
                <DialogDescription>
                  Создайте новую категорию для классификации расходов
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Название категории"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <Label htmlFor="isDefault">Категория по умолчанию</Label>
                </div>
                <Button onClick={handleAdd} className="w-full">
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{category.name}</p>
                      {category.isDefault && <Badge variant="secondary" className="text-xs">По умолчанию</Badge>}
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Типы коммунальных услуг
  const UtilityTypes = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", unit: "", color: "bg-yellow-500", description: "" });

    const handleAdd = () => {
      const newType: UtilityType = {
        id: Date.now().toString(),
        ...formData
      };
      setUtilityTypes([...utilityTypes, newType]);
      setFormData({ name: "", unit: "", color: "bg-yellow-500", description: "" });
      setIsDialogOpen(false);
    };

    return (
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Типы коммунальных услуг
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить тип услуги
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый тип коммунальной услуги</DialogTitle>
                <DialogDescription>
                  Добавьте новый тип коммунальной услуги в справочник
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Электричество"
                  />
                </div>
                <div>
                  <Label>Единица измерения</Label>
                  <Input 
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="кВт⋅ч"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full">
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {utilityTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${type.color}`} />
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Единица: {type.unit}
                      {type.description && ` • ${type.description}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="budget-categories" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="budget-categories">Категории бюджета</TabsTrigger>
          <TabsTrigger value="currency">Валюта</TabsTrigger>
          <TabsTrigger value="income">Доходы</TabsTrigger>
          <TabsTrigger value="expenses">Расходы</TabsTrigger>
          <TabsTrigger value="utilities">Коммунальные</TabsTrigger>
        </TabsList>

        <TabsContent value="budget-categories" className="space-y-6">
          <BudgetEditor />
        </TabsContent>

        <TabsContent value="currency" className="space-y-6">
          <CurrencySettings />
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <IncomeCategories />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <ExpenseCategories />
        </TabsContent>

        <TabsContent value="utilities" className="space-y-6">
          <UtilityTypes />
        </TabsContent>
      </Tabs>
    </div>
  );
}