import { readableColor } from 'color2k';
import { useMemo } from 'react';
import { Badge } from '@/shared/components/ui/badge';


type TeaTagProps = {
  name: string;
  color: string;
}

export function TeaTag({ name, color }: TeaTagProps) {
  const style = useMemo(() => ({
    backgroundColor: color,
    color: readableColor(color),
  }), [color]);

  return (
    <Badge variant='outline' className='border-current/25' style={style}>
      {name}
    </Badge>
  );
}
