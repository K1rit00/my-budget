import { useState } from "react";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./components/Dashboard";
import { PaymentCalendar } from "./components/PaymentCalendar";
import { QuickExpenseAdd } from "./components/QuickExpenseAdd";
import { References } from "./components/References";
import { Profile } from "./components/Profile";
import { Income } from "./components/Income";
import { Credits } from "./components/Credits";
import { Rent } from "./components/Rent";
import { Utilities } from "./components/Utilities";
import { MonthlyExpenses } from "./components/MonthlyExpenses";
import { Dream } from "./components/Dream";
import { Auth } from "./components/Auth";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { LogOut } from "lucide-react";

interface User {
  email: string;
  name: string;
}

function AppContent() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("dashboard");
  };

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "quick-expenses":
        return <QuickExpenseAdd />;
      case "calendar":
        return <PaymentCalendar />;
      case "profile":
        return <Profile />;
      case "references":
        return <References />;
      case "income":
        return <Income />;
      case "credits":
        return <Credits />;
      case "rent":
        return <Rent />;
      case "utilities":
        return <Utilities />;
      case "monthly":
        return <MonthlyExpenses />;
      case "dream":
        return <Dream />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard": return "Главная";
      case "quick-expenses": return "Быстрые расходы";
      case "calendar": return "Календарь платежей";
      case "profile": return "Профиль";
      case "references": return "Справочники";
      case "income": return "Доходы";
      case "credits": return "Кредиты и рассрочки";
      case "rent": return "Аренда жилья";
      case "utilities": return "Коммунальные платежи";
      case "monthly": return "Ежемесячные траты";
      case "dream": return "Мечта";
      default: return "Главная";
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case "dashboard": return `Добро пожаловать, ${user.name}!`;
      case "quick-expenses": return "Быстрое добавление и учёт расходов";
      case "calendar": return "Планирование платежей и напоминания";
      case "profile": return "Настройки профиля и персональные данные";
      case "references": return "Категории бюджета, валюта и справочная информация";
      case "income": return "Учёт доходов, постановка целей и аналитика поступлений";
      case "credits": return "Учёт кредитов, рассрочек и графиков платежей";
      case "rent": return "Управление арендой жилья и платежами";
      case "utilities": return "Учет показаний счетчиков и коммунальных платежей";
      case "monthly": return "Планирование и контроль ежемесячных трат";
      case "dream": return "Накопления на мечты и достижение целей";
      default: return `Добро пожаловать, ${user.name}!`;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        <SidebarInset className="flex-1">
          <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-xl">{getPageTitle()}</h1>
                <p className="text-sm text-muted-foreground">
                  {getPageDescription()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-gradient-to-br from-background to-muted/20 overflow-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="budget-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}