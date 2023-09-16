import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setMetaDescription(content: string) {
  const meta = document.querySelector("meta[name='description']");
  if (meta) {
    meta.setAttribute("content", content);
  } else {
    const newMeta = document.createElement("meta");
    newMeta.setAttribute("name", "description");
    newMeta.setAttribute("content", content);
    document.head.appendChild(newMeta);
  }
}

export function setMetaTitle(content: string) {
  const meta = document.querySelector("meta[name='title']");
  if (meta) {
    meta.setAttribute("content", content);
  } else {
    const newMeta = document.createElement("meta");
    newMeta.setAttribute("name", "title");
    newMeta.setAttribute("content", content);
    document.head.appendChild(newMeta);
  }
}

export function setHtmlLang(lang: string) {
  document.documentElement.lang = lang;
}
