import{b as $,r as c,d as A,j as e,u as M,t as E}from"./index-UJBoMZ4F.js";import{g as Y,L as Z,d as L,a as q}from"./Layout-vEidXHBI.js";function J({image:s,onSelect:k,onDelete:I,isSelected:d,onToggleSelect:g}){const{aesKey:u}=$(),[f,b]=c.useState(null);c.useEffect(()=>{if(s.encrypted_thumbnail&&s.thumbnail_iv&&u)try{const r=A(s.encrypted_thumbnail,s.thumbnail_iv,u);b(r)}catch{b(null)}},[s.encrypted_thumbnail,s.thumbnail_iv,u]);const z=r=>r<1024?r+" B":r<1024*1024?(r/1024).toFixed(1)+" KB":(r/(1024*1024)).toFixed(1)+" MB",p=r=>new Date(r).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),y=r=>{r.stopPropagation(),window.confirm(`确定删除 "${s.original_filename}" 吗？`)&&I(s.id)},v=r=>{r.stopPropagation(),g&&g(s)};return e.jsxs("div",{className:`image-card ${d?"image-card-selected":""}`,onClick:()=>k(s),children:[e.jsx("div",{className:"card-checkbox",children:e.jsx("input",{type:"checkbox",checked:d,onChange:v,onClick:r=>r.stopPropagation()})}),e.jsx("div",{className:"card-thumb",children:f?e.jsx("img",{src:f,alt:"",className:"thumb-image"}):e.jsxs("div",{className:"thumb-placeholder",children:[e.jsx("span",{className:"thumb-icon",children:"🔒"}),e.jsx("span",{className:"thumb-label",children:"已加密"})]})}),e.jsxs("div",{className:"card-info",children:[e.jsx("p",{className:"card-filename",title:s.original_filename,children:s.original_filename}),e.jsxs("div",{className:"card-meta",children:[e.jsx("span",{children:z(s.file_size)}),e.jsx("span",{children:p(s.created_at)})]}),s.tags&&e.jsx("div",{className:"card-tags",children:s.tags.split(",").map(r=>e.jsx("span",{className:"badge",children:r.trim()},r.trim()))})]}),e.jsx("button",{className:"card-delete",onClick:y,title:"删除",children:"✕"}),e.jsx("style",{children:`
        .image-card {
          position: relative;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: border-color var(--transition), box-shadow var(--transition),
            transform 0.15s ease;
        }
        .image-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .image-card-selected {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }
        .card-checkbox {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 2;
        }
        .card-checkbox input {
          width: 18px;
          height: 18px;
          accent-color: var(--color-primary);
          cursor: pointer;
        }
        .card-thumb {
          aspect-ratio: 4 / 3;
          background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .thumb-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
        }
        .thumb-icon { font-size: 2.5rem; opacity: 0.6; }
        .thumb-label { font-size: 0.75rem; font-weight: 500; }
        .card-info {
          padding: 12px;
        }
        .card-filename {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }
        .card-delete {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.85);
          color: #fff;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition);
        }
        .image-card:hover .card-delete {
          opacity: 1;
        }
        .card-delete:hover {
          background: var(--color-danger);
        }
      `})]})}function U(){const{isAuthenticated:s}=M(),{keyReady:k,aesKey:I}=$(),[d,g]=c.useState([]),[u,f]=c.useState(!0),[b,z]=c.useState(""),[p,y]=c.useState(1),[v,r]=c.useState(1),[x,B]=c.useState(""),[m,w]=c.useState(new Set),[o,C]=c.useState(null),[V,D]=c.useState(!1),j=c.useRef(!1),N=c.useCallback(async t=>{var i,n,a,l;f(!0),z("");try{const h=await Y({page:p,limit:20,search:t||void 0}),_=((i=h.data)==null?void 0:i.items)||h.items||[];g(_),r(((a=(n=h.data)==null?void 0:n.pagination)==null?void 0:a.pages)||((l=h.pagination)==null?void 0:l.pages)||1)}catch(h){z("加载图片列表失败"),console.error(h)}finally{f(!1)}},[p]);c.useEffect(()=>{s&&k&&N(x)},[s,k,N,p]);const R=async t=>{var i,n;try{await L(t),g(a=>a.filter(l=>l.id!==t)),w(a=>{const l=new Set(a);return l.delete(t),l})}catch(a){E("删除失败："+(((n=(i=a.response)==null?void 0:i.data)==null?void 0:n.message)||a.message),"error")}},K=async()=>{if(m.size===0||!window.confirm(`确定删除选中的 ${m.size} 张图片？`))return;const t=Array.from(m),i=5;let n=0,a=0;for(let l=0;l<t.length;l+=i){const h=t.slice(l,l+i),_=await Promise.allSettled(h.map(S=>L(S)));n+=_.filter(S=>S.status==="fulfilled").length,a+=_.filter(S=>S.status==="rejected").length}a>0?E(`${n} 张删除成功，${a} 张删除失败`,"warning"):n>0&&E(`${n} 张图片已删除`,"success"),N(x),w(new Set)},T=t=>{const i=t.id||t;w(n=>{const a=new Set(n);return a.has(i)?a.delete(i):a.add(i),a})},F=()=>{m.size===d.length?w(new Set):w(new Set(d.map(t=>t.id)))},G=async t=>{j.current=!1,D(!0),C({...t,decryptedSrc:null});try{const i=await q(t.id),n=i.data||i,a=A(n.encrypted_data,n.iv,I);if(!a||a.length===0)throw new Error("解密结果为空");j.current||C(l=>({...l,decryptedSrc:a}))}catch(i){j.current||C(n=>({...n,decryptedSrc:null,decryptError:"解密失败: "+i.message}))}finally{j.current||D(!1)}},P=()=>{j.current=!0,C(null)},H=t=>{t.preventDefault(),y(1),N(x)};return e.jsxs(Z,{children:[e.jsxs("div",{className:"gallery",children:[e.jsxs("div",{className:"gallery-toolbar",children:[e.jsxs("form",{className:"search-form",onSubmit:H,children:[e.jsx("input",{className:"input search-input",type:"text",placeholder:"搜索文件名、描述、标签...",value:x,onChange:t=>B(t.target.value)}),e.jsx("button",{className:"btn btn-primary btn-sm",type:"submit",children:"搜索"})]}),e.jsx("div",{className:"toolbar-actions",children:m.size>0&&e.jsxs("div",{className:"batch-actions",children:[e.jsxs("span",{className:"batch-count",children:["已选 ",m.size," 项"]}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:F,children:m.size===d.length?"取消全选":"全选"}),e.jsx("button",{className:"btn btn-danger btn-sm",onClick:K,children:"批量删除"})]})})]}),u?e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"加载中..."})]}):b?e.jsxs("div",{className:"gallery-status gallery-error",children:[e.jsx("p",{children:b}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>N(x),children:"重试"})]}):d.length===0?e.jsxs("div",{className:"gallery-status",children:[e.jsx("span",{className:"empty-icon",children:"🖼"}),e.jsx("p",{children:"暂无图片"}),e.jsx("p",{className:"text-muted text-sm",children:"上传你的第一张加密图片吧"})]}):e.jsx("div",{className:"image-grid",children:d.map(t=>e.jsx(J,{image:t,onSelect:G,onDelete:R,isSelected:m.has(t.id),onToggleSelect:T},t.id))}),v>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:p<=1,onClick:()=>y(t=>t-1),children:"上一页"}),e.jsxs("span",{className:"page-info",children:[p," / ",v]}),e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:p>=v,onClick:()=>y(t=>t+1),children:"下一页"})]}),o&&e.jsx("div",{className:"viewer-overlay",onClick:P,children:e.jsxs("div",{className:"viewer-card",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"viewer-header",children:[e.jsx("h3",{children:o.original_filename}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:P,children:"✕ 关闭"})]}),e.jsxs("div",{className:"viewer-body",children:[V&&e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在解密..."})]}),o.decryptedSrc&&e.jsx("img",{src:o.decryptedSrc,alt:o.original_filename,className:"viewer-img"}),o.decryptError&&e.jsx("p",{style:{color:"var(--color-danger)"},children:o.decryptError})]}),o.description&&e.jsx("p",{className:"viewer-desc",children:o.description})]})})]}),e.jsx("style",{children:`
        .gallery { display: flex; flex-direction: column; gap: 20px; }
        .gallery-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .search-form { display: flex; gap: 8px; flex: 1; max-width: 400px; }
        .search-input { flex: 1; }
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .batch-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .batch-count { font-size: 0.85rem; color: var(--color-primary); font-weight: 600; }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .gallery-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: var(--color-text-secondary);
        }
        .gallery-error { color: var(--color-danger); }
        .empty-icon { font-size: 4rem; opacity: 0.3; }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 16px 0;
        }
        .page-info { font-size: 0.9rem; color: var(--color-text-secondary); }
        /* Viewer overlay */
        .viewer-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        .viewer-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
        }
        .viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .viewer-header h3 {
          font-size: 1rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .viewer-body {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        .viewer-img {
          max-width: 100%;
          max-height: 65vh;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }
        .viewer-desc {
          padding: 0 20px 16px;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        @media (max-width: 640px) {
          .image-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
          .search-form { max-width: 100%; }
        }
      `})]})}export{U as default};
