# Help Button Component QA Checklist

## Visual & Typography Consistency

- [ ] Button uses site font (`font-sans` / `var(--font-family-sans)`)
- [ ] Colors match theme tokens (`--color-accent-light/dark`, `--color-background`)
- [ ] KBD styling in tooltip matches modal KBD styling
- [ ] Button size and shape consistent (44px circular, shadow-md)

## Accessibility

- [ ] Button has proper ARIA attributes (`aria-haspopup="dialog"`, `aria-controls`, `aria-expanded`)
- [ ] Tooltip has `role="tooltip"` and `aria-hidden` toggles correctly
- [ ] Focus is trapped within modal when open
- [ ] Focus returns to help button when modal closes
- [ ] Keyboard navigation works (Tab cycles, Shift+Tab reverse)
- [ ] Screen reader announces modal title and content

## Functionality

- [ ] Clicking button opens modal
- [ ] `?` key still opens modal
- [ ] `q` and `Escape` close modal
- [ ] Click outside modal closes it
- [ ] Global navigation keys disabled while modal open
- [ ] Tooltip shows on hover/focus, hides on blur/leave

## Responsive & Mobile

- [ ] Button respects safe-area insets on mobile
- [ ] Tooltip hidden on small screens (`sm:block hidden`)
- [ ] Button remains reachable and doesn't obstruct navigation
- [ ] Touch targets are adequate (44px minimum)

## Performance & Robustness

- [ ] No duplicate event listeners after page transitions
- [ ] Component works with Astro ViewTransitions
- [ ] Reduced motion respected (no animations when `prefers-reduced-motion`)
- [ ] No console errors or warnings

## Integration Notes

- Component added to `base.astro` with `transition:persist`
- Uses existing `showHelpModal()` from `src/scripts/vim.ts`
- Exports `isHelpModalOpen()` for global key handler gating
- Compatible with existing theme system and dark mode

