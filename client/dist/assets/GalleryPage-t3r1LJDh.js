import{b as O,r as i,d as G,j as e,u as ie,t as b,g as oe,s as le}from"./index-CChE3e5z.js";import{g as ce,L as de,d as F,a as pe,c as H}from"./Layout-BGnoMFgZ.js";function me({image:l,onSelect:D,onDelete:B,isSelected:x,onToggleSelect:u}){const{aesKey:N}=O(),[E,z]=i.useState(null),[C,A]=i.useState(!1),m=i.useRef(null);i.useEffect(()=>{const n=m.current;if(!n)return;const y=new IntersectionObserver(([$])=>{$.isIntersecting&&(A(!0),y.unobserve(n))},{rootMargin:"200px"});return y.observe(n),()=>y.disconnect()},[]),i.useEffect(()=>{if(!(!C||!l.encrypted_thumbnail||!l.thumbnail_iv||!N))try{const n=G(l.encrypted_thumbnail,l.thumbnail_iv,N);z(n)}catch{z(null)}},[C,l.encrypted_thumbnail,l.thumbnail_iv,N]);const f=n=>n<1024?n+" B":n<1024*1024?(n/1024).toFixed(1)+" KB":(n/(1024*1024)).toFixed(1)+" MB",v=n=>new Date(n).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),V=n=>{n.stopPropagation(),window.confirm(`确定删除 "${l.original_filename}" 吗？`)&&B(l.id)},I=n=>{n.stopPropagation(),u&&u(l)};return e.jsxs("div",{ref:m,className:`image-card ${x?"image-card-selected":""}`,onClick:()=>D(l),children:[e.jsx("div",{className:"card-checkbox",children:e.jsx("input",{type:"checkbox",checked:x,onChange:I,onClick:n=>n.stopPropagation()})}),e.jsx("div",{className:"card-thumb",children:E?e.jsx("img",{src:E,alt:"",className:"thumb-image"}):e.jsxs("div",{className:"thumb-placeholder",children:[e.jsx("span",{className:"thumb-icon",children:"🔒"}),e.jsx("span",{className:"thumb-label",children:"已加密"})]})}),e.jsxs("div",{className:"card-info",children:[e.jsx("p",{className:"card-filename",title:l.original_filename,children:l.original_filename}),e.jsxs("div",{className:"card-meta",children:[e.jsx("span",{children:f(l.file_size)}),e.jsx("span",{children:v(l.created_at)})]}),l.tags&&e.jsx("div",{className:"card-tags",children:l.tags.split(",").map(n=>e.jsx("span",{className:"badge",children:n.trim()},n.trim()))})]}),e.jsx("button",{className:"card-delete",onClick:V,title:"删除",children:"✕"}),e.jsx("style",{children:`
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
      `})]})}function xe(){const{isAuthenticated:l}=ie(),{keyReady:D,aesKey:B,keyHash:x}=O(),[u,N]=i.useState([]),[E,z]=i.useState(!0),[C,A]=i.useState(""),[m,f]=i.useState(1),[v,V]=i.useState(1),[I,n]=i.useState(20),[y,$]=i.useState(""),[j,J]=i.useState(""),[S,U]=i.useState(!1),[p,k]=i.useState(new Set),[h,_]=i.useState(null),[Y,R]=i.useState(!1),[Z,P]=i.useState(!1),[L,M]=i.useState(""),T=i.useRef(!1),w=i.useCallback(async a=>{var r,o,s,t;z(!0),A("");try{const d={page:m,limit:I,search:a||void 0};!S&&x&&(d.key_hash=x);const c=await ce(d),g=((r=c.data)==null?void 0:r.items)||c.items||[];N(g),V(((s=(o=c.data)==null?void 0:o.pagination)==null?void 0:s.pages)||((t=c.pagination)==null?void 0:t.pages)||1)}catch(d){A("加载图片列表失败"),console.error(d)}finally{z(!1)}},[m,I,x,S]);i.useEffect(()=>{l&&D&&w(j)},[l,D,w,m]);const q=async a=>{var r,o;try{await F(a),N(s=>s.filter(t=>t.id!==a)),k(s=>{const t=new Set(s);return t.delete(a),t})}catch(s){b("删除失败："+(((o=(r=s.response)==null?void 0:r.data)==null?void 0:o.message)||s.message),"error")}},Q=async()=>{if(p.size===0||!window.confirm(`确定删除选中的 ${p.size} 张图片？`))return;const a=Array.from(p),r=5;let o=0,s=0;for(let t=0;t<a.length;t+=r){const d=a.slice(t,t+r),c=await Promise.allSettled(d.map(g=>F(g)));o+=c.filter(g=>g.status==="fulfilled").length,s+=c.filter(g=>g.status==="rejected").length}s>0?b(`${o} 张删除成功，${s} 张删除失败`,"warning"):o>0&&b(`${o} 张图片已删除`,"success"),w(j),k(new Set)},W=a=>{const r=a.id||a;k(o=>{const s=new Set(o);return s.has(r)?s.delete(r):s.add(r),s})},X=()=>{p.size===u.length?k(new Set):k(new Set(u.map(a=>a.id)))},ee=async a=>{T.current=!1,_({...a,decryptedSrc:null});const r=oe(a.id);if(r){_(t=>({...t,decryptedSrc:r}));return}R(!0);const o=15e3,s=new Promise((t,d)=>{setTimeout(()=>d(new Error("请求超时")),o)});try{const t=await Promise.race([pe(a.id),s]),d=t.data||t,c=G(d.encrypted_data,d.iv,B);if(!c||c.length===0)throw new Error("解密结果为空");le(a.id,c),T.current||_(g=>({...g,decryptedSrc:c}))}catch(t){if(!T.current){const d=t.message==="请求超时"?"加载超时，请检查网络":"解密失败";_(c=>({...c,decryptedSrc:null,decryptError:d}))}}finally{T.current||R(!1)}},K=()=>{T.current=!0,_(null)},ae=a=>{a.preventDefault(),f(1),w(j)},te=a=>{a.preventDefault();const r=parseInt(y,10);r>=1&&r<=v&&(f(r),$(""))},se=a=>{n(a),f(1)},re=async()=>{var r,o,s;if(!L.trim())return;const a=Array.from(p);try{const t=await H.put("/api/images/batch",{ids:a,tags:L.trim()});b(`${t.data.data.updated} 个图片标签已更新`,"success")}catch(t){b("批量打标签失败: "+(((s=(o=(r=t.response)==null?void 0:r.data)==null?void 0:o.error)==null?void 0:s.message)||t.message),"error")}P(!1),M(""),w(j)},ne=async()=>{var r,o,s;if(!x){b("请先设置加密口令","error");return}const a=Array.from(p);if(a.length!==0)try{const t=await H.put("/api/images/batch-key-hash",{ids:a,key_hash:x});b(`${t.data.data.updated} 个图片已标记为当前密钥可解密`,"success"),w(j),k(new Set)}catch(t){b("批量标记失败: "+(((s=(o=(r=t.response)==null?void 0:r.data)==null?void 0:o.error)==null?void 0:s.message)||t.message),"error")}};return e.jsxs(de,{children:[e.jsxs("div",{className:"gallery",children:[e.jsxs("div",{className:"gallery-toolbar",children:[e.jsxs("form",{className:"search-form",onSubmit:ae,children:[e.jsx("input",{className:"input search-input",type:"text",placeholder:"搜索文件名、描述、标签...",value:j,onChange:a=>J(a.target.value)}),e.jsx("button",{className:"btn btn-primary btn-sm",type:"submit",children:"搜索"})]}),e.jsxs("div",{className:"toolbar-actions",children:[e.jsx("button",{className:`btn btn-sm ${S?"btn-primary":"btn-ghost"}`,onClick:()=>{U(!S),f(1)},title:S?"只显示可解密图片":"显示所有图片",children:S?"显示全部":"仅可解密"}),p.size>0&&e.jsxs("div",{className:"batch-actions",children:[e.jsxs("span",{className:"batch-count",children:["已选 ",p.size," 项"]}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:X,children:p.size===u.length?"取消全选":"全选"}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>P(!0),children:"批量打标签"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:ne,title:"标记选中图片为当前密钥可解密",children:"标记密钥"}),e.jsx("button",{className:"btn btn-danger btn-sm",onClick:Q,children:"批量删除"})]})]})]}),E?e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"加载中..."})]}):C?e.jsxs("div",{className:"gallery-status gallery-error",children:[e.jsx("p",{children:C}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>w(j),children:"重试"})]}):u.length===0?e.jsxs("div",{className:"gallery-status",children:[e.jsx("span",{className:"empty-icon",children:"🖼"}),e.jsx("p",{children:"暂无图片"}),e.jsx("p",{className:"text-muted text-sm",children:"上传你的第一张加密图片吧"})]}):e.jsx("div",{className:"image-grid",children:u.map(a=>e.jsx(me,{image:a,onSelect:ee,onDelete:q,isSelected:p.has(a.id),onToggleSelect:W},a.id))}),e.jsxs("div",{className:"pagination-bar",children:[e.jsxs("div",{className:"page-size-selector",children:[e.jsx("span",{className:"page-label",children:"每页"}),e.jsxs("select",{className:"page-select",value:I,onChange:a=>se(Number(a.target.value)),children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"}),e.jsx("option",{value:100,children:"100"})]}),e.jsx("span",{className:"page-label",children:"条"})]}),v>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:m<=1,onClick:()=>f(a=>a-1),children:"上一页"}),e.jsxs("span",{className:"page-info",children:[m," / ",v]}),e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:m>=v,onClick:()=>f(a=>a+1),children:"下一页"})]}),e.jsxs("form",{className:"jump-form",onSubmit:te,children:[e.jsx("span",{className:"page-label",children:"跳转"}),e.jsx("input",{className:"input jump-input",type:"number",min:"1",max:v,value:y,onChange:a=>$(a.target.value),placeholder:"页码"}),e.jsx("button",{className:"btn btn-ghost btn-sm",type:"submit",children:"GO"})]})]}),h&&e.jsx("div",{className:"viewer-overlay",onClick:K,children:e.jsxs("div",{className:"viewer-card",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"viewer-header",children:[e.jsx("h3",{children:h.original_filename}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:K,children:"✕ 关闭"})]}),e.jsxs("div",{className:"viewer-body",children:[Y&&e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在解密..."})]}),h.decryptedSrc&&e.jsx("img",{src:h.decryptedSrc,alt:h.original_filename,className:"viewer-img"}),h.decryptError&&e.jsx("p",{style:{color:"var(--color-danger)"},children:h.decryptError})]}),h.description&&e.jsx("p",{className:"viewer-desc",children:h.description})]})}),Z&&e.jsx("div",{className:"viewer-overlay",onClick:()=>P(!1),children:e.jsxs("div",{className:"tag-dialog",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"tag-dialog-header",children:[e.jsx("h3",{children:"批量打标签"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>P(!1),children:"✕"})]}),e.jsxs("div",{className:"tag-dialog-body",children:[e.jsxs("p",{className:"tag-dialog-info",children:["为选中的 ",e.jsx("strong",{children:p.size})," 张图片添加标签"]}),e.jsx("input",{className:"input",type:"text",placeholder:"输入标签，多个标签用逗号分隔",value:L,onChange:a=>M(a.target.value),autoFocus:!0}),e.jsx("p",{className:"tag-dialog-hint",children:"例如：风景,旅行,2024"})]}),e.jsxs("div",{className:"tag-dialog-footer",children:[e.jsx("button",{className:"btn btn-ghost",onClick:()=>P(!1),children:"取消"}),e.jsx("button",{className:"btn btn-primary",onClick:re,children:"确认"})]})]})})]}),e.jsx("style",{children:`
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
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px 0;
        }
        .pagination {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .page-info { font-size: 0.9rem; color: var(--color-text-secondary); }
        .page-size-selector {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .page-label {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        .page-select {
          padding: 4px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 0.85rem;
          cursor: pointer;
        }
        .jump-form {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .jump-input {
          width: 60px;
          padding: 4px 8px;
          text-align: center;
        }
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
        /* Tag Dialog */
        .tag-dialog {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 400px;
          max-width: 90vw;
          animation: fadeIn 0.2s ease;
        }
        .tag-dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .tag-dialog-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        .tag-dialog-body {
          padding: 20px;
        }
        .tag-dialog-info {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }
        .tag-dialog-hint {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 8px;
        }
        .tag-dialog-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--color-border);
        }
        @media (max-width: 640px) {
          .image-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
          .search-form { max-width: 100%; }
        }
      `})]})}export{xe as default};
