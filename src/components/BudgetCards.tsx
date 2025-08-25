import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function BudgetCards() {
  const [isDreamHidden, setIsDreamHidden] = useState(true);

  const budgetData = {
    plannedExpenses: 225000,
    remainingThisMonth: 92500,
    dreamSavings: 125000,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-700">Запланированные траты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-blue-900">
            {budgetData.plannedExpenses.toLocaleString("kk-KZ")} ₸
          </div>
          <p className="text-sm text-blue-600 mt-2">Из блока "Ежемесячные траты"</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-700">Осталось до конца месяца</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-green-900">
            {budgetData.remainingThisMonth.toLocaleString("kk-KZ")} ₸
          </div>
          <p className="text-sm text-green-600 mt-2">На основе трат</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-2xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-purple-700">На мечту</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDreamHidden(!isDreamHidden)}
            className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-200"
          >
            {isDreamHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-purple-900">
            {isDreamHidden ? "••••••" : `${budgetData.dreamSavings.toLocaleString("kk-KZ")} ₸`}
          </div>
          <p className="text-sm text-purple-600 mt-2">Накопления на цель</p>
        </CardContent>
      </Card>
    </div>
  );
}