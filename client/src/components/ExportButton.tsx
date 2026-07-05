import { Download, FileSpreadsheet, FileText, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ExportButtonProps {
  entityType: 'projects' | 'clients' | 'opportunities';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ExportButton({ entityType, variant = 'outline', size = 'sm', className }: ExportButtonProps) {
  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      toast.success('Exportando...', {
        description: 'Preparando o arquivo para download',
      });

      const response = await fetch(`/api/export/${entityType}/${format}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar');
      }

      // Obter blob do response
      const blob = await response.blob();

      // Obter nome do arquivo do header ou usar padrão
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `cenastudio_${entityType}_${new Date().toISOString().split('T')[0]}`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      } else {
        const extensions = { excel: '.xlsx', csv: '.csv', pdf: '.pdf' };
        filename += extensions[format];
      }

      // Criar link temporário e fazer download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Exportado com sucesso!', {
        description: `Arquivo ${filename} baixado`,
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Erro ao exportar', {
        description: 'Não foi possível exportar os dados. Tente novamente.',
      });
    }
  };

  const entityLabels = {
    projects: 'Projetos',
    clients: 'Clientes',
    opportunities: 'Oportunidades',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Exportar {entityLabels[entityType]}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileType className="h-4 w-4 mr-2 text-blue-600" />
          CSV (.csv)
        </DropdownMenuItem>
        {entityType !== 'opportunities' && (
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2 text-red-600" />
            PDF (.pdf)
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
