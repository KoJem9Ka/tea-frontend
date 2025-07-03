import { HexColorPicker } from 'react-colorful';
import { type ControllerRenderProps } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';


type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  className?: string;
};

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn('w-full', className)}>
      <HexColorPicker
        color={value}
        onChange={onChange}
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  );
}

type ColorPickerFieldProps = ControllerRenderProps & {
  className?: string;
};

export function ColorPickerField({ value, onChange, className }: ColorPickerFieldProps) {
  return (
    <ColorPicker
      value={value || '#000000'}
      onChange={onChange}
      className={className}
    />
  );
}
