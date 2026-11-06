(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=e>>>0;return()=>{t+=1831565813;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}function t(e,t){let n=[...t];for(let t=n.length-1;t>0;t--){let r=Math.floor(e()*(t+1));[n[t],n[r]]=[n[r],n[t]]}return n}function n(e,n,r){return t(e,Array.from({length:n},(e,t)=>t)).slice(0,r)}var r=[`김`,`이`,`박`,`최`,`정`,`강`,`조`,`윤`,`장`,`임`,`한`,`오`,`서`,`신`,`권`,`황`,`안`,`송`,`류`,`홍`],i=`민준.서준.도윤.예준.시우.하준.주원.지호.준서.건우.서연.서윤.지우.서현.민서.하은.하윤.윤서.채원.지유.수아.지민.현우.지안.유준.은우.시현.예은.다은.수빈.연우.태양.가은.예린.소율.도현.준혁.시온.나윤.재원`.split(`.`);function a(e){return r[Math.floor(e()*r.length)]+i[Math.floor(e()*i.length)]}function o(e,t){for(let n=0;n<20;n++){let n=a(e);if(n!==t)return n}return`홍길동`}function s(e,t){let n=new Set,r=0;for(;n.size<t&&r<t*40;)n.add(a(e)),r++;for(;n.size<t;)n.add(`가상${String(n.size+1).padStart(2,`0`)}`);return[...n].sort((e,t)=>e.localeCompare(t,`ko`))}var c={id_mark:`학년·반·번호 마킹 오류`,name_mismatch:`성명 불일치`,duplicate_mark:`중복 표기`,missing_mark:`답안 미표기`,incomplete_mark:`불완전 표기`,missing_subject:`과목코드 누락`,missing_proctor:`감독관 확인란 누락`,correction_tape:`수정테이프 이상 (우리 학교 규정)`,form_type:`문형(홀·짝) 미표기`,wrong_pen:`컴퓨터용 사인펜 아님`,damaged:`접힘·얼룩·찢김`,absent_mismatch:`결시 표기·사유 불일치`,ok:`이상 없음`},l={id_mark:`수기·명렬의 학년·반·번호와 자릿수 마킹이 다릅니다.`,name_mismatch:`OMR 수기 성명이 명렬표와 다릅니다.`,duplicate_mark:`같은 문항에 두 개 이상 칠해져 있습니다.`,missing_mark:`답해야 할 문항이 비어 있습니다.`,incomplete_mark:`흐리거나 한 줄(ㅡ)·부분만 그어 인식이 어렵습니다. (인식 가능하면 이상 없음)`,missing_subject:`과목코드가 비어 있거나 명렬·시험과 다릅니다.`,missing_proctor:`감독관 확인란에 서명·도장이 없습니다.`,correction_tape:`수정테이프가 들뜨거나 위에 다시 칠해져 있습니다. ※ 처리는 우리 학교 규정 기준.`,form_type:`문형(홀수형/짝수형)이 표기되지 않았습니다.`,wrong_pen:`컴퓨터용 수성 사인펜이 아닌 필기구 흔적입니다.`,damaged:`카드가 접히거나 얼룩·찢김이 있습니다.`,absent_mismatch:`빈 답안지의 결시 표기·사유가 명렬과 다릅니다.`,ok:`수기·마킹·명렬이 일치하고 물리적 이상도 없습니다.`},u=[`id_mark`,`name_mismatch`,`duplicate_mark`,`missing_mark`,`incomplete_mark`,`missing_subject`,`missing_proctor`,`correction_tape`,`form_type`,`wrong_pen`,`damaged`,`absent_mismatch`,`ok`],d=[`id_mark`,`name_mismatch`,`missing_subject`],f=[`duplicate_mark`,`missing_mark`,`incomplete_mark`],p=[`correction_tape`,`damaged`,`form_type`,`missing_proctor`,`wrong_pen`,`absent_mismatch`],m={ok:`정상`,call_identity:`학생 호출하여 기재 사항 확인`,score_wrong:`채점 반영(오답)`,to_subject:`교과 확인·판독 보류`},h={ok:`이상 없음. 성적 처리로 넘깁니다.`,call_identity:`학번·이름·과목명·과목코드만. 답안 마킹을 학생에게 고치게 하지 않습니다.`,score_wrong:`학생 호출 없이 오답 처리. 교사가 답안을 고치지 않습니다.`,to_subject:`교과 교사가 기재 오류·답안 인식을 확인하고, 필요하면 학교 성적처리 절차로 넘깁니다.`},g={immediate:`시험 직후`,subject_review:`교과 확인`},_={immediate:`시험 종료 후 10분 이내, 답안지 회수·검사 구역에서. 인적사항 기재·마킹을 먼저 확인합니다. 답안 마킹은 수정시키지 않습니다. 오답으로 판정한 답안은 학생을 부르지 않고 그대로 채점합니다. (학생 호출 종료 이후에도 기재 오류만 호출)`,subject_review:`시간 제한 없음. 교과 교사가 기재 오류 여부와 답안 인식을 확인하고, 필요하면 학교 성적처리 절차로 넘깁니다.`},v={easy:{id:`easy`,label:`쉬움`,studentCount:10,questionCount:20,errorCardCount:3,flippedBackCount:2,upsideDownCount:2,absentCount:1,immediateLimitSec:300,multiClass:!1},normal:{id:`normal`,label:`보통`,studentCount:20,questionCount:20,errorCardCount:6,flippedBackCount:4,upsideDownCount:3,absentCount:2,immediateLimitSec:480,multiClass:!1},hard:{id:`hard`,label:`어려움`,studentCount:30,questionCount:20,errorCardCount:10,flippedBackCount:6,upsideDownCount:5,absentCount:3,immediateLimitSec:600,multiClass:!1},multi:{id:`multi`,label:`여러 반`,studentCount:18,questionCount:20,errorCardCount:8,flippedBackCount:4,upsideDownCount:3,absentCount:3,immediateLimitSec:600,multiClass:!0,classes:[{grade:2,classNo:3,studentCount:9},{grade:2,classNo:4,studentCount:9}]}},ee=[{code:11,name:`국어`},{code:17,name:`수학`},{code:21,name:`영어`},{code:31,name:`한국사`},{code:41,name:`사회탐구`},{code:51,name:`과학탐구`}],te=[`id_mark`,`name_mismatch`,`duplicate_mark`,`missing_mark`,`incomplete_mark`,`missing_subject`,`missing_proctor`,`correction_tape`,`form_type`,`wrong_pen`,`damaged`],y=[`missing_proctor`,`damaged`,`correction_tape`,`incomplete_mark`,`wrong_pen`,`id_mark`,`duplicate_mark`];function b(e){return String(e).padStart(2,`0`)}function ne(e,t){return Array.from({length:t},()=>e()<.08?{choices:[1+Math.floor(e()*5)],style:`messy_ok`}:{choices:[1+Math.floor(e()*5)],style:`normal`})}function re(e,n,r,i,a,s){if(!n.isAbsentBlank&&!n.injectedErrors.includes(i))switch(n.injectedErrors.push(i),i){case`id_mark`:{let t=e();if(t<.25)n.markedGrade=r.grade===1?2:1;else if(t<.55){let t=s.filter(e=>e!==r.classNo);if(t.length)n.markedClass=t[Math.floor(e()*t.length)];else{let t=r.classNo;for(;t===r.classNo;)t=1+Math.floor(e()*8);n.markedClass=t}}else if(t<.8){let t=r.number;for(;t===r.number;)t=1+Math.floor(e()*40);n.markedNumber=t}else{let t=s.filter(e=>e!==r.classNo);t.length?n.handwrittenClass=t[Math.floor(e()*t.length)]:n.markedNumber=r.number===1?2:1}break}case`name_mismatch`:n.handwrittenName=o(e,r.name);break;case`duplicate_mark`:{let t=Math.floor(e()*a),r=1+Math.floor(e()*5),i=r;for(;i===r;)i=1+Math.floor(e()*5);n.answers[t]={choices:[r,i],style:`normal`};break}case`missing_mark`:{let t=Math.floor(e()*a);n.answers[t]={choices:[],style:`normal`};break}case`incomplete_mark`:{let t=Math.floor(e()*a),r=n.answers[t]?.choices[0]??1+Math.floor(e()*5),i=[`faint`,`line`,`partial`],o=i[Math.floor(e()*i.length)];n.answers[t]={choices:[r],incomplete:!0,style:o};break}case`missing_subject`:n.subjectCode=null;break;case`missing_proctor`:n.proctorSigned=!1;break;case`correction_tape`:n.hasCorrectionTape=!0,n.correctionTapeBad=!0,n.correctionTapeQi=Math.floor(e()*a);break;case`form_type`:n.formType=null;break;case`wrong_pen`:n.wrongPen=!0;break;case`damaged`:n.damaged=!0,n.damageKind=t(e,[`fold`,`stain`,`tear`])[0]}}function ie(e,t,r,i,a,o){let c=s(e,i).map((e,n)=>{let i=n+1;return{id:`${o}-${b(i)}`,grade:t,classNo:r,number:i,name:e,examId:`${t}${b(r)}${b(i)}`,absent:!1}}),l=[`병결`,`사고결`,`기타결`,`미응시`],u=Math.min(a,Math.max(0,c.length-1)),d=n(e,c.length,u);for(let t of d)c[t].absent=!0,c[t].absentNote=l[Math.floor(e()*l.length)];return c}function ae(e,t,n){return{id:`c-${t.id}`,studentId:t.id,handwrittenName:t.name,handwrittenGrade:t.grade,handwrittenClass:t.classNo,handwrittenNumber:t.number,markedGrade:t.grade,markedClass:t.classNo,markedNumber:t.number,subjectCode:n.subjectCode,subjectName:n.subjectName,formType:e()<.5?`odd`:`even`,answers:ne(e,n.questionCount),proctorSigned:!0,hasCorrectionTape:!1,correctionTapeBad:!1,correctionTapeQi:null,wrongPen:!1,damaged:!1,injectedErrors:[],faceDown:!1,upsideDown:!1,isAbsentBlank:!1,absentMarked:!1,absentReasonOnCard:null}}function oe(e,t,n,r){let i=[`병결`,`사고결`,`기타결`,`미응시`],a=t.absentNote??`병결`,o=!0,s=[];if(r){if(s.push(`absent_mismatch`),e()<.5)o=!1,a=``;else{let n=i.filter(e=>e!==t.absentNote);a=n[Math.floor(e()*n.length)]??`기타결`}}return{id:`c-${t.id}`,studentId:t.id,handwrittenName:t.name,handwrittenGrade:t.grade,handwrittenClass:t.classNo,handwrittenNumber:t.number,markedGrade:t.grade,markedClass:t.classNo,markedNumber:t.number,subjectCode:n.subjectCode,subjectName:n.subjectName,formType:null,answers:Array.from({length:n.questionCount},()=>({choices:[],style:`normal`})),proctorSigned:!0,hasCorrectionTape:!1,correctionTapeBad:!1,correctionTapeQi:null,wrongPen:!1,damaged:!1,injectedErrors:s.length?s:[`ok`],faceDown:!1,upsideDown:!1,isAbsentBlank:!0,absentMarked:o,absentReasonOnCard:a||null}}function se(e,n,r,i,a){let o=n.filter(e=>!e.isAbsentBlank);for(let n of y){if(o.some(e=>e.injectedErrors.includes(n)))continue;let s=t(e,o.filter(e=>e.injectedErrors[0]===`ok`||e.injectedErrors.length<2))[0];s&&(s.injectedErrors[0]===`ok`&&(s.injectedErrors=[]),re(e,s,r.find(e=>e.id===s.studentId),n,i,a))}}function x(r=`easy`,i,a=`subject_review`){let o=v[r],s=i??(Math.floor(Math.random()*1e9)||1),c=e(s),l=ee[Math.floor(c()*ee.length)],u=o.multiClass?o.classes??[{grade:2,classNo:4,studentCount:o.studentCount}]:[{grade:2,classNo:4,studentCount:o.studentCount}],d=u.reduce((e,t)=>e+t.studentCount,0),f=Math.min(o.absentCount,d-u.length),p=u.map((e,t)=>{let n=u.length-t,r=Math.min(e.studentCount-1,Math.max(0,Math.round(f/n)));return f-=r,r}),m={seed:s,difficulty:r,studentCount:d,questionCount:o.questionCount,grade:u[0].grade,classNo:u[0].classNo,subjectCode:l.code,subjectName:l.name,errorCardCount:o.errorCardCount,flippedBackCount:o.flippedBackCount,upsideDownCount:o.upsideDownCount,absentCount:p.reduce((e,t)=>e+t,0),timeLimitSec:a===`immediate`?Math.min(600,o.immediateLimitSec):null,inspectionMode:a,multiClass:o.multiClass,classes:u},h=[];u.forEach((e,t)=>{h.push(...ie(c,e.grade,e.classNo,e.studentCount,p[t],`s${e.classNo}`))});let g=[...new Set(h.map(e=>e.classNo))],_=h.filter(e=>!e.absent),y=h.filter(e=>e.absent),b=_.map(e=>ae(c,e,m)),ne=y.length>0?n(c,y.length,Math.min(1,y.length)):[];for(let e=0;e<y.length;e++)b.push(oe(c,y[e],m,ne.includes(e)));let x=b.filter(e=>!e.isAbsentBlank),S=n(c,x.length,Math.min(m.errorCardCount,x.length));for(let e of S){let n=x[e],r=h.find(e=>e.id===n.studentId),i=c()<.4?2:1,a=t(c,[...te]).slice(0,i);for(let e of a)re(c,n,r,e,m.questionCount,g)}se(c,b,h,m.questionCount,g);for(let e of b)e.injectedErrors.length===0&&(e.injectedErrors=[`ok`]);let C=b.map((e,t)=>e.isAbsentBlank?-1:t).filter(e=>e>=0),ce=t(c,C).slice(0,Math.min(m.flippedBackCount,C.length));for(let e of ce)b[e].faceDown=!0;let le=b.map((e,t)=>!e.faceDown&&!e.isAbsentBlank?t:-1).filter(e=>e>=0),w=t(c,le).slice(0,Math.min(m.upsideDownCount,le.length));for(let e of w)b[e].upsideDown=!0;if(w.length<m.upsideDownCount){let e=m.upsideDownCount-w.length,n=t(c,b.map((e,t)=>e.faceDown&&!e.upsideDown&&!e.isAbsentBlank?t:-1).filter(e=>e>=0)).slice(0,e);for(let e of n)b[e].upsideDown=!0}return{config:m,roster:h,cards:t(c,b)}}function S(e,t){let n=new Map(t.map(e=>[e.studentId,e.id]));return[...e].sort((e,t)=>e.grade===t.grade?e.classNo===t.classNo?e.number-t.number:e.classNo-t.classNo:e.grade-t.grade).map(e=>n.get(e.id)).filter(Boolean)}function C(e,t){return e.find(e=>e.id===t.studentId)}function ce(e,t=`subject_review`){let n=e.injectedErrors.filter(e=>e!==`ok`);if(n.length===0)return`ok`;let r=n.some(e=>d.includes(e)),i=n.some(e=>f.includes(e)),a=n.some(e=>p.includes(e));return r?`call_identity`:t===`subject_review`?a?`to_subject`:i?`score_wrong`:`to_subject`:i&&!a?`score_wrong`:a&&!i?`to_subject`:i?`score_wrong`:`to_subject`}function le(){let e=new URLSearchParams(location.search).get(`seed`);if(!e)return;let t=Number(e);return Number.isFinite(t)?t>>>0:void 0}function w(){let e=new URLSearchParams(location.search).get(`diff`);if(e===`easy`||e===`normal`||e===`hard`||e===`multi`)return e}function ue(){let e=new URLSearchParams(location.search).get(`mode`);if(e===`immediate`||e===`subject_review`)return e}function de(e){let t=e.length,n=e.filter(e=>e.absent).length;return{enrolled:t,absent:n,present:t-n}}var fe=20,pe=25,me=25,he=8,ge=300;function _e(e){let t=new Set(e);return t.has(`ok`)&&t.size>1&&t.delete(`ok`),[...t]}function ve(e,t,n){let r=e.length===t.length&&e.every((e,n)=>e===t[n]),i=e.filter(e=>{let t=n.get(e);return t&&(t.faceDown||t.upsideDown)});return{orderCorrect:r,orientationCorrect:i.length===0,playerOrder:e,expectedOrder:t,badOrientation:i}}function ye(e,t,n=`subject_review`){let r=new Map(t.map(e=>[e.cardId,e]));return e.map(e=>{let t=e.injectedErrors.length===1&&e.injectedErrors[0]===`ok`?[`ok`]:e.injectedErrors.filter(e=>e!==`ok`),i=r.get(e.id),a=_e(i?.selected??[]),o=i?.disposition??`ok`,s=ce(e,n),c=new Set(t),l=new Set(a),u=[...l].filter(e=>c.has(e)),d=[...c].filter(e=>!l.has(e)),f=[...l].filter(e=>!c.has(e)),p=o===s,m=d.length===0&&f.length===0&&u.length===c.size&&p;return{cardId:e.id,expected:t,selected:a,expectedDisposition:s,disposition:o,hit:u,missed:d,falsePositive:f,dispositionOk:p,perfect:m}})}function be(e){let t=e.headcountOk?fe:0,n=(e.sort.orderCorrect?pe:0)+(e.sort.orientationCorrect?me:0),r=0;for(let t of e.inspection)t.perfect?r+=he:r+=t.hit.length*2-t.missed.length*2-t.falsePositive.length+(t.dispositionOk?2:-2);r=Math.max(0,r);let i=70+e.cardCount*he+10,a=e.timedOut?0:Math.max(0,Math.min(10,Math.round(10*(1-e.timeSeconds/ge))));return{headcountOk:e.headcountOk,headcountPoints:t,sortOrderOk:e.sort.orderCorrect,sortOrientationOk:e.sort.orientationCorrect,sortPoints:n,inspection:e.inspection,inspectionPoints:r,timeSeconds:e.timeSeconds,timeBonus:a,total:t+n+r+a,maxTotal:i,timedOut:e.timedOut,inspectionMode:e.inspectionMode}}function xe(e,t,n=9,r){let i=Array.from({length:n+1},(e,n)=>`<span class="bub ${t!==null&&t===n?`filled`:``}" data-d="${n}"><i>${n}</i></span>`).join(``);return`<div class="digit-col"${r?` data-region="${r}"`:``}><span class="digit-cap">${e}</span><div class="digit-bubs">${i}</div></div>`}function Se(e,t,n){let r=t===null?null:Math.floor(t/10),i=t===null?null:t%10;return`<div class="digit-group"${n?` data-region="${n}"`:``}><span class="group-label">${e}</span><div class="digit-cols">${xe(`십`,r)}${xe(`일`,i)}</div></div>`}function Ce(e,t,n=9,r){return`<div class="digit-group"${r?` data-region="${r}"`:``}><span class="group-label">${e}</span><div class="digit-cols">${xe(``,t,n)}</div></div>`}function we(e){let{on:t,incomplete:n,wrongPen:r,style:i}=e;return[`bub`,`ans`,t?`filled`:``,n?`incomplete`:``,r?`wrong-pen`:``,i&&i!==`normal`?`style-${i}`:``].filter(Boolean).join(` `)}function Te(e,t,n){let r=[];for(let i=t;i<n;i++){let t=e.answers[i];if(!t)continue;let n=i+1,a=t.choices.length>1,o=t.choices.length===0&&!e.isAbsentBlank,s=!!t.incomplete,c=a?`duplicate_mark`:o?`missing_mark`:s?`incomplete_mark`:e.wrongPen&&t.choices.length?`wrong_pen`:``,l=[1,2,3,4,5].map(n=>{let r=t.choices.includes(n);return`<span class="${we({on:r,incomplete:r&&t.incomplete,wrongPen:r&&e.wrongPen,style:r?t.style:void 0})}"><i>${n}</i></span>`}).join(``),u=c?` data-region="${c}"`:``;r.push(`<div class="ans-row"${u} data-q="${n}"><span class="qno">${String(n).padStart(2,`0`)}</span>${l}</div>`)}return`<div class="ans-block">${r.join(``)}</div>`}function Ee(e){if(!e.damaged)return``;let t=e.damageKind??`fold`;return t===`fold`?`<div class="dmg-overlay dmg-fold-mark" data-region="damaged" title="접힘" aria-hidden="true">
      <span class="dmg-fold-corner"></span><span class="dmg-fold-label">접힘</span>
    </div>`:t===`stain`?`<div class="dmg-overlay dmg-stain-mark" data-region="damaged" title="얼룩" aria-hidden="true">
      <span class="dmg-stain-blob"></span><span class="dmg-stain-blob b2"></span><span class="dmg-fold-label">얼룩</span>
    </div>`:`<div class="dmg-overlay dmg-tear-mark" data-region="damaged" title="찢김" aria-hidden="true">
    <span class="dmg-tear-edge"></span><span class="dmg-fold-label">찢김</span>
  </div>`}function De(e){if(!e.hasCorrectionTape)return``;let t=e.correctionTapeQi??0,n=Math.ceil(e.answers.length/2),r=t<n?0:1,i=48+(t<n?t:t-n)/Math.max(1,n)*38,a=r===0?18:58;return`<div class="tape-trace ${e.correctionTapeBad?`tape-bad`:``}" data-region="correction_tape"
    style="top:${i}%;left:${a}%" title="수정테이프"></div>`}function Oe(e){if(!e.isAbsentBlank)return``;let t=[`병결`,`사고결`,`기타결`,`미응시`].map(t=>`<span class="abs-reason ${e.absentReasonOnCard===t?`on`:``}">${t}</span>`).join(``),n=e.injectedErrors.includes(`absent_mismatch`);return`<section class="absent-block ${n?`is-bad`:``}" data-region="${n?`absent_mismatch`:``}">
    <div class="absent-check">
      <span class="bub form ${e.absentMarked?`filled`:``}"><i>✓</i></span>
      <strong>결시</strong>
      <small>응시하지 않음 · 빈 답안지</small>
    </div>
    <div class="absent-reasons"><span class="group-label">결시 사유</span>${t}</div>
    <p class="absent-note">답안 마킹 없음 · 명렬의 결시·사유와 대조</p>
  </section>`}function ke(e,t={}){let{compact:n=!1,highlight:r=[]}=t,i=e=>r.includes(e)?`hl-err`:``,a=e.formType===`odd`,o=e.formType===`even`,s=e.injectedErrors.includes(`id_mark`),c=e.injectedErrors.includes(`name_mismatch`),l=e.injectedErrors.includes(`missing_subject`),u=e.injectedErrors.includes(`form_type`),d=e.injectedErrors.includes(`missing_proctor`),f=e.damaged?`dmg-${e.damageKind??`fold`} has-damage`:``,p=De(e),m=Ee(e),h=`<div class="ans-legend"><span>문항</span><span>①</span><span>②</span><span>③</span><span>④</span><span>⑤</span></div>`,g=Math.ceil(e.answers.length/2),_=n||e.isAbsentBlank?e.isAbsentBlank?Oe(e):``:`<section class="omr-answers ${i(`duplicate_mark`)} ${i(`missing_mark`)} ${i(`incomplete_mark`)}">
        <div class="ans-two">
          <div class="ans-col">${h}${Te(e,0,g)}</div>
          <div class="ans-col">${h}${Te(e,g,e.answers.length)}</div>
        </div>
      </section>`,v=e.subjectCode==null?`<span class="subj-missing">과목코드 미표기</span>`:`<span class="subj-code">${String(e.subjectCode).padStart(2,`0`)}</span> <span class="subj-name">${e.subjectName}</span>`;return`
<article class="omr-card front ${n?`is-compact`:``} ${f} ${e.wrongPen?`pen-wrong`:``} ${e.isAbsentBlank?`is-absent-blank`:``}" data-card-id="${e.id}">
  <div class="timing-marks left" aria-hidden="true"></div>
  <div class="timing-marks right" aria-hidden="true"></div>
  ${p}
  ${m}
  <header class="omr-head">
    <div class="omr-brand">
      <strong>전국연합학력평가</strong>
      <span>답안지 (OMR) · 데모</span>
    </div>
    <div class="omr-subject-chip ${i(`missing_subject`)}" ${l?`data-region="missing_subject"`:``}>
      <span class="subj-cap">응시 과목</span>
      ${v}
    </div>
    <div class="form-type ${i(`form_type`)}" ${u?`data-region="form_type"`:``}>
      <span class="ft-label">문형</span>
      <span class="bub form ${a?`filled`:``}"><i>홀</i></span>
      <span class="bub form ${o?`filled`:``}"><i>짝</i></span>
    </div>
  </header>
  <section class="omr-id">
    <div class="hand-block ${i(`name_mismatch`)}" ${c?`data-region="name_mismatch"`:``}>
      <div class="hand-line"><span>학년</span><b class="handwrite">${e.handwrittenGrade}</b></div>
      <div class="hand-line"><span>반</span><b class="handwrite">${e.handwrittenClass}</b></div>
      <div class="hand-line"><span>번호</span><b class="handwrite">${String(e.handwrittenNumber).padStart(2,`0`)}</b></div>
      <div class="hand-line name"><span>성명</span><b class="handwrite">${e.handwrittenName}</b></div>
    </div>
    <div class="mark-block ${i(`id_mark`)} ${i(`missing_subject`)}">
      ${Ce(`학년`,e.markedGrade,3,s?`id_mark`:void 0)}
      ${Se(`반`,e.markedClass,s?`id_mark`:void 0)}
      ${Se(`번호`,e.markedNumber,s?`id_mark`:void 0)}
      ${Se(`과목`,e.subjectCode,l?`missing_subject`:void 0)}
    </div>
  </section>
  ${_}
  <footer class="omr-foot">
    <div class="proctor ${e.proctorSigned?`signed`:`missing`} ${i(`missing_proctor`)}" ${d?`data-region="missing_proctor"`:``}>
      <span>감독관 확인</span>
      ${e.proctorSigned?`<em class="stamp" title="감독관 도장">確</em>`:`<em class="blank">미확인 · 도장 없음</em>`}
    </div>
    <span class="foot-note">※ 컴퓨터용 수성 사인펜 · 수정테이프는 우리 학교 규정 기준 · 교사가 답안을 고치지 않음</span>
  </footer>
</article>`}function Ae(e){let t=String(e.handwrittenNumber).padStart(2,`0`),n=e.formType===`odd`?`홀`:e.formType===`even`?`짝`:`문형?`,r=[e.faceDown?`is-back`:``,e.upsideDown?`is-upsidedown`:``].filter(Boolean).join(` `),i=`
<article class="desk-thumb-face front ${e.isAbsentBlank?`abs-thumb`:``}">
  <div class="thumb-stripe" aria-hidden="true"></div>
  <div class="thumb-class">${e.handwrittenGrade}-${e.handwrittenClass}</div>
  <div class="thumb-no">${t}</div>
  <div class="thumb-name">${e.handwrittenName}</div>
  <div class="thumb-meta">
    <span class="thumb-subj">${e.subjectCode??`??`} ${e.subjectName}</span>
    <span class="thumb-form">${n}</span>
  </div>
  <div class="thumb-flags">
    ${e.isAbsentBlank?`<i class="tf warn">결시 빈장</i>`:``}
    ${e.upsideDown?`<i class="tf warn thumb-badge-orient">위아래!</i>`:``}
    ${e.proctorSigned?``:`<i class="tf">감독?</i>`}
    ${e.hasCorrectionTape?`<i class="tf">테이프</i>`:``}
    ${e.wrongPen?`<i class="tf">펜</i>`:``}
    ${e.damaged?`<i class="tf">손상</i>`:``}
  </div>
</article>`;return`
<div class="desk-thumb card-3d ${r}" data-card-id="${e.id}" tabindex="0"
  aria-label="OMR ${e.handwrittenGrade}-${e.handwrittenClass} ${t}번 ${e.handwrittenName}">
  <div class="card-3d-inner desk-thumb-inner">
    <div class="card-face face-front">${i}</div>
    <div class="card-face face-back">
<article class="desk-thumb-face back">
  <div class="thumb-back-label">답안지 뒷면</div>
  <div class="thumb-badge-orient back-badge">뒤집힘</div>
</article></div>
  </div>
</div>`}function je(e,t,n,r){if(r?.multiClass)return[...new Set(e.map(e=>`${e.grade}-${e.classNo}`))].sort().map(t=>{let[n,i]=t.split(`-`).map(Number);return je(e.filter(e=>e.grade===n&&e.classNo===i).sort((e,t)=>e.number-t.number),n,i,{subjectLabel:r.subjectLabel})}).join(``);let i=[...e].sort((e,t)=>e.number-t.number).map(e=>{let t=e.absent;return`<tr class="${t?`absent`:``}">
        <td>${String(e.number).padStart(2,`0`)}</td>
        <td>${e.name}</td>
        <td>${e.examId}</td>
        <td>${t?`<span class="abs-mark">결시</span> ${e.absentNote??``}`:`응시`}</td>
      </tr>`}).join(``);return`
<div class="roster-sheet">
  <div class="roster-sheet-head">
    <strong>${t}학년 ${n}반 학생 명렬표</strong>
    <span>전국연합학력평가 · 응시 확인용${r?.subjectLabel?` · ${r.subjectLabel}`:``}</span>
  </div>
  <table>
    <thead><tr><th>번호</th><th>성명</th><th>수험번호</th><th>응시</th></tr></thead>
    <tbody>${i}</tbody>
  </table>
</div>`}var Me=`teacher-sim-omr-best-v1`;function Ne(){try{let e=localStorage.getItem(Me);return e?JSON.parse(e):{}}catch{return{}}}function Pe(e,t){let n=Ne();return t>=(n[e]?.score??-1)&&(n[e]={score:t,at:new Date().toISOString()},localStorage.setItem(Me,JSON.stringify(n))),n}var T=document.querySelector(`#app`),E=`hub`,D=w()??`easy`,O=ue()??`subject_review`,k=null,A=new Map,j=[],M=[],N=null,P=new Map;function Fe(){k?window.__TS_E2E__={stage:E,seed:k.config.seed,difficulty:k.config.difficulty,inspectionMode:k.config.inspectionMode,expectedOrder:S(k.roster,k.cards),cards:k.cards.map(e=>({id:e.id,injectedErrors:[...e.injectedErrors],disposition:ce(e,k.config.inspectionMode),isAbsentBlank:e.isAbsentBlank})),headcount:de(k.roster),subject:{code:k.config.subjectCode,name:k.config.subjectName},finalScore:R}:window.__TS_E2E__=void 0}var F=0,I=0,Ie=!1,L=null,R=null,Le=!1,z=1,B=0,V=0,H=null;function Re(){H!=null&&(clearInterval(H),H=null)}function U(){return I?Math.floor((Date.now()-I)/1e3):0}function W(e){return`${Math.floor(e/60)}:${String(e%60).padStart(2,`0`)}`}function G(){Re(),H=window.setInterval(()=>{let e=T.querySelector(`#timer`);e&&(e.textContent=W(U()));let t=k?.config.timeLimitSec;t!=null&&U()>=t&&E!==`results`&&(Le=!0,Ze())},500)}function K(){Re(),E=`hub`,k=null,J()}function ze(e){k=x(D,e??le(),O),A=new Map(k.cards.map(e=>[e.id,e])),j=k.cards.map(e=>e.id),M=[],N=null,P=new Map,F=0,I=0,Ie=!1,L=null,R=null,Le=!1,z=1,B=0,V=0,history.replaceState(null,``,`?diff=${D}&mode=${O}&seed=${k.config.seed}`)}function Be(e,t){D=e;let n=ue();n?(O=n,ze(t),E=`howto`):(window.__TS_SEED__=t,E=`mode`),J()}function Ve(e){O=e;let t=window.__TS_SEED__;window.__TS_SEED__=void 0,ze(t),E=`howto`,J()}function q(e){E=e,e!==`headcount`&&e!==`sorting`||I||(I=Date.now(),G()),J()}function J(){switch(E){case`hub`:He();break;case`difficulty`:Ue();break;case`mode`:We();break;case`howto`:Ge();break;case`headcount`:Ke();break;case`sorting`:Z();break;case`inspection`:$();break;case`results`:Qe()}Fe()}function Y(e,t){T.innerHTML=`
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
</div>`,T.querySelector(`#btn-hub`)?.addEventListener(`click`,()=>{(E===`hub`||confirm(`허브로 돌아갈까요? 진행 중이면 저장되지 않습니다.`))&&K()})}function He(){let e=Ne(),t=[e.easy,e.normal,e.hard,e.multi].filter(Boolean).length;Y(`
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
      <span class="hp-chip ${e.multi?`done`:``}">여러 반 ${e.multi?e.multi.score+`점`:`미클리어`}</span>
    </div>
  </div>
  <div class="game-grid">
    <button type="button" class="game-tile open" id="tile-omr">
      <span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="3" width="24" height="26" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="10" r="2" fill="currentColor"/><circle cx="22" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><rect x="8" y="22" width="16" height="2" fill="currentColor"/></svg></span>
      <span class="tile-badge">플레이 가능</span>
      <h2>OMR 카드 검사</h2>
      <p>인원 확인 → 정렬·뒤집기 → 이상 발견 · 시험 직후/교과 확인</p>
      <ul class="best-line">
        <li>쉬움 ${e.easy?.score??`—`}점</li>
        <li>보통 ${e.normal?.score??`—`}점</li>
        <li>어려움 ${e.hard?.score??`—`}점</li>
        <li>여러 반 ${e.multi?.score??`—`}점</li>
      </ul>
    </button>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M10 12h12M10 17h12M10 22h8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>출결 정리</h2><p>전자·종이 출석부 대조</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><path d="M8 26V8l8-3 8 3v18l-8-3-8 3z" stroke="currentColor" stroke-width="2"/><path d="M12 14h8M12 18h6" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>생기부 검토</h2><p>금지 표현·맞춤법</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 10l12 8 12-8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>가정통신문 교정</h2><p>날짜·금액·오탈자</p></div>
  </div>
  <footer class="hub-foot">
    <p>데모 미니게임 1종 · 나머지 타일은 로드맵 · 시드 고정 연습 가능 (?diff=&amp;seed=)</p>
  </footer>
</section>`,{stageClass:`stage-hub`}),T.querySelector(`#tile-omr`).addEventListener(`click`,()=>{E=`difficulty`,J()})}function Ue(){let e=Ne();Y(`
<section class="panel" data-stage="difficulty">
  <h1>OMR 카드 검사 · 난이도</h1>
  <p class="lead">재적·반 구성에 따라 책상 위 카드 더미가 달라집니다. 다음 화면에서 검사 시점을 고릅니다.</p>
  <div class="diff-grid">${Object.keys(v).map(t=>{let n=v[t],r=`시험 직후 최대 ${Math.floor(n.immediateLimitSec/60)}분`,i=t===`easy`?`🌱`:t===`normal`?`📘`:t===`hard`?`🔥`:`🏫`,a=e[t]?.score,o=n.multiClass?n.classes.map(e=>`${e.grade}-${e.classNo}반 ${e.studentCount}명`).join(` · `):`단일 반`;return`
<button type="button" class="diff-card" data-diff="${t}">
  <span class="diff-ico" aria-hidden="true">${i}</span>
  <h2>${n.label}</h2>
  <ul class="diff-meta">
    <li><b>${n.studentCount}</b>명</li>
    <li>문항 ${n.questionCount}</li>
    <li>결시 ${n.absentCount}</li>
  </ul>
  <p class="diff-lim">${r}</p>
  <p class="diff-lim">${o}</p>
  <p class="diff-best ${a==null?``:`has`}">최고 ${a??`—`}점</p>
</button>`}).join(``)}</div>
  <div class="actions"><button class="btn ghost" id="btn-back" type="button">허브</button></div>
</section>`),T.querySelector(`#btn-back`).addEventListener(`click`,K),T.querySelectorAll(`[data-diff]`).forEach(e=>{e.addEventListener(`click`,()=>Be(e.dataset.diff))})}function We(){let e=v[D];Y(`
<section class="panel" data-stage="mode">
  <h1>검사 시점 · ${e.label}</h1>
  <p class="lead">시험 직후는 짧은 시간 안에 회수·검사합니다. 교과 확인은 시간 제한이 없습니다.</p>
  <div class="mode-grid">
    <button type="button" class="mode-card" data-mode="immediate">
      <h2>${g.immediate}</h2>
      <p class="mode-lim">최대 ${Math.floor(e.immediateLimitSec/60)}분 (10분 이내)</p>
      <p>${_.immediate}</p>
    </button>
    <button type="button" class="mode-card" data-mode="subject_review">
      <h2>${g.subject_review}</h2>
      <p class="mode-lim">시간 제한 없음</p>
      <p>${_.subject_review}</p>
    </button>
  </div>
  <div class="actions"><button class="btn ghost" id="btn-back" type="button">난이도</button></div>
</section>`),T.querySelector(`#btn-back`).addEventListener(`click`,()=>{E=`difficulty`,J()}),T.querySelectorAll(`[data-mode]`).forEach(e=>{e.addEventListener(`click`,()=>Ve(e.dataset.mode))})}function Ge(){let e=k,t=e.config.inspectionMode,n=e.config.timeLimitSec==null?`교과 확인 · 시간 제한 없음`:`시험 직후 · ${Math.floor(e.config.timeLimitSec/60)}분 제한`;Y(`
<section class="panel howto-panel" data-stage="howto">
  <h1>하는 방법 · ${v[e.config.difficulty].label}</h1>
  <p class="lead">${g[t]} · ${n} · 과목 <b>${e.config.subjectName}(${String(e.config.subjectCode).padStart(2,`0`)})</b></p>
  <ol class="howto-steps">
    <li><span class="howto-ico" aria-hidden="true">①</span><div><b>응시 인원 확인</b><p>응시자 + 결시자 = 재적. 결시생은 빈 답안지를 꺼내 결시·사유를 명렬과 대조합니다.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">②</span><div><b>정렬·방향</b><p>${e.config.multiClass?`반별로 묶고 각 반 안에서는 번호(가나다)순`:`번호순`}으로 트레이에 올립니다. 뒷면·위아래(180°)를 바로잡습니다. F/R/Enter.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">③</span><div><b>이상 발견</b><p>${_[t]} 카드의 문제 부위를 클릭하면 이상이 선택됩니다. 교사가 답안을 고치지 않습니다.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">④</span><div><b>조치</b><p>기재 오류(학번·이름·과목)만 «학생 호출하여 기재 사항 확인». 답안 마킹 이상은 «학생 호출 없이 오답 처리». 판독이 어려우면 교과 확인.</p></div></li>
  </ol>
  <aside class="field-rules" aria-label="현장 규칙">
    <b>현장 규칙 요약</b>
    <ul>
      <li><strong>인원</strong> 응시 + 결시 = 재적 · 결시 빈 답안지</li>
      <li><strong>조치</strong> 정상 · 기재 확인 호출 · 오답 처리 · 교과 확인</li>
      <li><strong>마킹</strong> 교사가 대신 고치지 않음 · 답안 수정 호출 없음</li>
    </ul>
  </aside>
  <p class="howto-seed">시드 <b>${e.config.seed}</b> · 재적 <b>${e.config.studentCount}</b> · 카드 <b>${e.cards.length}</b>${e.config.multiClass?` · 여러 반`:``}</p>
  <div class="actions">
    <button class="btn primary" id="btn-go" type="button">인원 확인 시작</button>
    <button class="btn ghost" id="btn-back" type="button">검사 시점</button>
  </div>
</section>`),T.querySelector(`#btn-go`).addEventListener(`click`,()=>q(`headcount`)),T.querySelector(`#btn-back`).addEventListener(`click`,()=>{E=`mode`,J()})}function Ke(){let e=k,t=de(e.roster),n=`<div class="progress"><span class="pill">인원 확인</span><span class="timer" id="timer">${W(U())}</span></div>`;Y(`
<section class="panel headcount-panel" data-stage="headcount">
  <h1>응시 인원 확인</h1>
  <p class="lead">명렬표를 보고 <b>응시자 + 결시자 = 재적</b>인지 확인하세요. 결시생은 <b>빈 답안지</b>를 꺼내 결시·사유를 대조합니다.</p>
  <div class="hc-layout">
    ${je(e.roster,e.config.grade,e.config.classNo,{multiClass:e.config.multiClass,subjectLabel:`${e.config.subjectName}(${String(e.config.subjectCode).padStart(2,`0`)})`})}
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
</section>`,{top:n,desk:!0,stageClass:`stage-headcount`}),G(),T.querySelector(`#hc-form`).addEventListener(`submit`,e=>{e.preventDefault();let n=new FormData(e.target),r=Number(n.get(`enrolled`)),i=Number(n.get(`present`)),a=Number(n.get(`absent`)),o=i+a===r,s=r===t.enrolled&&i===t.present&&a===t.absent&&o;Ie=s,s?q(`sorting`):X(o?`숫자가 명렬과 다릅니다. (정답 재적 ${t.enrolled} · 응시 ${t.present} · 결시 ${t.absent})`:`응시자 + 결시자 = 재적이 되지 않습니다.`)})}function X(e){let t=T.querySelector(`#toast`);t&&(t.hidden=!1,t.textContent=e,window.setTimeout(()=>{t.hidden=!0},3200))}function Z(){let e=k,t=[...e.roster].sort((e,t)=>e.grade===t.grade?e.classNo===t.classNo?e.number-t.number:e.classNo-t.classNo:e.grade-t.grade),n=S(e.roster,e.cards),r=[...j,...M].filter(e=>{let t=A.get(e);return t.faceDown||t.upsideDown}).length,i=`<div class="progress"><span class="pill">정렬</span><span class="timer" id="timer">${W(U())}</span><span class="hint-pill">방향 이상 ${r}장 · 트레이 ${M.length}/${e.cards.length}</span></div>`,a=j.map((e,t)=>{let n=A.get(e),r=Math.max(1,j.length),i=-4+(r===1?0:t/(r-1))*8+(t%3-1)*1.2,a=t%5*4+(n.upsideDown||n.faceDown?8:0),o=(n.upsideDown||n.faceDown?40:0)+t+1,s=[n.faceDown?`<span class="pile-chip back">뒷면</span>`:``,n.upsideDown?`<span class="pile-chip warn">위아래</span>`:``].join(``);return`
<div class="desk-card pile-card ${N===e?`selected`:``} ${n.upsideDown?`has-orient`:``} ${n.faceDown?`has-back`:``}" data-id="${e}" draggable="true"
  style="--r:${i}deg; --lift:${a}px; --tilt:${1+t%2}deg; z-index:${o}">
  ${s}
  ${Ae(n)}
</div>`}).join(``),o=t.map((e,t)=>{let r=M[t],i=n[t];if(!r)return`
<div class="tray-slot empty-slot" data-slot="${t}" data-class="${e.grade}-${e.classNo}">
  <span class="slot-label">슬롯 ${t+1} · ${e.grade}-${e.classNo}반 ${String(e.number).padStart(2,`0`)}${e.absent?` · 결시`:``}</span>
  <div class="slot-ghost">${e.grade}-${e.classNo} ${String(e.number).padStart(2,`0`)} ${e.name}${e.absent?` (결시)`:``}</div>
</div>`;let a=A.get(r),o=r===i&&!a.faceDown&&!a.upsideDown,s=r===i;return`
<div class="tray-slot ${s&&!a.faceDown&&!a.upsideDown?`slot-ok`:s?`slot-warn`:`slot-bad`}" data-slot="${t}" data-id="${r}">
  <span class="slot-label">슬롯 ${t+1} · ${e.grade}-${e.classNo}반 ${String(e.number).padStart(2,`0`)}${e.absent?` · 결시`:``}
    <em>${o?`✓`:s?`방향!`:`순서✗`}</em>
  </span>
  <div class="desk-card tray-card tray-fan" data-id="${r}" data-tray-index="${t}" draggable="true"
    style="--fan:${(t%5-2)*1.6}deg">
    ${Ae(a)}
  </div>
  <div class="tray-tools">
    <button type="button" class="btn tiny" data-act="left" data-i="${t}" ${t===0?`disabled`:``}>←</button>
    <button type="button" class="btn tiny" data-act="right" data-i="${t}" ${t>=M.length-1?`disabled`:``}>→</button>
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
      ${je(e.roster,e.config.grade,e.config.classNo,{multiClass:e.config.multiClass,subjectLabel:`${e.config.subjectName}(${String(e.config.subjectCode).padStart(2,`0`)})`})}
      <p class="side-note">${e.config.multiClass?`반 → 번호(가나다)순. `:``}결시생은 빈 답안지를 같은 슬롯에 둡니다.</p>
      <aside class="desk-sticky" aria-hidden="true">
        <b>메모</b>
        <p>뒷면·위아래 먼저 바로잡고 트레이로.</p>
        <p class="kbd-row"><kbd>F</kbd> 뒤집기 <kbd>R</kbd> 위아래 <kbd>Enter</kbd> 트레이</p>
      </aside>
    </aside>
    <div class="desk-work ${j.length?`has-pile`:`no-pile`}">
      <div class="pile-zone ${j.length?``:`is-empty`}" id="pile-zone">
        <header class="zone-head">
          <h2>흐트러진 더미 <small class="pile-count">${j.length}장</small></h2>
          <div class="pile-actions toolbar">
            <button type="button" class="btn tiny" id="btn-flip-sel" ${N?``:`disabled`} title="F">선택 뒤집기 <kbd>F</kbd></button>
            <button type="button" class="btn tiny" id="btn-spin-sel" ${N?``:`disabled`} title="R">위아래 <kbd>R</kbd></button>
            <button type="button" class="btn tiny primary" id="btn-to-tray" ${N?``:`disabled`} title="Enter">트레이 <kbd>⏎</kbd></button>
          </div>
        </header>
        <div class="pile-area" id="pile-area">${a||`<p class="empty">더미가 비었습니다 — 아래 트레이를 확인하세요</p>`}</div>
      </div>
      <div class="tray-zone ${j.length?``:`is-expanded`}" id="tray-zone">
        <header class="zone-head">
          <h2>정렬 트레이 <small>${e.config.multiClass?`반→번호순`:`번호순`} · 초록=맞음 · F/R/Enter</small></h2>
          <div class="pile-actions toolbar">
            <button class="btn tiny" id="btn-autosort" type="button">${e.config.multiClass?`반·번호순`:`수기번호순`}</button>
            <button class="btn tiny primary" id="btn-done-sort" type="button">정렬 완료 · 검사</button>
          </div>
        </header>
        <div class="tray-rail" id="tray-rail">${o}</div>
      </div>
    </div>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,{top:i,desk:!0,stageClass:`stage-sorting`}),G(),qe()}function qe(){T.querySelector(`#btn-autosort`)?.addEventListener(`click`,()=>{let e=[...j,...M];for(let t of e){let e=A.get(t);e.faceDown=!1,e.upsideDown=!1}M=e.sort((e,t)=>{let n=A.get(e),r=A.get(t);return n.handwrittenGrade===r.handwrittenGrade?n.handwrittenClass===r.handwrittenClass?n.handwrittenNumber-r.handwrittenNumber:n.handwrittenClass-r.handwrittenClass:n.handwrittenGrade-r.handwrittenGrade}),j=[],N=null,Z()}),T.querySelector(`#btn-done-sort`)?.addEventListener(`click`,()=>{if(j.length){X(`더미에 카드가 남아 있습니다.`);return}let e=M.filter(e=>{let t=A.get(e);return t.faceDown||t.upsideDown});if(e.length){X(`방향이 잘못된 카드가 ${e.length}장 있습니다.`);return}let t=S(k.roster,[...A.values()]);L=ve(M,t,A),(L.orderCorrect||confirm(`번호 순서가 명렬과 다릅니다. 그래도 검사로 갈까요?`))&&(F=0,q(`inspection`))});let e=e=>{N=e,Z()};T.querySelectorAll(`.pile-card`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),e(t.dataset.id)}),t.addEventListener(`dblclick`,()=>Q(t.dataset.id)),t.addEventListener(`dragstart`,e=>{e.dataTransfer?.setData(`text/plain`,t.dataset.id),N=t.dataset.id,t.classList.add(`dragging`)}),t.addEventListener(`dragend`,()=>t.classList.remove(`dragging`))});let t=T.querySelector(`#tray-zone`),n=T.querySelector(`#tray-rail`);t?.addEventListener(`dragover`,e=>{e.preventDefault(),n?.classList.add(`drag-over`)}),t?.addEventListener(`dragleave`,()=>n?.classList.remove(`drag-over`)),t?.addEventListener(`drop`,e=>{e.preventDefault(),n?.classList.remove(`drag-over`);let t=e.dataTransfer?.getData(`text/plain`);t&&Q(t)}),T.querySelector(`#btn-to-tray`)?.addEventListener(`click`,()=>{N&&Q(N)}),T.querySelector(`#btn-flip-sel`)?.addEventListener(`click`,()=>{if(!N)return;let e=A.get(N);e.faceDown=!e.faceDown,Z()}),T.querySelector(`#btn-spin-sel`)?.addEventListener(`click`,()=>{if(!N)return;let e=A.get(N);e.upsideDown=!e.upsideDown,Z()}),T.querySelectorAll(`.tray-tools [data-act]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.i),n=e.dataset.act,r=M[t];if(!r)return;let i=A.get(r);n===`flip`&&(i.faceDown=!i.faceDown),n===`spin`&&(i.upsideDown=!i.upsideDown),n===`to-pile`&&(M=M.filter(e=>e!==r),j.push(r)),n===`left`&&t>0&&([M[t-1],M[t]]=[M[t],M[t-1]]),n===`right`&&t<M.length-1&&([M[t+1],M[t]]=[M[t],M[t+1]]),Z()})}),T.querySelectorAll(`.tray-card .desk-thumb, .tray-card .card-3d`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.cardId,n=A.get(t);n.faceDown?n.faceDown=!1:n.upsideDown?n.upsideDown=!1:n.faceDown=!0,Z()})})}function Je(e){if(E!==`sorting`)return;let t=e.target?.tagName;if(t!==`INPUT`&&t!==`TEXTAREA`){if(e.key===`f`||e.key===`F`){if(!N)return;e.preventDefault();let t=A.get(N);t.faceDown=!t.faceDown,Z()}else if(e.key===`r`||e.key===`R`){if(!N)return;e.preventDefault();let t=A.get(N);t.upsideDown=!t.upsideDown,Z()}else e.key===`Enter`&&N&&(e.preventDefault(),Q(N))}}window.addEventListener(`keydown`,Je);function Q(e){j.includes(e)&&(j=j.filter(t=>t!==e),M.push(e),N=null,Z())}function $(){let e=k,t=M.length?M:S(e.roster,e.cards),n=A.get(t[F]),r=C(e.roster,n),i=P.get(n.id)??{selected:[],disposition:`ok`},a=new Set(i.selected),o=e.config.timeLimitSec,s=o==null?W(U()):`${W(U())} / ${W(o)}`,d=`<div class="progress"><span class="pill">검사 · ${g[e.config.inspectionMode]}</span><span class="timer" id="timer">${s}</span><span class="hint-pill">${F+1}/${t.length} · ${e.config.subjectName}</span></div>`,f=u.map(e=>{let t=a.has(e);return`<label class="check check-${e} ${t?`on`:``} ${e===`ok`?`ok`:``}" data-err="${e}">
      <input type="checkbox" value="${e}" ${t?`checked`:``}/>
      <span class="check-body"><strong>${c[e]}</strong><small>${l[e]}</small></span>
    </label>`}).join(``),p=[`ok`,`call_identity`,`score_wrong`,`to_subject`].map(e=>`
<label class="disp disp-${e} ${i.disposition===e?`on`:``}" data-disp="${e}">
  <input type="radio" name="disp" value="${e}" ${i.disposition===e?`checked`:``}/>
  <span><strong>${m[e]}</strong><small>${h[e]}</small></span>
</label>`).join(``),_=e.config.inspectionMode===`immediate`?`인적사항 기재·마킹을 먼저 확인합니다. 답안 마킹은 수정시키지 않습니다. 오답으로 판정한 답안은 학생을 부르지 않고 그대로 채점합니다.`:`교과 교사가 기재 오류 여부와 답안 인식을 확인하고, 필요하면 학교 성적처리 절차로 넘깁니다.`;Y(`
<section class="panel inspection-panel" data-stage="inspection">
  <div class="inspect-layout">
    <aside class="inspect-roster">
      <h2>명렬 한 줄</h2>
      <dl class="student-card">
        <div><dt>학년·반·번호</dt><dd>${r.grade}-${r.classNo}-${String(r.number).padStart(2,`0`)}</dd></div>
        <div><dt>성명</dt><dd>${r.name}</dd></div>
        <div><dt>수험번호</dt><dd>${r.examId}</dd></div>
        <div><dt>과목</dt><dd>${e.config.subjectName} (${String(e.config.subjectCode).padStart(2,`0`)})</dd></div>
        <div><dt>응시</dt><dd>${r.absent?`결시 · ${r.absentNote??``}`:`응시`}</dd></div>
      </dl>
      <p class="warn-note">⚠ 교사가 답안 마킹을 대신 고치지 않습니다.<br/>학생 호출 없이 오답 처리 · 기재 오류만 호출</p>
      <p class="side-note mode-help">${_}</p>
      <div class="dot-nav" id="dot-nav">
        ${t.map((e,t)=>{let n=P.has(e),r=A.get(e);return`<button type="button" class="dot ${t===F?`current`:``} ${n?`done`:``} ${r.isAbsentBlank?`abs`:``}" data-i="${t}" aria-label="${t+1}번">${t+1}</button>`}).join(``)}
      </div>
    </aside>
    <div class="inspect-card-pane">
      <div class="zoom-toolbar">
        <button type="button" class="btn tiny" id="z-out">−</button>
        <button type="button" class="btn tiny" id="z-reset">배율 리셋</button>
        <button type="button" class="btn tiny" id="z-in">+</button>
        <span class="side-note">문제 부위를 클릭하면 이상이 선택됩니다</span>
      </div>
      <div class="zoom-viewport" id="zoom-viewport">
        <div class="zoom-canvas" id="zoom-canvas" style="transform:translate(${B}px,${V}px) scale(${z})">
          ${ke(n,{student:r,showRosterHint:!1})}
        </div>
      </div>
    </div>
    <aside class="inspect-judge inspect-actions">
      <h2>발견한 이상</h2>
      <form id="judge-form" class="judge-form judge-2col">${f}</form>
      <h2>조치</h2>
      <form id="disp-form" class="disp-form">${p}</form>
      <div class="actions inspect-actions">
        <button class="btn ghost" id="btn-prev" type="button" ${F===0?`disabled`:``}>←</button>
        <button class="btn primary" id="btn-submit" type="button">${F<t.length-1?`저장 후 다음`:`제출 · 결과`}</button>
      </div>
    </aside>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,{top:d,desk:!0,stageClass:`stage-inspection`}),G(),Xe(n,t),requestAnimationFrame(Ye)}function Ye(){let e=T.querySelector(`#zoom-viewport`),t=T.querySelector(`#zoom-canvas`),n=t?.querySelector(`.omr-card`);if(!e||!t||!n||z!==1)return;let r=e.clientWidth-24,i=n.scrollWidth||n.offsetWidth;if(i>0&&r>0){let e=Math.min(1.35,Math.max(.9,r/i));Math.abs(e-1)>.02&&B===0&&V===0&&(z=e,t.style.transform=`translate(0px,0px) scale(${z})`)}}function Xe(e,t){let n=(t,n)=>{P.set(e.id,{selected:t,disposition:n})},r=(t,r)=>{let i=P.get(e.id)??{selected:[],disposition:`ok`},a=new Set(i.selected);r??!a.has(t)?t===`ok`?a=new Set([`ok`]):(a.delete(`ok`),a.add(t)):a.delete(t);let o=i.disposition,s=[...a].filter(e=>e!==`ok`);o=a.has(`ok`)&&a.size===1?`ok`:s.some(e=>e===`id_mark`||e===`name_mismatch`||e===`missing_subject`)?`call_identity`:s.some(e=>e===`duplicate_mark`||e===`missing_mark`||e===`incomplete_mark`)?`score_wrong`:`to_subject`,n([...a],o),$()};T.querySelectorAll(`#judge-form input`).forEach(e=>{e.addEventListener(`change`,()=>{r(e.value,e.checked)})}),T.querySelectorAll(`#disp-form input`).forEach(t=>{t.addEventListener(`change`,()=>{let r=P.get(e.id)??{selected:[],disposition:`ok`};n(r.selected,t.value),$()})}),T.querySelector(`#zoom-canvas`)?.querySelectorAll(`[data-region]`).forEach(e=>{e.style.cursor=`pointer`;let t=0,n=0;e.addEventListener(`pointerdown`,e=>{t=e.clientX,n=e.clientY,e.stopPropagation()}),e.addEventListener(`pointerup`,i=>{if(Math.hypot(i.clientX-t,i.clientY-n)>6)return;let a=e.getAttribute(`data-region`);a&&(i.stopPropagation(),r(a))})}),T.querySelector(`#btn-prev`)?.addEventListener(`click`,()=>{F=Math.max(0,F-1),z=1,B=0,V=0,$()}),T.querySelector(`#btn-submit`)?.addEventListener(`click`,()=>{let n=P.get(e.id);if(!n||n.selected.length===0)X(`발견한 이상을 고르세요. 없으면 «이상 없음».`);else if(F<t.length-1)F++,z=1,B=0,V=0,$();else{for(let e=0;e<t.length;e++)if(!P.has(t[e])){F=e,$(),X(`${e+1}번 카드 판정이 비어 있습니다.`);return}Ze()}}),T.querySelectorAll(`#dot-nav .dot`).forEach(e=>{e.addEventListener(`click`,()=>{F=Number(e.dataset.i),z=1,B=0,V=0,$()})}),T.querySelector(`#z-in`)?.addEventListener(`click`,()=>{z=Math.min(2.5,z+.25),$()}),T.querySelector(`#z-out`)?.addEventListener(`click`,()=>{z=Math.max(.75,z-.25),$()}),T.querySelector(`#z-reset`)?.addEventListener(`click`,()=>{z=1,B=0,V=0,$()});let i=T.querySelector(`#zoom-viewport`),a=!1,o=0,s=0;i?.addEventListener(`pointerdown`,e=>{e.target.closest(`[data-region]`)||(a=!0,o=e.clientX,s=e.clientY,i.setPointerCapture(e.pointerId))}),i?.addEventListener(`pointermove`,e=>{if(!a)return;B+=e.clientX-o,V+=e.clientY-s,o=e.clientX,s=e.clientY;let t=T.querySelector(`#zoom-canvas`);t&&(t.style.transform=`translate(${B}px,${V}px) scale(${z})`)}),i?.addEventListener(`pointerup`,()=>{a=!1})}function Ze(){Re();let e=k,t=M.length?M:S(e.roster,e.cards),n=S(e.roster,[...A.values()]);L||=ve(t,n,A);let r=ye(t.map(e=>A.get(e)),t.map(e=>{let t=P.get(e)??{selected:[`ok`],disposition:`ok`};return{cardId:e,selected:t.selected,disposition:t.disposition}}),e.config.inspectionMode);R=be({headcountOk:Ie,sort:L,inspection:r,timeSeconds:U(),cardCount:t.length,timedOut:Le,inspectionMode:e.config.inspectionMode}),Pe(e.config.difficulty,R.total),q(`results`)}function Qe(){let e=R,t=k,n=e.maxTotal?e.total/e.maxTotal:0,r=n>=.95?`A+`:n>=.85?`A`:n>=.7?`B`:n>=.55?`C`:`D`,i=new Map;for(let n of e.inspection){let e=A.get(n.cardId),r=C(t.roster,e),a=`${r.grade}-${r.classNo}`;i.has(a)||i.set(a,[]),i.get(a).push(n)}let a=[...i.entries()].sort((e,t)=>e[0].localeCompare(t[0])).map(([e,n])=>{let r=n.map(e=>{let n=A.get(e.cardId),r=C(t.roster,n),i=[...e.missed,...e.hit.filter(e=>e!==`ok`)];return`
<article class="result-card ${e.perfect?`ok`:`ng`} ${n.isAbsentBlank?`abs`:``}">
  <header><b>${r.grade}-${r.classNo} ${String(r.number).padStart(2,`0`)} ${r.name}${n.isAbsentBlank?` · 결시 빈장`:``}</b>
    <span class="tag ${e.perfect?`good`:`bad`}">${e.perfect?`정확`:`미흡`}</span>
  </header>
  <div class="result-mini">${ke(n,{student:r,highlight:i,compact:!0})}</div>
  <div class="explain hit">맞춤: ${e.hit.map(e=>c[e]).join(`, `)||`—`}</div>
  ${e.missed.length?`<div class="explain miss">놓침: ${e.missed.map(e=>`${c[e]} — ${l[e]}`).join(` / `)}</div>`:``}
  ${e.falsePositive.length?`<div class="explain fp">잘못 선택: ${e.falsePositive.map(e=>c[e]).join(`, `)}</div>`:``}
  <div class="explain ${e.dispositionOk?`hit`:`miss`}">조치: ${m[e.disposition]}
    ${e.dispositionOk?``:`(정답: ${m[e.expectedDisposition]})`}
    ${e.disposition===`score_wrong`?` · <em>학생 호출 없이 오답 처리</em>`:``}
  </div>
</article>`}).join(``);return`<div class="result-class-group"><h3>${e.replace(`-`,`학년 `)}반</h3>${r}</div>`}).join(``);Y(`
<section class="panel results-panel" data-stage="results">
  <div class="score-hero">
    <p class="eyebrow">결과 · ${v[t.config.difficulty].label} · ${g[e.inspectionMode]}${e.timedOut?` · 시간초과`:``} · ${t.config.subjectName}</p>
    <div class="grade-badge" data-grade="${r}">${r}</div>
    <h1><span class="score-num">${e.total}</span> <small>/ ${e.maxTotal}</small></h1>
    <div class="score-bar" aria-hidden="true"><i style="width:${Math.round(n*100)}%"></i></div>
    <p class="lead">소요 ${W(e.timeSeconds)} · 보너스 +${e.timeBonus} · 시드 ${t.config.seed}</p>
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
  <div class="result-list"><h2>카드별 해설</h2>${a}</div>
  <div class="actions">
    <button class="btn primary" id="btn-retry" type="button">같은 시드</button>
    <button class="btn ghost" id="btn-new" type="button">새 시드</button>
    <button class="btn ghost" id="btn-hub2" type="button">허브</button>
  </div>
</section>`),T.querySelector(`#btn-retry`).addEventListener(`click`,()=>{O=t.config.inspectionMode,history.replaceState(null,``,`?diff=${t.config.difficulty}&mode=${t.config.inspectionMode}&seed=${t.config.seed}`),Be(t.config.difficulty,t.config.seed)}),T.querySelector(`#btn-new`).addEventListener(`click`,()=>{O=t.config.inspectionMode,Be(t.config.difficulty)}),T.querySelector(`#btn-hub2`).addEventListener(`click`,K)}K();