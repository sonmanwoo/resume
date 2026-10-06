'use strict';
const frame=document.getElementById('motion'), play=document.getElementById('play'), seek=document.getElementById('seek'), sound=document.getElementById('sound'), time=document.getElementById('time'), statusText=document.getElementById('status');
let playing=false, position=6, last=0, audio, renderer;
function paint(){renderer.seek(position);seek.value=position;time.textContent=position.toFixed(1)+' / 30초';}
function syncAudio(){if(!audio)return;audio.currentTime=position;if(playing&&!audio.muted)audio.play().catch(()=>{statusText.textContent='소리를 재생할 수 없습니다. 영상은 계속 재생됩니다.';});else audio.pause();}
function tick(now){if(!playing)return;position=(position+(now-last)/1000)%30;last=now;paint();requestAnimationFrame(tick);}
function pause(){playing=false;play.textContent='재생';if(audio)audio.pause();}
play.addEventListener('click',()=>{if(playing){pause();return;}playing=true;last=performance.now();play.textContent='일시정지';syncAudio();requestAnimationFrame(tick);});
seek.addEventListener('input',()=>{position=Number(seek.value);paint();syncAudio();});
sound.addEventListener('click',()=>{audio.muted=!audio.muted;sound.setAttribute('aria-pressed',String(!audio.muted));sound.textContent=audio.muted?'소리 켜기':'소리 끄기';syncAudio();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
frame.addEventListener('load',async()=>{try{renderer=frame.contentWindow;await renderer.ready;if(typeof renderer.seek!=='function')throw Error('renderer');audio=new Audio(renderer.SOUNDTRACK);audio.loop=true;audio.muted=true;paint();play.disabled=seek.disabled=sound.disabled=false;statusText.textContent='준비되었습니다. 재생을 누르면 모션이 시작됩니다.';}catch{statusText.textContent='모션을 불러오지 못했습니다. 소개 페이지의 영상이나 MP4 다운로드를 이용해 주세요.';}});
