(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,56154,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(62319),r=e.i(56691),i=e.i(80152);let n="linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)",s={background:n,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},l=["Tráfego Pago","Sites & Landing Pages","SEO","Social Media","Design Gráfico","Pacote Completo"],c=[{label:"WhatsApp",valor:"+55 (41) 99817-0428",href:"https://wa.me/5541998170428"},{label:"E-mail",valor:"contato@casacriative.com.br",href:"mailto:contato@casacriative.com.br"},{label:"Horário",valor:"Seg–Sex, 9h às 17h",href:null},{label:"Localização",valor:"Curitiba, PR — Brasil",href:null}];e.s(["default",0,function(){let[e,d]=(0,a.useState)("idle"),[p,g]=(0,a.useState)(""),h=async e=>{e.preventDefault();let t=new FormData(e.currentTarget);if(t.get("_gotcha"))return;let a=String(t.get("instagram")||""),o=String(t.get("nicho")||""),r=String(t.get("servico")||""),n=[r&&`Servi\xe7o: ${r}`,o&&`Nicho: ${o}`,a&&`Instagram: ${a}`].filter(Boolean).join(" | ");d("sending"),g("");try{await (0,i.sendLead)({name:String(t.get("name")||""),email:String(t.get("email")||""),phone:String(t.get("phone")||""),source:"form",notes:n}),d("sent")}catch(e){g(e.message||"Erro ao enviar."),d("error")}};return(0,t.jsxs)("main",{style:{background:"#000",minHeight:"100vh"},children:[(0,t.jsx)("style",{children:`
        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,210,160,0.2);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 14px;
          color: #fff;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .contact-input:focus { border-color: rgba(255,210,160,0.5); }
        .contact-input::placeholder { color: rgba(255,255,255,0.28); }
        .contact-select {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,210,160,0.2);
          border-radius: 10px;
          padding: 13px 16px;
          color: rgba(255,255,255,0.5);
          outline: none;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          box-sizing: border-box;
        }
        .contact-select option { background: #1a1a1a; color: #fff; }
        .glass-card-contact {
          position: relative;
          border-radius: 16px;
          background: linear-gradient(140deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 20%, rgba(120,70,40,0.08) 40%, rgba(0,0,0,0.6) 80%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          padding: 40px;
          overflow: hidden;
          border: 0.5px solid rgba(255,210,160,0.15);
        }
        .glass-card-contact::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(circle at 20% 10%, rgba(255,220,180,0.25) 0%, transparent 28%);
          pointer-events: none;
        }
      `}),(0,t.jsx)(o.default,{}),(0,t.jsxs)("section",{className:"hero-section",children:[(0,t.jsx)("p",{style:{fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:"#c47a4a",marginBottom:16},children:"Contato"}),(0,t.jsxs)("h1",{className:"h1-xl",style:{fontWeight:700,color:"#f5f5f7",maxWidth:600,margin:"0 auto 20px"},children:["Vamos fazer sua",(0,t.jsx)("br",{}),(0,t.jsx)("span",{style:{background:n,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:"marca crescer."})]}),(0,t.jsx)("p",{style:{fontSize:17,fontWeight:300,color:"#86868b",lineHeight:1.65,maxWidth:460,margin:"0 auto"},children:"Sem compromisso. A primeira conversa é totalmente gratuita."})]}),(0,t.jsx)("section",{style:{padding:"0 24px 100px"},children:(0,t.jsxs)("div",{className:"r-contact",style:{maxWidth:900,margin:"0 auto",gap:40},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:28,marginBottom:40},children:c.map((e,a)=>(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{style:{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#555",marginBottom:4},children:e.label}),e.href?(0,t.jsx)("a",{href:e.href,style:{fontSize:15,textDecoration:"none",...s},children:e.valor}):(0,t.jsx)("p",{style:{fontSize:15,color:"#86868b"},children:e.valor})]},a))}),(0,t.jsx)("div",{style:{height:"0.5px",background:"linear-gradient(90deg,transparent,#c47a4a,transparent)",marginBottom:28}}),(0,t.jsx)("p",{style:{fontSize:13,fontWeight:300,color:"#555",lineHeight:1.7},children:"Respondemos em até 24h úteis. Para urgências, use o WhatsApp."})]}),(0,t.jsxs)("div",{className:"glass-card-contact",children:[(0,t.jsx)("div",{style:{position:"absolute",top:0,left:0,right:0,height:2,background:n,borderRadius:"16px 16px 0 0"}}),"sent"===e?(0,t.jsxs)("div",{style:{position:"relative",zIndex:1,textAlign:"center",padding:"40px 10px"},children:[(0,t.jsx)("h2",{style:{fontSize:22,fontWeight:700,color:"#f5f5f7",marginBottom:10},children:"Mensagem enviada! ✅"}),(0,t.jsx)("p",{style:{fontSize:14,fontWeight:300,color:"#86868b"},children:"Recebemos seu contato e retornamos em até 24h úteis."})]}):(0,t.jsxs)("form",{onSubmit:h,style:{display:"flex",flexDirection:"column",gap:10,position:"relative",zIndex:1},children:[(0,t.jsx)("h2",{style:{fontSize:20,fontWeight:700,color:"#f5f5f7",letterSpacing:"-0.5px",marginBottom:4},children:"Envie sua mensagem"}),(0,t.jsx)("p",{style:{fontSize:13,fontWeight:300,color:"#86868b",marginBottom:12},children:"Preencha abaixo e retornamos em até 24h."}),(0,t.jsx)("input",{name:"name",className:"contact-input",type:"text",placeholder:"Nome completo",required:!0}),(0,t.jsx)("input",{name:"email",className:"contact-input",type:"email",placeholder:"E-mail",required:!0}),(0,t.jsx)("input",{name:"phone",className:"contact-input",type:"tel",placeholder:"Telefone / WhatsApp"}),(0,t.jsx)("input",{name:"instagram",className:"contact-input",type:"text",placeholder:"Instagram (@suamarca)"}),(0,t.jsx)("input",{name:"nicho",className:"contact-input",type:"text",placeholder:"Nicho de atuação"}),(0,t.jsxs)("select",{name:"servico",className:"contact-select",defaultValue:"",children:[(0,t.jsx)("option",{value:"",disabled:!0,children:"Serviço de interesse"}),l.map(e=>(0,t.jsx)("option",{value:e,children:e},e))]}),(0,t.jsx)("input",{name:"_gotcha",tabIndex:-1,autoComplete:"off",style:{position:"absolute",left:"-9999px",width:1,height:1,opacity:0},"aria-hidden":"true"}),"error"===e&&(0,t.jsxs)("p",{style:{color:"#ff6b6b",fontSize:13},children:[p," Tente novamente ou use o WhatsApp."]}),(0,t.jsx)("button",{type:"submit",disabled:"sending"===e,style:{background:n,color:"#fff",border:"none",borderRadius:10,padding:"14px 28px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit",marginTop:6,opacity:"sending"===e?.6:1},children:"sending"===e?"Enviando…":"Enviar mensagem"})]})]})]})}),(0,t.jsx)(r.default,{})]})}])}]);