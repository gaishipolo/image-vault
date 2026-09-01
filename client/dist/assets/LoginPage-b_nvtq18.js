import{u as j,a as N,r as s,j as e,N as y}from"./index-UJBoMZ4F.js";function S(){const{login:p,isAuthenticated:u}=j(),x=N(),[t,f]=s.useState(""),[o,h]=s.useState(""),[r,l]=s.useState(""),[n,i]=s.useState(!1);if(u)return e.jsx(y,{to:"/key-setup",replace:!0});const b=async a=>{var c,d,m;if(a.preventDefault(),l(""),!t.trim()||!o.trim()){l("请输入用户名和密码");return}i(!0);try{await p(t,o),x("/key-setup")}catch(g){const v=((m=(d=(c=g.response)==null?void 0:c.data)==null?void 0:d.error)==null?void 0:m.message)||g.message||"登录失败，请检查用户名和密码";l(v)}finally{i(!1)}};return e.jsxs("div",{className:"login-page",children:[e.jsxs("div",{className:"login-card animate-fade-in",children:[e.jsxs("div",{className:"login-header",children:[e.jsx("span",{className:"login-logo",children:"🔒"}),e.jsx("h1",{className:"login-title",children:"SecureVault"}),e.jsx("p",{className:"login-subtitle",children:"图片管理系统"})]}),e.jsxs("form",{className:"login-form",onSubmit:b,children:[r&&e.jsx("div",{className:"login-error",children:r}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"username",children:"用户名"}),e.jsx("input",{id:"username",className:`input ${r?"input-error":""}`,type:"text",placeholder:"请输入用户名",value:t,onChange:a=>f(a.target.value),autoComplete:"username",autoFocus:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"password",children:"密码"}),e.jsx("input",{id:"password",className:`input ${r?"input-error":""}`,type:"password",placeholder:"请输入密码",value:o,onChange:a=>h(a.target.value),autoComplete:"current-password"})]}),e.jsx("button",{className:"btn btn-primary btn-lg w-full",type:"submit",disabled:n,children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner"}),"登录中..."]}):"登录"})]})]}),e.jsx("style",{children:`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 50%, #ede9fe 100%);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 40px 32px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-logo { font-size: 3rem; display: block; margin-bottom: 8px; }
        .login-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .login-subtitle {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-top: 4px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .login-error {
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-sm);
          color: var(--color-danger);
          font-size: 0.85rem;
          text-align: center;
        }
        @media (max-width: 480px) {
          .login-card { padding: 32px 20px; }
        }
      `})]})}export{S as default};
