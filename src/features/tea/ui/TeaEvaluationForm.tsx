import { useId, useState } from 'react';
import { useTeaEvaluateMutation } from '@/features/tea/hooks/useTeaEvaluateMutation';
import { TeaFavouriteButton } from '@/features/tea/ui/TeaFavouriteButton';
import type { TeaWithRating } from '@/shared/backbone/backend/model/tea';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Stars } from '@/shared/components/Stars';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';


type TeaEvaluationFormProps = {
  tea: TeaWithRating;
  className?: string;
};

export function TeaEvaluationForm({ tea, className }: TeaEvaluationFormProps) {
  const noteFieldId = `note-${useId()}`;
  const [rating, setRating] = useState(tea.rating || 0);
  const [note, setNote] = useState(tea.note || '');

  const evaluateMutation = useTeaEvaluateMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    evaluateMutation.mutate({ id: tea.id, rating, note });
  };

  const hasChanges = rating !== (tea.rating || 0) || note !== (tea.note || '');
  const isSubmitting = evaluateMutation.isPending;

  return (
    <Card className={cn(className)}>
      <CardContent className='space-y-3'>
        <CardTitle>Заметка</CardTitle>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-3'>
          <div className='flex justify-between items-center gap-3'>
            <Stars
              value={rating}
              onChange={setRating}
              isDisabled={isSubmitting}
              starClassName='size-10 sm:size-8'
            />

            <TeaFavouriteButton id={tea.id} isFavourite={tea.isFavourite} />
          </div>

          <div className='space-y-2'>
            <Textarea
              id={noteFieldId}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='Ваши впечатления о чае...'
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <Button
            type='submit'
            disabled={!hasChanges || rating === 0}
            className='w-full space-x-3'
            isLoading={isSubmitting}
          >
            {isSubmitting && <Iconify icon={Icon.LoadingSpinner} />}
            {isSubmitting ? 'Сохранение...' : tea.rating ? 'Обновить' : 'Оценить'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
