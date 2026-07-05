import { useState, useEffect, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: string;
  color?: string;
  description?: string;
  project_id?: number;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/calendar/events', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedEvents = data.data.map((event: any) => ({
            ...event,
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            allDay: event.all_day,
          }));
          setEvents(formattedEvents);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Erro ao carregar eventos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const title = window.prompt('Nome do evento:');
      if (title) {
        createEvent({
          title,
          start_date: start.toISOString(),
          end_date: end.toISOString(),
          all_day: true,
          type: 'other',
        });
      }
    },
    []
  );

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    alert(`Evento: ${event.title}\n${event.description || ''}`);
  }, []);

  const createEvent = async (eventData: any) => {
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast({
          title: 'Evento criado com sucesso!',
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Erro ao criar evento',
        variant: 'destructive',
      });
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const typeColors: Record<string, string> = {
      project: '#3b82f6',
      deadline: '#ef4444',
      meeting: '#8b5cf6',
      shooting: '#f59e0b',
      delivery: '#10b981',
      other: '#6b7280',
    };

    const backgroundColor = event.color || typeColors[event.type] || '#6b7280';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando calendário...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">
            Visualize prazos, reuniões e marcos importantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4" style={{ height: 'calc(100vh - 200px)' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: 'Próximo',
            previous: 'Anterior',
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'Nenhum evento neste período',
            showMore: (total) => `+${total} mais`,
          }}
        />
      </div>
    </div>
  );
}
