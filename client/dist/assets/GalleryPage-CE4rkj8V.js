import{b as Q,r as o,d as K,j as e,u as ye,t as h,g as ve,s as je,c as we,e as Ne}from"./index-srIVcmBf.js";import{g as Se,L as ke,d as Y,a as Z,c as q,u as ze}from"./Layout-BBnBE6Bx.js";function Ce({image:l,onSelect:T,onDelete:S,isSelected:u,onToggleSelect:f}){const{aesKey:k}=Q(),[A,_]=o.useState(null),[P,E]=o.useState(!1),g=o.useRef(null);o.useEffect(()=>{const n=g.current;if(!n)return;const w=new IntersectionObserver(([M])=>{M.isIntersecting&&(E(!0),w.unobserve(n))},{rootMargin:"200px"});return w.observe(n),()=>w.disconnect()},[]),o.useEffect(()=>{if(!(!P||!l.encrypted_thumbnail||!l.thumbnail_iv||!k))try{const n=K(l.encrypted_thumbnail,l.thumbnail_iv,k);_(n)}catch{_(null)}},[P,l.encrypted_thumbnail,l.thumbnail_iv,k]);const b=n=>n<1024?n+" B":n<1024*1024?(n/1024).toFixed(1)+" KB":(n/(1024*1024)).toFixed(1)+" MB",j=n=>new Date(n).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),L=n=>{n.stopPropagation(),window.confirm(`确定删除 "${l.original_filename}" 吗？`)&&S(l.id)},I=n=>{n.stopPropagation(),f&&f(l)};return e.jsxs("div",{ref:g,className:`image-card ${u?"image-card-selected":""}`,onClick:()=>T(l),children:[e.jsx("div",{className:"card-checkbox",children:e.jsx("input",{type:"checkbox",checked:u,onChange:I,onClick:n=>n.stopPropagation()})}),e.jsx("div",{className:"card-thumb",children:A?e.jsx("img",{src:A,alt:"",className:"thumb-image"}):e.jsxs("div",{className:"thumb-placeholder",children:[e.jsx("span",{className:"thumb-icon",children:"🔒"}),e.jsx("span",{className:"thumb-label",children:"已加密"})]})}),e.jsxs("div",{className:"card-info",children:[e.jsx("p",{className:"card-filename",title:l.original_filename,children:l.original_filename}),e.jsxs("div",{className:"card-meta",children:[e.jsx("span",{children:b(l.file_size)}),e.jsx("span",{children:j(l.created_at)})]}),l.tags&&e.jsx("div",{className:"card-tags",children:l.tags.split(",").map(n=>e.jsx("span",{className:"badge",children:n.trim()},n.trim()))})]}),e.jsx("button",{className:"card-delete",onClick:L,title:"删除",children:"✕"}),e.jsx("style",{children:`
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
      `})]})}function Ie(){const{isAuthenticated:l}=ye(),{keyReady:T,aesKey:S,keyHash:u}=Q(),[f,k]=o.useState([]),[A,_]=o.useState(!0),[P,E]=o.useState(""),[g,b]=o.useState(1),[j,L]=o.useState(1),[I,n]=o.useState(20),[w,M]=o.useState(""),[y,X]=o.useState(""),[z,ee]=o.useState(!1),[m,N]=o.useState(new Set),[x,B]=o.useState(null),[te,H]=o.useState(!1),[ae,$]=o.useState(!1),[F,O]=o.useState(""),D=o.useRef(!1),v=o.useCallback(async t=>{var s,i,r,a;_(!0),E("");try{const c={page:g,limit:I,search:t||void 0};!z&&u&&(c.key_hash=u);const d=await Se(c),p=((s=d.data)==null?void 0:s.items)||d.items||[];k(p),L(((r=(i=d.data)==null?void 0:i.pagination)==null?void 0:r.pages)||((a=d.pagination)==null?void 0:a.pages)||1)}catch(c){E("加载图片列表失败"),console.error(c)}finally{_(!1)}},[g,I,u,z]);o.useEffect(()=>{l&&T&&v(y)},[l,T,v,g]);const se=async t=>{var s,i;try{await Y(t),k(r=>r.filter(a=>a.id!==t)),N(r=>{const a=new Set(r);return a.delete(t),a})}catch(r){h("删除失败："+(((i=(s=r.response)==null?void 0:s.data)==null?void 0:i.message)||r.message),"error")}},re=async()=>{if(m.size===0||!window.confirm(`确定删除选中的 ${m.size} 张图片？`))return;const t=Array.from(m),s=5;let i=0,r=0;for(let a=0;a<t.length;a+=s){const c=t.slice(a,a+s),d=await Promise.allSettled(c.map(p=>Y(p)));i+=d.filter(p=>p.status==="fulfilled").length,r+=d.filter(p=>p.status==="rejected").length}r>0?h(`${i} 张删除成功，${r} 张删除失败`,"warning"):i>0&&h(`${i} 张图片已删除`,"success"),v(y),N(new Set)},ne=t=>{const s=t.id||t;N(i=>{const r=new Set(i);return r.has(s)?r.delete(s):r.add(s),r})},ie=()=>{m.size===f.length?N(new Set):N(new Set(f.map(t=>t.id)))},oe=async t=>{D.current=!1,B({...t,decryptedSrc:null});const s=ve(t.id);if(s){B(a=>({...a,decryptedSrc:s}));return}H(!0);const i=15e3,r=new Promise((a,c)=>{setTimeout(()=>c(new Error("请求超时")),i)});try{const a=await Promise.race([Z(t.id),r]),c=a.data||a,d=K(c.encrypted_data,c.iv,S);if(!d||d.length===0)throw new Error("解密结果为空");je(t.id,d),D.current||B(p=>({...p,decryptedSrc:d}))}catch(a){if(!D.current){const c=a.message==="请求超时"?"加载超时，请检查网络":"解密失败";B(d=>({...d,decryptedSrc:null,decryptError:c}))}}finally{D.current||H(!1)}},J=()=>{D.current=!0,B(null)},le=t=>{t.preventDefault(),b(1),v(y)},ce=t=>{t.preventDefault();const s=parseInt(w,10);s>=1&&s<=j&&(b(s),M(""))},de=t=>{n(t),b(1)},pe=async()=>{var s,i,r;if(!F.trim())return;const t=Array.from(m);try{const a=await q.put("/api/images/batch",{ids:t,tags:F.trim()});h(`${a.data.data.updated} 个图片标签已更新`,"success")}catch(a){h("批量打标签失败: "+(((r=(i=(s=a.response)==null?void 0:s.data)==null?void 0:i.error)==null?void 0:r.message)||a.message),"error")}$(!1),O(""),v(y)},me=async()=>{var s,i,r;if(!u){h("请先设置加密口令","error");return}const t=Array.from(m);if(t.length!==0)try{const a=await q.put("/api/images/batch-key-hash",{ids:t,key_hash:u});h(`${a.data.data.updated} 个图片已标记为当前密钥可解密`,"success"),v(y),N(new Set)}catch(a){h("批量标记失败: "+(((r=(i=(s=a.response)==null?void 0:s.data)==null?void 0:i.error)==null?void 0:r.message)||a.message),"error")}},he=async()=>{if(!S){h("请先设置加密口令","error");return}const t=Array.from(m);if(t.length===0||!window.confirm(`将对 ${t.length} 张图片进行重新压缩（PNG/BMP → WebP无损），是否继续？`))return;let s=0,i=0,r=0;for(let c=0;c<t.length;c++){const d=t[c];h(`正在处理 ${c+1}/${t.length}...`,"info");try{const p=await Z(d),C=p.data||p,U=K(C.encrypted_data,C.iv,S),G=atob(U.split(",")[1]||U),W=new ArrayBuffer(G.length),ge=new Uint8Array(W);for(let V=0;V<G.length;V++)ge[V]=G.charCodeAt(V);const xe=new Blob([W],{type:C.mime_type}),ue=new File([xe],C.original_filename,{type:C.mime_type}),R=await we(ue),{ciphertext:fe,iv:be}=Ne(R.data,S);await ze(d,{encrypted_data:fe,iv:be,mime_type:R.mime_type,file_size:R.compressed_size}),r+=C.file_size-R.compressed_size,s++}catch(p){console.error(`重新压缩图片 ${d} 失败:`,p),i++}}const a=(r/1024/1024).toFixed(2);h(`完成：${s} 张成功，${i} 张失败，节省 ${a} MB`,s>0?"success":"error"),v(y),N(new Set)};return e.jsxs(ke,{children:[e.jsxs("div",{className:"gallery",children:[e.jsxs("div",{className:"gallery-toolbar",children:[e.jsxs("form",{className:"search-form",onSubmit:le,children:[e.jsx("input",{className:"input search-input",type:"text",placeholder:"搜索文件名、描述、标签...",value:y,onChange:t=>X(t.target.value)}),e.jsx("button",{className:"btn btn-primary btn-sm",type:"submit",children:"搜索"})]}),e.jsxs("div",{className:"toolbar-actions",children:[e.jsx("button",{className:`btn btn-sm ${z?"btn-primary":"btn-ghost"}`,onClick:()=>{ee(!z),b(1)},title:z?"只显示可解密图片":"显示所有图片",children:z?"显示全部":"仅可解密"}),m.size>0&&e.jsxs("div",{className:"batch-actions",children:[e.jsxs("span",{className:"batch-count",children:["已选 ",m.size," 项"]}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:ie,children:m.size===f.length?"取消全选":"全选"}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>$(!0),children:"批量打标签"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:me,title:"标记选中图片为当前密钥可解密",children:"标记密钥"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:he,title:"重新压缩（PNG/BMP → WebP无损）",children:"重新压缩"}),e.jsx("button",{className:"btn btn-danger btn-sm",onClick:re,children:"批量删除"})]})]})]}),A?e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"加载中..."})]}):P?e.jsxs("div",{className:"gallery-status gallery-error",children:[e.jsx("p",{children:P}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>v(y),children:"重试"})]}):f.length===0?e.jsxs("div",{className:"gallery-status",children:[e.jsx("span",{className:"empty-icon",children:"🖼"}),e.jsx("p",{children:"暂无图片"}),e.jsx("p",{className:"text-muted text-sm",children:"上传你的第一张加密图片吧"})]}):e.jsx("div",{className:"image-grid",children:f.map(t=>e.jsx(Ce,{image:t,onSelect:oe,onDelete:se,isSelected:m.has(t.id),onToggleSelect:ne},t.id))}),e.jsxs("div",{className:"pagination-bar",children:[e.jsxs("div",{className:"page-size-selector",children:[e.jsx("span",{className:"page-label",children:"每页"}),e.jsxs("select",{className:"page-select",value:I,onChange:t=>de(Number(t.target.value)),children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"}),e.jsx("option",{value:100,children:"100"})]}),e.jsx("span",{className:"page-label",children:"条"})]}),j>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:g<=1,onClick:()=>b(t=>t-1),children:"上一页"}),e.jsxs("span",{className:"page-info",children:[g," / ",j]}),e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:g>=j,onClick:()=>b(t=>t+1),children:"下一页"})]}),e.jsxs("form",{className:"jump-form",onSubmit:ce,children:[e.jsx("span",{className:"page-label",children:"跳转"}),e.jsx("input",{className:"input jump-input",type:"number",min:"1",max:j,value:w,onChange:t=>M(t.target.value),placeholder:"页码"}),e.jsx("button",{className:"btn btn-ghost btn-sm",type:"submit",children:"GO"})]})]}),x&&e.jsx("div",{className:"viewer-overlay",onClick:J,children:e.jsxs("div",{className:"viewer-card",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"viewer-header",children:[e.jsx("h3",{children:x.original_filename}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:J,children:"✕ 关闭"})]}),e.jsxs("div",{className:"viewer-body",children:[te&&e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在解密..."})]}),x.decryptedSrc&&e.jsx("img",{src:x.decryptedSrc,alt:x.original_filename,className:"viewer-img"}),x.decryptError&&e.jsx("p",{style:{color:"var(--color-danger)"},children:x.decryptError})]}),x.description&&e.jsx("p",{className:"viewer-desc",children:x.description})]})}),ae&&e.jsx("div",{className:"viewer-overlay",onClick:()=>$(!1),children:e.jsxs("div",{className:"tag-dialog",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"tag-dialog-header",children:[e.jsx("h3",{children:"批量打标签"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>$(!1),children:"✕"})]}),e.jsxs("div",{className:"tag-dialog-body",children:[e.jsxs("p",{className:"tag-dialog-info",children:["为选中的 ",e.jsx("strong",{children:m.size})," 张图片添加标签"]}),e.jsx("input",{className:"input",type:"text",placeholder:"输入标签，多个标签用逗号分隔",value:F,onChange:t=>O(t.target.value),autoFocus:!0}),e.jsx("p",{className:"tag-dialog-hint",children:"例如：风景,旅行,2024"})]}),e.jsxs("div",{className:"tag-dialog-footer",children:[e.jsx("button",{className:"btn btn-ghost",onClick:()=>$(!1),children:"取消"}),e.jsx("button",{className:"btn btn-primary",onClick:pe,children:"确认"})]})]})})]}),e.jsx("style",{children:`
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
      `})]})}export{Ie as default};
