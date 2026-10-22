const Icon = ({ children }) =>
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>;

const icons = {
  back:     <Icon><path d="M15 5l-7 7 7 7"/></Icon>,
  forward:  <Icon><path d="M9 5l7 7-7 7"/></Icon>,
  search:   <Icon><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></Icon>,
  trim:     <Icon><path d="M7 3v14h14"/><path d="M3 7h14v14"/></Icon>,
  bookmark: <Icon><path d="M7 3h10v18l-5-4-5 4z"/></Icon>,
};

export default icons;
