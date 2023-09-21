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
