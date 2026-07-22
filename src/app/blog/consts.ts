export interface BlogPost {
  title: string;
  category: string;
  link: string;
  date: string;
  external?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "The CLI is the New UI",
    category: "AI & DX",
    link: "https://www.thesis.social/article/cmp73stnr000o04l6bxr194c5",
    date: "May 2026",
    external: true,
  },
  {
    title: "The need for INCLUSION.md",
    category: "Accessibility",
    link: "/blog/posts/the-need-for-inclusion-md",
    date: "May 2026",
  },
  {
    title: "Creating an A11y Auditing Kit",
    category: "Accessibility",
    link: "/blog/posts/creating-an-a11y-auditing-kit",
    date: "June 2022",
  },
];
