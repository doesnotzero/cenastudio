import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportsTab() {
  return (
    <Card className="border-frame-gray-3 bg-frame-gray-1/20">
      <CardContent className="flex flex-col items-center justify-center min-h-64 text-center">
        <FileText className="h-12 w-12 text-frame-gray-light mb-4" />
        <h3 className="text-lg font-semibold mb-2">Relatórios em Desenvolvimento</h3>
        <p className="text-sm text-frame-gray-light max-w-md">
          Sistema de relatórios avançados com agendamento e exportação será implementado
          nas próximas tasks (1.7 e 1.8).
        </p>
      </CardContent>
    </Card>
  );
}
