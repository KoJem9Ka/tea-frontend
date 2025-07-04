import { Link } from '@tanstack/react-router';
import { isTMA } from '@telegram-apps/sdk-react';
import { useMemo } from 'react';
import { AuthStore } from '@/features/auth';
import { ThemeTabs } from '@/features/theme';
import { useSignals } from '@/shared/backbone/signals';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES.ts';
import { Icon, Iconify } from '@/shared/components/Iconify.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';


export function HeaderUserProfile() {
  useSignals();
  const isTma = useMemo(() => isTMA(), []);
  const user = AuthStore.user!;

  const name = [user.telegram.first_name, user.telegram.last_name].filter(Boolean).join(' ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex gap-2 items-center transition aria-expanded:scale-95'>
          <img className='size-10 rounded-full' src={user.telegram.photo_url} alt='' />
          {name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {AuthStore.isAdmin ? (<>
          <DropdownMenuItem asChild>
            <Link {...ROUTES.ADMIN_TEA_NEW}>
              <Iconify icon={Icon.Tea} className='size-4' />
              Новый чай
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link {...ROUTES.ADMIN_CATEGORIES}>
              <Iconify icon={Icon.Category} className='size-4' />
              Категории
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link {...ROUTES.ADMIN_TAGS}>
              <Iconify icon={Icon.Tag} className='size-4' />
              Теги
            </Link>
          </DropdownMenuItem>
        </>) : null}
        <div className='px-2 py-1.5'>
          <ThemeTabs />
        </div>
        {!isTma ? (<>
          <DropdownMenuItem variant='destructive' onClick={AuthStore.loggedOut}>
            <Iconify icon={Icon.Logout} className='size-4' />
            Выйти
          </DropdownMenuItem>
        </>) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
