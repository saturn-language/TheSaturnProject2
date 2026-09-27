import * as THREE from "three";
const stage=document.getElementById("saturn-stage"),host=document.getElementById("saturn-canvas");
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,stage.clientWidth/stage.clientHeight,.1,100);
camera.position.set(0,.2,5.5);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;host.appendChild(renderer.domElement);
const group=new THREE.Group();scene.add(group);

// deep-space stars
const count=2800,pos=new Float32Array(count*3);
for(let i=0;i<count;i++){const r=9+Math.random()*18,a=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r;pos[i*3+2]=(Math.random()-.5)*22}
const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(pos,3));
scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.018,transparent:true,opacity:.8})));

// procedural Saturn texture
const c=document.createElement("canvas");c.width=1024;c.height=512;const x=c.getContext("2d");
const g=x.createLinearGradient(0,0,1024,0);g.addColorStop(0,"#49392f");g.addColorStop(.16,"#a88970");g.addColorStop(.29,"#d0b397");g.addColorStop(.39,"#826854");g.addColorStop(.52,"#c3a487");g.addColorStop(.63,"#725a4a");g.addColorStop(.76,"#b5977b");g.addColorStop(1,"#43342c");x.fillStyle=g;x.fillRect(0,0,1024,512);
for(let y=0;y<512;y+=7){x.fillStyle=`rgba(255,235,210,${.018+Math.random()*.05})`;x.fillRect(0,y,1024,2+Math.random()*5)}
const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
const sphere=new THREE.Mesh(new THREE.SphereGeometry(1.38,96,64),new THREE.MeshStandardMaterial({map:tex,roughness:.92}));group.add(sphere);
const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.405,64,48),new THREE.MeshBasicMaterial({color:0xd6bca5,transparent:true,opacity:.055,side:THREE.BackSide}));group.add(atmosphere);

// ring texture
const rc=document.createElement("canvas");rc.width=1024;rc.height=64;const rctx=rc.getContext("2d"),rg=rctx.createLinearGradient(0,0,1024,0);
rg.addColorStop(0,"rgba(205,182,157,0)");rg.addColorStop(.08,"rgba(185,157,132,.35)");rg.addColorStop(.18,"rgba(230,207,181,.8)");rg.addColorStop(.27,"rgba(112,91,77,.25)");rg.addColorStop(.38,"rgba(225,201,174,.72)");rg.addColorStop(.46,"rgba(82,65,55,.18)");rg.addColorStop(.57,"rgba(218,194,167,.68)");rg.addColorStop(.7,"rgba(119,95,78,.25)");rg.addColorStop(.84,"rgba(226,202,176,.72)");rg.addColorStop(1,"rgba(160,133,111,0)");
rctx.fillStyle=rg;rctx.fillRect(0,0,1024,64);const ringTex=new THREE.CanvasTexture(rc);ringTex.colorSpace=THREE.SRGBColorSpace;
const ring=new THREE.Mesh(new THREE.RingGeometry(1.7,3,192,8),new THREE.MeshStandardMaterial({map:ringTex,transparent:true,side:THREE.DoubleSide,roughness:1,alphaTest:.01}));
ring.rotation.x=Math.PI/2.25;ring.rotation.z=-.12;group.add(ring);
const inner=new THREE.Mesh(new THREE.RingGeometry(1.52,1.7,192,4),new THREE.MeshBasicMaterial({color:0xbca58d,transparent:true,opacity:.32,side:THREE.DoubleSide}));inner.rotation.copy(ring.rotation);group.add(inner);

// lighting
scene.add(new THREE.AmbientLight(0x6b5d52,.45));const sun=new THREE.DirectionalLight(0xffe2c6,4.2);sun.position.set(-4,2.5,5);scene.add(sun);
const rim=new THREE.DirectionalLight(0x8b73a8,1.15);rim.position.set(4,-1,-4);scene.add(rim);

// interaction
let tx=0,ty=0;stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5});stage.addEventListener("pointerleave",()=>{tx=ty=0});
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();sphere.rotation.y=t*.075;atmosphere.rotation.y=t*.075;ring.rotation.z=-.12+Math.sin(t*.18)*.012;group.rotation.y+=(tx*.18-group.rotation.y)*.035;group.rotation.x+=(-ty*.1-group.rotation.x)*.035;renderer.render(scene,camera)}animate();
function resize(){const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);renderer.setPixelRatio(Math.min(devicePixelRatio,2))}addEventListener("resize",resize);