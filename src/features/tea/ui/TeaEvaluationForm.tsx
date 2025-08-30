import { useState } from 'react';
import { useTeaEvaluateMutation } from '@/features/tea/hooks/useTeaEvaluateMutation';
import { useTeaEvaluationDeleteMutation } from '@/features/tea/hooks/useTeaEvaluationDeleteMutation.ts';
import type { TeaWithRating } from '@/shared/backbone/backend/model/tea';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Stars } from '@/shared/components/Stars';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';


type TeaEvaluationFormProps = {
  tea: TeaWithRating;
  className?: string;
};

export function TeaEvaluationForm({ tea, className }: TeaEvaluationFormProps) {
  const [rating, setRating] = useState(tea.rating || EMPTY_VALUE.rating);
  const [note, setNote] = useState(tea.note || EMPTY_VALUE.note);

  const isEvaluationExists = Number.isSafeInteger(tea.rating) && tea.rating !== EMPTY_VALUE.rating;
  const isEmpty = rating === EMPTY_VALUE.rating && note === EMPTY_VALUE.note;
  const hasChanges = rating !== (tea.rating || EMPTY_VALUE.rating) || note !== (tea.note || EMPTY_VALUE.note);
  const hasAcceptableChanges = rating !== EMPTY_VALUE.rating && hasChanges;
  const isDeletionPlanned = isEvaluationExists && rating === EMPTY_VALUE.rating && note === EMPTY_VALUE.note;

  const evaluateMutation = useTeaEvaluateMutation();
  const evaluationDeleteMutation = useTeaEvaluationDeleteMutation();
  const isSubmitting = evaluateMutation.isPending || evaluationDeleteMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeletionPlanned) evaluationDeleteMutation.mutate({ id: tea.id });
    else evaluateMutation.mutate({ id: tea.id, rating, note });
  };

  const handleReset = () => {
    setRating(tea.rating || EMPTY_VALUE.rating);
    setNote(tea.note || EMPTY_VALUE.note);
  };

  const handleClear = () => {
    setRating(EMPTY_VALUE.rating);
    setNote(EMPTY_VALUE.note);
  };

  return (
    <Card className={className}>
      <CardContent className='space-y-3'>
        <CardTitle>Заметка</CardTitle>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-3'>
          <div className='flex items-center justify-between space-x-3'>
            <Stars
              value={rating}
              onChange={setRating}
              isDisabled={isSubmitting}
              starClassName='size-10 sm:size-8'
            />

            <Button size='icon' variant='secondary' onClick={handleClear} disabled={isSubmitting || isEmpty}>
              <Iconify icon={Icon.DeleteTrashCan} className='size-6' />
            </Button>
          </div>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='Ваши впечатления о чае...'
            disabled={isSubmitting}
            rows={3}
          />

          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='secondary'
              className='mr-2 w-full space-x-3'
              disabled={!hasChanges || isSubmitting}
              onClick={handleReset}
            >
              <Iconify icon={Icon.ResetUndo} className='size-6' />
              Сбросить
            </Button>

            <Button
              type='submit'
              disabled={!hasAcceptableChanges && !isDeletionPlanned}
              variant={isDeletionPlanned ? 'destructive' : 'default'}
              className='w-full space-x-3'
              isLoading={isSubmitting}
            >
              <Iconify icon={isSubmitting ? Icon.LoadingSpinner : Icon.SaveDiskette} />

              {isSubmitting
                ? isDeletionPlanned
                  ? 'Удаление...'
                  : 'Сохранение...'
                : isEvaluationExists
                  ? isDeletionPlanned
                    ? 'Удалить'
                    : 'Обновить'
                  : 'Оценить'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const EMPTY_VALUE = {
  rating: 0,
  note: '',
};
