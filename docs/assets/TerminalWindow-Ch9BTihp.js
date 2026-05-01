import{r as n,s as a,p as y,d as $,j as o}from"./index-DGflmKUA.js";const v=`Commands: help, about, work, skills, contact, clear, whoami, social, ls, cat skills, git log, sudo hire-me
Extras: uname, uptime, fortune, cowsay, env, rm -rf /, ping google`;function E(){const[d,l]=n.useState([{type:"o",text:"aryan-os shell - type help"}]),[g,u]=n.useState(""),[s,b]=n.useState([]),[m,c]=n.useState(0),x=n.useRef(null),p=n.useRef(!1);n.useEffect(()=>{var r;(r=x.current)==null||r.scrollIntoView({behavior:"smooth"})},[d]);const i=n.useCallback(async(r,e=!1)=>{if(!e){l(t=>[...t,{type:"o",text:r}]);return}p.current=!0,l(t=>[...t,{type:"o",text:""}]);for(let t=0;t<r.length;t++){const f=r.slice(0,t+1);await new Promise(h=>setTimeout(h,5)),l(h=>{const w=[...h];return w[w.length-1]={type:"o",text:f},w})}p.current=!1},[]),k=n.useCallback(async r=>{const e=r.trim().toLowerCase();if(l(t=>[...t,{type:"i",text:`$ ${r}`}]),!p.current&&e){if(e==="clear"){l([]);return}if(e==="help"){await i(v);return}if(e==="sudo hire-me"||e==="sudo hire me"){await i(`sudo: hire-me: Permission granted… for reading ${a.email}. No password stored on this shell.`,!0);return}if(e==="git log"){await i(`commit ${Date.now().toString(36)}
Author: ${a.name} <${a.email}>
Date: now

    chore(portfolio): ship early, iterate loudly.
`,!0);return}if(e==="rm -rf /"||e==="rm -rf life"){await i("rm: refusing to remove '/': Operation not permitted (try gratitude instead).",!0);return}if(e==="ping google.com"||e==="ping google"){await i("64 bytes from google.com: icmp_seq=0 ttl=56 time=0.9 ms — routes clear.",!0);return}if(e==="ls"||e==="ls projects"){await i(y.map(t=>`${t.title.replace(/\s+/g,"-").toLowerCase()}/`).join("  "),!0);return}if(e==="cat skills"||e==="cat skills.txt"){await i($.map(t=>`${t.title}:
${t.items.map(f=>`  • ${f.name}`).join(`
`)}`).join(`

`),!0);return}if(e==="about"){await i([a.about.headline,...a.about.paragraphs].join(`

`),!0);return}if(e==="work"){await i(y.map(t=>`• ${t.title} - ${t.subtitle}`).join(`
`),!0);return}if(e==="skills"){await i($.map(t=>`${t.title} (${t.items.length} items)`).join(`
`),!0);return}if(e==="contact"){await i(a.email,!0);return}if(e==="uname"||e==="uname -a"){await i("Darwin aryan-os 24.0.0 arm64 — portfolio shell (not a real kernel; aesthetics only).",!0);return}if(e==="uptime"){await i(`${Math.floor(performance.now()/36e5)}:${String(Math.floor(performance.now()/6e4%60)).padStart(2,"0")} up (session), load: imagination/1.0`,!0);return}if(e==="fortune"){await i(["Ship the portfolio. Touch grass between deploys.","Your cursor is glowing — use that power responsibly.","Recruiters skip cover letters; they remember motion design."][Math.floor(Math.random()*3)],!0);return}if(e.startsWith("cowsay")){const t=(r.replace(/^cowsay\s*/i,"").trim()||"moo").slice(0,72);await i(` ${"_".repeat(t.length+2)}
< ${t} >
 ${"-".repeat(t.length+2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,!0);return}if(e==="env"||e==="printenv"){await i(`USER=${a.name.replace(/\s+/g,"_")}
SHELL=aryan-os
PWD=/portfolio
NODE_ENV=creative`,!0);return}if(e==="whoami"){await i(`${a.name} - ${a.title}`,!0);return}if(e==="social"){await i(`GitHub: ${a.github}
LinkedIn: ${a.linkedin}
Medium: ${a.medium}`,!0);return}await i(`command not found: ${r.split(/\s+/)[0]}. Try help.`)}},[i]),j=r=>{if(r.key==="Enter"){const e=g;u(""),e.trim()&&b(t=>[...t,e].slice(-40)),c(0),k(e)}if(r.key==="ArrowUp"){if(r.preventDefault(),s.length===0)return;const e=Math.min(s.length,m+1);c(e),u(s[s.length-e]??"")}if(r.key==="ArrowDown"){if(r.preventDefault(),m<=1){c(0),u("");return}const e=m-1;c(e),u(s[s.length-e]??"")}};return o.jsxs("div",{className:"flex h-full min-h-[320px] flex-col bg-[#0a0a0c] p-3 font-jetbrains text-[12px] text-emerald-100/90",children:[o.jsxs("div",{className:"min-h-0 flex-1 overflow-auto whitespace-pre-wrap leading-relaxed",children:[d.map((r,e)=>o.jsx("div",{className:r.type==="i"?"text-white/55":"",children:r.text},`${e}-${r.text.slice(0,12)}`)),o.jsx("div",{ref:x})]}),o.jsxs("div",{className:"mt-2 flex items-center gap-2 border-t border-white/10 pt-2",children:[o.jsx("span",{className:"text-indigo-400",children:"❯"}),o.jsx("input",{className:"min-w-0 flex-1 bg-transparent text-white/90 outline-none caret-indigo-400",value:g,onChange:r=>u(r.target.value),onKeyDown:j,spellCheck:!1,autoCapitalize:"off",autoComplete:"off","aria-label":"Terminal input"}),o.jsx("span",{className:"ak-term-cursor inline-block h-4 w-2 shrink-0 bg-emerald-400/80","aria-hidden":!0})]})]})}export{E as TerminalWindow};
