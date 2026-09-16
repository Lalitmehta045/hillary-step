"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { landPoints, slerp, toVec, type Vec3 } from "./geo";

type Rt = { lat: number; lon: number };
type ArcDef = { from: Rt; to: Rt; hue: string; delay: number; duration: number; label: { city: string; country: string; tint: string; glyph: string } };

const IND_MUM = { lat: 19.07, lon: 72.87 }, IND_DEL = { lat: 28.61, lon: 77.20 }, IND_BLR = { lat: 12.97, lon: 77.59 }, IND_HYD = { lat: 17.38, lon: 78.48 }, IND_MAA = { lat: 13.08, lon: 80.27 };
const USA_LA = { lat: 34.05, lon: -118.24 }, USA_SJ = { lat: 37.33, lon: -121.88 }, USA_NY = { lat: 40.71, lon: -74.00 }, USA_DAL = { lat: 32.77, lon: -96.79 }, USA_BOS = { lat: 42.36, lon: -71.05 }, USA_CHI = { lat: 41.87, lon: -87.62 };
const AUS_SYD = { lat: -33.86, lon: 151.2 }, AUS_MEL = { lat: -37.81, lon: 144.96 }, AUS_BNE = { lat: -27.47, lon: 153.03 }, AUS_PER = { lat: -31.95, lon: 115.86 };

const ARCS: ArcDef[] = [
  { from: IND_MUM, to: USA_NY, hue: "#ff3d9e", delay: 0, duration: 5.5, label: { city: "New York", country: "NY", tint: "#7c6cf6", glyph: "◈" } },
  { from: USA_NY, to: AUS_SYD, hue: "#6f5bf5", delay: 1.8, duration: 6.8, label: { city: "Sydney", country: "NSW", tint: "#3fa0ff", glyph: "●" } },
  { from: AUS_SYD, to: IND_DEL, hue: "#ff8a3d", delay: 3.6, duration: 5.6, label: { city: "Delhi NCR", country: "", tint: "#f0b429", glyph: "◐" } },
  { from: IND_DEL, to: USA_LA, hue: "#e0399f", delay: 5.4, duration: 6.0, label: { city: "Los Angeles", country: "CA", tint: "#ff3d9e", glyph: "▲" } },
  { from: USA_LA, to: AUS_MEL, hue: "#5b8def", delay: 7.2, duration: 6.5, label: { city: "Melbourne", country: "VIC", tint: "#ff7a59", glyph: "◆" } },
  { from: AUS_MEL, to: IND_BLR, hue: "#8b5cf6", delay: 9.0, duration: 5.4, label: { city: "Bengaluru", country: "KA", tint: "#22b07d", glyph: "◼" } },
  { from: IND_BLR, to: USA_SJ, hue: "#ff3d9e", delay: 10.8, duration: 5.8, label: { city: "San Jose", country: "CA", tint: "#e0399f", glyph: "◈" } },
  { from: USA_SJ, to: AUS_BNE, hue: "#6f5bf5", delay: 12.6, duration: 7.2, label: { city: "Brisbane", country: "QLD", tint: "#ff8a3d", glyph: "●" } },
  { from: AUS_BNE, to: IND_HYD, hue: "#ff8a3d", delay: 14.4, duration: 5.6, label: { city: "Hydrabad", country: "TN", tint: "#7c6cf6", glyph: "▲" } },
  { from: IND_HYD, to: USA_DAL, hue: "#e0399f", delay: 16.2, duration: 5.8, label: { city: "Dallas", country: "TX", tint: "#3fa0ff", glyph: "◐" } },
  { from: USA_DAL, to: AUS_PER, hue: "#5b8def", delay: 18.0, duration: 6.2, label: { city: "Perth", country: "WA", tint: "#ff7a59", glyph: "◆" } },
  { from: AUS_PER, to: IND_MAA, hue: "#8b5cf6", delay: 19.8, duration: 6.5, label: { city: "Chennai", country: "TN", tint: "#0f4bd8", glyph: "◼" } },
  { from: IND_MAA, to: USA_CHI, hue: "#ff3d9e", delay: 21.6, duration: 5.8, label: { city: "Chicago", country: "IL", tint: "#7c6cf6", glyph: "◈" } },
  { from: USA_CHI, to: USA_BOS, hue: "#6f5bf5", delay: 23.4, duration: 3.5, label: { city: "Boston", country: "MA", tint: "#3fa0ff", glyph: "●" } },
  { from: USA_BOS, to: IND_MUM, hue: "#ff8a3d", delay: 25.2, duration: 5.6, label: { city: "Mumbai", country: "MH", tint: "#f0b429", glyph: "◐" } },
];

const TILT = 0.2;
const BLUE = [26, 108, 255], GREEN = [64, 246, 0], ORANGE = [255, 149, 0];
type Label = { id: number; x: number; y: number; o: number; def: ArcDef["label"] };

export function Globe({ active = "India" }: { active?: string }) {
  const wrap = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), threeCanvas = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const targetLon = active === "United States" ? -95 : active === "Australia" ? 135 : 80;
  const targetSpin = -targetLon * (Math.PI / 180);
  const targetSpinRef = useRef(targetSpin), focusRef = useRef(targetSpin), lastTime = useRef(performance.now()), pausedRef = useRef(false);

  useEffect(() => { targetSpinRef.current = -targetLon * (Math.PI / 180); }, [active, targetLon]);

  useEffect(() => {
    const el = wrap.current, cv = canvas.current, threeCv = threeCanvas.current;
    if (!el || !cv || !threeCv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const threeScene = new THREE.Scene();
    const threeCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const threeRenderer = new THREE.WebGLRenderer({ canvas: threeCv, alpha: true, antialias: true, powerPreference: "high-performance" });
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.28;

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/assets/earth-blue-marble.jpg", () => { earthMat.needsUpdate = true; });
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    const earthLightsTexture = textureLoader.load("/assets/earth-lights.png", () => { earthMat.needsUpdate = true; });
    earthLightsTexture.colorSpace = THREE.SRGBColorSpace;

    const tiltGroup = new THREE.Group();
    threeScene.add(tiltGroup);
    const earthGeo = new THREE.SphereGeometry(0.998, 64, 64);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: { dayTexture: { value: earthTexture }, nightTexture: { value: earthLightsTexture }, sunDirection: { value: new THREE.Vector3(0, 0, 1) } },
      vertexShader: `varying vec2 vUv; varying vec3 vNormal; void main(){ vUv=uv; vNormal=normalize(normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform sampler2D dayTexture; uniform sampler2D nightTexture; uniform vec3 sunDirection;
        varying vec2 vUv; varying vec3 vNormal;
        void main(){
          vec4 daySample=texture2D(dayTexture,vUv); vec4 nightSample=texture2D(nightTexture,vUv);
          float sunDot=dot(normalize(vNormal),normalize(sunDirection));
          float dayFactor=smoothstep(-0.15,0.18,sunDot);

          // Royal blue target: #1A52D5. Preserve satellite texture/cloud detail while
          // pulling the sunlit ocean toward the exact brand blue requested.
          float blueDominance=daySample.b-max(daySample.r,daySample.g)*0.72;
          float oceanMask=smoothstep(0.025,0.16,blueDominance);
          float luminance=dot(daySample.rgb,vec3(0.299,0.587,0.114));
          vec3 royalBlue=vec3(0.102,0.322,0.835);
          vec3 texturedRoyal=royalBlue*(0.72+0.42*luminance);
          vec3 oceanColor=mix(daySample.rgb,texturedRoyal,0.78*oceanMask);
          float daylight=max(0.06,sunDot*0.95+0.12);
          vec3 dayColor=oceanColor*daylight*1.32;

          vec3 nightTerrain=daySample.rgb*0.045;
          vec3 rawLights=nightSample.rgb;
          vec3 cityLights=pow(rawLights,vec3(0.92))*3.8;
          cityLights*=vec3(1.28,1.10,0.85);
          vec3 nightColor=nightTerrain+cityLights;
          vec3 finalColor=mix(nightColor,dayColor,dayFactor);
          gl_FragColor=vec4(finalColor,1.0);
        }
      `,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    tiltGroup.add(earthMesh);

    // A very thin second spherical shell creates the subtle rounded outline visible
    // around the Earth in the reference, without adding latitude/longitude wireframe.
    const horizonGeo = new THREE.SphereGeometry(1.035, 96, 64);
    const horizonMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color("#1A52D5") } },
      vertexShader: `varying vec3 vNormal; void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 glowColor; varying vec3 vNormal;
        void main(){
          float facing=abs(dot(normalize(vNormal),vec3(0.0,0.0,1.0)));
          float rim=1.0-smoothstep(0.0,0.24,facing);
          float thin=pow(rim,2.8);
          gl_FragColor=vec4(glowColor,thin*0.82);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    tiltGroup.add(horizonMesh);

    const atmosphereGeo = new THREE.SphereGeometry(1.055, 96, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec3 vNormal;
        void main(){
          float facing=abs(dot(normalize(vNormal),vec3(0.0,0.0,1.0)));
          float rim=1.0-smoothstep(0.0,0.34,facing);
          float intensity=pow(rim,3.4);
          gl_FragColor=vec4(0.08,0.32,0.84,intensity*0.34);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    tiltGroup.add(atmosphereMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff,0.15);
    threeScene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfffaed,4.0);
    tiltGroup.add(sunLight);
    const rimLight1 = new THREE.DirectionalLight(0x7c6cf6,1.2);
    rimLight1.position.set(5,2,-5); threeScene.add(rimLight1);
    const rimLight2 = new THREE.DirectionalLight(0x3fa0ff,0.8);
    rimLight2.position.set(-5,-2,-5); threeScene.add(rimLight2);

    const onEnter=()=>{pausedRef.current=true;}, onLeave=()=>{pausedRef.current=false;};
    el.addEventListener("pointerenter",onEnter); el.addEventListener("pointerleave",onLeave);

    const bgStars:{x:number,y:number,s:number,a:number,speed:number}[]=[];
    for(let i=0;i<250;i++) bgStars.push({x:Math.random(),y:Math.random(),s:Math.random()*1.5+0.5,a:Math.random()*Math.PI*2,speed:0.5+Math.random()*2});

    const dots=landPoints(60000), n=dots.length;
    const ph0=new Float32Array(n), ph1=new Float32Array(n), ph2=new Float32Array(n), spd=new Float32Array(n), amp=new Float32Array(n);
    for(let i=0;i<n;i++){ph0[i]=Math.random()*Math.PI*2;ph1[i]=Math.random()*Math.PI*2;ph2[i]=Math.random()*Math.PI*2;spd[i]=0.35+Math.random()*0.9;amp[i]=0.006+Math.random()*0.03;}
    const drifted:Vec3={x:0,y:0,z:0};
    const arcs=ARCS.map(a=>({def:a,a:toVec(a.from.lat,a.from.lon),b:toVec(a.to.lat,a.to.lon)}));
    let w=0,h=0,dpr=1;
    const resize=()=>{dpr=Math.min(2,window.devicePixelRatio||1);w=el.clientWidth;h=el.clientHeight;cv.width=Math.floor(w*dpr);cv.height=Math.floor(h*dpr);cv.style.width=`${w}px`;cv.style.height=`${h}px`;threeRenderer.setPixelRatio(dpr);threeRenderer.setSize(w,h,false);};
    resize(); const ro=new ResizeObserver(resize); ro.observe(el);
    let raf=0,isVisible=true;
    const io=new IntersectionObserver(entries=>{if(entries[0])isVisible=entries[0].isIntersecting;}); io.observe(el);
    const start=performance.now(); lastTime.current=start;
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame=(now:number)=>{
      raf=requestAnimationFrame(frame); if(!isVisible)return;
      const dt=(now-lastTime.current)/1000; lastTime.current=now; const t=(now-start)/1000+15;
      if(!reduce&&!pausedRef.current)targetSpinRef.current+=dt*0.1;
      const nowD=new Date(); const utcHours=nowD.getUTCHours()+nowD.getUTCMinutes()/60+nowD.getUTCSeconds()/3600; const sunLon=(12-utcHours)*15; const sunVecGeo=toVec(0,sunLon);
      let diff=targetSpinRef.current-focusRef.current; while(diff>Math.PI)diff-=Math.PI*2; while(diff< -Math.PI)diff+=Math.PI*2; focusRef.current+=diff*0.08;
      const spin=focusRef.current,isMobile=w<768,R=isMobile?Math.min(w,h)*0.42:Math.min(w,h)*0.35,cx=w*0.5,cy=h*0.5,cam=4.2,cosT=Math.cos(TILT),sinT=Math.sin(TILT),cosS=Math.cos(spin),sinS=Math.sin(spin);
      const sunX=sunVecGeo.x*cosS+sunVecGeo.z*sinS,sunZ=-sunVecGeo.x*sinS+sunVecGeo.z*cosS; sunLight.position.set(sunX*5,sunVecGeo.y*5,sunZ*5);
      const project=(p:Vec3)=>{const x1=p.x*cosS+p.z*sinS,z1=-p.x*sinS+p.z*cosS,y2=p.y*cosT-z1*sinT,z2=p.y*sinT+z1*cosT,persp=cam/(cam-z2);return{x:cx+x1*R*persp,y:cy-y2*R*persp,z:z2,s:persp};};
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
      const currentLon=-focusRef.current*(180/Math.PI); let diffLon=Math.abs(currentLon-sunLon)%360; if(diffLon>180)diffLon=360-diffLon; let nightFactor=(diffLon-70)/30; nightFactor=Math.max(0,Math.min(1,nightFactor));
      if(nightFactor>0) for(const s of bgStars){const sx=s.x*w,sy=s.y*h,distSq=(sx-cx)*(sx-cx)+(sy-cy)*(sy-cy);if(distSq<R*R*1.05)continue;const twinkle=0.3+0.7*Math.sin(t*s.speed+s.a);if(twinkle>0){ctx.fillStyle=`rgba(255,255,255,${(0.5*twinkle*nightFactor).toFixed(3)})`;ctx.beginPath();ctx.arc(sx,sy,s.s,0,Math.PI*2);ctx.fill();}}
      tiltGroup.rotation.x=TILT; earthMesh.rotation.y=spin-Math.PI/2; tiltGroup.updateMatrixWorld(true);
      const sunWorld=new THREE.Vector3(); sunLight.getWorldPosition(sunWorld); const localSun=earthMesh.worldToLocal(sunWorld).normalize(); earthMat.uniforms.sunDirection.value.copy(localSun);
      const fov=2*Math.atan((h/2)/(R*cam))*(180/Math.PI); threeCamera.fov=fov; threeCamera.aspect=w/h; threeCamera.position.set(0,0,cam); threeCamera.lookAt(0,0,0); threeCamera.updateProjectionMatrix(); threeRenderer.render(threeScene,threeCamera);
      const edgeVignette=ctx.createRadialGradient(cx,cy,R*0.82,cx,cy,R); edgeVignette.addColorStop(0,"rgba(5,10,25,0)");edgeVignette.addColorStop(0.85,"rgba(5,10,25,0.2)");edgeVignette.addColorStop(1,"rgba(10,15,35,0.5)");ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=edgeVignette;ctx.fill();
      for(let i=0;i<n;i++){
        const d=dots[i]!,sp=spd[i]!,a=amp[i]!,f1=Math.sin(t*sp+ph0[i]!),f2=Math.sin(t*sp*0.83+ph1[i]!),f3=Math.sin(t*sp*1.27+ph2[i]!),lift=1+a*1.6*(0.5+0.5*f3); drifted.x=d.x*lift+a*f1;drifted.y=d.y*lift+a*f2;drifted.z=d.z*lift+a*f3;const p=project(drifted);if(p.z<0.22)continue;
        const g=0.5+((p.x-cx)/R)*0.5-((p.y-cy)/R)*0.5,k=Math.min(1,Math.max(0,g));
        const rCol=k<0.5?BLUE[0]!(+((GREEN[0]!-BLUE[0]!)*(k/0.5))):GREEN[0]!+((ORANGE[0]!-GREEN[0]!)*((k-0.5)/0.5));
        const gCol=k<0.5?BLUE[1]!+((GREEN[1]!-BLUE[1]!)*(k/0.5)):GREEN[1]!+((ORANGE[1]!-GREEN[1]!)*((k-0.5)/0.5));
        const bCol=k<0.5?BLUE[2]!+((GREEN[2]!-BLUE[2]!)*(k/0.5)):GREEN[2]!+((ORANGE[2]!-GREEN[2]!)*((k-0.5)/0.5));
        const twinkle=0.78+0.22*f2,fade=Math.min(1,(p.z-0.22)/0.2);let opacity=Math.min(1,(0.9+0.5*fade)*twinkle);const sunDot=drifted.x*sunVecGeo.x+drifted.y*sunVecGeo.y+drifted.z*sunVecGeo.z,sunIntensity=Math.max(0,Math.min(1,(sunDot+0.2)/0.4)),rSize=Math.max(0.45,0.8*p.s*(R/620));if(sunDot<0)opacity*=Math.max(0,1-(-sunDot)*4);else opacity*=Math.max(0.25,sunIntensity);
        ctx.fillStyle=`rgba(${rCol|0},${gCol|0},${bCol|0},${opacity.toFixed(3)})`;ctx.fillRect(p.x-rSize,p.y-rSize,rSize*2,rSize*2);
      }
      const nextLabels:Label[]=[];const cycle=28;
      arcs.forEach((arc,idx)=>{
        const timeOffset=t-arc.def.delay,local=((timeOffset%cycle)+cycle)%cycle,headProg=local/arc.def.duration,tailProg=headProg-0.55,head=Math.min(1,Math.max(0,headProg)),tail=Math.min(1,Math.max(0,tailProg)),lift=0.28;
        const pointAt=(u:number)=>{const base=slerp(arc.a,arc.b,u),alt=1+lift*Math.sin(Math.PI*u);return{x:base.x*alt,y:base.y*alt,z:base.z*alt};};
        const ring=(v:Vec3,alpha:number)=>{const pr=project(v);if(pr.z<0||alpha<=0)return null;const rr=5*pr.s*(R/620);ctx.beginPath();ctx.arc(pr.x,pr.y,rr,0,Math.PI*2);ctx.strokeStyle=`${arc.def.hue}${Math.round(alpha*255).toString(16).padStart(2,"0")}`;ctx.lineWidth=Math.max(1.2,R/520);ctx.stroke();ctx.beginPath();ctx.arc(pr.x,pr.y,rr*0.36,0,Math.PI*2);ctx.fillStyle=`${arc.def.hue}${Math.round(alpha*255).toString(16).padStart(2,"0")}`;ctx.fill();return pr;};
        if(tail<1&&head>0){ctx.lineWidth=Math.max(1.3,R/420);ctx.lineCap="round";const steps=64;ctx.beginPath();let started=false;for(let s=0;s<=steps;s++){const u=tail+((head-tail)*s)/steps,pr=project(pointAt(u)),isOccluded=pr.z<0.22&&Math.hypot(pr.x-cx,pr.y-cy)<R*0.99;if(isOccluded){started=false;continue;}if(!started){ctx.moveTo(pr.x,pr.y);started=true;}else ctx.lineTo(pr.x,pr.y);}const pa=project(pointAt(tail)),pb=project(pointAt(head)),dx=pb.x-pa.x,dy=pb.y-pa.y;if(dx*dx+dy*dy>0.5){const grad=ctx.createLinearGradient(pa.x,pa.y,pb.x,pb.y);grad.addColorStop(0,`${arc.def.hue}00`);grad.addColorStop(1,`${arc.def.hue}ee`);ctx.strokeStyle=grad;ctx.stroke();}ring(arc.a,Math.min(1,headProg*6)*(1-tail));}
        let destAlpha=0;const tailArrivalTime=arc.def.duration*1.55,labelEndTime=tailArrivalTime+1.5;if(headProg>0.9){const fadeIn=Math.min(1,(headProg-0.9)/0.1),fadeOut=local<=labelEndTime?Math.min(1,(labelEndTime-local)/0.6):0;destAlpha=Math.min(fadeIn,fadeOut);}const dest=ring(arc.b,destAlpha);if(dest&&headProg>=0.9)nextLabels.push({id:idx,x:dest.x,y:dest.y,o:Math.max(0,Math.min(1,destAlpha)),def:arc.def.label});
      });
      nextLabels.sort((a,b)=>a.y-b.y);for(let i=0;i<nextLabels.length;i++)for(let j=0;j<i;j++){const a=nextLabels[j],b=nextLabels[i];if(Math.abs(a.x-b.x)<160&&Math.abs(a.y-b.y)<42)b.y=a.y+42;}nextLabels.sort((a,b)=>a.id-b.id);
      setLabels(prev=>{if(prev.length===nextLabels.length&&prev.every((p,i)=>p.id===nextLabels[i]!.id&&Math.abs(p.x-nextLabels[i]!.x)<0.5&&Math.abs(p.y-nextLabels[i]!.y)<0.5&&Math.abs(p.o-nextLabels[i]!.o)<0.02))return prev;return nextLabels;});
    };
    raf=requestAnimationFrame(frame);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();el.removeEventListener("pointerenter",onEnter);el.removeEventListener("pointerleave",onLeave);threeRenderer.dispose();earthGeo.dispose();earthMat.dispose();earthTexture.dispose();horizonGeo.dispose();horizonMat.dispose();atmosphereGeo.dispose();atmosphereMat.dispose();};
  },[]);

  return <div ref={wrap} className="relative h-full w-full overflow-hidden transition-colors duration-700 bg-slate-950">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_52%,rgba(255,180,100,0.10),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(20,55,120,0.16),transparent_38%)] pointer-events-none z-0" />
    <canvas ref={threeCanvas} className="absolute inset-0 block h-full w-full pointer-events-none z-[5]" aria-hidden />
    <canvas ref={canvas} className="block h-full w-full relative z-10" aria-hidden />
    <div className="pointer-events-none absolute inset-0 z-20">{labels.map(l=><div key={l.id} className="absolute flex -translate-y-1/2 items-center gap-2 rounded-lg px-2 py-1.5 shadow-[0_8px_24px_-8px_rgba(38,20,90,0.35)] ring-1 backdrop-blur transition-colors bg-slate-900/95 ring-white/10" style={{left:l.x+14,top:l.y-22,opacity:l.o}}><span className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-primary-foreground" style={{backgroundColor:l.def.tint}}>{l.def.glyph}</span><span className="text-[13px] font-semibold text-slate-100">{l.def.city}{l.def.country?",":""}</span>{l.def.country&&<span className="text-[13px] text-slate-400">{l.def.country}</span>}</div>)}</div>
  </div>;
}
