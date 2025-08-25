import { useState } from "react";
import { Building, Calendar, Bell, FileText, Plus, AlertTriangle, Users, UserCheck, CheckCircle2, DollarSign, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

interface RentProperty {
  id: string;
  address: string;
  totalRent: number;
  deposit: number;
  landlordName: string;
  landlordPhone: string;
  contractStartDate: Date;
  contractEndDate: Date;
  paymentDay: number;
  notes: string;
  autoReminder: boolean;
  hasMultipleTenants: boolean;
  isLandlord: boolean;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  rentShare: number;
  isCurrentUser: boolean;
}

interface RentPayment {
  id: string;
  month: string;
  totalAmount: number;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  tenantPayments: TenantPayment[];
}

interface TenantPayment {
  tenantId: string;
  amount: number;
  paidDate: Date | null;
  confirmedByLandlord: Date | null;
  status: "paid" | "pending" | "overdue" | "confirmed";
  paidByUserId?: string; // кто внес оплату за арендатора
}

const initialProperty: RentProperty = {
  id: "1",
  address: "ул. Пушкина, д. 15, кв. 42",
  totalRent: 150000,
  deposit: 300000,
  landlordName: "Иванов Сергей Петрович",
  landlordPhone: "+7 (999) 123-45-67",
  contractStartDate: new Date(2024, 0, 1),
  contractEndDate: new Date(2024, 11, 31),
  paymentDay: 5,
  notes: "Коммунальные услуги не включены в стоимость аренды",
  autoReminder: true,
  hasMultipleTenants: true,
  isLandlord: false
};

const initialTenants: Tenant[] = [
  {
    id: "1",
    name: "Иван Петров (Я)",
    email: "ivan.petrov@email.com",
    rentShare: 75000,
    isCurrentUser: true
  },
  {
    id: "2",
    name: "Анна Сидорова",
    email: "anna.sidorova@email.com",
    rentShare: 75000,
    isCurrentUser: false
  }
];

const initialPayments: RentPayment[] = [
  {
    id: "1",
    month: "Декабрь 2024",
    totalAmount: 150000,
    dueDate: new Date(2024, 11, 5),
    status: "paid",
    tenantPayments: [
      {
        tenantId: "1",
        amount: 75000,
        paidDate: new Date(2024, 11, 3),
        confirmedByLandlord: new Date(2024, 11, 4),
        status: "confirmed"
      },
      {
        tenantId: "2",
        amount: 75000,
        paidDate: new Date(2024, 11, 2),
        confirmedByLandlord: new Date(2024, 11, 4),
        status: "confirmed",
        paidByUserId: "1" // Иван заплатил за Анну
      }
    ]
  },
  {
    id: "2",
    month: "Январь 2025",
    totalAmount: 150000,
    dueDate: new Date(2025, 0, 5),
    status: "pending",
    tenantPayments: [
      {
        tenantId: "1",
        amount: 75000,
        paidDate: new Date(2025, 0, 2),
        confirmedByLandlord: null,
        status: "paid"
      },
      {
        tenantId: "2",
        amount: 75000,
        paidDate: null,
        confirmedByLandlord: null,
        status: "overdue"
      }
    ]
  }
];

export function Rent() {
  const [currentTab, setCurrentTab] = useState("info");
  const [property, setProperty] = useState<RentProperty>(initialProperty);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [payments, setPayments] = useState<RentPayment[]>(initialPayments);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTenantForPayment, setSelectedTenantForPayment] = useState<string>("");
  
  const [tenantFormData, setTenantFormData] = useState({
    name: "",
    email: "",
    rentShare: 0
  });

  const [paymentFormData, setPaymentFormData] = useState({
    tenantId: "",
    month: "Февраль 2025",
    payForSelf: true
  });

  const statusLabels = {
    paid: "Оплачено",
    pending: "Ожидает оплаты",
    overdue: "Просрочено",
    confirmed: "Подтверждено"
  };

  const statusColors = {
    paid: "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300"
  };

  const getCurrentUser = () => {
    return tenants.find(tenant => tenant.isCurrentUser);
  };

  const getCurrentUserShare = () => {
    if (property.isLandlord) return property.totalRent;
    return tenants.find(tenant => tenant.isCurrentUser)?.rentShare || property.totalRent;
  };

  const getOverduePayments = () => {
    return payments.filter(payment => payment.status === "overdue" || 
      payment.tenantPayments.some(tp => tp.status === "overdue"));
  };

  const getTotalPaidThisYear = () => {
    const currentYear = new Date().getFullYear();
    
    if (property.isLandlord) {
      return payments
        .filter(payment => payment.dueDate.getFullYear() === currentYear)
        .reduce((sum, payment) => {
          const confirmedAmount = payment.tenantPayments
            .filter(tp => tp.status === "confirmed")
            .reduce((tpSum, tp) => tpSum + tp.amount, 0);
          return sum + confirmedAmount;
        }, 0);
    } else {
      const currentUserTenant = tenants.find(t => t.isCurrentUser);
      if (!currentUserTenant) return 0;

      return payments
        .filter(payment => payment.dueDate.getFullYear() === currentYear)
        .reduce((sum, payment) => {
          const userPayment = payment.tenantPayments.find(tp => tp.tenantId === currentUserTenant.id);
          return sum + (userPayment && (userPayment.status === "paid" || userPayment.status === "confirmed") ? userPayment.amount : 0);
        }, 0);
    }
  };

  const markTenantPaymentAsPaid = (paymentId: string, tenantId: string, paidByCurrentUser = false) => {
    const tenant = tenants.find(t => t.id === tenantId);
    const currentUser = getCurrentUser();
    
    setPayments(payments.map(payment => {
      if (payment.id === paymentId) {
        const updatedTenantPayments = payment.tenantPayments.map(tp => 
          tp.tenantId === tenantId 
            ? { 
                ...tp, 
                paidDate: new Date(), 
                status: "paid" as const,
                paidByUserId: paidByCurrentUser ? currentUser?.id : undefined
              }
            : tp
        );
        
        return {
          ...payment,
          tenantPayments: updatedTenantPayments
        };
      }
      return payment;
    }));

    if (paidByCurrentUser && tenant && currentUser) {
      toast.success(`Оплата внесена за ${tenant.name}`, {
        description: `Сумма: ${tenant.rentShare.toLocaleString("kk-KZ")} ₸`
      });
    } else if (tenant) {
      toast.success(`Платёж арендатора ${tenant.name} отмечен как оплаченный`, {
        description: `Сумма: ${tenant.rentShare.toLocaleString("kk-KZ")} ₸`
      });
    }
  };

  const confirmPaymentByLandlord = (paymentId: string, tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    const payment = payments.find(p => p.id === paymentId);
    const tenantPayment = payment?.tenantPayments.find(tp => tp.tenantId === tenantId);
    
    setPayments(payments.map(payment => {
      if (payment.id === paymentId) {
        const updatedTenantPayments = payment.tenantPayments.map(tp => 
          tp.tenantId === tenantId && tp.status === "paid"
            ? { ...tp, confirmedByLandlord: new Date(), status: "confirmed" as const }
            : tp
        );
        
        const allConfirmed = updatedTenantPayments.every(tp => tp.status === "confirmed");
        
        return {
          ...payment,
          tenantPayments: updatedTenantPayments,
          status: allConfirmed ? "paid" as const : payment.status
        };
      }
      return payment;
    }));

    toast.success(`Получение платежа подтверждено`, {
      description: `От ${tenant?.name}: ${tenantPayment?.amount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const recordRentPaymentForTenant = (tenantId: string, month: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    // Создаем новый платеж или обновляем существующий
    const existingPayment = payments.find(p => p.month === month);
    
    if (existingPayment) {
      setPayments(payments.map(payment => {
        if (payment.id === existingPayment.id) {
          const updatedTenantPayments = payment.tenantPayments.map(tp => 
            tp.tenantId === tenantId 
              ? { ...tp, paidDate: new Date(), status: "paid" as const }
              : tp
          );
          return {
            ...payment,
            tenantPayments: updatedTenantPayments
          };
        }
        return payment;
      }));
    }

    toast.success(`Оплата аренды записана для ${tenant.name}`, {
      description: `${month}: ${tenant.rentShare.toLocaleString("kk-KZ")} ₸`
    });
  };

  const handleAddTenant = () => {
    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: tenantFormData.name,
      email: tenantFormData.email,
      rentShare: tenantFormData.rentShare,
      isCurrentUser: false
    };
    
    setTenants([...tenants, newTenant]);
    
    // Добавляем нового арендатора во все существующие платежи
    setPayments(payments.map(payment => ({
      ...payment,
      tenantPayments: [
        ...payment.tenantPayments,
        {
          tenantId: newTenant.id,
          amount: newTenant.rentShare,
          paidDate: null,
          confirmedByLandlord: null,
          status: "pending" as const
        }
      ]
    })));
    
    setTenantFormData({ name: "", email: "", rentShare: 0 });
    setIsTenantDialogOpen(false);

    toast.success(`${property.isLandlord ? "Арендатор" : "Соарендатор"} добавлен`, {
      description: `${newTenant.name} - ${newTenant.rentShare.toLocaleString("kk-KZ")} ₸`
    });
  };

  const handlePaymentForTenant = () => {
    const tenant = tenants.find(t => t.id === paymentFormData.tenantId);
    const currentUser = getCurrentUser();
    
    if (!tenant || !currentUser) return;

    // Находим платеж за указанный месяц
    const payment = payments.find(p => p.month === paymentFormData.month);
    if (!payment) return;

    const isPayingForSelf = paymentFormData.payForSelf || tenant.isCurrentUser;

    markTenantPaymentAsPaid(payment.id, paymentFormData.tenantId, !isPayingForSelf);

    setPaymentFormData({
      tenantId: "",
      month: "Февраль 2025",
      payForSelf: true
    });
    setIsPaymentDialogOpen(false);
  };

  const payForAllTenants = () => {
    const currentPayment = payments.find(p => p.month === "Январь 2025");
    if (!currentPayment) return;

    const unpaidTenants = currentPayment.tenantPayments.filter(tp => tp.status !== "paid" && tp.status !== "confirmed");
    const totalAmount = unpaidTenants.reduce((sum, tp) => sum + tp.amount, 0);
    const currentUser = getCurrentUser();

    setPayments(payments.map(payment => {
      if (payment.id === currentPayment.id) {
        const updatedTenantPayments = payment.tenantPayments.map(tp => 
          tp.status !== "paid" && tp.status !== "confirmed"
            ? { 
                ...tp, 
                paidDate: new Date(), 
                status: "paid" as const,
                paidByUserId: currentUser?.id
              }
            : tp
        );
        
        return {
          ...payment,
          tenantPayments: updatedTenantPayments,
          status: "paid" as const
        };
      }
      return payment;
    }));

    toast.success("Оплата внесена за всех арендаторов", {
      description: `Общая сумма: ${totalAmount.toLocaleString("kk-KZ")} ₸`
    });
  };

  const PropertyInfo = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Информация об аренде
          </CardTitle>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={property.isLandlord}
                onCheckedChange={(checked) => {
                  setProperty({...property, isLandlord: checked});
                  toast.info(checked ? "Переключен режим арендодателя" : "Переключен режим арендатора");
                }}
              />
              <Label>Я арендодатель</Label>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Редактировать</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Редактировать информацию</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Адрес</Label>
                    <Input 
                      value={property.address}
                      onChange={(e) => setProperty({...property, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Общая стоимость аренды</Label>
                      <Input 
                        type="number"
                        value={property.totalRent}
                        onChange={(e) => setProperty({...property, totalRent: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>День оплаты</Label>
                      <Input 
                        type="number"
                        min="1"
                        max="31"
                        value={property.paymentDay}
                        onChange={(e) => setProperty({...property, paymentDay: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={property.hasMultipleTenants}
                      onCheckedChange={(checked) => setProperty({...property, hasMultipleTenants: checked})}
                    />
                    <Label>Несколько арендаторов</Label>
                  </div>
                  <Button onClick={() => {
                    setIsEditDialogOpen(false);
                    toast.success("Информация об аренде обновлена");
                  }} className="w-full">
                    Сохранить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Адрес</Label>
                <p className="font-medium">{property.address}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {property.hasMultipleTenants ? "Общая стоимость аренды" : "Стоимость аренды"}
                </Label>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {property.totalRent.toLocaleString("kk-KZ")} ₸
                </p>
                {property.hasMultipleTenants && !property.isLandlord && (
                  <p className="text-sm text-muted-foreground">
                    Ваша доля: {getCurrentUserShare().toLocaleString("kk-KZ")} ₸
                  </p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground">День оплаты</Label>
                <p className="font-medium">{property.paymentDay} число каждого месяца</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">
                  {property.isLandlord ? "Контактная информация" : "Арендодатель"}
                </Label>
                <p className="font-medium">{property.landlordName}</p>
                <p className="text-sm text-muted-foreground">{property.landlordPhone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Срок договора</Label>
                <p className="font-medium">
                  {property.contractStartDate.toLocaleDateString("ru-RU")} - {property.contractEndDate.toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Залог</Label>
                <p className="font-medium">{property.deposit.toLocaleString("kk-KZ")} ₸</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {property.hasMultipleTenants && (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {property.isLandlord ? "Арендаторы" : "Соарендаторы"}
            </CardTitle>
            <div className="flex gap-2">
              {!property.isLandlord && (
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(true)}
                  className="text-green-600 hover:text-green-700"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Внести оплату
                </Button>
              )}
              <Dialog open={isTenantDialogOpen} onOpenChange={setIsTenantDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Добавить {property.isLandlord ? "арендатора" : "соарендатора"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {property.isLandlord ? "Новый арендатор" : "Новый соарендатор"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Имя и фамилия</Label>
                      <Input 
                        value={tenantFormData.name}
                        onChange={(e) => setTenantFormData({...tenantFormData, name: e.target.value})}
                        placeholder="Введите имя"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        value={tenantFormData.email}
                        onChange={(e) => setTenantFormData({...tenantFormData, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label>Доля в аренде (₸)</Label>
                      <Input 
                        type="number"
                        value={tenantFormData.rentShare}
                        onChange={(e) => setTenantFormData({...tenantFormData, rentShare: Number(e.target.value)})}
                        placeholder="0"
                      />
                    </div>
                    <Button onClick={handleAddTenant} className="w-full">
                      Добавить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-semibold">{tenant.rentShare.toLocaleString("kk-KZ")} ₸</p>
                      <p className="text-xs text-muted-foreground">
                        {((tenant.rentShare / property.totalRent) * 100).toFixed(1)}%
                      </p>
                    </div>
                    {property.isLandlord && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => recordRentPaymentForTenant(tenant.id, "Февраль 2025")}
                        className="text-green-600 hover:text-green-700"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Записать оплату
                      </Button>
                    )}
                    {!property.isLandlord && !tenant.isCurrentUser && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPaymentFormData({...paymentFormData, tenantId: tenant.id, payForSelf: false});
                          setIsPaymentDialogOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Заплатить за него
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!property.isLandlord && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Оплата за всех</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Внести оплату за всех неоплаченных арендаторов
                    </p>
                  </div>
                  <Button
                    onClick={payForAllTenants}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Оплатить всё
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {getOverduePayments().length > 0 && (
        <Card className="rounded-2xl border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Есть просроченные платежи</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Проверьте статус платежей в разделе "Платежи"
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Внести оплату аренды</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>За кого оплачиваем</Label>
              <Select 
                value={paymentFormData.tenantId} 
                onValueChange={(value) => {
                  const tenant = tenants.find(t => t.id === value);
                  setPaymentFormData({
                    ...paymentFormData, 
                    tenantId: value,
                    payForSelf: tenant?.isCurrentUser || false
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите арендатора" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} - {tenant.rentShare.toLocaleString("kk-KZ")} ₸
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>За какой месяц</Label>
              <Select 
                value={paymentFormData.month} 
                onValueChange={(value) => setPaymentFormData({...paymentFormData, month: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Февраль 2025">Февраль 2025</SelectItem>
                  <SelectItem value="Январь 2025">Январь 2025</SelectItem>
                  <SelectItem value="Декабрь 2024">Декабрь 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentFormData.tenantId && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Сумма к оплате:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {tenants.find(t => t.id === paymentFormData.tenantId)?.rentShare.toLocaleString("kk-KZ")} ₸
                  </span>
                </div>
                {!paymentFormData.payForSelf && (
                  <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    💡 Вы оплачиваете за другого арендатора
                  </div>
                )}
              </div>
            )}
            <Button 
              onClick={handlePaymentForTenant} 
              className="w-full"
              disabled={!paymentFormData.tenantId}
            >
              Внести оплату
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const PaymentHistory = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">Я заплатил в этом году</span>
            </div>
            <p className="text-2xl text-blue-900 dark:text-blue-100">
              {getTotalPaidThisYear().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-700 dark:text-orange-300">Мой следующий платёж</span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">5 февраля</p>
            <p className="text-xl text-orange-900 dark:text-orange-100">
              {getCurrentUserShare().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">История платежей</h3>
        {payments.map((payment) => (
          <Card key={payment.id} className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium">{payment.month}</h4>
                  <p className="text-sm text-muted-foreground">
                    Срок: {payment.dueDate.toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">
                    {payment.totalAmount.toLocaleString("kk-KZ")} ₸
                  </p>
                  <Badge className={statusColors[payment.status]}>
                    {statusLabels[payment.status]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-sm text-muted-foreground">Статус по соарендаторам:</h5>
                {payment.tenantPayments.map((tenantPayment) => {
                  const tenant = tenants.find(t => t.id === tenantPayment.tenantId);
                  const paidByUser = tenantPayment.paidByUserId 
                    ? tenants.find(t => t.id === tenantPayment.paidByUserId)
                    : null;

                  return (
                    <div 
                      key={tenantPayment.tenantId} 
                      className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg border border-border/50 dark:border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground dark:bg-muted-foreground/70" />
                          <span className="font-medium">{tenant?.name}</span>
                        </div>
                        <Badge className={statusColors[tenantPayment.status]} variant="secondary">
                          {statusLabels[tenantPayment.status]}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">
                            {tenantPayment.amount.toLocaleString("kk-KZ")} ₸
                          </p>
                          {tenantPayment.paidDate && (
                            <p className="text-xs text-muted-foreground">
                              {tenantPayment.paidDate.toLocaleDateString("ru-RU")}
                            </p>
                          )}
                          {paidByUser && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Оплатил: {paidByUser.name}
                            </p>
                          )}
                          {tenantPayment.confirmedByLandlord && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Подтверждено {tenantPayment.confirmedByLandlord.toLocaleDateString("ru-RU")}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          {property.isLandlord && tenantPayment.status === "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => confirmPaymentByLandlord(payment.id, tenantPayment.tenantId)}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 border-green-200 dark:border-green-800"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Подтвердить
                            </Button>
                          )}
                          
                          {!property.isLandlord && tenantPayment.status === "overdue" && tenant?.isCurrentUser && (
                            <Button
                              size="sm"
                              onClick={() => markTenantPaymentAsPaid(payment.id, tenantPayment.tenantId)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              Оплатить
                            </Button>
                          )}
                          
                          {!property.isLandlord && tenantPayment.status === "overdue" && !tenant?.isCurrentUser && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markTenantPaymentAsPaid(payment.id, tenantPayment.tenantId, true)}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border-blue-200 dark:border-blue-800"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              Оплатить за него
                            </Button>
                          )}
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
    </div>
  );

  const FixedPaymentHistory = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700">
                {property.isLandlord ? "Получено в этом году" : "Я заплатил в этом году"}
              </span>
            </div>
            <p className="text-2xl text-blue-900">
              {getTotalPaidThisYear().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700">
                {property.isLandlord ? "Ожидается в феврале" : "Мой следующий платёж"}
              </span>
            </div>
            <p className="text-lg text-orange-900">
              {property.paymentDay} февраля
            </p>
            <p className="text-sm text-orange-600">
              {property.isLandlord ? property.totalRent.toLocaleString("kk-KZ") : getCurrentUserShare().toLocaleString("kk-KZ")} ₸
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>
            {property.isLandlord ? "История поступлений" : "История платежей"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{payment.month}</h4>
                    <p className="text-sm text-muted-foreground">
                      Срок: {payment.dueDate.toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {payment.totalAmount.toLocaleString("kk-KZ")} ₸
                    </p>
                    <Badge className={statusColors[payment.status]}>
                      {statusLabels[payment.status]}
                    </Badge>
                  </div>
                </div>

                {property.hasMultipleTenants && (
                  <div className="space-y-2 pt-3 border-t">
                    <h5 className="text-sm font-medium">
                      {property.isLandlord ? "Статус по арендаторам:" : "Статус по соарендат��рам:"}
                    </h5>
                    {payment.tenantPayments.map((tenantPayment) => {
                      const tenant = tenants.find(t => t.id === tenantPayment.tenantId);
                      const paidByUser = tenantPayment.paidByUserId ? tenants.find(t => t.id === tenantPayment.paidByUserId) : null;
                      if (!tenant) return null;

                      return (
                        <div key={tenantPayment.tenantId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{tenant.name}</span>
                            <Badge className={statusColors[tenantPayment.status]} variant="secondary">
                              {statusLabels[tenantPayment.status]}
                            </Badge>
                            {paidByUser && !tenant.isCurrentUser && (
                              <Badge variant="outline" className="text-xs">
                                Оплачено: {paidByUser.name}
                              </Badge>
                            )}
                            {tenantPayment.confirmedByLandlord && (
                              <span className="text-xs text-green-600">
                                Подтверждено {tenantPayment.confirmedByLandlord.toLocaleDateString("ru-RU")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {tenantPayment.amount.toLocaleString("kk-KZ")} ₸
                            </span>
                            {tenantPayment.status !== "paid" && tenantPayment.status !== "confirmed" && tenant.isCurrentUser && !property.isLandlord && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markTenantPaymentAsPaid(payment.id, tenant.id)}
                              >
                                Отметить оплаченным
                              </Button>
                            )}
                            {!property.isLandlord && tenantPayment.status !== "paid" && tenantPayment.status !== "confirmed" && !tenant.isCurrentUser && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markTenantPaymentAsPaid(payment.id, tenant.id, true)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Оплатить за него
                              </Button>
                            )}
                            {property.isLandlord && tenantPayment.status === "paid" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmPaymentByLandlord(payment.id, tenant.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Подтвердить получение
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Documents = () => (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Документы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Договор аренды</p>
                <p className="text-sm text-muted-foreground">PDF, 2.4 МБ</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Скачать</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Акт приёма-передачи</p>
                <p className="text-sm text-muted-foreground">PDF, 1.8 МБ</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Скачать</Button>
          </div>

          <Button variant="outline" className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Добавить документ
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="property" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="property">Информация</TabsTrigger>
          <TabsTrigger value="payments">Платежи</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
        </TabsList>

        <TabsContent value="property">
          <PropertyInfo />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="documents">
          <Documents />
        </TabsContent>
      </Tabs>
    </div>
  );
}