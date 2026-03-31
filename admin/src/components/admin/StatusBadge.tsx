import { cn } from '@/lib/utils';

type StatusType = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'active' | 'blocked';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  paid: 'bg-info/10 text-info',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
  active: 'bg-success/10 text-success',
  blocked: 'bg-destructive/10 text-destructive',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || 'bg-muted text-muted-foreground';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
