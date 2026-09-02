import{b as F,r as o,d as K,j as e,u as ae,t as C,g as te,s as se}from"./index-Dh-KNLnu.js";import{g as re,L as ie,d as R,a as ne,c as le}from"./Layout-DrUUIBzO.js";function oe({image:l,onSelect:I,onDelete:T,isSelected:m,onToggleSelect:b}){const{aesKey:v}=F(),[y,j]=o.useState(null);o.useEffect(()=>{if(l.encrypted_thumbnail&&l.thumbnail_iv&&v)try{const n=K(l.encrypted_thumbnail,l.thumbnail_iv,v);j(n)}catch{j(null)}},[l.encrypted_thumbnail,l.thumbnail_iv,v]);const P=n=>n<1024?n+" B":n<1024*1024?(n/1024).toFixed(1)+" KB":(n/(1024*1024)).toFixed(1)+" MB",h=n=>new Date(n).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),g=n=>{n.stopPropagation(),window.confirm(`确定删除 "${l.original_filename}" 吗？`)&&T(l.id)},x=n=>{n.stopPropagation(),b&&b(l)};return e.jsxs("div",{className:`image-card ${m?"image-card-selected":""}`,onClick:()=>I(l),children:[e.jsx("div",{className:"card-checkbox",children:e.jsx("input",{type:"checkbox",checked:m,onChange:x,onClick:n=>n.stopPropagation()})}),e.jsx("div",{className:"card-thumb",children:y?e.jsx("img",{src:y,alt:"",className:"thumb-image"}):e.jsxs("div",{className:"thumb-placeholder",children:[e.jsx("span",{className:"thumb-icon",children:"🔒"}),e.jsx("span",{className:"thumb-label",children:"已加密"})]})}),e.jsxs("div",{className:"card-info",children:[e.jsx("p",{className:"card-filename",title:l.original_filename,children:l.original_filename}),e.jsxs("div",{className:"card-meta",children:[e.jsx("span",{children:P(l.file_size)}),e.jsx("span",{children:h(l.created_at)})]}),l.tags&&e.jsx("div",{className:"card-tags",children:l.tags.split(",").map(n=>e.jsx("span",{className:"badge",children:n.trim()},n.trim()))})]}),e.jsx("button",{className:"card-delete",onClick:g,title:"删除",children:"✕"}),e.jsx("style",{children:`
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
      `})]})}function pe(){const{isAuthenticated:l}=ae(),{keyReady:I,aesKey:T}=F(),[m,b]=o.useState([]),[v,y]=o.useState(!0),[j,P]=o.useState(""),[h,g]=o.useState(1),[x,n]=o.useState(1),[_,G]=o.useState(20),[B,$]=o.useState(""),[u,J]=o.useState(""),[c,w]=o.useState(new Set),[p,N]=o.useState(null),[H,A]=o.useState(!1),[M,S]=o.useState(!1),[E,L]=o.useState(""),z=o.useRef(!1),f=o.useCallback(async a=>{var s,r,t,i;y(!0),P("");try{const d=await re({page:h,limit:_,search:a||void 0}),D=((s=d.data)==null?void 0:s.items)||d.items||[];b(D),n(((t=(r=d.data)==null?void 0:r.pagination)==null?void 0:t.pages)||((i=d.pagination)==null?void 0:i.pages)||1)}catch(d){P("加载图片列表失败"),console.error(d)}finally{y(!1)}},[h,_]);o.useEffect(()=>{l&&I&&f(u)},[l,I,f,h]);const O=async a=>{var s,r;try{await R(a),b(t=>t.filter(i=>i.id!==a)),w(t=>{const i=new Set(t);return i.delete(a),i})}catch(t){C("删除失败："+(((r=(s=t.response)==null?void 0:s.data)==null?void 0:r.message)||t.message),"error")}},Y=async()=>{if(c.size===0||!window.confirm(`确定删除选中的 ${c.size} 张图片？`))return;const a=Array.from(c),s=5;let r=0,t=0;for(let i=0;i<a.length;i+=s){const d=a.slice(i,i+s),D=await Promise.allSettled(d.map(k=>R(k)));r+=D.filter(k=>k.status==="fulfilled").length,t+=D.filter(k=>k.status==="rejected").length}t>0?C(`${r} 张删除成功，${t} 张删除失败`,"warning"):r>0&&C(`${r} 张图片已删除`,"success"),f(u),w(new Set)},Z=a=>{const s=a.id||a;w(r=>{const t=new Set(r);return t.has(s)?t.delete(s):t.add(s),t})},q=()=>{c.size===m.length?w(new Set):w(new Set(m.map(a=>a.id)))},Q=async a=>{z.current=!1,N({...a,decryptedSrc:null});const s=te(a.id);if(s){N(r=>({...r,decryptedSrc:s}));return}A(!0);try{const r=await ne(a.id),t=r.data||r,i=K(t.encrypted_data,t.iv,T);if(!i||i.length===0)throw new Error("解密结果为空");se(a.id,i),z.current||N(d=>({...d,decryptedSrc:i}))}catch(r){z.current||N(t=>({...t,decryptedSrc:null,decryptError:"解密失败: "+r.message}))}finally{z.current||A(!1)}},V=()=>{z.current=!0,N(null)},U=a=>{a.preventDefault(),g(1),f(u)},W=a=>{a.preventDefault();const s=parseInt(B,10);s>=1&&s<=x&&(g(s),$(""))},X=a=>{G(a),g(1)},ee=async()=>{var s,r,t;if(!E.trim())return;const a=Array.from(c);try{const i=await le.put("/api/images/batch",{ids:a,tags:E.trim()});C(`${i.data.data.updated} 个图片标签已更新`,"success")}catch(i){C("批量打标签失败: "+(((t=(r=(s=i.response)==null?void 0:s.data)==null?void 0:r.error)==null?void 0:t.message)||i.message),"error")}S(!1),L(""),f(u)};return e.jsxs(ie,{children:[e.jsxs("div",{className:"gallery",children:[e.jsxs("div",{className:"gallery-toolbar",children:[e.jsxs("form",{className:"search-form",onSubmit:U,children:[e.jsx("input",{className:"input search-input",type:"text",placeholder:"搜索文件名、描述、标签...",value:u,onChange:a=>J(a.target.value)}),e.jsx("button",{className:"btn btn-primary btn-sm",type:"submit",children:"搜索"})]}),e.jsx("div",{className:"toolbar-actions",children:c.size>0&&e.jsxs("div",{className:"batch-actions",children:[e.jsxs("span",{className:"batch-count",children:["已选 ",c.size," 项"]}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:q,children:c.size===m.length?"取消全选":"全选"}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>S(!0),children:"批量打标签"}),e.jsx("button",{className:"btn btn-danger btn-sm",onClick:Y,children:"批量删除"})]})})]}),v?e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"加载中..."})]}):j?e.jsxs("div",{className:"gallery-status gallery-error",children:[e.jsx("p",{children:j}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>f(u),children:"重试"})]}):m.length===0?e.jsxs("div",{className:"gallery-status",children:[e.jsx("span",{className:"empty-icon",children:"🖼"}),e.jsx("p",{children:"暂无图片"}),e.jsx("p",{className:"text-muted text-sm",children:"上传你的第一张加密图片吧"})]}):e.jsx("div",{className:"image-grid",children:m.map(a=>e.jsx(oe,{image:a,onSelect:Q,onDelete:O,isSelected:c.has(a.id),onToggleSelect:Z},a.id))}),e.jsxs("div",{className:"pagination-bar",children:[e.jsxs("div",{className:"page-size-selector",children:[e.jsx("span",{className:"page-label",children:"每页"}),e.jsxs("select",{className:"page-select",value:_,onChange:a=>X(Number(a.target.value)),children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"}),e.jsx("option",{value:100,children:"100"})]}),e.jsx("span",{className:"page-label",children:"条"})]}),x>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:h<=1,onClick:()=>g(a=>a-1),children:"上一页"}),e.jsxs("span",{className:"page-info",children:[h," / ",x]}),e.jsx("button",{className:"btn btn-ghost btn-sm",disabled:h>=x,onClick:()=>g(a=>a+1),children:"下一页"})]}),e.jsxs("form",{className:"jump-form",onSubmit:W,children:[e.jsx("span",{className:"page-label",children:"跳转"}),e.jsx("input",{className:"input jump-input",type:"number",min:"1",max:x,value:B,onChange:a=>$(a.target.value),placeholder:"页码"}),e.jsx("button",{className:"btn btn-ghost btn-sm",type:"submit",children:"GO"})]})]}),p&&e.jsx("div",{className:"viewer-overlay",onClick:V,children:e.jsxs("div",{className:"viewer-card",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"viewer-header",children:[e.jsx("h3",{children:p.original_filename}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:V,children:"✕ 关闭"})]}),e.jsxs("div",{className:"viewer-body",children:[H&&e.jsxs("div",{className:"gallery-status",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在解密..."})]}),p.decryptedSrc&&e.jsx("img",{src:p.decryptedSrc,alt:p.original_filename,className:"viewer-img"}),p.decryptError&&e.jsx("p",{style:{color:"var(--color-danger)"},children:p.decryptError})]}),p.description&&e.jsx("p",{className:"viewer-desc",children:p.description})]})}),M&&e.jsx("div",{className:"viewer-overlay",onClick:()=>S(!1),children:e.jsxs("div",{className:"tag-dialog",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"tag-dialog-header",children:[e.jsx("h3",{children:"批量打标签"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>S(!1),children:"✕"})]}),e.jsxs("div",{className:"tag-dialog-body",children:[e.jsxs("p",{className:"tag-dialog-info",children:["为选中的 ",e.jsx("strong",{children:c.size})," 张图片添加标签"]}),e.jsx("input",{className:"input",type:"text",placeholder:"输入标签，多个标签用逗号分隔",value:E,onChange:a=>L(a.target.value),autoFocus:!0}),e.jsx("p",{className:"tag-dialog-hint",children:"例如：风景,旅行,2024"})]}),e.jsxs("div",{className:"tag-dialog-footer",children:[e.jsx("button",{className:"btn btn-ghost",onClick:()=>S(!1),children:"取消"}),e.jsx("button",{className:"btn btn-primary",onClick:ee,children:"确认"})]})]})})]}),e.jsx("style",{children:`
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
      `})]})}export{pe as default};
