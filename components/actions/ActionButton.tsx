import React from 'react';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MessageCircle, MapPin, Calendar, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  type: 'call' | 'email' | 'whatsapp' | 'directions' | 'appointment' | 'social';
  onClick: () => void;
  label: string;
  className?: string;
}

const icons = {
  call: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  directions: MapPin,
  appointment: Calendar,
  social: Share2,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onClick,
  label,
  className,
}) => {
  const Icon = icons[type];

  return (
    <Button
      variant="primary"
      size="lg"
      icon={<Icon className="w-5 h-5" />}
      onClick={onClick}
      className={cn('w-full mb-3', className)}
    >
      {label}
    </Button>
  );
};

