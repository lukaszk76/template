# A webpage template

#### This is a template for a  webpage with Shadcn-ui and shader animation based on Three.js. 
Please feel free to utilize it for your projects.

## What it provides?:

+ [TypeScript](https://www.typescriptlang.org/) as the main language.
+ [React 18](https://www.react.org/) as the main frontend framework.
+ [Vite](https://vitejs.dev/) as the bundler.
+ [TailwindCSS](https://tailwindcss.com/) as the CSS framework.
+ [Shadcn-ui](https://ui.shadcn.com/) as the UI library.
+ [Three.js](https://threejs.org/) as the 3D webgl library.
+ [GSAP](https://greensock.com/gsap/) as the animation library.
+ [Lucide](https://lucide.dev/) as the icon library.
+ [Lenis](https://lenis.studiofreight.com/) as smooth scrolling library.
+ [ESLint](https://eslint.org/) as the linter.
+ [Prettier](https://prettier.io/) as the code formatter.

It also provides custom hooks, functions and providers for:
+ custom shader animation engine based on Three.js: ```src/components/ThreeAnimationPipes```
+ multiple language support: ```src/lib/useTranslations.tsx``` and ```src/components/Menu/LanguageSelector.tsx```
+ dark mode support: ```src/components/Menu/ThemeToggle.tsx```
+ main meta tags setting: ```src/lib/metaTagsSetters.ts```
+ app context: ```src/AppContext.tsx```

## How to use?
1. Set your global css settings in ```app/globals.css```.
2. Add your components to ```src/components```.
3. Connect your components to the main page in  ```src/components/Layout/Layout.tsx```.
4. Arrange your global context (if it makes sense for your project) in ```src/AppContext.tsx```.
5. Add translations to ```src/assets/translations```. In case you develop a bigger project you should consider using an external translation management system.
6. Adjust the app menu in ```src/components/Menu/Menu.tsx```.
7. Adjust the webgl animation (if you need any animation) in ```src/components/ThreeAnimationPipes/ThreeAnimationPipes.tsx```.
The main Three.js setup is in ```src/components/ThreeAnimationPipes/Three/AnimationEngine.ts```.
Shaders can be found in ```src/components/ThreeAnimationPipes/Three/glsl```.
The animation provided in the template is inspired by [movie](https://www.youtube.com/watch?v=0D-J_Lbxeeg&t=4s) of [Yuri Artiukh](https://www.youtube.com/@akella_).
8. Adjust the cursor animation (if you need any) in ```src/components/AnimatedCursor/animatedCursor.ts```.
