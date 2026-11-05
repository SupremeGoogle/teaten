export function WhatsAppIcon({ className = "" }: { className?: string }) {
  // Calendar-check icon (name kept so every booking button keeps working).
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4M9 15.2l2.1 2.1L15.5 13" />
    </svg>
  );
}

export function ViberIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5c-4.7 0-8 1.2-8.8 5.3-.4 2-.3 5.4 1.3 7.2.7.8 1.4 1 1.9 1.1v3l2.8-2.8c.9.1 1.7.1 2.8.1 4.7 0 8-1.200 8.800-5.300.4-2 .3-5.400-1.300-7.200C16.800 2.900 14.300 2.500 12 2.500Zm.7 3.300c2.600.2 4.300 1.900 4.500 4.500 0 .3-.5.300-.6 0-.2-2.200-1.600-3.600-3.900-3.800-.3 0-.2-.7 0-.7Zm-.4 1.700c1.700.1 2.800 1.200 3 2.900 0 .3-.5.300-.6 0-.2-1.400-1-2.200-2.400-2.300-.3 0-.2-.6 0-.6Zm-3.100.4c.3-.2.700-.1.900.2l.7 1c.2.300.1.600-.1.800l-.4.400c.5 1.100 1.700 2.200 2.800 2.700l.4-.5c.2-.2.500-.3.800-.1l1 .7c.3.200.4.600.2.900-.5.800-1.200 1.100-1.900.9-2.800-.8-4.700-2.700-5.500-5.300-.2-.7.200-1.300 1.100-1.700Z"/>
    </svg>
  );
}
