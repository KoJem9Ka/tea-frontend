/**
 * @source https://github.com/sersavan/shadcn-multi-select-component
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, XIcon } from 'lucide-react';
import * as React from 'react';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/lib/utils';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 ~hover:-translate-y-1 ~hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Props for MultiSelect component
 */
export interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional HEX color code for the option, used for styling. */
    color?: string;
    /** Optional foreground color for the option, used for text color. */
    colorForeground?: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The current selected values. If provided, the component operates in controlled mode. */
  value?: readonly string[];

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      value: propsValue,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalSelectedValues, setInternalSelectedValues] = React.useState<string[]>(defaultValue);
    const isControlled = propsValue !== undefined;
    const selectedValues = isControlled ? propsValue : internalSelectedValues;

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    // const handleInputKeyDown = (
    //   event: React.KeyboardEvent<HTMLInputElement>,
    // ) => {
    //   if (event.key === 'Enter') {
    //     setIsPopoverOpen(true);
    //   } else if (event.key === 'Backspace' && !event.currentTarget.value) {
    //     const newValues = [...selectedValues];
    //     newValues.pop();
    //     onValueChange(newValues);
    //     if (!isControlled) {
    //       setInternalSelectedValues(newValues);
    //     }
    //   }
    // };

    const toggleOption = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue];
      onValueChange(newValues);
      if (!isControlled) {
        setInternalSelectedValues(newValues);
      }
    };

    const handleClear = () => {
      onValueChange([]);
      if (!isControlled) {
        setInternalSelectedValues([]);
      }
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    // const clearExtraOptions = () => {
    //   const newSelectedValues = selectedValues.slice(0, maxCount);
    //   setSelectedValues(newSelectedValues);
    //   onValueChange(newSelectedValues);
    // };
    //
    // const toggleAll = () => {
    //   if (selectedValues.length === options.length) {
    //     handleClear();
    //   } else {
    //     const allValues = options.map((option) => option.value);
    //     setSelectedValues(allValues);
    //     onValueChange(allValues);
    //   }
    // };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild={asChild}>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            variant='outline'
            className={cn(
              'flex w-full p-1 rounded-md border min-h-9 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto',
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className='flex justify-between items-center w-full'>
                <div className='flex flex-wrap items-center'>
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant }))}
                        style={{ animationDuration: `${animation}s`, backgroundColor: option?.color, color: option?.colorForeground }}
                      >
                        {IconComponent && (
                          <IconComponent className='h-4 w-4 mr-2' />
                        )}
                        {option?.label}
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ещё ${selectedValues.length - maxCount}`}
                    </Badge>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <XIcon
                    className='h-4 mx-2 cursor-pointer text-muted-foreground'
                    onClickCapture={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation='vertical'
                    className='flex min-h-6 h-full'
                  />
                  <ChevronDown className='h-4 mx-2 cursor-pointer text-muted-foreground' />
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between w-full mx-auto'>
                <span className='text-sm ~text-muted-foreground mx-3'>
                  {placeholder}
                </span>
                <ChevronDown className='h-4 cursor-pointer text-muted-foreground mx-2' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            {/*<CommandInput*/}
            {/*  placeholder='Поиск...'*/}
            {/*  onKeyDown={handleInputKeyDown}*/}
            {/*  autoFocus={false}*/}
            {/*  onFocus={(e) => {*/}
            {/*    // Предотвращаем автофокус на мобильных устройствах*/}
            {/*    // Если фокус произошел не от пользовательского действия, убираем его*/}
            {/*    if (document.activeElement === e.currentTarget && !e.currentTarget.dataset.userFocused) {*/}
            {/*      e.currentTarget.blur();*/}
            {/*    }*/}
            {/*  }}*/}
            {/*  onMouseDown={(e) => {*/}
            {/*    // Помечаем, что фокус произошел от пользовательского действия*/}
            {/*    e.currentTarget.dataset.userFocused = 'true';*/}
            {/*  }}*/}
            {/*  onTouchStart={(e) => {*/}
            {/*    // Помечаем, что фокус произошел от пользовательского действия на мобильных*/}
            {/*    e.currentTarget.dataset.userFocused = 'true';*/}
            {/*  }}*/}
            {/*/>*/}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {/*<CommandItem*/}
                {/*  key='all'*/}
                {/*  onSelect={toggleAll}*/}
                {/*  className='cursor-pointer'*/}
                {/*>*/}
                {/*  {selectedValues.length === options.length*/}
                {/*    ? <IconLineMdCircleToConfirmCircleTwotoneTransition className='size-5 text-primary' />*/}
                {/*    : <IconLineMdConfirmCircleTwotoneToCircleTransition className='size-5 ' />}*/}
                {/*  <span>(Выбрать все)</span>*/}
                {/*</CommandItem>*/}
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className='cursor-pointer'
                    >
                      {isSelected
                        ? <Iconify icon={Icon.CircleToCheck} className='size-5 text-primary' />
                        : <Iconify icon={Icon.CheckToCircle} className='size-5' />}
                      {option.icon && (
                        <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandGroup>
              <div className='flex items-center justify-between'>
                {selectedValues.length > 0 && (
                  <>
                    <CommandItem
                      onSelect={handleClear}
                      className='flex-1 justify-center cursor-pointer'
                    >
                      Очистить
                    </CommandItem>
                    <Separator
                      orientation='vertical'
                      className='flex min-h-6 h-full'
                    />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className='flex-1 justify-center cursor-pointer max-w-full'
                >
                  Закрыть
                </CommandItem>
              </div>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';
