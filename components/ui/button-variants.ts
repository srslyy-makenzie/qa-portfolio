import { cva } from 'class-variance-authority'

// Kept out of button.tsx (a client module) so server components such as Pagination can
// call it. Styles anything that should look like a button: links, popover triggers.
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium select-none',
    'touch-target focus-ring transition-colors duration-fast ease-standard',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-hover',
      },
      size: {
        sm: 'h-control-sm px-2.5 text-body-sm [&_svg]:size-4',
        md: 'h-control-md px-3 text-body-sm [&_svg]:size-4',
        lg: 'h-control-lg px-4 text-body [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)
