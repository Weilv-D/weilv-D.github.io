import{t as r}from"./hoisted.WQgUK5qD.js";import"./index.C893PFFG.js";const n={},c=document.createElement("script");Object.entries({...n,src:"https://giscus.app/client.js"}).forEach(([e,t])=>c.setAttribute(e,t));const i={light:"noborder_light",dark:"noborder_gray"},o=e=>{let t=e;return t==="os-default"&&(t="light",(document.querySelector(":root.dark")||document.querySelector(":root:not(.light)")&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(t="dark")),i[t]},a=e=>{document.querySelector("iframe.giscus-frame")?.contentWindow?.postMessage({giscus:e},"https://giscus.app")};r.subscribe(e=>{a({setConfig:{theme:o(e)}})});const s=e=>{if(!e.querySelector(".giscus"))return;const t=c.cloneNode(!0);t.setAttribute("data-theme",o(r.get())),e.body.appendChild(t)};s(document);document.addEventListener("astro:after-swap",()=>s(document));window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>e.matches&&s(document));window.matchMedia("(prefers-color-scheme: light)").addEventListener("change",e=>e.matches&&s(document));