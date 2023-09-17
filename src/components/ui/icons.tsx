import {
  LucideProps,
  Linkedin,
  Github,
  Home,
  Phone,
  Mail,
  Hash,
  Smile,
  Frown,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";

export const Icons = {
  expand: ChevronsUpDown,
  collapse: ChevronsDownUp,
  home: Home,
  phone: Phone,
  linkedin: Linkedin,
  mail: Mail,
  github: Github,
  hash: Hash,
  smile: Smile,
  frown: Frown,
  logo: (props: LucideProps) => (
    <svg viewBox="0 0 555 640" {...props}>
      <path
        fill="currentColor"
        d="
  M 555.00 160.06
  L 555.00 480.06
  L 277.69 640.00
  L 277.19 640.00
  L 0.00 479.94
  L -0.04 160.12
  L 276.65 0.51
  Q 277.50 0.02 278.35 0.51
  L 555.00 160.06
  Z
  M 24.88 173.89
  A 0.75 0.75 0.0 0 0 24.50 174.54
  L 24.50 465.46
  A 0.75 0.75 0.0 0 0 24.88 466.11
  L 277.13 611.51
  A 0.75 0.75 0.0 0 0 277.87 611.51
  L 530.12 466.08
  A 0.75 0.75 0.0 0 0 530.50 465.43
  L 530.50 174.52
  A 0.75 0.75 0.0 0 0 530.12 173.87
  L 277.88 28.45
  A 0.75 0.75 0.0 0 0 277.14 28.45
  L 24.88 173.89
  Z"
      />
      <rect
        fill="currentColor"
        x="-13.20"
        y="-105.04"
        transform="translate(275.08,319.99) rotate(11.6)"
        width="26.40"
        height="210.08"
        rx="13.04"
      />
      <path
        fill="currentColor"
        d="
  M 198.40 263.40
  C 179.42 281.50 161.08 300.52 142.52 319.13
  Q 142.15 319.49 142.52 319.86
  Q 187.88 365.35 201.06 378.42
  C 214.21 391.47 196.16 410.67 181.58 396.25
  Q 149.65 364.67 117.98 332.83
  C 109.02 323.81 106.89 317.47 116.33 308.04
  Q 149.39 274.99 182.41 241.91
  C 194.04 230.28 212.08 244.31 203.21 258.21
  Q 202.22 259.76 198.40 263.40
  Z"
      />
      <path
        fill="currentColor"
        d="
  M 352.15 258.71
  C 343.70 247.33 356.69 232.38 368.98 239.19
  Q 370.82 240.21 374.25 243.64
  Q 406.21 275.58 438.16 307.53
  C 444.73 314.10 448.07 321.56 440.66 329.17
  Q 424.98 345.26 374.09 395.59
  C 369.26 400.37 364.12 403.44 357.82 400.68
  C 348.74 396.69 346.64 385.73 353.69 378.69
  Q 383.10 349.30 412.49 319.89
  Q 412.87 319.51 412.50 319.14
  Q 385.61 292.20 358.77 265.39
  Q 352.32 258.95 352.15 258.71
  Z"
      />
    </svg>
  ),
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