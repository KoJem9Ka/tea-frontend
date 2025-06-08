import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { Button } from '@/shared/components/ui/button';


export function NotFoundRouteComponent() {
  return (
    <Container isCenter className='text-center text-balance'>
      <p className='font-thin text-6xl'>404</p>
      <p>Запрашиваемая страница не найдена</p>
      <Button variant='secondary' asChild>
        <Link {...ROUTES.HOME}>Домой</Link>
      </Button>
    </Container>
  );
}
