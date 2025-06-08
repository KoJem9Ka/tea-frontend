import { Link } from '@tanstack/react-router';
import { AuthStore, TelegramLoginCustomButton } from '@/features/auth';
import { BackHeaderButton } from '@/features/header/ui/BackHeaderButton';
import { HeaderUserProfile } from '@/features/header/ui/HeaderUserProfile';
import { ThemeDropdown } from '@/features/theme';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';


export function Header() {
  useSignals();

  return (
    <header className='bg-card text-card-foreground border'>
      <Container className='flex-row justify-between items-center py-2'>
        <nav className='flex gap-4 items-center'>
          <BackHeaderButton />

          <Link {...ROUTES.HOME}>🐼 TeaApp</Link>
        </nav>

        <div className='grow' />

        {AuthStore.isAuthorized ? (
          <HeaderUserProfile />
        ) : (<>
          <ThemeDropdown />
          <TelegramLoginCustomButton />
        </>)}
      </Container>
    </header>
  );
}
