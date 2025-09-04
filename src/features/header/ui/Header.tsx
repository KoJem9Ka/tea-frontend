import { Link } from '@tanstack/react-router';
import { AuthStore, TelegramLoginCustomButton } from '@/features/auth';
import { HeaderBackButton } from '@/features/header/ui/HeaderBackButton.tsx';
import { HeaderUserProfile } from '@/features/header/ui/HeaderUserProfile';
import { ThemeDropdown } from '@/features/theme';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { IconAppLogoFramed } from '@/shared/components/icons/IconAppLogo.tsx';


export function Header() {
  useSignals();

  return (
    <header className='bg-card text-card-foreground border animate-in slide-in-from-top-10 fade-in-100'>
      <Container className='flex-row justify-between items-center py-2'>
        <nav className='flex gap-4 items-center'>
          <HeaderBackButton />

          <Link {...ROUTES.HOME} className='flex items-center gap-2'>
            <IconAppLogoFramed className='size-10 text-white' frameClassName='light:fill-black' />
          </Link>
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
