// svg icons (didn't want a whole icon library for a handful of icons)
export function GroupIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 6C14.3432 6 13 7.34315 13 9C13 10.6569 14.3432 12 16 12C17.6569 12 19 10.6569 19 9C19 7.34315 17.6569 6 16 6ZM11 9C11 6.23858 13.2386 4 16 4C18.7614 4 21 6.23858 21 9C21 10.3193 20.489 11.5193 19.6542 12.4128C21.4951 13.0124 22.9176 14.1993 23.8264 15.5329C24.1374 15.9893 24.0195 16.6114 23.5631 16.9224C23.1068 17.2334 22.4846 17.1155 22.1736 16.6591C21.1979 15.2273 19.4178 14 17 14C13.166 14 11 17.0742 11 19C11 19.5523 10.5523 20 10 20C9.44773 20 9.00001 19.5523 9.00001 19C9.00001 18.308 9.15848 17.57 9.46082 16.8425C9.38379 16.7931 9.3123 16.7323 9.24889 16.6602C8.42804 15.7262 7.15417 15 5.50001 15C3.84585 15 2.57199 15.7262 1.75114 16.6602C1.38655 17.075 0.754692 17.1157 0.339855 16.7511C-0.0749807 16.3865 -0.115709 15.7547 0.248886 15.3398C0.809035 14.7025 1.51784 14.1364 2.35725 13.7207C1.51989 12.9035 1.00001 11.7625 1.00001 10.5C1.00001 8.01472 3.01473 6 5.50001 6C7.98529 6 10 8.01472 10 10.5C10 11.7625 9.48013 12.9035 8.64278 13.7207C9.36518 14.0785 9.99085 14.5476 10.5083 15.0777C11.152 14.2659 11.9886 13.5382 12.9922 12.9945C11.7822 12.0819 11 10.6323 11 9ZM3.00001 10.5C3.00001 9.11929 4.1193 8 5.50001 8C6.88072 8 8.00001 9.11929 8.00001 10.5C8.00001 11.8807 6.88072 13 5.50001 13C4.1193 13 3.00001 11.8807 3.00001 10.5Z"
      />
    </svg>
  );
}

export function EyeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path
        fillRule="evenodd"
        d="M.66 10.59a1.65 1.65 0 0 1 0-1.19A10 10 0 0 1 10 3c4.26 0 7.9 2.66 9.34 6.41.15.38.15.8 0 1.19A10 10 0 0 1 10 17c-4.26 0-7.9-2.66-9.34-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function EyeSlashIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.75-1.75a10.05 10.05 0 0 0 3.3-4.38 1.65 1.65 0 0 0 0-1.19A10 10 0 0 0 10 3a9.96 9.96 0 0 0-4.75 1.2L3.28 2.22ZM7.75 6.7l1.1 1.1a2.5 2.5 0 0 1 3.35 3.35l1.1 1.1A4 4 0 0 0 7.75 6.7Z"
        clipRule="evenodd"
      />
      <path d="M10.75 16.97 8.4 14.62A4 4 0 0 1 5.38 11.6L2.2 8.43a10 10 0 0 0-1.54 2.16 1.65 1.65 0 0 0 0 1.19A10 10 0 0 0 10 17c.25 0 .5-.01.75-.03Z" />
    </svg>
  );
}

export function KeyIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 7a5 5 0 1 1 3.61 4.8l-1.33 1.33a.75.75 0 0 1-.53.22H8.5v1.25a.75.75 0 0 1-.75.75H6.5v1.25a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .22-.53l4.4-4.4A5 5 0 0 1 8 7Zm5-2a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 8 .75.75 0 0 0 16 8a3 3 0 0 0-3-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PencilIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M13.59 3.59a2 2 0 0 1 2.82 2.82l-8.5 8.5a1 1 0 0 1-.45.26l-3.5 1a.75.75 0 0 1-.93-.93l1-3.5a1 1 0 0 1 .26-.45l8.5-8.5Z" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4H3.75a.75.75 0 0 0 0 1.5h.3l.82 10.23A2.75 2.75 0 0 0 7.61 18h4.78a2.75 2.75 0 0 0 2.74-2.27l.82-10.23h.3a.75.75 0 0 0 0-1.5H14v-.25A2.75 2.75 0 0 0 11.25 1h-2.5ZM7.5 3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25V4h-5v-.25Zm.3 4.5a.75.75 0 0 1 .7.8l.25 5a.75.75 0 1 1-1.5.08l-.25-5a.75.75 0 0 1 .8-.88Zm4.4.8a.75.75 0 0 0-1.5-.08l-.25 5a.75.75 0 1 0 1.5.08l.25-5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}
