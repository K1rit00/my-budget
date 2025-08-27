import { useState } from "react";
import { Zap, Plus, Receipt, Calendar, TrendingUp, DollarSign, FileText, Gauge, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { toast } from "sonner@2.0.3";

// Справочник типов коммунальных услуг
const utilityTypesReference = [
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

interface UtilityPayment {
  id: string;
  utilityTypeId: string;
  amount: number;
  meterReading?: number; // Необязательное показание счетчика
  date: Date;
  notes?: string;
}

const initialPayments: UtilityPayment[] = [
  {
    id: "1",
    utilityTypeId: "1",
    amount: 3061,
    meterReading: 15420,
    date: new Date(2025, 0, 25),
    notes: "Показания сняты 25 числа"
  },
  {
    id: "2",
    utilityTypeId: "2",
    amount: 1785,
    meterReading: 8750,
    date: new Date(2025, 0, 25)
  },
  {
    id: "3",
    utilityTypeId: "3",
    amount: 1697,
    meterReading: 245.8,
    date: new Date(2025, 0, 25)
  },
  {
    id: "4",
    utilityTypeId: "7",
    amount: 1200,
    date: new Date(2025, 0, 20)
  },
  {
    id: "5",
    utilityTypeId: "8",
    amount: 4500,
    date: new Date(2025, 0, 15)
  },
  // Прошлый месяц
  {
    id: "6",
    utilityTypeId: "1",
    amount: 3243,
    meterReading: 15285,
    date: new Date(2024, 11, 25)
  },
  {
    id: "7",
    utilityTypeId: "2",
    amount: 1849,
    meterReading: 8695,
    date: new Date(2024, 11, 25)
  },
  {
    id: "8",
    utilityTypeId: "8",
    amount: 4500,
    date: new Date(2024, 11, 15)
  }
];

export function Utilities() {
  const [payments, setPayments] = useState<UtilityPayment[]>(initialPayments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<UtilityPayment | null>(null);
  
  const [formData, setFormData] = useState({
    utilityTypeId: "",
    amount: 0,
    meterReading: "",
    notes: ""
  });

  const getUtilityType = (id: string) => {
    return utilityTypesReference.find(type => type.id === id);
  };

  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments
      .filter(payment => {
        const paymentDate = payment.date;
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalPaidThisYear = () => {
    const currentYear = new Date().getFullYear();
    return payments
      .filter(payment => payment.date.getFullYear() === currentYear)
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPaymentsCount = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments.filter(payment => {
      const paymentDate = payment.date;
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    }).length;
  };

  const resetForm = () => {
    setFormData({
      utilityTypeId: "",
      amount: 0,
      meterReading: "",
      notes: ""
    });
    setEditingPayment(null);
  };

  const handleAddPayment = () => {
    if (!formData.utilityTypeId || formData.amount <= 0) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const newPayment: UtilityPayment = {
      id: Date.now().toString(),
      utilityTypeId: formData.utilityTypeId,
      amount: formData.amount,
      meterReading: formData.meterReading ? Number(formData.meterReading) : undefined,
      date: new Date(),
      notes: formData.notes
    };

    setPayments([newPayment, ...payments]);
    resetForm();
    setIsAddDialogOpen(false);

    const utilityType = getUtilityType(formData.utilityTypeId);
    toast.success("Платеж добавлен", {
      description: `${utilityType?.name}: ${formData.amount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const handleEditPayment = () => {
    if (!editingPayment || !formData.utilityTypeId || formData.amount <= 0) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const updatedPayment: UtilityPayment = {
      ...editingPayment,
      utilityTypeId: formData.utilityTypeId,
      amount: formData.amount,
      meterReading: formData.meterReading ? Number(formData.meterReading) : undefined,
      notes: formData.notes
    };

    setPayments(payments.map(p => p.id === editingPayment.id ? updatedPayment : p));
    resetForm();
    setIsAddDialogOpen(false);

    const utilityType = getUtilityType(formData.utilityTypeId);
    toast.success("Платеж обновлен", {
      description: `${utilityType?.name}: ${formData.amount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(payments.filter(p => p.id !== paymentId));
    toast.success("Платеж удален");
  };

  const openEditDialog = (payment: UtilityPayment) => {
    setEditingPayment(payment);
    setFormData({
      utilityTypeId: payment.utilityTypeId,
      amount: payment.amount,
      meterReading: payment.meterReading?.toString() || "",
      notes: payment.notes || ""
    });
    setIsAddDialogOpen(true);
  };

  const RecentPayments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">Платежей в месяце</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {getPaymentsCount()}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-700 dark:text-orange-300">Текущий месяц</span>
            </div>
            <p className="text-2xl text-orange-900 dark:text-orange-100">
              {getCurrentMonthTotal().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">За год</span>
            </div>
            <p className="text-2xl text-green-900 dark:text-green-100">
              {getTotalPaidThisYear().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Последние платежи</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить платеж
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPayment ? "Редактировать платеж" : "Новый платеж"}
                </DialogTitle>
                <DialogDescription>
                  {editingPayment ? "Внесите изменения в существующий платеж" : "Добавьте новый коммунальный платеж"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Тип услуги *</Label>
                  <Select 
                    value={formData.utilityTypeId} 
                    onValueChange={(value) => setFormData({...formData, utilityTypeId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип услуги" />
                    </SelectTrigger>
                    <SelectContent>
                      {utilityTypesReference.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Сумма (₸) *</Label>
                  <Input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>Показания счетчика (необязательно)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={formData.meterReading}
                    onChange={(e) => setFormData({...formData, meterReading: e.target.value})}
                    placeholder="Текущие показания"
                  />
                </div>

                <div>
                  <Label>Примечание (необязательно)</Label>
                  <Input 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Дополнительная информация"
                  />
                </div>

                <Button 
                  onClick={editingPayment ? handleEditPayment : handleAddPayment} 
                  className="w-full"
                  disabled={!formData.utilityTypeId || formData.amount <= 0}
                >
                  {editingPayment ? "Сохранить изменения" : "Добавить платеж"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Услуга</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Показания</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 10).map((payment) => {
                  const utilityType = getUtilityType(payment.utilityTypeId);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {utilityType && (
                            <div className={`w-3 h-3 rounded-full ${utilityType.color}`} />
                          )}
                          <div>
                            <p className="font-medium">{utilityType?.name}</p>
                            {payment.notes && (
                              <p className="text-xs text-muted-foreground">{payment.notes}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {payment.amount.toLocaleString("kk-KZ")} ₸
                      </TableCell>
                      <TableCell>
                        {payment.meterReading ? (
                          <span>{payment.meterReading} {utilityType?.unit || ""}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{payment.date.toLocaleDateString("ru-RU")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(payment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePayment(payment.id)}
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
              <p className="text-muted-foreground mb-4">Платежи не добавлены</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить платеж
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const MonthlyHistory = () => {
    // Группируем платежи по месяцам
    const groupedPayments = payments.reduce((groups, payment) => {
      const monthKey = `${payment.date.getFullYear()}-${payment.date.getMonth()}`;
      if (!groups[monthKey]) {
        groups[monthKey] = {
          month: payment.date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
          year: payment.date.getFullYear(),
          monthNum: payment.date.getMonth(),
          payments: [],
          total: 0
        };
      }
      groups[monthKey].payments.push(payment);
      groups[monthKey].total += payment.amount;
      return groups;
    }, {} as Record<string, {
      month: string;
      year: number;
      monthNum: number;
      payments: UtilityPayment[];
      total: number;
    }>);

    // Сортируем группы по дате (самые новые первые)
    const sortedGroups = Object.values(groupedPayments).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthNum - a.monthNum;
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-700 dark:text-purple-300">Месяцев с данными</span>
              </div>
              <p className="text-2xl text-purple-900 dark:text-purple-100">
                {sortedGroups.length}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-indigo-700 dark:text-indigo-300">Всего платежей</span>
              </div>
              <p className="text-2xl text-indigo-900 dark:text-indigo-100">
                {payments.length}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-cyan-700 dark:text-cyan-300">Средний месяц</span>
              </div>
              <p className="text-2xl text-cyan-900 dark:text-cyan-100">
                {sortedGroups.length > 0 
                  ? Math.round(sortedGroups.reduce((sum, group) => sum + group.total, 0) / sortedGroups.length).toLocaleString("kk-KZ")
                  : 0
                } ₸
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {sortedGroups.map((group) => (
            <Card key={`${group.year}-${group.monthNum}`} className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{group.month}</CardTitle>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">
                      {group.total.toLocaleString("kk-KZ")} ₸
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group.payments.length} платеж{group.payments.length > 1 ? 'ей' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.payments.map((payment) => {
                    const utilityType = getUtilityType(payment.utilityTypeId);
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {utilityType && (
                            <div className={`w-4 h-4 rounded-full ${utilityType.color}`} />
                          )}
                          <div>
                            <p className="font-medium">{utilityType?.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{payment.date.toLocaleDateString("ru-RU")}</span>
                              {payment.meterReading && (
                                <span>Показания: {payment.meterReading} {utilityType?.unit || ""}</span>
                              )}
                              {payment.notes && (
                                <span>• {payment.notes}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {payment.amount.toLocaleString("kk-KZ")} ₸
                          </p>
                          <div className="flex gap-1 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(payment)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedGroups.length === 0 && (
          <Card className="rounded-2xl">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">История платежей пуста</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить первый платеж
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const Analytics = () => {
    const currentYear = new Date().getFullYear();
    const yearlyPayments = payments.filter(payment => payment.date.getFullYear() === currentYear);
    const yearlyTotal = yearlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Анализ по типам услуг
    const serviceStats = utilityTypesReference.map(type => {
      const typePayments = yearlyPayments.filter(payment => payment.utilityTypeId === type.id);
      const total = typePayments.reduce((sum, payment) => sum + payment.amount, 0);
      const count = typePayments.length;
      const average = count > 0 ? total / count : 0;
      
      return {
        ...type,
        total,
        count,
        average,
        percentage: yearlyTotal > 0 ? (total / yearlyTotal) * 100 : 0
      };
    }).filter(stat => stat.total > 0)
      .sort((a, b) => b.total - a.total);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">Итого за {currentYear} год</span>
              </div>
              <p className="text-2xl text-blue-900 dark:text-blue-100">
                {yearlyTotal.toLocaleString("kk-KZ")} ₸
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300">Средний платеж</span>
              </div>
              <p className="text-2xl text-green-900 dark:text-green-100">
                {yearlyPayments.length > 0 
                  ? Math.round(yearlyTotal / yearlyPayments.length).toLocaleString("kk-KZ")
                  : 0
                } ₸
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Структура расходов по типам услуг</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceStats.map((stat) => (
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
                  <div className="text-sm text-muted-foreground ml-6">
                    {stat.count} платеж{stat.count > 1 ? 'ей' : ''} • 
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
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments">Платежи</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <RecentPayments />
        </TabsContent>

        <TabsContent value="history">
          <MonthlyHistory />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}