// =========================
// Class: MenuItem
// =========================

export class MenuItem {
  title: string;
  routerLink: string;
  icon: string | null;
  onClick: (event: Event) => void;

  constructor(
    title: string,
    routerLink: string,
    options?: {
      icon?: string;
      onClick?: (event: Event) => void;
    },
  ) {
    this.title = title;
    this.routerLink = routerLink;
    this.icon = options?.icon ?? null;
    this.onClick = options?.onClick ?? (() => {});
  }
}
