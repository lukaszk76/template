import { LucideProps, Linkedin, Github } from "lucide-react";

export const Icons = {
  linkedin: Linkedin,
  github: Github,

  yinYang: (props: LucideProps) => (
    <svg viewBox="-46 -46 86 86" {...props}>
      <circle
        r="36"
        fill="hsl(var(--background))"
        stroke="currentColor"
        strokeWidth="6"
      />
      <path
        fill="currentColor"
        d="M0,36a36,36 0 0 1 0,-72a18,18 0 0 1 0,36a18,18 0 0 0 0,36"
      />
      <circle r="5" cy="18" fill="currentColor" />
      <circle r="5" cy="-18" fill="hsl(var(--background))" />
    </svg>
  ),
};
