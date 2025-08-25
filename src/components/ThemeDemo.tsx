import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  XCircle,
  Sun,
  Moon,
  Star,
  Heart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Target
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const sampleData = [
  { month: "Янв", доходы: 450000, расходы: 320000 },
  { month: "Фев", доходы: 480000, расходы: 350000 },
  { month: "Мар", доходы: 520000, расходы: 380000 },
  { month: "Апр", доходы: 495000, расходы: 360000 },
];

const pieData = [
  { name: "Кредиты", value: 45, color: "#ef4444" },
  { name: "Продукты", value: 25, color: "#10b981" },
  { name: "Развлечения", value: 15, color: "#3b82f6" },
  { name: "Прочее", value: 15, color: "#8b5cf6" },
];

export function ThemeDemo() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 mb-1">Доходы</p>
                <p className="text-2xl text-green-900 dark:text-green-100">487,500 ₸</p>
              </div>
              <div className="w-12 h-12 bg-green-200 dark:bg-green-800/50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400 mb-1">Расходы</p>
                <p className="text-2xl text-red-900 dark:text-red-100">358,900 ₸</p>
              </div>
              <div className="w-12 h-12 bg-red-200 dark:bg-red-800/50 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-700 dark:text-red-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Баланс</p>
                <p className="text-2xl text-blue-900 dark:text-blue-100">1,250,000 ₸</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800/50 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-400 mb-1">Цели</p>
                <p className="text-2xl text-purple-900 dark:text-purple-100">75%</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800/50 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Тренды доходов и расходов</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="fill-muted-foreground" />
                <YAxis className="fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="доходы" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="расходы" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Структура расходов</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Form Elements */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Элементы форм в темной теме</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inputs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inputs">Поля ввода</TabsTrigger>
              <TabsTrigger value="buttons">Кнопки</TabsTrigger>
              <TabsTrigger value="controls">Контролы</TabsTrigger>
              <TabsTrigger value="feedback">Обратная связь</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Введите имя" />
                </div>
                <div>
                  <Label htmlFor="select">Категория</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Продукты</SelectItem>
                      <SelectItem value="transport">Транспорт</SelectItem>
                      <SelectItem value="entertainment">Развлечения</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Сумма</Label>
                  <Input id="amount" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" placeholder="Добавьте описание..." />
              </div>
            </TabsContent>

            <TabsContent value="buttons" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Основная кнопка</Button>
                <Button variant="secondary">Вторичная</Button>
                <Button variant="outline">Контурная</Button>
                <Button variant="ghost">Прозрачная</Button>
                <Button variant="link">Ссылка</Button>
                <Button variant="destructive">Удалить</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Маленькая</Button>
                <Button size="default">Обычная</Button>
                <Button size="lg">Большая</Button>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" checked={switchValue} onCheckedChange={setSwitchValue} />
                  <Label htmlFor="notifications">Уведомления</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Прогресс выполнения цели</Label>
                  <Progress value={75} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label>Размер ежемесячного платежа: {sliderValue[0]}%</Label>
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Тип платежа</Label>
                  <RadioGroup defaultValue="regular">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="regular" />
                      <Label htmlFor="regular">Регулярный</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="early" id="early" />
                      <Label htmlFor="early">Досрочный</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="overpayment" id="overpayment" />
                      <Label htmlFor="overpayment">Переплата</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Согласен с условиями</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Информация</AlertTitle>
                  <AlertDescription>
                    Это информационное сообщение в темной теме.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>
                    Произошла ошибка при обработке платежа.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-wrap gap-2">
                  <Badge>Активный</Badge>
                  <Badge variant="secondary">Вторичный</Badge>
                  <Badge variant="outline">Контурный</Badge>
                  <Badge variant="destructive">Удалено</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}