/**
 * The page column, shared by the header, content and footer so their edges line up.
 * Phones: full width with side padding. Tablets and laptops: a wider, centred column.
 */
export const CONTAINER =
  'mx-auto w-full max-w-md px-5 sm:max-w-xl sm:px-8 md:max-w-3xl md:px-10 lg:max-w-6xl lg:px-12';

/** A narrower column for single-focus steps (loading, errors), still centred on wide screens. */
export const NARROW = 'mx-auto w-full max-w-xl';
