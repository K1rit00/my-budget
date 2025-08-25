import { useState } from "react";
import { Heart, Target, Plus, Calendar, TrendingUp, Gift, Plane, Home, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Dream {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: "travel" | "property" | "vehicle" | "education" | "business" | "gift" | "other";
  monthlyContribution: number;
  priority: "high" | "medium" | "low";
  isActive: boolean;
}

interface Contribution {
  id: string;
  dreamId: string;
  amount: number;
  date: Date;
  description?: string;
}

const initialDreams: Dream[] = [
  {
    id: "1",
    title: "Отпуск в Японии",
    description: "Путешествие на 2 недели с посещением Токио, Киото и Осаки",
    targetAmount: 1500000,
    currentAmount: 625000,
    deadline: new Date(2025, 6, 1),
    category: "travel",
    monthlyContribution: 125000,
    priority: "high",
    isActive: true
  },
  {
    id: "2",
    title: "Новый автомобиль",
    description: "Накопления на первоначальный взнос для покупки автомобиля",
    targetAmount: 2500000,
    currentAmount: 900000,
    deadline: new Date(2025, 11, 31),
    category: "vehicle",
    monthlyContribution: 100000,
    priority: "medium",
    isActive: true
  },
  {
    id: "3",
    title: "Свадьба",
    description: "Организация торжества мечты",
    targetAmount: 4000000,
    currentAmount: 0,
    deadline: new Date(2026, 5, 15),
    category: "other",
    monthlyContribution: 150000,
    priority: "high",
    isActive: false
  }
];

const initialContributions: Contribution[] = [
  {
    id: "1",
    dreamId: "1",
    amount: 125000,
    date: new Date(2024, 11, 1),
    description: "Ежемесячное пополнение"
  },
  {
    id: "2",
    dreamId: "1",
    amount: 50000,
    date: new Date(2024, 11, 15),
    description: "Премия на работе"
  },
  {
    id: "3",
    dreamId: "2",
    amount: 100000,
    date: new Date(2024, 11, 1),
    description: "Регулярное накопление"
  }
];

export function Dream() {
  const [dreams, setDreams] = useState<Dream[]>(initialDreams);
  const [contributions, setContributions] = useState<Contribution[]>(initialContributions);
  const [isDreamDialogOpen, setIsDreamDialogOpen] = useState(false);
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false);
  const [selectedDreamId, setSelectedDreamId] = useState<string>("");
  
  const [dreamFormData, setDreamFormData] = useState({
    title: "",
    description: "",
    targetAmount: 0,
    deadline: "",
    category: "other" as Dream["category"],
    monthlyContribution: 0,
    priority: "medium" as Dream["priority"]
  });

  const [contributionFormData, setContributionFormData] = useState({
    dreamId: "",
    amount: 0,
    description: ""
  });

  const categoryLabels = {
    travel: "Путешествия",
    property: "Недвижимость",
    vehicle: "Транспорт",
    education: "Образование",
    business: "Бизнес",
    gift: "Подарки",
    other: "Прочее"
  };

  const categoryIcons = {
    travel: Plane,
    property: Home,
    vehicle: Car,
    education: Target,
    business: TrendingUp,
    gift: Gift,
    other: Heart
  };

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

  const getTotalSavings = () => {
    return dreams.reduce((sum, dream) => sum + dream.currentAmount, 0);
  };

  const getMonthlyContributions = () => {
    return dreams
      .filter(dream => dream.isActive)
      .reduce((sum, dream) => sum + dream.monthlyContribution, 0);
  };

  const getActiveDreams = () => {
    return dreams.filter(dream => dream.isActive);
  };

  const getDreamContributions = (dreamId: string) => {
    return contributions.filter(contribution => contribution.dreamId === dreamId);
  };

  const handleAddDream = () => {
    const newDream: Dream = {
      id: Date.now().toString(),
      ...dreamFormData,
      currentAmount: 0,
      deadline: new Date(dreamFormData.deadline),
      isActive: true
    };
    setDreams([...dreams, newDream]);
    setDreamFormData({
      title: "",
      description: "",
      targetAmount: 0,
      deadline: "",
      category: "other",
      monthlyContribution: 0,
      priority: "medium"
    });
    setIsDreamDialogOpen(false);
  };

  const handleAddContribution = () => {
    const newContribution: Contribution = {
      id: Date.now().toString(),
      dreamId: contributionFormData.dreamId,
      amount: contributionFormData.amount,
      date: new Date(),
      description: contributionFormData.description
    };
    
    setContributions([...contributions, newContribution]);
    
    // Обновляем текущую сумму в мечте
    setDreams(dreams.map(dream => 
      dream.id === contributionFormData.dreamId
        ? { ...dream, currentAmount: dream.currentAmount + contributionFormData.amount }
        : dream
    ));
    
    setContributionFormData({
      dreamId: "",
      amount: 0,
      description: ""
    });
    setIsContributionDialogOpen(false);
  };

  const getMonthsToGoal = (dream: Dream) => {
    if (dream.monthlyContribution <= 0) return "∞";
    const remaining = dream.targetAmount - dream.currentAmount;
    const months = Math.ceil(remaining / dream.monthlyContribution);
    return months > 0 ? months : 0;
  };

  const DreamsList = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">Всего накоплено</span>
            </div>
            <p className="text-2xl text-purple-900 dark:text-purple-100">
              {getTotalSavings().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">В месяц откладываю</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {getMonthlyContributions().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">Активных целей</span>
            </div>
            <p className="text-2xl text-green-900 dark:text-green-100">
              {getActiveDreams().length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Мои мечты и цели</CardTitle>
          <Dialog open={isDreamDialogOpen} onOpenChange={setIsDreamDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить мечту
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Новая мечта</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input 
                    value={dreamFormData.title}
                    onChange={(e) => setDreamFormData({...dreamFormData, title: e.target.value})}
                    placeholder="Название мечты"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea 
                    value={dreamFormData.description}
                    onChange={(e) => setDreamFormData({...dreamFormData, description: e.target.value})}
                    placeholder="Подробное описание"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Целевая сумма</Label>
                    <Input 
                      type="number"
                      value={dreamFormData.targetAmount}
                      onChange={(e) => setDreamFormData({...dreamFormData, targetAmount: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Ежемесячно</Label>
                    <Input 
                      type="number"
                      value={dreamFormData.monthlyContribution}
                      onChange={(e) => setDreamFormData({...dreamFormData, monthlyContribution: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Срок достижения</Label>
                    <Input 
                      type="date"
                      value={dreamFormData.deadline}
                      onChange={(e) => setDreamFormData({...dreamFormData, deadline: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Приоритет</Label>
                    <Select 
                      value={dreamFormData.priority} 
                      onValueChange={(value: Dream["priority"]) => 
                        setDreamFormData({...dreamFormData, priority: value})
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
                </div>
                <div>
                  <Label>Категория</Label>
                  <Select 
                    value={dreamFormData.category} 
                    onValueChange={(value: Dream["category"]) => 
                      setDreamFormData({...dreamFormData, category: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddDream} className="w-full">
                  Добавить мечту
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dreams.map((dream) => {
              const progressPercentage = (dream.currentAmount / dream.targetAmount) * 100;
              const IconComponent = categoryIcons[dream.category];
              const monthsLeft = getMonthsToGoal(dream);
              
              return (
                <div key={dream.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{dream.title}</h4>
                          <Badge className={priorityColors[dream.priority]}>
                            {priorityLabels[dream.priority]}
                          </Badge>
                          <Badge variant="outline">{categoryLabels[dream.category]}</Badge>
                          {!dream.isActive && (
                            <Badge variant="secondary">Неактивна</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{dream.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600 dark:text-purple-400">
                        {dream.currentAmount.toLocaleString("kk-KZ")} ₸
                      </p>
                      <p className="text-sm text-muted-foreground">
                        из {dream.targetAmount.toLocaleString("kk-KZ")} ₸
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progressPercentage.toFixed(1)}% накоплено</span>
                      <span>
                        {typeof monthsLeft === "number" ? `${monthsLeft} мес. до цели` : "Нет ежемесячных взносов"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>До {dream.deadline.toLocaleDateString("ru-RU")}</span>
                      <span>
                        {dream.monthlyContribution.toLocaleString("kk-KZ")} ₸/мес
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedDreamId(dream.id);
                        setContributionFormData({...contributionFormData, dreamId: dream.id});
                        setIsContributionDialogOpen(true);
                      }}
                    >
                      Пополнить
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setDreams(dreams.map(d => 
                          d.id === dream.id 
                            ? {...d, isActive: !d.isActive}
                            : d
                        ));
                      }}
                    >
                      {dream.isActive ? "Приостановить" : "Активировать"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isContributionDialogOpen} onOpenChange={setIsContributionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пополнить накопления</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Выберите мечту</Label>
              <Select 
                value={contributionFormData.dreamId} 
                onValueChange={(value) => setContributionFormData({...contributionFormData, dreamId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите мечту" />
                </SelectTrigger>
                <SelectContent>
                  {dreams.filter(dream => dream.isActive).map((dream) => (
                    <SelectItem key={dream.id} value={dream.id}>{dream.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Сумма пополнения</Label>
              <Input 
                type="number"
                value={contributionFormData.amount}
                onChange={(e) => setContributionFormData({...contributionFormData, amount: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Комментарий (необязательно)</Label>
              <Input 
                value={contributionFormData.description}
                onChange={(e) => setContributionFormData({...contributionFormData, description: e.target.value})}
                placeholder="Источник средств"
              />
            </div>
            <Button onClick={handleAddContribution} className="w-full">
              Пополнить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const ContributionHistory = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>История пополнений</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contributions
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((contribution) => {
              const dream = dreams.find(d => d.id === contribution.dreamId);
              if (!dream) return null;
              
              return (
                <div key={contribution.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <div>
                      <p className="font-medium">{dream.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {contribution.date.toLocaleDateString("ru-RU")}
                        {contribution.description && ` • ${contribution.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      +{contribution.amount.toLocaleString("kk-KZ")} ₸
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dreams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dreams">Мои мечты</TabsTrigger>
          <TabsTrigger value="history">История пополнений</TabsTrigger>
        </TabsList>

        <TabsContent value="dreams">
          <DreamsList />
        </TabsContent>

        <TabsContent value="history">
          <ContributionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}