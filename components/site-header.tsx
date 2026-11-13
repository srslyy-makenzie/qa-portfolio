'use client'

import { Menu } from 'lucide-react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { buttonVariants } from '@/components/ui/button-variants'
import { IconButton } from '@/components/ui/icon-button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTopLink,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { isActive, NAV } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <NextLink
          href="/"
          className="focus-ring rounded-sm text-body font-semibold"
          data-testid="site-name"
        >
          {name}
        </NextLink>

        <NavigationMenu className="hidden md:block" aria-label="Main" data-testid="desktop-nav">
          <NavigationMenuList>
            {NAV.slice(1).map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuTopLink
                  active={isActive(pathname, item.href)}
                  render={<NextLink href={item.href} />}
                  className="data-active:text-primary"
                >
                  {item.label}
                </NavigationMenuTopLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<IconButton label="Open menu" className="md:hidden" data-testid="mobile-nav-trigger"><Menu /></IconButton>}
            />
            <SheetContent side="right" data-testid="mobile-nav">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main">
                <ul className="flex flex-col gap-1">
                  {NAV.map((item) => {
                    const active = isActive(pathname, item.href)
                    return (
                      <li key={item.href}>
                        <NextLink
                          href={item.href}
                          aria-current={active ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'lg' }),
                            'w-full justify-start',
                            active && 'bg-accent text-accent-foreground',
                          )}
                        >
                          {item.label}
                        </NextLink>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
