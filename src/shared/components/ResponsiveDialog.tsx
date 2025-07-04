import {
  type ReactNode,
  type Ref,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/shared/components/ui/sheet'
import { useIsMd } from '@/shared/hooks/useResponsive';


type ResponsiveDialogProps = {
  title?: string,
  triggerSlot: ReactNode,
  formSlot: ReactNode,
  onSuccess?: () => void | PromiseLike<void>,
  controlRef?: Ref<ResponsiveDialogControlRef>,
  signal?: AbortSignal,
};

export type ResponsiveDialogControlRef = {
  close: () => void;
};

export function ResponsiveDialog({ title, triggerSlot, formSlot, controlRef, signal }: ResponsiveDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isMd } = useIsMd();

  useImperativeHandle(controlRef, () => ({
    close: () => setIsOpen(false),
  }), []);

  useEffect(() => {
    if (!signal || !isOpen) return;
    if (signal.aborted) return setIsOpen(false);
    const handler = () => setIsOpen(false);
    signal.addEventListener('abort', handler);
    return () => signal.removeEventListener('abort', handler);
  }, [isOpen, signal]);

  if (isMd) return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerSlot}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        {title ? (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        ) : null}

        {formSlot}

      </DialogContent>
    </Dialog>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {triggerSlot}
      </SheetTrigger>

      <SheetContent side='bottom'>
        {title ? (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        ) : null}

        <div className='-mx-4 px-4 min-h-0 overflow-y-auto'>
          {formSlot}
        </div>
      </SheetContent>
    </Sheet>
  );
}
