(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=e>>>0;return()=>{t+=1831565813;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}function t(e,t){let n=[...t];for(let t=n.length-1;t>0;t--){let r=Math.floor(e()*(t+1));[n[t],n[r]]=[n[r],n[t]]}return n}function n(e,n,r){return t(e,Array.from({length:n},(e,t)=>t)).slice(0,r)}var r=[`김`,`이`,`박`,`최`,`정`,`강`,`조`,`윤`,`장`,`임`,`한`,`오`,`서`,`신`,`권`,`황`,`안`,`송`,`류`,`홍`],i=`민준.서준.도윤.예준.시우.하준.주원.지호.준서.건우.서연.서윤.지우.서현.민서.하은.하윤.윤서.채원.지유.수아.지민.현우.지안.유준.은우.시현.예은.다은.수빈.연우.태양.가은.예린.소율.도현.준혁.시온.나윤.재원`.split(`.`);function a(e){return r[Math.floor(e()*r.length)]+i[Math.floor(e()*i.length)]}function o(e,t){for(let n=0;n<20;n++){let n=a(e);if(n!==t)return n}return`홍길동`}var s={id_mark:`학년·반·번호 마킹 오류`,name_mismatch:`성명 불일치`,duplicate_mark:`중복 표기`,missing_mark:`답안 미표기`,incomplete_mark:`불완전 표기`,missing_subject:`과목코드 누락`,missing_proctor:`감독관 확인란 누락`,correction_tape:`수정테이프 이상 (우리 학교 규정)`,form_type:`문형(홀·짝) 미표기`,wrong_pen:`컴퓨터용 사인펜 아님`,damaged:`접힘·얼룩·찢김`,ok:`이상 없음`},c={id_mark:`수기·명렬의 학년·반·번호와 자릿수 마킹이 다릅니다.`,name_mismatch:`OMR 수기 성명이 명렬표와 다릅니다.`,duplicate_mark:`같은 문항에 두 개 이상 칠해져 있습니다. (구: 이중 마킹)`,missing_mark:`답해야 할 문항이 비어 있습니다.`,incomplete_mark:`마킹이 흐리거나 불완전해 인식이 어렵습니다. (구: 흐린 마킹)`,missing_subject:`과목코드가 비어 있습니다.`,missing_proctor:`감독관 확인란에 서명·도장이 없습니다.`,correction_tape:`수정테이프가 들뜨거나 위에 다시 칠해져 있습니다. ※ 처리는 우리 학교 규정 기준.`,form_type:`문형(홀수형/짝수형)이 표기되지 않았습니다.`,wrong_pen:`컴퓨터용 수성 사인펜이 아닌 필기구 흔적입니다.`,damaged:`카드가 접히거나 얼룩·찢김이 있습니다.`,ok:`수기·마킹·명렬이 일치하고 물리적 이상도 없습니다.`},l=[`id_mark`,`name_mismatch`,`duplicate_mark`,`missing_mark`,`incomplete_mark`,`missing_subject`,`missing_proctor`,`correction_tape`,`form_type`,`wrong_pen`,`damaged`,`ok`],u={ok:`정상`,ask_student:`학생에게 수정 요청`,to_subject:`교과 확인으로 넘김`},d={ok:`이상 없음. 성적 처리로 넘깁니다.`,ask_student:`시험 진행 중에만. 학생이 본인 카드를 고칩니다. 교사가 대신 칠하지 않습니다.`,to_subject:`시험 종료 후. 현장에서 고치지 않고 교과·성적 처리로 넘깁니다.`},f={easy:{id:`easy`,label:`쉬움`,studentCount:10,questionCount:20,errorCardCount:3,flippedBackCount:2,upsideDownCount:2,absentCount:1,timeLimitSec:null},normal:{id:`normal`,label:`보통`,studentCount:20,questionCount:20,errorCardCount:6,flippedBackCount:4,upsideDownCount:3,absentCount:2,timeLimitSec:600},hard:{id:`hard`,label:`어려움`,studentCount:30,questionCount:20,errorCardCount:10,flippedBackCount:6,upsideDownCount:5,absentCount:3,timeLimitSec:480}},p=[`id_mark`,`name_mismatch`,`duplicate_mark`,`missing_mark`,`incomplete_mark`,`missing_subject`,`missing_proctor`,`correction_tape`,`form_type`,`wrong_pen`,`damaged`];function m(e){return String(e).padStart(2,`0`)}function ee(e,t){return Array.from({length:t},()=>({choices:[1+Math.floor(e()*5)]}))}function te(e,n,r,i,a){if(!n.injectedErrors.includes(i))switch(n.injectedErrors.push(i),i){case`id_mark`:{let t=e();if(t<.34)n.markedGrade=r.grade===1?2:1;else if(t<.67){let t=r.classNo;for(;t===r.classNo;)t=1+Math.floor(e()*8);n.markedClass=t}else{let t=r.number;for(;t===r.number;)t=1+Math.floor(e()*40);n.markedNumber=t}break}case`name_mismatch`:n.handwrittenName=o(e,r.name);break;case`duplicate_mark`:{let t=Math.floor(e()*a),r=1+Math.floor(e()*5),i=r;for(;i===r;)i=1+Math.floor(e()*5);n.answers[t]={choices:[r,i]};break}case`missing_mark`:{let t=Math.floor(e()*a);n.answers[t]={choices:[]};break}case`incomplete_mark`:{let t=Math.floor(e()*a),r=n.answers[t]?.choices[0]??1+Math.floor(e()*5);n.answers[t]={choices:[r],incomplete:!0};break}case`missing_subject`:n.subjectCode=null;break;case`missing_proctor`:n.proctorSigned=!1;break;case`correction_tape`:n.hasCorrectionTape=!0,n.correctionTapeBad=!0;break;case`form_type`:n.formType=null;break;case`wrong_pen`:n.wrongPen=!0;break;case`damaged`:n.damaged=!0,n.damageKind=t(e,[`fold`,`stain`,`tear`])[0]}}function h(r=`easy`,i){let o=f[r],s={seed:i??(Math.floor(Math.random()*1e9)||1),difficulty:r,studentCount:o.studentCount,questionCount:o.questionCount,grade:2,classNo:4,subjectCode:17,errorCardCount:o.errorCardCount,flippedBackCount:o.flippedBackCount,upsideDownCount:o.upsideDownCount,absentCount:o.absentCount,timeLimitSec:o.timeLimitSec},c=e(s.seed),l=Array.from({length:s.studentCount},(e,t)=>{let n=t+1;return{id:`s-${m(n)}`,grade:s.grade,classNo:s.classNo,number:n,name:a(c),examId:`${s.grade}${m(s.classNo)}${m(n)}`,absent:!1}}),u=n(c,l.length,Math.min(s.absentCount,l.length-1)),d=[`병결`,`사고결`,`기타결`,`미응시`];for(let e of u)l[e].absent=!0,l[e].absentNote=d[Math.floor(c()*d.length)];let h=l.filter(e=>!e.absent).map(e=>({id:`c-${e.id}`,studentId:e.id,handwrittenName:e.name,handwrittenGrade:e.grade,handwrittenClass:e.classNo,handwrittenNumber:e.number,markedGrade:e.grade,markedClass:e.classNo,markedNumber:e.number,subjectCode:s.subjectCode,formType:c()<.5?`odd`:`even`,answers:ee(c,s.questionCount),proctorSigned:!0,hasCorrectionTape:!1,correctionTapeBad:!1,wrongPen:!1,damaged:!1,injectedErrors:[],faceDown:!1,upsideDown:!1})),g=n(c,h.length,Math.min(s.errorCardCount,h.length));for(let e of g){let n=h[e],r=l.find(e=>e.id===n.studentId),i=c()<.4?2:1,a=t(c,[...p]).slice(0,i);for(let e of a)te(c,n,r,e,s.questionCount)}for(let e of h)e.injectedErrors.length===0&&(e.injectedErrors=[`ok`]);let _=n(c,h.length,Math.min(s.flippedBackCount,h.length));for(let e of _)h[e].faceDown=!0;let v=h.map((e,t)=>e.faceDown?-1:t).filter(e=>e>=0),y=t(c,v).slice(0,Math.min(s.upsideDownCount,v.length));for(let e of y)h[e].upsideDown=!0;if(y.length<s.upsideDownCount){let e=s.upsideDownCount-y.length,n=t(c,h.map((e,t)=>e.faceDown&&!e.upsideDown?t:-1).filter(e=>e>=0)).slice(0,e);for(let e of n)h[e].upsideDown=!0}return{config:s,roster:l,cards:t(c,h)}}function g(e,t){let n=new Map(t.map(e=>[e.studentId,e.id]));return e.filter(e=>!e.absent).map(e=>n.get(e.id))}function _(e,t){return e.find(e=>e.id===t.studentId)}function v(e){return e.injectedErrors.length===1&&e.injectedErrors[0]===`ok`?`ok`:`to_subject`}function y(){let e=new URLSearchParams(location.search).get(`seed`);if(!e)return;let t=Number(e);return Number.isFinite(t)?t>>>0:void 0}function ne(){let e=new URLSearchParams(location.search).get(`diff`);if(e===`easy`||e===`normal`||e===`hard`)return e}function re(e){let t=e.length,n=e.filter(e=>e.absent).length;return{enrolled:t,absent:n,present:t-n}}var ie=20,ae=25,oe=25,se=8,ce=300;function le(e){let t=new Set(e);return t.has(`ok`)&&t.size>1&&t.delete(`ok`),[...t]}function ue(e,t,n){let r=e.length===t.length&&e.every((e,n)=>e===t[n]),i=e.filter(e=>{let t=n.get(e);return t&&(t.faceDown||t.upsideDown)});return{orderCorrect:r,orientationCorrect:i.length===0,playerOrder:e,expectedOrder:t,badOrientation:i}}function de(e,t){let n=new Map(t.map(e=>[e.cardId,e]));return e.map(e=>{let t=e.injectedErrors.length===1&&e.injectedErrors[0]===`ok`?[`ok`]:e.injectedErrors.filter(e=>e!==`ok`),r=n.get(e.id),i=le(r?.selected??[]),a=r?.disposition??`ok`,o=v(e),s=new Set(t),c=new Set(i),l=[...c].filter(e=>s.has(e)),u=[...s].filter(e=>!c.has(e)),d=[...c].filter(e=>!s.has(e)),f=a===o,p=u.length===0&&d.length===0&&l.length===s.size&&f;return{cardId:e.id,expected:t,selected:i,expectedDisposition:o,disposition:a,hit:l,missed:u,falsePositive:d,dispositionOk:f,perfect:p}})}function fe(e){let t=e.headcountOk?ie:0,n=(e.sort.orderCorrect?ae:0)+(e.sort.orientationCorrect?oe:0),r=0;for(let t of e.inspection)t.perfect?r+=se:r+=t.hit.length*2-t.missed.length*2-t.falsePositive.length+(t.dispositionOk?2:-2);r=Math.max(0,r);let i=70+e.cardCount*se+10,a=e.timedOut?0:Math.max(0,Math.min(10,Math.round(10*(1-e.timeSeconds/ce))));return{headcountOk:e.headcountOk,headcountPoints:t,sortOrderOk:e.sort.orderCorrect,sortOrientationOk:e.sort.orientationCorrect,sortPoints:n,inspection:e.inspection,inspectionPoints:r,timeSeconds:e.timeSeconds,timeBonus:a,total:t+n+r+a,maxTotal:i,timedOut:e.timedOut}}function b(e,t,n=9){return`<div class="digit-col"><span class="digit-cap">${e}</span><div class="digit-bubs">${Array.from({length:n+1},(e,n)=>`<span class="bub ${t!==null&&t===n?`filled`:``}" data-d="${n}"><i>${n}</i></span>`).join(``)}</div></div>`}function x(e,t){let n=t===null?null:Math.floor(t/10),r=t===null?null:t%10;return`<div class="digit-group"><span class="group-label">${e}</span><div class="digit-cols">${b(`십`,n)}${b(`일`,r)}</div></div>`}function pe(e,t,n=9){return`<div class="digit-group"><span class="group-label">${e}</span><div class="digit-cols">${b(``,t,n)}</div></div>`}function me(e,t,n){let r=[];for(let i=t;i<n;i++){let t=e.answers[i];if(!t)continue;let n=i+1,a=[1,2,3,4,5].map(n=>{let r=t.choices.includes(n),i=r&&t.incomplete,a=r&&e.wrongPen;return`<span class="${[`bub`,`ans`,r?`filled`:``,i?`incomplete`:``,a?`wrong-pen`:``].filter(Boolean).join(` `)}"><i>${n}</i></span>`}).join(``);r.push(`<div class="ans-row" data-q="${n}"><span class="qno">${String(n).padStart(2,`0`)}</span>${a}</div>`)}return`<div class="ans-block">${r.join(``)}</div>`}function he(e,t={}){let{student:n,showRosterHint:r=!1,compact:i=!1,highlight:a=[]}=t,o=e=>a.includes(e)?`hl-err`:``,s=e.formType===`odd`,c=e.formType===`even`,l=e.damaged?`dmg-${e.damageKind??`fold`}`:``,u=e.hasCorrectionTape?`<div class="tape-trace ${e.correctionTapeBad?`tape-bad`:``} ${o(`correction_tape`)}" title="수정테이프"></div>`:``,d=`<div class="ans-legend"><span>문항</span><span>①</span><span>②</span><span>③</span><span>④</span><span>⑤</span></div>`,f=Math.ceil(e.answers.length/2),p=i?``:`<section class="omr-answers ${o(`duplicate_mark`)} ${o(`missing_mark`)} ${o(`incomplete_mark`)}">
        <div class="ans-two">
          <div class="ans-col">${d}${me(e,0,f)}</div>
          <div class="ans-col">${d}${me(e,f,e.answers.length)}</div>
        </div>
      </section>`;return`
<article class="omr-card front ${i?`is-compact`:``} ${l} ${e.wrongPen?`pen-wrong`:``}" data-card-id="${e.id}">
  <div class="timing-marks left" aria-hidden="true"></div>
  <div class="timing-marks right" aria-hidden="true"></div>
  ${u}
  <header class="omr-head">
    <div class="omr-brand">
      <strong>전국연합학력평가</strong>
      <span>답안지 (OMR) · 데모</span>
    </div>
    <div class="form-type ${o(`form_type`)}">
      <span class="ft-label">문형</span>
      <span class="bub form ${s?`filled`:``}"><i>홀</i></span>
      <span class="bub form ${c?`filled`:``}"><i>짝</i></span>
    </div>
  </header>
  <section class="omr-id">
    <div class="hand-block ${o(`name_mismatch`)}">
      <div class="hand-line"><span>학년</span><b class="handwrite">${e.handwrittenGrade}</b></div>
      <div class="hand-line"><span>반</span><b class="handwrite">${e.handwrittenClass}</b></div>
      <div class="hand-line"><span>번호</span><b class="handwrite">${String(e.handwrittenNumber).padStart(2,`0`)}</b></div>
      <div class="hand-line name"><span>성명</span><b class="handwrite">${e.handwrittenName}</b></div>
      ${r&&n?`<div class="roster-hint">명렬 대조: ${String(n.number).padStart(2,`0`)} ${n.name}${n.absent?` (결시)`:``}</div>`:``}
    </div>
    <div class="mark-block ${o(`id_mark`)} ${o(`missing_subject`)}">
      ${pe(`학년`,e.markedGrade,3)}
      ${x(`반`,e.markedClass)}
      ${x(`번호`,e.markedNumber)}
      ${x(`과목`,e.subjectCode)}
    </div>
  </section>
  ${p}
  <footer class="omr-foot">
    <div class="proctor ${e.proctorSigned?`signed`:`missing`} ${o(`missing_proctor`)}">
      <span>감독관 확인</span>
      ${e.proctorSigned?`<em class="stamp">確</em>`:`<em class="blank">미확인</em>`}
    </div>
    <span class="foot-note">※ 컴퓨터용 수성 사인펜 · 수정테이프는 우리 학교 규정 기준</span>
  </footer>
</article>`}function ge(e){let t=String(e.handwrittenNumber).padStart(2,`0`),n=e.formType===`odd`?`홀`:e.formType===`even`?`짝`:`문형?`,r=[e.faceDown?`is-back`:``,e.upsideDown?`is-upsidedown`:``].filter(Boolean).join(` `),i=`
<article class="desk-thumb-face front">
  <div class="thumb-stripe" aria-hidden="true"></div>
  <div class="thumb-no">${t}</div>
  <div class="thumb-name">${e.handwrittenName}</div>
  <div class="thumb-meta">
    <span>${e.handwrittenGrade}-${e.handwrittenClass}</span>
    <span class="thumb-form">${n}</span>
  </div>
  <div class="thumb-flags">
    ${e.upsideDown?`<i class="tf warn thumb-badge-orient">위아래!</i>`:``}
    ${e.proctorSigned?``:`<i class="tf">감독?</i>`}
    ${e.hasCorrectionTape?`<i class="tf">테이프</i>`:``}
    ${e.wrongPen?`<i class="tf">펜</i>`:``}
    ${e.damaged?`<i class="tf">손상</i>`:``}
  </div>
</article>`;return`
<div class="desk-thumb card-3d ${r}" data-card-id="${e.id}" tabindex="0"
  aria-label="OMR ${t}번 ${e.handwrittenName}">
  <div class="card-3d-inner desk-thumb-inner">
    <div class="card-face face-front">${i}</div>
    <div class="card-face face-back">
<article class="desk-thumb-face back">
  <div class="thumb-back-label">답안지 뒷면</div>
  <div class="thumb-badge-orient back-badge">뒤집힘</div>
</article></div>
  </div>
</div>`}function _e(e,t,n){return`
<div class="roster-sheet">
  <div class="roster-sheet-head">
    <strong>${t}학년 ${n}반 학생 명렬표</strong>
    <span>전국연합학력평가 · 응시 확인용</span>
  </div>
  <table>
    <thead><tr><th>번호</th><th>성명</th><th>수험번호</th><th>응시</th></tr></thead>
    <tbody>${e.map(e=>{let t=e.absent;return`<tr class="${t?`absent`:``}">
        <td>${String(e.number).padStart(2,`0`)}</td>
        <td>${e.name}</td>
        <td>${e.examId}</td>
        <td>${t?`<span class="abs-mark">결시</span> ${e.absentNote??``}`:`응시`}</td>
      </tr>`}).join(``)}</tbody>
  </table>
</div>`}var ve=`teacher-sim-omr-best-v1`;function S(){try{let e=localStorage.getItem(ve);return e?JSON.parse(e):{}}catch{return{}}}function ye(e,t){let n=S();return t>=(n[e]?.score??-1)&&(n[e]={score:t,at:new Date().toISOString()},localStorage.setItem(ve,JSON.stringify(n))),n}var C=document.querySelector(`#app`),w=`hub`,be=ne()??`easy`,T=null,E=new Map,D=[],O=[],k=null,A=new Map;function xe(){T?window.__TS_E2E__={stage:w,seed:T.config.seed,difficulty:T.config.difficulty,expectedOrder:g(T.roster,T.cards),cards:T.cards.map(e=>({id:e.id,injectedErrors:[...e.injectedErrors],disposition:v(e)})),headcount:re(T.roster),finalScore:F}:window.__TS_E2E__=void 0}var j=0,M=0,N=!1,P=null,F=null,I=!1,L=1,R=0,z=0,B=null;function V(){B!=null&&(clearInterval(B),B=null)}function H(){return M?Math.floor((Date.now()-M)/1e3):0}function U(e){return`${Math.floor(e/60)}:${String(e%60).padStart(2,`0`)}`}function W(){V(),B=window.setInterval(()=>{let e=C.querySelector(`#timer`);e&&(e.textContent=U(H()));let t=T?.config.timeLimitSec;t!=null&&H()>=t&&w!==`results`&&(I=!0,Ae())},500)}function G(){V(),w=`hub`,T=null,J()}function K(e,t){be=e,T=h(e,t??y()),E=new Map(T.cards.map(e=>[e.id,e])),D=T.cards.map(e=>e.id),O=[],k=null,A=new Map,j=0,M=0,N=!1,P=null,F=null,I=!1,L=1,R=0,z=0,history.replaceState(null,``,`?diff=${be}&seed=${T.config.seed}`),w=`howto`,J()}function q(e){w=e,e!==`headcount`&&e!==`sorting`||M||(M=Date.now(),W()),J()}function J(){switch(w){case`hub`:Se();break;case`difficulty`:Ce();break;case`howto`:we();break;case`headcount`:Te();break;case`sorting`:Z();break;case`inspection`:$();break;case`results`:je()}xe()}function Y(e,t){C.innerHTML=`
<div class="app-root ${t?.desk?`has-desk`:``} ${t?.stageClass??``}">
  ${t?.desk?`<div class="desk-bg" aria-hidden="true"></div>`:`<div class="hub-bg" aria-hidden="true"></div>`}
  <header class="topbar">
    <button type="button" class="brand-btn" id="btn-hub" title="허브로">
      <span class="logo">✎</span>
      <div><strong>교사 시뮬레이터</strong><small>잡무 연습 모음</small></div>
    </button>
    ${t?.top??``}
  </header>
  <main class="stage">${e}</main>
</div>`,C.querySelector(`#btn-hub`)?.addEventListener(`click`,()=>{(w===`hub`||confirm(`허브로 돌아갈까요? 진행 중이면 저장되지 않습니다.`))&&G()})}function Se(){let e=S(),t=[e.easy,e.normal,e.hard].filter(Boolean).length;Y(`
<section class="panel hub-panel" data-stage="hub">
  <div class="hub-banner" aria-hidden="true">
    <svg viewBox="0 0 960 280" class="hub-scene" role="img">
      <defs>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fdba74"/>
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f8efe3"/><stop offset="100%" stop-color="#e7d5c0"/>
        </linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#5a3424"/><stop offset="50%" stop-color="#7a4a32"/><stop offset="100%" stop-color="#4a2a1c"/>
        </linearGradient>
      </defs>
      <rect width="960" height="280" fill="url(#wall)"/>
      <rect x="0" y="200" width="960" height="80" fill="#d6c0a8"/>
      <rect x="36" y="22" width="170" height="100" rx="4" fill="url(#win)" stroke="#b45309" stroke-width="4"/>
      <line x1="121" y1="22" x2="121" y2="122" stroke="#b45309" stroke-width="3"/>
      <line x1="36" y1="72" x2="206" y2="72" stroke="#b45309" stroke-width="3"/>
      <rect x="230" y="40" width="110" height="100" fill="#0f766e"/>
      <ellipse cx="300" cy="230" rx="18" ry="10" fill="#166534"/>
      <rect x="294" y="200" width="12" height="30" fill="#365314"/>
      <circle cx="300" cy="192" r="22" fill="#22c55e"/>
      <circle cx="285" cy="200" r="14" fill="#4ade80"/>
      <circle cx="316" cy="198" r="12" fill="#86efac"/>
      <rect x="245" y="52" width="80" height="10" fill="#99f6e4"/>
      <rect x="245" y="70" width="62" height="8" fill="#ccfbf1"/>
      <rect x="245" y="88" width="50" height="8" fill="#99f6e4"/>
      <rect x="320" y="150" width="600" height="90" fill="url(#desk)"/>
      <rect x="360" y="118" width="86" height="54" fill="#fffef8" stroke="#c23b55" stroke-width="2" transform="rotate(-8 403 145)"/>
      <rect x="460" y="128" width="86" height="54" fill="#fffef8" stroke="#c23b55" stroke-width="2" transform="rotate(5 503 155)"/>
      <rect x="560" y="124" width="86" height="54" fill="#be123c" transform="rotate(-3 603 151)"/>
      <text x="578" y="158" font-size="14" fill="#fff" font-weight="700">답안</text>
      <rect x="680" y="136" width="56" height="38" fill="#faf6ef" stroke="#78716c" stroke-width="1.5"/>
      <circle cx="840" cy="90" r="30" fill="#fef3c7" stroke="#ca8a04" stroke-width="3"/>
      <text x="826" y="100" font-size="26">☕</text>
      <text x="40" y="250" font-size="16" fill="#44403c">교무실 책상 · 창가 햇살 · 잡무는 여기서 연습</text>
    </svg>
  </div>
  <div class="hub-hero">
    <p class="eyebrow">Teacher Simulator</p>
    <h1>교사의 잡무,<br/>미니게임으로 손에 익히기</h1>
    <p class="lead">예비교사·실습생·학생을 위한 현장 잡무 연습. 서류는 진짜처럼, 실수는 여기서.</p>
    <div class="hub-summary">
      <span>클리어한 난이도 <b>${t}/3</b></span>
      <span>OMR 최고 <b>${Math.max(e.easy?.score??0,e.normal?.score??0,e.hard?.score??0)||`—`}</b></span>
    </div>
    <div class="hub-progress" aria-label="난이도별 진행">
      <span class="hp-chip ${e.easy?`done`:``}">쉬움 ${e.easy?e.easy.score+`점`:`미클리어`}</span>
      <span class="hp-chip ${e.normal?`done`:``}">보통 ${e.normal?e.normal.score+`점`:`미클리어`}</span>
      <span class="hp-chip ${e.hard?`done`:``}">어려움 ${e.hard?e.hard.score+`점`:`미클리어`}</span>
    </div>
  </div>
  <div class="game-grid">
    <button type="button" class="game-tile open" id="tile-omr">
      <span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="3" width="24" height="26" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="10" r="2" fill="currentColor"/><circle cx="22" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><rect x="8" y="22" width="16" height="2" fill="currentColor"/></svg></span>
      <span class="tile-badge">플레이 가능</span>
      <h2>OMR 카드 검사</h2>
      <p>인원 확인 → 정렬·뒤집기 → 이상 발견 → 교과 확인</p>
      <ul class="best-line">
        <li>쉬움 ${e.easy?.score??`—`}점</li>
        <li>보통 ${e.normal?.score??`—`}점</li>
        <li>어려움 ${e.hard?.score??`—`}점</li>
      </ul>
    </button>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M10 12h12M10 17h12M10 22h8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>출결 정리</h2><p>전자·종이 출석부 대조</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><path d="M8 26V8l8-3 8 3v18l-8-3-8 3z" stroke="currentColor" stroke-width="2"/><path d="M12 14h8M12 18h6" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>생기부 검토</h2><p>금지 표현·맞춤법</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 10l12 8 12-8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>가정통신문 교정</h2><p>날짜·금액·오탈자</p></div>
  </div>
  <footer class="hub-foot">
    <p>데모 미니게임 1종 · 나머지 타일은 로드맵 · 시드 고정 연습 가능 (?diff=&amp;seed=)</p>
  </footer>
</section>`,{stageClass:`stage-hub`}),C.querySelector(`#tile-omr`).addEventListener(`click`,()=>{w=`difficulty`,J()})}function Ce(){let e=S();Y(`
<section class="panel" data-stage="difficulty">
  <h1>OMR 카드 검사 · 난이도</h1>
  <p class="lead">재적 인원에 따라 책상 위 카드 더미가 달라집니다.</p>
  <div class="diff-grid">${Object.keys(f).map(t=>{let n=f[t],r=n.timeLimitSec?`${Math.floor(n.timeLimitSec/60)}분 제한`:`시간 제한 없음`,i=t===`easy`?`🌱`:t===`normal`?`📘`:`🔥`,a=e[t]?.score;return`
<button type="button" class="diff-card" data-diff="${t}">
  <span class="diff-ico" aria-hidden="true">${i}</span>
  <h2>${n.label}</h2>
  <ul class="diff-meta">
    <li><b>${n.studentCount}</b>명</li>
    <li>문항 ${n.questionCount}</li>
    <li>결시 ${n.absentCount}</li>
  </ul>
  <p class="diff-lim">${r}</p>
  <p class="diff-best ${a==null?``:`has`}">최고 ${a??`—`}점</p>
</button>`}).join(``)}</div>
  <div class="actions"><button class="btn ghost" id="btn-back" type="button">허브</button></div>
</section>`),C.querySelector(`#btn-back`).addEventListener(`click`,G),C.querySelectorAll(`[data-diff]`).forEach(e=>{e.addEventListener(`click`,()=>K(e.dataset.diff))})}function we(){let e=T;Y(`
<section class="panel howto-panel" data-stage="howto">
  <h1>하는 방법 · ${f[e.config.difficulty].label}</h1>
  <ol class="howto-steps">
    <li><span class="howto-ico" aria-hidden="true">①</span><div><b>응시 인원 확인</b><p>응시자 + 결시자 = 재적. 결시는 빈칸이 아니라 명렬에 «결시»와 사유를 남깁니다.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">②</span><div><b>정렬·방향</b><p>책상 위 흐트러진 OMR을 번호순 트레이에 올립니다. 뒷면·위아래(180°) 뒤집힌 장을 바로잡습니다. 단축키 F/R/Enter.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">③</span><div><b>이상 발견</b><p>마킹을 대신 고치지 마세요. 시험 중이면 학생에게 수정을 요청하고, 종료 후면 교과 확인으로 넘깁니다. 돋보기로 마킹을 확대하세요.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">④</span><div><b>우리 학교 규정</b><p>수정테이프 허용 여부는 학교·시험마다 다릅니다. 이 데모는 <em>우리 학교 규정 기준</em>으로 «들뜸·덧칠»을 이상으로 봅니다.</p></div></li>
  </ol>
  <aside class="field-rules" aria-label="현장 규칙">
    <b>현장 규칙 요약</b>
    <ul>
      <li><strong>인원</strong> 응시 + 결시 = 재적</li>
      <li><strong>조치</strong> 정상 · 학생 수정 요청 · 교과 확인</li>
      <li><strong>마킹</strong> 교사가 대신 고치지 않음</li>
    </ul>
  </aside>
  <p class="howto-seed">시드 <b>${e.config.seed}</b> · 재적 <b>${e.config.studentCount}</b> · 응시 <b>${e.cards.length}</b></p>
  <div class="actions">
    <button class="btn primary" id="btn-go" type="button">인원 확인 시작</button>
    <button class="btn ghost" id="btn-back" type="button">난이도</button>
  </div>
</section>`),C.querySelector(`#btn-go`).addEventListener(`click`,()=>q(`headcount`)),C.querySelector(`#btn-back`).addEventListener(`click`,()=>{w=`difficulty`,J()})}function Te(){let e=T,t=re(e.roster),n=`<div class="progress"><span class="pill">인원 확인</span><span class="timer" id="timer">${U(H())}</span></div>`;Y(`
<section class="panel headcount-panel" data-stage="headcount">
  <h1>응시 인원 확인</h1>
  <p class="lead">명렬표를 보고 <b>응시자 + 결시자 = 재적</b>인지 확인하세요. 결시생 카드는 더미에 없습니다.</p>
  <div class="hc-layout">
    ${_e(e.roster,e.config.grade,e.config.classNo)}
    <form id="hc-form" class="hc-form">
      <label>재적 <input name="enrolled" type="number" min="0" required /></label>
      <label>응시자 <input name="present" type="number" min="0" required /></label>
      <label>결시자 <input name="absent" type="number" min="0" required /></label>
      <p class="hc-formula" aria-hidden="true">응시 + 결시 = 재적</p>
      <p class="side-note hc-hint">힌트: 명렬 «결시» 행을 세요. (정답은 제출 후)</p>
      <button class="btn primary" type="submit">확인 · 정렬로</button>
    </form>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,{top:n,desk:!0,stageClass:`stage-headcount`}),W(),C.querySelector(`#hc-form`).addEventListener(`submit`,e=>{e.preventDefault();let n=new FormData(e.target),r=Number(n.get(`enrolled`)),i=Number(n.get(`present`)),a=Number(n.get(`absent`)),o=i+a===r,s=r===t.enrolled&&i===t.present&&a===t.absent&&o;N=s,s?q(`sorting`):X(o?`숫자가 명렬과 다릅니다. (정답 재적 ${t.enrolled} · 응시 ${t.present} · 결시 ${t.absent})`:`응시자 + 결시자 = 재적이 되지 않습니다.`)})}function X(e){let t=C.querySelector(`#toast`);t&&(t.hidden=!1,t.textContent=e,window.setTimeout(()=>{t.hidden=!0},3200))}function Z(){let e=T,t=e.roster.filter(e=>!e.absent),n=g(e.roster,e.cards),r=[...D,...O].filter(e=>{let t=E.get(e);return t.faceDown||t.upsideDown}).length,i=`<div class="progress"><span class="pill">정렬</span><span class="timer" id="timer">${U(H())}</span><span class="hint-pill">방향 이상 ${r}장 · 트레이 ${O.length}/${e.cards.length}</span></div>`,a=D.map((e,t)=>{let n=E.get(e),r=Math.max(1,D.length),i=-4+(r===1?0:t/(r-1))*8+(t%3-1)*1.2,a=t%5*4+(n.upsideDown||n.faceDown?8:0),o=(n.upsideDown||n.faceDown?40:0)+t+1,s=[n.faceDown?`<span class="pile-chip back">뒷면</span>`:``,n.upsideDown?`<span class="pile-chip warn">위아래</span>`:``].join(``);return`
<div class="desk-card pile-card ${k===e?`selected`:``} ${n.upsideDown?`has-orient`:``} ${n.faceDown?`has-back`:``}" data-id="${e}" draggable="true"
  style="--r:${i}deg; --lift:${a}px; --tilt:${1+t%2}deg; z-index:${o}">
  ${s}
  ${ge(n)}
</div>`}).join(``),o=t.map((e,t)=>{let r=O[t],i=n[t];if(!r)return`
<div class="tray-slot empty-slot" data-slot="${t}">
  <span class="slot-label">슬롯 ${t+1} · 예상 ${String(e.number).padStart(2,`0`)}</span>
  <div class="slot-ghost">${String(e.number).padStart(2,`0`)} ${e.name}</div>
</div>`;let a=E.get(r),o=r===i&&!a.faceDown&&!a.upsideDown,s=r===i;return`
<div class="tray-slot ${s&&!a.faceDown&&!a.upsideDown?`slot-ok`:s?`slot-warn`:`slot-bad`}" data-slot="${t}" data-id="${r}">
  <span class="slot-label">슬롯 ${t+1} · 예상 ${String(e.number).padStart(2,`0`)}
    <em>${o?`✓`:s?`방향!`:`순서✗`}</em>
  </span>
  <div class="desk-card tray-card tray-fan" data-id="${r}" data-tray-index="${t}" draggable="true"
    style="--fan:${(t%5-2)*1.6}deg">
    ${ge(a)}
  </div>
  <div class="tray-tools">
    <button type="button" class="btn tiny" data-act="left" data-i="${t}" ${t===0?`disabled`:``}>←</button>
    <button type="button" class="btn tiny" data-act="right" data-i="${t}" ${t>=O.length-1?`disabled`:``}>→</button>
    <button type="button" class="btn tiny accent" data-act="flip" data-i="${t}">뒷면</button>
    <button type="button" class="btn tiny accent" data-act="spin" data-i="${t}">위아래</button>
    <button type="button" class="btn tiny" data-act="to-pile" data-i="${t}">더미로</button>
  </div>
</div>`}).join(``);Y(`
<section class="sorting-desk" data-stage="sorting">
  <div class="desk-table">
    <div class="desk-window" aria-hidden="true"></div>
    <div class="desk-props" aria-hidden="true">
      <svg class="prop-pen" viewBox="0 0 120 24" width="110" height="22">
        <rect x="4" y="8" width="88" height="8" rx="2" fill="#1e293b"/>
        <polygon points="92,8 112,12 92,16" fill="#fbbf24"/>
        <rect x="0" y="7" width="10" height="10" rx="2" fill="#0f766e"/>
      </svg>
      <svg class="prop-mug" viewBox="0 0 48 48" width="44" height="44">
        <ellipse cx="20" cy="40" rx="14" ry="4" fill="rgba(0,0,0,0.25)"/>
        <rect x="8" y="12" width="24" height="26" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
        <path d="M32 18h6a6 6 0 010 12h-6" fill="none" stroke="#b45309" stroke-width="2"/>
        <path d="M14 8c2-4 6-4 8 0M22 8c2-4 6-4 8 0" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
      </svg>
      <svg class="prop-clip" viewBox="0 0 40 50" width="36" height="44">
        <rect x="6" y="10" width="28" height="36" rx="2" fill="#fffef8" stroke="#78716c"/>
        <rect x="10" y="4" width="20" height="12" rx="2" fill="#a8a29e"/>
        <line x1="12" y1="22" x2="28" y2="22" stroke="#d6d3d1"/>
        <line x1="12" y1="28" x2="28" y2="28" stroke="#d6d3d1"/>
        <line x1="12" y1="34" x2="24" y2="34" stroke="#d6d3d1"/>
      </svg>
    </div>
    <aside class="desk-roster paper-object">
      ${_e(e.roster,e.config.grade,e.config.classNo)}
      <p class="side-note">결시 행은 카드가 없습니다. 응시 카드만 번호순으로.</p>
      <aside class="desk-sticky" aria-hidden="true">
        <b>메모</b>
        <p>뒷면·위아래 먼저 바로잡고 트레이로.</p>
        <p class="kbd-row"><kbd>F</kbd> 뒤집기 <kbd>R</kbd> 위아래 <kbd>Enter</kbd> 트레이</p>
      </aside>
    </aside>
    <div class="desk-work ${D.length?`has-pile`:`no-pile`}">
      <div class="pile-zone ${D.length?``:`is-empty`}" id="pile-zone">
        <header class="zone-head">
          <h2>흐트러진 더미 <small class="pile-count">${D.length}장</small></h2>
          <div class="pile-actions toolbar">
            <button type="button" class="btn tiny" id="btn-flip-sel" ${k?``:`disabled`} title="F">선택 뒤집기 <kbd>F</kbd></button>
            <button type="button" class="btn tiny" id="btn-spin-sel" ${k?``:`disabled`} title="R">위아래 <kbd>R</kbd></button>
            <button type="button" class="btn tiny primary" id="btn-to-tray" ${k?``:`disabled`} title="Enter">트레이 <kbd>⏎</kbd></button>
          </div>
        </header>
        <div class="pile-area" id="pile-area">${a||`<p class="empty">더미가 비었습니다 — 아래 트레이를 확인하세요</p>`}</div>
      </div>
      <div class="tray-zone ${D.length?``:`is-expanded`}" id="tray-zone">
        <header class="zone-head">
          <h2>정렬 트레이 <small>번호 오름차순 · 초록=맞음 · F/R/Enter</small></h2>
          <div class="pile-actions toolbar">
            <button class="btn tiny" id="btn-autosort" type="button">수기번호순</button>
            <button class="btn tiny primary" id="btn-done-sort" type="button">정렬 완료 · 검사</button>
          </div>
        </header>
        <div class="tray-rail" id="tray-rail">${o}</div>
      </div>
    </div>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,{top:i,desk:!0,stageClass:`stage-sorting`}),W(),Ee()}function Ee(){C.querySelector(`#btn-autosort`)?.addEventListener(`click`,()=>{let e=[...D,...O];for(let t of e){let e=E.get(t);e.faceDown=!1,e.upsideDown=!1}O=e.sort((e,t)=>E.get(e).handwrittenNumber-E.get(t).handwrittenNumber),D=[],k=null,Z()}),C.querySelector(`#btn-done-sort`)?.addEventListener(`click`,()=>{if(D.length){X(`더미에 카드가 남아 있습니다.`);return}let e=O.filter(e=>{let t=E.get(e);return t.faceDown||t.upsideDown});if(e.length){X(`방향이 잘못된 카드가 ${e.length}장 있습니다.`);return}let t=g(T.roster,[...E.values()]);P=ue(O,t,E),(P.orderCorrect||confirm(`번호 순서가 명렬과 다릅니다. 그래도 검사로 갈까요?`))&&(j=0,q(`inspection`))});let e=e=>{k=e,Z()};C.querySelectorAll(`.pile-card`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),e(t.dataset.id)}),t.addEventListener(`dblclick`,()=>Q(t.dataset.id)),t.addEventListener(`dragstart`,e=>{e.dataTransfer?.setData(`text/plain`,t.dataset.id),k=t.dataset.id,t.classList.add(`dragging`)}),t.addEventListener(`dragend`,()=>t.classList.remove(`dragging`))});let t=C.querySelector(`#tray-zone`),n=C.querySelector(`#tray-rail`);t?.addEventListener(`dragover`,e=>{e.preventDefault(),n?.classList.add(`drag-over`)}),t?.addEventListener(`dragleave`,()=>n?.classList.remove(`drag-over`)),t?.addEventListener(`drop`,e=>{e.preventDefault(),n?.classList.remove(`drag-over`);let t=e.dataTransfer?.getData(`text/plain`);t&&Q(t)}),C.querySelector(`#btn-to-tray`)?.addEventListener(`click`,()=>{k&&Q(k)}),C.querySelector(`#btn-flip-sel`)?.addEventListener(`click`,()=>{if(!k)return;let e=E.get(k);e.faceDown=!e.faceDown,Z()}),C.querySelector(`#btn-spin-sel`)?.addEventListener(`click`,()=>{if(!k)return;let e=E.get(k);e.upsideDown=!e.upsideDown,Z()}),C.querySelectorAll(`.tray-tools [data-act]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.i),n=e.dataset.act,r=O[t];if(!r)return;let i=E.get(r);n===`flip`&&(i.faceDown=!i.faceDown),n===`spin`&&(i.upsideDown=!i.upsideDown),n===`to-pile`&&(O=O.filter(e=>e!==r),D.push(r)),n===`left`&&t>0&&([O[t-1],O[t]]=[O[t],O[t-1]]),n===`right`&&t<O.length-1&&([O[t+1],O[t]]=[O[t],O[t+1]]),Z()})}),C.querySelectorAll(`.tray-card .desk-thumb, .tray-card .card-3d`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.cardId,n=E.get(t);n.faceDown?n.faceDown=!1:n.upsideDown?n.upsideDown=!1:n.faceDown=!0,Z()})})}function De(e){if(w!==`sorting`)return;let t=e.target?.tagName;if(t!==`INPUT`&&t!==`TEXTAREA`){if(e.key===`f`||e.key===`F`){if(!k)return;e.preventDefault();let t=E.get(k);t.faceDown=!t.faceDown,Z()}else if(e.key===`r`||e.key===`R`){if(!k)return;e.preventDefault();let t=E.get(k);t.upsideDown=!t.upsideDown,Z()}else e.key===`Enter`&&k&&(e.preventDefault(),Q(k))}}window.addEventListener(`keydown`,De);function Q(e){D.includes(e)&&(D=D.filter(t=>t!==e),O.push(e),k=null,Z())}function $(){let e=T,t=O.length?O:g(e.roster,e.cards),n=E.get(t[j]),r=_(e.roster,n),i=A.get(n.id)??{selected:[],disposition:`ok`},a=new Set(i.selected),o=`<div class="progress"><span class="pill">검사</span><span class="timer" id="timer">${U(H())}</span><span class="hint-pill">${j+1}/${t.length}</span></div>`,f=l.map(e=>{let t=a.has(e);return`<label class="check check-${e} ${t?`on`:``} ${e===`ok`?`ok`:``}" data-err="${e}">
      <input type="checkbox" value="${e}" ${t?`checked`:``}/>
      <span class="check-body"><strong>${s[e]}</strong><small>${c[e]}</small></span>
    </label>`}).join(``),p=[`ok`,`ask_student`,`to_subject`].map(e=>`
<label class="disp disp-${e} ${i.disposition===e?`on`:``}" data-disp="${e}">
  <input type="radio" name="disp" value="${e}" ${i.disposition===e?`checked`:``}/>
  <span><strong>${u[e]}</strong><small>${d[e]}</small></span>
</label>`).join(``);Y(`
<section class="panel inspection-panel" data-stage="inspection">
  <div class="inspect-layout">
    <aside class="inspect-roster">
      <h2>명렬 한 줄</h2>
      <dl class="student-card">
        <div><dt>번호</dt><dd>${String(r.number).padStart(2,`0`)}</dd></div>
        <div><dt>성명</dt><dd>${r.name}</dd></div>
        <div><dt>학년·반·번호</dt><dd>${r.grade}-${r.classNo}-${String(r.number).padStart(2,`0`)}</dd></div>
        <div><dt>수험번호</dt><dd>${r.examId}</dd></div>
      </dl>
      <p class="warn-note">⚠ 교사가 마킹을 대신 고치지 않습니다.</p>
      <div class="dot-nav" id="dot-nav">
        ${t.map((e,t)=>{let n=A.has(e);return`<button type="button" class="dot ${t===j?`current`:``} ${n?`done`:``}" data-i="${t}" aria-label="${t+1}번">${t+1}</button>`}).join(``)}
      </div>
    </aside>
    <div class="inspect-card-pane">
      <div class="zoom-toolbar">
        <button type="button" class="btn tiny" id="z-out">−</button>
        <button type="button" class="btn tiny" id="z-reset">돋보기 리셋</button>
        <button type="button" class="btn tiny" id="z-in">+</button>
      </div>
      <div class="zoom-viewport" id="zoom-viewport">
        <div class="zoom-canvas" id="zoom-canvas" style="transform:translate(${R}px,${z}px) scale(${L})">
          ${he(n,{student:r,showRosterHint:!0})}
        </div>
        <div class="magnifier" id="magnifier" hidden></div>
      </div>
      <p class="side-note mag-hint">마우스 위에 돋보기 렌즈 · 드래그로 이동 · +/− 로 확대</p>
    </div>
    <aside class="inspect-judge inspect-actions">
      <h2>발견한 이상</h2>
      <form id="judge-form" class="judge-form">${f}</form>
      <h2>조치</h2>
      <form id="disp-form" class="disp-form">${p}</form>
      <div class="actions inspect-actions">
        <button class="btn ghost" id="btn-prev" type="button" ${j===0?`disabled`:``}>←</button>
        <button class="btn primary" id="btn-submit" type="button">${j<t.length-1?`저장 후 다음`:`제출 · 결과`}</button>
      </div>
    </aside>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,{top:o,desk:!0,stageClass:`stage-inspection`}),W(),ke(n,t),requestAnimationFrame(Oe)}function Oe(){let e=C.querySelector(`#zoom-viewport`),t=C.querySelector(`#zoom-canvas`),n=t?.querySelector(`.omr-card`);if(!e||!t||!n||L!==1)return;let r=e.clientWidth-24,i=n.scrollWidth||n.offsetWidth;if(i>0&&r>0){let e=Math.min(1.35,Math.max(.9,r/i));Math.abs(e-1)>.02&&R===0&&z===0&&(L=e,t.style.transform=`translate(0px,0px) scale(${L})`)}}function ke(e,t){let n=(t,n)=>{A.set(e.id,{selected:t,disposition:n})};C.querySelectorAll(`#judge-form input`).forEach(t=>{t.addEventListener(`change`,()=>{let r=A.get(e.id)??{selected:[],disposition:`ok`},i=new Set(r.selected),a=t.value;t.checked?a===`ok`?i=new Set([`ok`]):(i.delete(`ok`),i.add(a)):i.delete(a),n([...i],r.disposition),$()})}),C.querySelectorAll(`#disp-form input`).forEach(t=>{t.addEventListener(`change`,()=>{let r=A.get(e.id)??{selected:[],disposition:`ok`};n(r.selected,t.value),$()})}),C.querySelector(`#btn-prev`)?.addEventListener(`click`,()=>{j=Math.max(0,j-1),L=1,R=0,z=0,$()}),C.querySelector(`#btn-submit`)?.addEventListener(`click`,()=>{let n=A.get(e.id);if(!n||n.selected.length===0)X(`발견한 이상을 고르세요. 없으면 «이상 없음».`);else if(n.selected.includes(`ok`)&&n.selected.length,j<t.length-1)j++,L=1,R=0,z=0,$();else{for(let e=0;e<t.length;e++)if(!A.has(t[e])){j=e,$(),X(`${e+1}번 카드 판정이 비어 있습니다.`);return}Ae()}}),C.querySelectorAll(`#dot-nav .dot`).forEach(e=>{e.addEventListener(`click`,()=>{j=Number(e.dataset.i),L=1,R=0,z=0,$()})}),C.querySelector(`#z-in`)?.addEventListener(`click`,()=>{L=Math.min(2.5,L+.25),$()}),C.querySelector(`#z-out`)?.addEventListener(`click`,()=>{L=Math.max(.75,L-.25),$()}),C.querySelector(`#z-reset`)?.addEventListener(`click`,()=>{L=1,R=0,z=0,$()});let r=C.querySelector(`#zoom-viewport`),i=!1,a=0,o=0;r?.addEventListener(`pointerdown`,e=>{i=!0,a=e.clientX,o=e.clientY,r.setPointerCapture(e.pointerId)}),r?.addEventListener(`pointermove`,e=>{if(!i)return;R+=e.clientX-a,z+=e.clientY-o,a=e.clientX,o=e.clientY;let t=C.querySelector(`#zoom-canvas`);t&&(t.style.transform=`translate(${R}px,${z}px) scale(${L})`)}),r?.addEventListener(`pointerup`,()=>{i=!1});let s=C.querySelector(`#magnifier`),c=C.querySelector(`#zoom-canvas`);if(r&&s&&c){let e=e=>{if(i){s.hidden=!0;return}let t=r.getBoundingClientRect(),n=e.clientX-t.left,a=e.clientY-t.top;s.hidden=!1,s.style.width=`180px`,s.style.height=`180px`,s.style.left=`${Math.max(4,Math.min(t.width-180-4,n-90))}px`,s.style.top=`${Math.max(4,Math.min(t.height-180-4,a-90))}px`;let o=(n-R)/Math.max(.01,L),l=(a-z)/Math.max(.01,L),u=2.6,d=90-o*u,f=90-l*u;s.innerHTML=`<div class="mag-inner" style="transform:translate(${d}px,${f}px) scale(${u}); transform-origin:0 0">${c.innerHTML}</div>`};r.addEventListener(`pointermove`,t=>{i||e(t)}),r.addEventListener(`pointerleave`,()=>{s.hidden=!0})}}function Ae(){V();let e=T,t=O.length?O:g(e.roster,e.cards),n=g(e.roster,[...E.values()]);P||=ue(t,n,E);let r=de(t.map(e=>E.get(e)),t.map(e=>{let t=A.get(e)??{selected:[`ok`],disposition:`ok`};return{cardId:e,selected:t.selected,disposition:t.disposition}}));F=fe({headcountOk:N,sort:P,inspection:r,timeSeconds:H(),cardCount:t.length,timedOut:I}),ye(e.config.difficulty,F.total),q(`results`)}function je(){let e=F,t=T,n=e.maxTotal?e.total/e.maxTotal:0,r=n>=.95?`A+`:n>=.85?`A`:n>=.7?`B`:n>=.55?`C`:`D`,i=e.inspection.map(e=>{let n=E.get(e.cardId),r=_(t.roster,n),i=[...e.missed,...e.hit.filter(e=>e!==`ok`)];return`
<article class="result-card ${e.perfect?`ok`:`ng`}">
  <header><b>${String(r.number).padStart(2,`0`)} ${r.name}</b>
    <span class="tag ${e.perfect?`good`:`bad`}">${e.perfect?`정확`:`미흡`}</span>
  </header>
  <div class="result-mini">${he(n,{student:r,highlight:i,compact:!0})}</div>
  <div class="explain hit">맞춤: ${e.hit.map(e=>s[e]).join(`, `)||`—`}</div>
  ${e.missed.length?`<div class="explain miss">놓침: ${e.missed.map(e=>`${s[e]} — ${c[e]}`).join(` / `)}</div>`:``}
  ${e.falsePositive.length?`<div class="explain fp">잘못 선택: ${e.falsePositive.map(e=>s[e]).join(`, `)}</div>`:``}
  <div class="explain ${e.dispositionOk?`hit`:`miss`}">조치: ${u[e.disposition]}
    ${e.dispositionOk?``:`(정답: ${u[e.expectedDisposition]})`}</div>
</article>`}).join(``);Y(`
<section class="panel results-panel" data-stage="results">
  <div class="score-hero">
    <p class="eyebrow">결과 · ${f[t.config.difficulty].label}${e.timedOut?` · 시간초과`:``}</p>
    <div class="grade-badge" data-grade="${r}">${r}</div>
    <h1><span class="score-num">${e.total}</span> <small>/ ${e.maxTotal}</small></h1>
    <div class="score-bar" aria-hidden="true"><i style="width:${Math.round(n*100)}%"></i></div>
    <p class="lead">소요 ${U(e.timeSeconds)} · 보너스 +${e.timeBonus} · 시드 ${t.config.seed}</p>
  </div>
  <div class="result-grid">
    <div class="result-box">
      <h2>인원</h2>
      <p>${e.headcountOk?`✅`:`❌`} +${e.headcountPoints}/20</p>
      <div class="meter" aria-hidden="true"><i style="width:${e.headcountPoints/20*100}%"></i></div>
    </div>
    <div class="result-box">
      <h2>정렬</h2>
      <p>${e.sortOrderOk?`✅`:`❌`} 순서 · ${e.sortOrientationOk?`✅`:`❌`} 방향 · +${e.sortPoints}/50</p>
      <div class="meter" aria-hidden="true"><i style="width:${e.sortPoints/50*100}%"></i></div>
    </div>
    <div class="result-box">
      <h2>검사</h2>
      <p>+${e.inspectionPoints} · 완벽 ${e.inspection.filter(e=>e.perfect).length}/${e.inspection.length}</p>
      <div class="meter" aria-hidden="true"><i style="width:${e.inspection.length?e.inspection.filter(e=>e.perfect).length/e.inspection.length*100:0}%"></i></div>
    </div>
  </div>
  <div class="result-list"><h2>카드별 해설</h2>${i}</div>
  <div class="actions">
    <button class="btn primary" id="btn-retry" type="button">같은 시드</button>
    <button class="btn ghost" id="btn-new" type="button">새 시드</button>
    <button class="btn ghost" id="btn-hub2" type="button">허브</button>
  </div>
</section>`),C.querySelector(`#btn-retry`).addEventListener(`click`,()=>K(t.config.difficulty,t.config.seed)),C.querySelector(`#btn-new`).addEventListener(`click`,()=>K(t.config.difficulty)),C.querySelector(`#btn-hub2`).addEventListener(`click`,G)}G();