const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const $ = (id) => document.getElementById(id);
const W = canvas.width, H = canvas.height;
const scoreUI = $("score"), coinsUI = $("coins"), bestUI = $("best");
const screen = $("screen"), startButton = $("start");
const screenTitle = $("screen-title"), screenCopy = $("screen-copy");
const screenKicker = $("screen-kicker"), toast = $("toast");

const lanes = [W * .36, W * .50, W * .64];
const state = { running:false, score:0, coins:0, best:Number(localStorage.getItem("templeDashBest") || 0),
  speed:5, frame:0, spawn:0, road:0, objects:[], dust:[], toastTimer:0 };
const player = { lane:1, x:lanes[1], y:H-105, jump:0, vy:0, jumping:false, tilt:0 };
bestUI.textContent = pad(state.best);

function pad(n){ return String(Math.floor(n)).padStart(6,"0"); }
function resizeCanvas(){ /* Fixed internal resolution keeps gameplay consistent; CSS scales it responsively. */ }
function reset(){
  state.score=0; state.coins=0; state.speed=5; state.frame=0; state.spawn=0; state.road=0; state.objects=[]; state.dust=[];
  player.lane=1; player.x=lanes[1]; player.jump=0; player.vy=0; player.jumping=false; player.tilt=0;
  scoreUI.textContent=pad(0); coinsUI.textContent="00";
}
function start(){
  reset(); state.running=true; screen.classList.add("hidden"); requestAnimationFrame(loop);
}
function finish(){
  if(!state.running) return;
  state.running=false;
  if(state.score>state.best){state.best=state.score;localStorage.setItem("templeDashBest",state.best);}
  bestUI.textContent=pad(state.best);
  screenKicker.textContent="THE TRAIL HAS CLAIMED ANOTHER RUNNER";
  screenTitle.textContent="Run complete.";
  screenCopy.textContent=`Distance ${state.score.toLocaleString()} · ${state.coins} coins collected. Ready to beat your best?`;
  startButton.innerHTML='Run again <span>↗</span>';
  screen.classList.remove("hidden");
}
function changeLane(dir){if(state.running)player.lane=Math.max(0,Math.min(2,player.lane+dir));}
function jump(){if(state.running&&!player.jumping){player.jumping=true;player.vy=14;}}
document.addEventListener("keydown",e=>{
  if(["ArrowLeft","ArrowRight","ArrowUp"," "].includes(e.key))e.preventDefault();
  if(e.key==="ArrowLeft"||e.key.toLowerCase()==="a")changeLane(-1);
  if(e.key==="ArrowRight"||e.key.toLowerCase()==="d")changeLane(1);
  if(e.key==="ArrowUp"||e.key===" "||e.key.toLowerCase()==="w")jump();
});
startButton.addEventListener("click",start);

// Swipe controls for phones and tablets.
let touchStart=null;
canvas.addEventListener("touchstart",e=>{const t=e.changedTouches[0];touchStart={x:t.clientX,y:t.clientY};},{passive:true});
canvas.addEventListener("touchend",e=>{
  if(!touchStart||!state.running)return;
  const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;
  if(Math.abs(dy)>25&&dy<0)jump();else if(Math.abs(dx)>20)changeLane(dx>0?1:-1);
  touchStart=null;
},{passive:true});

function polygon(points,fill,stroke=null,lineWidth=1){
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();
  ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
}
function drawTree(x,y,s){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="#493c28";ctx.fillRect(-6,-4,12,68);
  ctx.fillStyle="#244a2d";
  for(const [dx,dy,r] of [[0,-25,31],[-19,-5,25],[18,-4,26],[0,13,22]]){ctx.beginPath();ctx.arc(dx,dy,r,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle="#37613a";ctx.beginPath();ctx.arc(-9,-29,15,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function drawTemple(){
  // Distant mist and layered hills
  const mist=ctx.createLinearGradient(0,90,0,340);mist.addColorStop(0,"#a9c17b88");mist.addColorStop(1,"#8b9c5b00");
  ctx.fillStyle=mist;ctx.fillRect(0,70,W,280);
  polygon([[0,260],[90,180],[180,235],[285,155],[390,245],[500,170],[620,238],[750,160],[900,240],[1000,185],[1000,400],[0,400]],"#577746");
  polygon([[0,300],[110,235],[210,280],[330,210],[450,290],[590,225],[720,285],[850,205],[1000,280],[1000,420],[0,420]],"#3d633c");
  // temple silhouette
  ctx.fillStyle="#526448";ctx.fillRect(421,143,158,91);ctx.fillRect(401,163,198,12);
  polygon([[412,145],[500,91],[588,145]],"#596b4b");
  ctx.fillRect(438,182,17,52);ctx.fillRect(482,182,17,52);ctx.fillRect(526,182,17,52);ctx.fillRect(570,182,4,52);
  ctx.fillStyle="#b9b276";ctx.fillRect(498,191,7,43);
  // framing jungle
  drawTree(65,230,1.25);drawTree(150,251,.88);drawTree(900,230,1.25);drawTree(820,250,.9);
}
function drawTrack(){
  // track shoulder
  polygon([[W*.455,220],[W*.545,220],[W*1.02,H],[W*-.02,H]],"#b99a5c");
  polygon([[W*.47,220],[W*.53,220],[W*.86,H],[W*.14,H]],"#65533b");
  // track light / center gradient
  const road=ctx.createLinearGradient(0,220,0,H);road.addColorStop(0,"#786243");road.addColorStop(1,"#493c2c");
  polygon([[W*.48,220],[W*.52,220],[W*.82,H],[W*.18,H]],road);
  // lane dividers taper into perspective
  ctx.strokeStyle="#d7c18b99";ctx.lineWidth=2;
  for(let i=1;i<=2;i++){ctx.beginPath();ctx.moveTo(W*(.5+(i-1.5)*.022),220);ctx.lineTo(W*(.18+i*.213),H);ctx.stroke();}
  // running tiles with perspective scaling
  for(let i=0;i<10;i++){
    const y=220+((i*58+state.road)%410),t=(y-220)/380,w=2+t*8;
    ctx.fillStyle=i%2?"#e0ca8c66":"#e8d5a477";
    ctx.fillRect(W/2-w/2,y,w,4+t*14);
  }
  // edge stones
  for(let i=0;i<13;i++){
    const y=235+((i*46+state.road*1.15)%370),t=(y-220)/380;
    ctx.fillStyle="#d3bb7c";ctx.fillRect(W*.5-(W*.04+t*W*.34),y,3+t*5,3+t*5);
    ctx.fillRect(W*.5+(W*.04+t*W*.34),y,3+t*5,3+t*5);
  }
}
function drawBackground(){
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#7ba56c");sky.addColorStop(.35,"#c2b777");sky.addColorStop(.63,"#697c43");sky.addColorStop(1,"#1b3021");
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  // sun
  const glow=ctx.createRadialGradient(500,145,5,500,145,130);glow.addColorStop(0,"#f7e5a4aa");glow.addColorStop(1,"#f7e5a400");
  ctx.fillStyle=glow;ctx.fillRect(350,0,300,300);
  ctx.fillStyle="#f4dc98";ctx.beginPath();ctx.arc(500,145,32,0,Math.PI*2);ctx.fill();
  drawTemple();
  // moving foliage gives depth
  for(let i=0;i<10;i++){const x=(i*117+state.frame*.22)%W;const y=290+(i%3)*23;ctx.fillStyle="#24452b";ctx.globalAlpha=.38;ctx.beginPath();ctx.ellipse(x,y,40,12,.2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  drawTrack();
  // vignette
  const v=ctx.createRadialGradient(W/2,H*.55,130,W/2,H*.55,620);v.addColorStop(.55,"#07110900");v.addColorStop(1,"#07110977");
  ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
function spawn(){
  const lane=Math.floor(Math.random()*3);
  const type=Math.random()<.42?"coin":(Math.random()<.55?"rock":"log");
  state.objects.push({lane,type,y:238,hit:false,phase:Math.random()*6});
}
function drawCoin(obj,t){
  const spin=.35+Math.abs(Math.sin(state.frame*.12+obj.phase))*.65;
  ctx.save();ctx.translate(obj.x,obj.y);ctx.scale(t*1.4*spin,t*1.4);
  ctx.shadowColor="#ffd15b";ctx.shadowBlur=20;
  ctx.fillStyle="#d88b1e";ctx.beginPath();ctx.ellipse(0,0,15,19,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#ffe99a";ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle="#fff1ad";ctx.fillRect(-2,-10,4,20);ctx.restore();
}
function drawObstacle(obj){
  const t=Math.max(.18,(obj.y-220)/370);obj.x=lanes[obj.lane];ctx.save();ctx.translate(obj.x,obj.y);ctx.scale(t*1.5,t*1.5);
  ctx.fillStyle="#141c13aa";ctx.beginPath();ctx.ellipse(0,18,31,10,0,0,Math.PI*2);ctx.fill();
  if(obj.type==="rock"){
    polygon([[-27,13],[-22,-10],[-7,-24],[13,-20],[27,-2],[22,15],[4,23]],"#454c3c","#7d8269",2);
    polygon([[-17,-8],[-5,-18],[9,-13],[1,2],[-12,3]],"#737b62");
    ctx.fillStyle="#8e9377";ctx.fillRect(-17,7,10,3);
  }else{
    ctx.fillStyle="#754a2b";ctx.beginPath();ctx.roundRect(-32,-13,64,27,7);ctx.fill();
    ctx.strokeStyle="#bb8850";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-22,-9);ctx.lineTo(22,9);ctx.moveTo(-20,9);ctx.lineTo(15,-8);ctx.stroke();
    ctx.fillStyle="#c99b5e";ctx.beginPath();ctx.ellipse(-30,0,7,13,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function drawPlayer(){
  const target=lanes[player.lane];player.x+=(target-player.x)*.22;
  if(player.jumping){player.jump+=player.vy;player.vy-=.72;if(player.jump<=0){player.jump=0;player.jumping=false;}}
  const x=player.x,y=player.y-player.jump;
  // shadow responds to jump height
  ctx.fillStyle="#0d180f99";ctx.beginPath();ctx.ellipse(x,player.y+24,26-player.jump*.12,9-player.jump*.025,0,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(x,y);ctx.rotate(player.tilt);
  // backpack
  ctx.fillStyle="#914d2b";ctx.beginPath();ctx.roundRect(11,-17,15,30,5);ctx.fill();
  // legs
  ctx.lineCap="round";ctx.strokeStyle="#233a30";ctx.lineWidth=12;
  const run=Math.sin(state.frame*.35)*5;
  ctx.beginPath();ctx.moveTo(-7,12);ctx.lineTo(-10-run,36);ctx.moveTo(7,12);ctx.lineTo(11+run,36);ctx.stroke();
  ctx.strokeStyle="#b88b55";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-15-run,38);ctx.lineTo(-5-run,38);ctx.moveTo(6+run,38);ctx.lineTo(17+run,38);ctx.stroke();
  // tunic with highlights
  ctx.fillStyle="#1e5c46";ctx.beginPath();ctx.roundRect(-18,-20,36,39,9);ctx.fill();
  ctx.fillStyle="#4c8b5b";ctx.beginPath();ctx.moveTo(-10,-16);ctx.lineTo(-2,-16);ctx.lineTo(6,15);ctx.lineTo(-3,15);ctx.closePath();ctx.fill();
  // arms
  ctx.strokeStyle="#c38f63";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-16,-11);ctx.lineTo(-23,5+run*.4);ctx.moveTo(16,-11);ctx.lineTo(22,4-run*.4);ctx.stroke();
  // head and hair
  ctx.fillStyle="#d9a174";ctx.beginPath();ctx.arc(0,-32,15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#39291e";ctx.beginPath();ctx.arc(0,-37,15,Math.PI,Math.PI*2);ctx.lineTo(13,-31);ctx.lineTo(-13,-31);ctx.closePath();ctx.fill();
  ctx.fillStyle="#efc75b";ctx.fillRect(-14,-32,28,5);
  ctx.fillStyle="#38291f";ctx.fillRect(-6,-28,2,2);ctx.fillRect(5,-28,2,2);
  ctx.restore();
}
function showToast(text){
  toast.textContent=text;toast.classList.add("show");state.toastTimer=45;
}
function update(){
  state.frame++;state.score+=1;state.speed=Math.min(10,5+state.score/850);state.road=(state.road+state.speed)%58;
  state.spawn++;
  if(state.spawn>Math.max(35,75-state.speed*4)){spawn();state.spawn=0;}
  for(const obj of state.objects){
    obj.y+=state.speed*(.7+obj.y/H*.65);
    if(!obj.hit&&obj.y>player.y-15&&obj.y<player.y+35&&obj.lane===player.lane){
      if(obj.type==="coin"){obj.hit=true;state.coins++;state.score+=20;coinsUI.textContent=String(state.coins).padStart(2,"0");showToast("+20 DISTANCE · COIN");}
      else if(player.jump<42){finish();return;}
    }
  }
  state.objects=state.objects.filter(o=>o.y<H+70&&!o.hit);
  scoreUI.textContent=pad(state.score);
  if(state.toastTimer>0&&--state.toastTimer===0)toast.classList.remove("show");
}
function render(){
  drawBackground();
  // Draw distant objects first; nearer objects are larger.
  [...state.objects].sort((a,b)=>a.y-b.y).forEach(obj=>{
    const t=Math.max(.18,(obj.y-220)/370);obj.x=lanes[obj.lane];
    if(obj.type==="coin")drawCoin(obj,t);else drawObstacle(obj);
  });
  drawPlayer();
}
function loop(){if(!state.running)return;update();render();if(state.running)requestAnimationFrame(loop);}

// Initial scene
bestUI.textContent=pad(state.best);
drawBackground();drawPlayer();
