import{u as y,b,a as j,r as i,j as e,N as g}from"./index-Dh-KNLnu.js";function v(a){if(!a)return{level:0,label:"",color:""};let r=0;return a.length>=8&&r++,a.length>=12&&r++,/[A-Z]/.test(a)&&r++,/[0-9]/.test(a)&&r++,/[^A-Za-z0-9]/.test(a)&&r++,r<=1?{level:1,label:"弱",color:"#ef4444"}:r<=3?{level:2,label:"中等",color:"#f59e0b"}:{level:3,label:"强",color:"#22c55e"}}function N(){const{isAuthenticated:a}=y(),{keyReady:r,unlockKey:m}=b(),p=j(),[s,x]=i.useState(""),[o,u]=i.useState(""),[c,l]=i.useState(""),[d,f]=i.useState(!1);if(!a)return e.jsx(g,{to:"/login",replace:!0});if(r)return e.jsx(g,{to:"/gallery",replace:!0});const n=v(s),h=t=>{if(t.preventDefault(),l(""),!s){l("请输入加密口令");return}if(s.length<6){l("口令长度至少 6 个字符");return}if(s!==o){l("两次输入的口令不一致");return}f(!0),setTimeout(()=>{try{m(s),p("/gallery")}catch{l("密钥生成失败，请重试")}finally{f(!1)}},50)};return e.jsxs("div",{className:"key-page",children:[e.jsxs("div",{className:"key-card animate-fade-in",children:[e.jsxs("div",{className:"key-header",children:[e.jsx("span",{className:"key-icon",children:"🔑"}),e.jsx("h1",{className:"key-title",children:"设置加密口令"}),e.jsxs("p",{className:"key-desc",children:["请设置加密口令，用于派生 AES-256 密钥保护您的图片数据。",e.jsx("br",{}),e.jsx("strong",{style:{color:"#ef4444"},children:"⚠ 忘记口令将无法恢复已加密的图片，请妥善保管！"}),e.jsx("br",{}),"口令仅保存在本地浏览器中，不会发送到服务器。"]})]}),e.jsxs("form",{className:"key-form",onSubmit:h,children:[c&&e.jsx("div",{className:"key-error",children:c}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"passphrase",children:"加密口令"}),e.jsx("input",{id:"passphrase",className:"input",type:"password",placeholder:"请输入加密口令（至少 6 个字符）",value:s,onChange:t=>x(t.target.value),autoFocus:!0}),s&&e.jsxs("div",{className:"strength-bar-wrapper",children:[e.jsx("div",{className:"strength-bar",children:[1,2,3].map(t=>e.jsx("div",{className:"strength-segment",style:{background:n.level>=t?n.color:"#e2e8f0"}},t))}),e.jsx("span",{className:"strength-label",style:{color:n.color},children:n.label})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"confirm",children:"确认口令"}),e.jsx("input",{id:"confirm",className:"input",type:"password",placeholder:"请再次输入口令",value:o,onChange:t=>u(t.target.value)})]}),e.jsx("button",{className:"btn btn-primary btn-lg w-full",type:"submit",disabled:d,children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner"}),"正在生成密钥..."]}):"解锁并进入"})]})]}),e.jsx("style",{children:`
        .key-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #ede9fe 0%, #f8fafc 50%, #e0e7ff 100%);
        }
        .key-card {
          width: 100%;
          max-width: 440px;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 40px 32px;
        }
        .key-header { text-align: center; margin-bottom: 28px; }
        .key-icon { font-size: 3rem; display: block; margin-bottom: 8px; }
        .key-title { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
        .key-desc {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin-top: 8px;
          line-height: 1.6;
        }
        .key-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text); }
        .key-error {
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-sm);
          color: var(--color-danger);
          font-size: 0.85rem;
          text-align: center;
        }
        .strength-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .strength-bar {
          flex: 1;
          display: flex;
          gap: 4px;
        }
        .strength-segment {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .strength-label {
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .key-card { padding: 32px 20px; }
        }
      `})]})}export{N as default};
