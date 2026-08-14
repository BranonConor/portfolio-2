/**
 * The site's sections, framed as game cartridges — shared by the home-page
 * cartridge selector (BootIntro) so both stay in sync. Selecting one on
 * the home screen triggers the boot animation and lands you on `href`.
 */
export type Cartridge = {
  label: string;
  href: string;
  color: string;
  blurb: string;
  /** Filename under /public/boot-intro/cartridges/, matching `color`. */
  art: string;
};

export const CARTRIDGES: Cartridge[] = [
  {
    label: "ABOUT",
    href: "/about",
    color: "#f05032",
    blurb: "Who I am",
    art: "red.svg",
  },
  {
    label: "IN THE WILD",
    href: "/in-the-wild",
    color: "#fbbf24",
    blurb: "Work out in the world",
    art: "yellow.svg",
  },
  {
    label: "ENGAGEMENTS",
    href: "/engagements",
    color: "#22c55e",
    blurb: "Talks & workshops",
    art: "green.svg",
  },
  {
    label: "BLOG",
    href: "/blog",
    color: "#61dafb",
    blurb: "Things I've written",
    art: "blue.svg",
  },
  {
    label: "PROJECTS",
    href: "/projects",
    color: "#da70d6",
    blurb: "Things I've built",
    art: "purple.svg",
  },
];
