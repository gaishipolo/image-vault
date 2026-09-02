import{h as d,u as m,b as p,a as b,j as a,i as s}from"./index-Dh-KNLnu.js";const x="",o=d.create({baseURL:x,timeout:3e4,headers:{"Content-Type":"application/json"}});o.interceptors.request.use(e=>{const n=localStorage.getItem("jwt_token");return n&&(e.headers.Authorization=`Bearer ${n}`),e},e=>Promise.reject(e));o.interceptors.response.use(e=>e,e=>(e.response&&e.response.status===401&&(localStorage.removeItem("jwt_token"),sessionStorage.removeItem("aes_key"),window.location.pathname!=="/login"&&(window.location.href="/login")),Promise.reject(e)));async function v(e={}){return(await o.get("/api/images",{params:e})).data}async function u(e){return(await o.get(`/api/images/${e}`)).data}async function h(e){return(await o.post("/api/images/upload",e,{timeout:6e4})).data}async function f(e){return(await o.delete(`/api/images/${e}`)).data}function j({children:e}){const{user:n,logout:i}=m(),{lockKey:c}=p(),l=b(),r=()=>{window.confirm(`确定退出登录？
退出后需要重新输入加密口令。`)&&(c(),i(),l("/login"))};return a.jsxs("div",{className:"layout",children:[a.jsx("header",{className:"navbar",children:a.jsxs("div",{className:"navbar-inner",children:[a.jsxs("div",{className:"navbar-brand",children:[a.jsx("span",{className:"brand-icon",children:"🔒"}),a.jsx("span",{className:"brand-text",children:"SecureVault"})]}),a.jsxs("nav",{className:"navbar-nav",children:[a.jsxs(s,{to:"/gallery",className:({isActive:t})=>`nav-link ${t?"nav-link-active":""}`,children:[a.jsx("span",{className:"nav-icon",children:"🖼"}),"画廊"]}),a.jsxs(s,{to:"/upload",className:({isActive:t})=>`nav-link ${t?"nav-link-active":""}`,children:[a.jsx("span",{className:"nav-icon",children:"⬆"}),"上传"]})]}),a.jsxs("div",{className:"navbar-right",children:[n&&a.jsx("span",{className:"user-name",children:n.username}),a.jsx("button",{className:"btn btn-ghost btn-sm",onClick:r,children:"退出登录"})]})]})}),a.jsx("main",{className:"main-content",children:e}),a.jsxs("nav",{className:"mobile-tabbar",children:[a.jsxs(s,{to:"/gallery",className:({isActive:t})=>`tab-item ${t?"tab-active":""}`,children:[a.jsx("span",{className:"tab-icon",children:"🖼"}),a.jsx("span",{className:"tab-label",children:"画廊"})]}),a.jsxs(s,{to:"/upload",className:({isActive:t})=>`tab-item ${t?"tab-active":""}`,children:[a.jsx("span",{className:"tab-icon",children:"⬆"}),a.jsx("span",{className:"tab-label",children:"上传"})]}),a.jsxs("button",{className:"tab-item",onClick:r,children:[a.jsx("span",{className:"tab-icon",children:"🚪"}),a.jsx("span",{className:"tab-label",children:"退出"})]})]}),a.jsx("style",{children:`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--color-text);
        }
        .brand-icon { font-size: 1.3rem; }
        .navbar-nav {
          display: flex;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: background var(--transition), color var(--transition);
        }
        .nav-link:hover {
          background: var(--color-surface-hover);
          color: var(--color-text);
          text-decoration: none;
        }
        .nav-link-active {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }
        .nav-icon { font-size: 1rem; }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-name {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        .main-content {
          flex: 1;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 24px;
          padding-bottom: 80px; /* space for bottom tab bar */
        }

        /* Mobile bottom tab bar */
        .mobile-tabbar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          padding: 8px 0;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
        }
        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 4px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          font-size: 0.7rem;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .tab-item:active {
          background: var(--color-surface-hover);
        }
        .tab-active {
          color: var(--color-primary);
        }
        .tab-icon {
          font-size: 1.4rem;
          line-height: 1;
        }
        .tab-label {
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .navbar-inner { padding: 0 12px; }
          .user-name { display: none; }
          .brand-text { display: none; }
          .nav-link span:not(.nav-icon) { display: none; }
          .main-content {
            padding: 16px;
            padding-bottom: 80px; /* space for mobile bottom tab bar */
          }
          .mobile-tabbar {
            display: flex;
          }
        }
      `})]})}export{j as L,u as a,o as c,f as d,v as g,h as u};
