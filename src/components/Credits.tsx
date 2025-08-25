import { useState } from "react";
import { CreditCard, Plus, Calendar, DollarSign, TrendingDown, Calculator, Target, CheckCircle, AlertCircle, Trash2, Edit } from "lucide-react";
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

interface Credit {
  id: string;
  name: string;
  type: "credit" | "mortgage" | "installment";
  principal: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
  totalMonths: number;
  nextPaymentDate: Date;
  bank: string;
  isActive: boolean;
}

interface Payment {
  id: string;
  creditId: string;
  amount: number;
  date: Date;
  type: "regular" | "early" | "overpayment";
  principalPart: number;
  interestPart: number;
}

interface EarlyPaymentPlan {
  id: string;
  creditId: string;
  strategy: "reduce_term" | "reduce_payment" | "full_payoff";
  extraAmount: number;
  startDate: Date;
  frequency: "monthly" | "quarterly" | "annually" | "once";
  isActive: boolean;
}

const initialCredits: Credit[] = [
  {
    id: "1",
    name: "Ипотека на квартиру",
    type: "mortgage",
    principal: 15000000,
    remainingAmount: 12500000,
    interestRate: 14.5,
    monthlyPayment: 185000,
    remainingMonths: 180,
    totalMonths: 240,
    nextPaymentDate: new Date(2025, 1, 15),
    bank: "Казком",
    isActive: true
  },
  {
    id: "2",
    name: "Потребительский кредит",
    type: "credit",
    principal: 2000000,
    remainingAmount: 850000,
    interestRate: 18.9,
    monthlyPayment: 87500,
    remainingMonths: 12,
    totalMonths: 24,
    nextPaymentDate: new Date(2025, 1, 20),
    bank: "Халык Банк",
    isActive: true
  },
  {
    id: "3",
    name: "Рассрочка iPhone",
    type: "installment",
    principal: 450000,
    remainingAmount: 180000,
    interestRate: 0,
    monthlyPayment: 45000,
    remainingMonths: 4,
    totalMonths: 10,
    nextPaymentDate: new Date(2025, 1, 10),
    bank: "Техномарт",
    isActive: true
  }
];

const initialPayments: Payment[] = [
  {
    id: "1",
    creditId: "1",
    amount: 185000,
    date: new Date(2025, 0, 15),
    type: "regular",
    principalPart: 35000,
    interestPart: 150000
  },
  {
    id: "2",
    creditId: "2",
    amount: 87500,
    date: new Date(2025, 0, 20),
    type: "regular",
    principalPart: 73500,
    interestPart: 14000
  },
  {
    id: "3",
    creditId: "1",
    amount: 200000,
    date: new Date(2025, 0, 25),
    type: "early",
    principalPart: 200000,
    interestPart: 0
  }
];

export function Credits() {
  const [credits, setCredits] = useState<Credit[]>(initialCredits);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [earlyPaymentPlans, setEarlyPaymentPlans] = useState<EarlyPaymentPlan[]>([]);
  const [isAddCreditDialogOpen, setIsAddCreditDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isEarlyPaymentDialogOpen, setIsEarlyPaymentDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  
  const [creditFormData, setCreditFormData] = useState({
    name: "",
    type: "credit" as "credit" | "mortgage" | "installment",
    principal: 0,
    interestRate: 0,
    totalMonths: 0,
    monthlyPayment: 0,
    bank: ""
  });

  const [paymentFormData, setPaymentFormData] = useState({
    creditId: "",
    amount: 0,
    type: "regular" as "regular" | "early" | "overpayment"
  });

  const [earlyPaymentFormData, setEarlyPaymentFormData] = useState({
    creditId: "",
    strategy: "reduce_term" as "reduce_term" | "reduce_payment" | "full_payoff",
    extraAmount: 0,
    frequency: "monthly" as "monthly" | "quarterly" | "annually" | "once"
  });

  const calculateEarlySavings = (credit: Credit, extraAmount: number, strategy: string) => {
    const monthlyRate = credit.interestRate / 100 / 12;
    let remainingAmount = credit.remainingAmount;
    let months = credit.remainingMonths;
    let totalInterest = 0;
    
    // Расчет без досрочного погашения
    const originalTotalInterest = (credit.monthlyPayment * months) - remainingAmount;
    
    if (strategy === "full_payoff") {
      return {
        monthsSaved: months,
        interestSaved: originalTotalInterest,
        newMonthlyPayment: 0,
        newTotalMonths: 0
      };
    }
    
    // Расчет с досрочным погашением
    let newMonthlyPayment = credit.monthlyPayment;
    let currentMonth = 0;
    
    while (remainingAmount > 0 && currentMonth < months) {
      const interestPayment = remainingAmount * monthlyRate;
      let principalPayment = newMonthlyPayment - interestPayment;
      
      if (strategy === "reduce_term") {
        principalPayment += extraAmount;
      }
      
      if (principalPayment > remainingAmount) {
        principalPayment = remainingAmount;
      }
      
      totalInterest += interestPayment;
      remainingAmount -= principalPayment;
      currentMonth++;
      
      if (strategy === "reduce_payment" && currentMonth === 1) {
        // Пересчитать ежемесячный платеж после досрочного погашения
        remainingAmount -= extraAmount;
        newMonthlyPayment = (remainingAmount * monthlyRate * Math.pow(1 + monthlyRate, months - 1)) / 
                           (Math.pow(1 + monthlyRate, months - 1) - 1);
      }
    }
    
    return {
      monthsSaved: months - currentMonth,
      interestSaved: originalTotalInterest - totalInterest,
      newMonthlyPayment: strategy === "reduce_payment" ? newMonthlyPayment : credit.monthlyPayment,
      newTotalMonths: currentMonth
    };
  };

  const getTotalDebt = () => {
    return credits.filter(c => c.isActive).reduce((sum, credit) => sum + credit.remainingAmount, 0);
  };

  const getMonthlyPayments = () => {
    return credits.filter(c => c.isActive).reduce((sum, credit) => sum + credit.monthlyPayment, 0);
  };

  const getThisMonthPayments = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments
      .filter(payment => {
        const paymentDate = payment.date;
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const CreditOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300">Общий долг</span>
            </div>
            <p className="text-2xl text-red-900 dark:text-red-100">
              {getTotalDebt().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-700 dark:text-orange-300">Ежемесячно</span>
            </div>
            <p className="text-2xl text-orange-900 dark:text-orange-100">
              {getMonthlyPayments().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">Оплачено в месяце</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {getThisMonthPayments().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Активные кредиты</CardTitle>
          <Dialog open={isAddCreditDialogOpen} onOpenChange={setIsAddCreditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить кредит
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый кредит</DialogTitle>
                <DialogDescription>
                  Добавьте новый кредит или рассрочку для отслеживания
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input 
                    value={creditFormData.name}
                    onChange={(e) => setCreditFormData({...creditFormData, name: e.target.value})}
                    placeholder="Название кредита"
                  />
                </div>
                
                <div>
                  <Label>Тип</Label>
                  <Select 
                    value={creditFormData.type} 
                    onValueChange={(value: "credit" | "mortgage" | "installment") => 
                      setCreditFormData({...creditFormData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Потребительский кредит</SelectItem>
                      <SelectItem value="mortgage">Ипотека</SelectItem>
                      <SelectItem value="installment">Рассрочка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Сумма кредита (₸)</Label>
                    <Input 
                      type="number"
                      value={creditFormData.principal}
                      onChange={(e) => setCreditFormData({...creditFormData, principal: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Процентная ставка (%)</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={creditFormData.interestRate}
                      onChange={(e) => setCreditFormData({...creditFormData, interestRate: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Срок (месяцев)</Label>
                    <Input 
                      type="number"
                      value={creditFormData.totalMonths}
                      onChange={(e) => setCreditFormData({...creditFormData, totalMonths: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Ежемесячный платеж (₸)</Label>
                    <Input 
                      type="number"
                      value={creditFormData.monthlyPayment}
                      onChange={(e) => setCreditFormData({...creditFormData, monthlyPayment: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Банк/Организация</Label>
                  <Input 
                    value={creditFormData.bank}
                    onChange={(e) => setCreditFormData({...creditFormData, bank: e.target.value})}
                    placeholder="Название банка"
                  />
                </div>

                <Button className="w-full">
                  Добавить кредит
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {credits.filter(c => c.isActive).map((credit) => {
              const progress = ((credit.totalMonths - credit.remainingMonths) / credit.totalMonths) * 100;
              const getTypeColor = (type: string) => {
                switch(type) {
                  case "mortgage": return "bg-purple-500";
                  case "credit": return "bg-orange-500";
                  case "installment": return "bg-green-500";
                  default: return "bg-gray-500";
                }
              };
              
              return (
                <Card key={credit.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getTypeColor(credit.type)}`} />
                        <div>
                          <h4 className="font-medium">{credit.name}</h4>
                          <p className="text-sm text-muted-foreground">{credit.bank}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={credit.type === "mortgage" ? "default" : "secondary"}>
                          {credit.type === "mortgage" ? "Ипотека" : 
                           credit.type === "credit" ? "Кредит" : "Рассрочка"}
                        </Badge>
                        <span className="font-medium">{credit.interestRate}%</span>
                      </div>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Остаток</p>
                        <p className="font-medium">{credit.remainingAmount.toLocaleString("kk-KZ")} ₸</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ежемесячно</p>
                        <p className="font-medium">{credit.monthlyPayment.toLocaleString("kk-KZ")} ₸</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Осталось месяцев</p>
                        <p className="font-medium">{credit.remainingMonths}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Следующий платеж</p>
                        <p className="font-medium">{credit.nextPaymentDate.toLocaleDateString("ru-RU")}</p>
                      </div>
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

  const EarlyPayments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">Потенциальная экономия</span>
            </div>
            <p className="text-2xl text-green-900 dark:text-green-100">
              {credits.reduce((sum, credit) => {
                const savings = calculateEarlySavings(credit, 50000, "reduce_term");
                return sum + savings.interestSaved;
              }, 0).toLocaleString("kk-KZ")} ₸
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">При доплате 50,000₸/мес</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">Досрочных планов</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {earlyPaymentPlans.filter(p => p.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">Досрочных платежей</span>
            </div>
            <p className="text-2xl text-purple-900 dark:text-purple-100">
              {payments.filter(p => p.type === "early" || p.type === "overpayment").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Калькулятор досрочного погашения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Выберите кредит</Label>
              <Select 
                value={selectedCredit?.id || ""} 
                onValueChange={(value) => {
                  const credit = credits.find(c => c.id === value);
                  setSelectedCredit(credit || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите кредит" />
                </SelectTrigger>
                <SelectContent>
                  {credits.filter(c => c.isActive).map((credit) => (
                    <SelectItem key={credit.id} value={credit.id}>
                      {credit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCredit && (
              <>
                <div>
                  <Label>Дополнительная сумма (₸)</Label>
                  <Input 
                    type="number"
                    value={earlyPaymentFormData.extraAmount}
                    onChange={(e) => setEarlyPaymentFormData({
                      ...earlyPaymentFormData, 
                      extraAmount: Number(e.target.value)
                    })}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label>Стратегия погашения</Label>
                  <Select 
                    value={earlyPaymentFormData.strategy} 
                    onValueChange={(value: "reduce_term" | "reduce_payment" | "full_payoff") => 
                      setEarlyPaymentFormData({...earlyPaymentFormData, strategy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reduce_term">Сократить срок кредита</SelectItem>
                      <SelectItem value="reduce_payment">Уменьшить ежемесячный платеж</SelectItem>
                      <SelectItem value="full_payoff">Полное погашение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {earlyPaymentFormData.extraAmount > 0 && (
                  <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <h4 className="font-medium mb-3 text-green-800 dark:text-green-200">Результат досрочного погашения:</h4>
                    <div className="space-y-2 text-sm">
                      {(() => {
                        const savings = calculateEarlySavings(
                          selectedCredit, 
                          earlyPaymentFormData.extraAmount, 
                          earlyPaymentFormData.strategy
                        );
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>Экономия на процентах:</span>
                              <span className="font-medium text-green-700 dark:text-green-300">
                                {savings.interestSaved.toLocaleString("kk-KZ")} ₸
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Сокращение срока:</span>
                              <span className="font-medium text-green-700 dark:text-green-300">
                                {savings.monthsSaved} месяцев
                              </span>
                            </div>
                            {earlyPaymentFormData.strategy === "reduce_payment" && (
                              <div className="flex justify-between">
                                <span>Новый ежемесячный платеж:</span>
                                <span className="font-medium text-green-700 dark:text-green-300">
                                  {Math.round(savings.newMonthlyPayment).toLocaleString("kk-KZ")} ₸
                                </span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </Card>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Планы досрочного погашения</CardTitle>
            <Dialog open={isEarlyPaymentDialogOpen} onOpenChange={setIsEarlyPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать план
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новый план досрочного погашения</DialogTitle>
                  <DialogDescription>
                    Создайте план регулярных досрочных платежей
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Кредит</Label>
                    <Select 
                      value={earlyPaymentFormData.creditId} 
                      onValueChange={(value) => setEarlyPaymentFormData({...earlyPaymentFormData, creditId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите кредит" />
                      </SelectTrigger>
                      <SelectContent>
                        {credits.filter(c => c.isActive).map((credit) => (
                          <SelectItem key={credit.id} value={credit.id}>
                            {credit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Дополнительная сумма (₸)</Label>
                    <Input 
                      type="number"
                      value={earlyPaymentFormData.extraAmount}
                      onChange={(e) => setEarlyPaymentFormData({
                        ...earlyPaymentFormData, 
                        extraAmount: Number(e.target.value)
                      })}
                    />
                  </div>

                  <div>
                    <Label>Частота платежей</Label>
                    <Select 
                      value={earlyPaymentFormData.frequency} 
                      onValueChange={(value: "monthly" | "quarterly" | "annually" | "once") => 
                        setEarlyPaymentFormData({...earlyPaymentFormData, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Ежемесячно</SelectItem>
                        <SelectItem value="quarterly">Ежеквартально</SelectItem>
                        <SelectItem value="annually">Ежегодно</SelectItem>
                        <SelectItem value="once">Однократно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    Создать план
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {earlyPaymentPlans.filter(p => p.isActive).length > 0 ? (
              <div className="space-y-3">
                {earlyPaymentPlans.filter(p => p.isActive).map((plan) => {
                  const credit = credits.find(c => c.id === plan.creditId);
                  return (
                    <Card key={plan.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{credit?.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            +{plan.extraAmount.toLocaleString("kk-KZ")} ₸ 
                            {plan.frequency === "monthly" ? " ежемесячно" :
                             plan.frequency === "quarterly" ? " ежеквартально" :
                             plan.frequency === "annually" ? " ежегодно" : " однократно"}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          {plan.strategy === "reduce_term" ? "Сокращение срока" :
                           plan.strategy === "reduce_payment" ? "Уменьшение платежа" : "Полное погашение"}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Планы досрочного погашения не созданы</p>
                <Button 
                  onClick={() => setIsEarlyPaymentDialogOpen(true)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать первый план
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Сравнение стратегий досрочного погашения</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCredit ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { strategy: "reduce_term", name: "Сокращение срока", color: "blue" },
                  { strategy: "reduce_payment", name: "Уменьшение платежа", color: "green" },
                  { strategy: "full_payoff", name: "Полное погашение", color: "purple" }
                ].map(({ strategy, name, color }) => {
                  const extraAmount = 50000;
                  const savings = calculateEarlySavings(selectedCredit, extraAmount, strategy);
                  
                  return (
                    <Card key={strategy} className={`p-4 border-${color}-200 bg-${color}-50`}>
                      <h4 className={`font-medium text-${color}-800 mb-3`}>{name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Экономия процентов:</span>
                          <span className={`font-medium text-${color}-700`}>
                            {savings.interestSaved.toLocaleString("kk-KZ")} ₸
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Сокращение срока:</span>
                          <span className={`font-medium text-${color}-700`}>
                            {savings.monthsSaved} мес.
                          </span>
                        </div>
                        {strategy === "reduce_payment" && (
                          <div className="flex justify-between">
                            <span>Новый платеж:</span>
                            <span className={`font-medium text-${color}-700`}>
                              {Math.round(savings.newMonthlyPayment).toLocaleString("kk-KZ")} ₸
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                * Расчеты при дополнительном ежемесячном платеже 50,000 ₸
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Выберите кредит в калькуляторе для сравнения стратегий</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const PaymentHistory = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>История платежей</CardTitle>
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить платеж
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый платеж</DialogTitle>
                <DialogDescription>
                  Зафиксируйте платеж по кредиту
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Кредит</Label>
                  <Select 
                    value={paymentFormData.creditId} 
                    onValueChange={(value) => setPaymentFormData({...paymentFormData, creditId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите кредит" />
                    </SelectTrigger>
                    <SelectContent>
                      {credits.filter(c => c.isActive).map((credit) => (
                        <SelectItem key={credit.id} value={credit.id}>
                          {credit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Сумма платежа (₸)</Label>
                  <Input 
                    type="number"
                    value={paymentFormData.amount}
                    onChange={(e) => setPaymentFormData({...paymentFormData, amount: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label>Тип платежа</Label>
                  <Select 
                    value={paymentFormData.type} 
                    onValueChange={(value: "regular" | "early" | "overpayment") => 
                      setPaymentFormData({...paymentFormData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Регулярный платеж</SelectItem>
                      <SelectItem value="early">Досрочное погашение</SelectItem>
                      <SelectItem value="overpayment">Переплата</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  Добавить платеж
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Кредит</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Основной долг</TableHead>
                <TableHead>Проценты</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const credit = credits.find(c => c.id === payment.creditId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date.toLocaleDateString("ru-RU")}</TableCell>
                    <TableCell>{credit?.name}</TableCell>
                    <TableCell className="font-medium">
                      {payment.amount.toLocaleString("kk-KZ")} ₸
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        payment.type === "regular" ? "secondary" :
                        payment.type === "early" ? "default" : "outline"
                      }>
                        {payment.type === "regular" ? "Регулярный" :
                         payment.type === "early" ? "Досрочный" : "Переплата"}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.principalPart.toLocaleString("kk-KZ")} ₸</TableCell>
                    <TableCell>{payment.interestPart.toLocaleString("kk-KZ")} ₸</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="early">Досрочное погашение</TabsTrigger>
          <TabsTrigger value="history">История платежей</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CreditOverview />
        </TabsContent>

        <TabsContent value="early">
          <EarlyPayments />
        </TabsContent>

        <TabsContent value="history">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}