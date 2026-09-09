"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import type { SiteConfig } from "@/lib/site-config";

export function DepthGallery({ products, config }: { products: Product[]; config: SiteConfig }) {
  const items = useMemo(()=>products.slice(0,config.carousel.maxProducts),[products,config.carousel.maxProducts]);
  const [rotation,setRotation] = useState(0);
  const [dragging,setDragging] = useState(false);
  const rotationRef=useRef(0),velocityRef=useRef(0),dragStartX=useRef(0),dragStartRotation=useRef(0),lastPointerX=useRef<number|null>(null),raf=useRef<number|null>(null),lastTime=useRef<number|null>(null);
  const count=Math.max(items.length,1),step=360/count;

  useEffect(()=>{
    function animate(time:number){
      if(lastTime.current===null) lastTime.current=time;
      const delta=Math.min(28,time-lastTime.current); lastTime.current=time;
      if(!dragging&&items.length>1){
        rotationRef.current+=delta*config.carousel.speed;
        rotationRef.current+=velocityRef.current;
        velocityRef.current*=.965;
        setRotation(rotationRef.current);
      }
      raf.current=requestAnimationFrame(animate);
    }
    raf.current=requestAnimationFrame(animate);
    return()=>{if(raf.current)cancelAnimationFrame(raf.current)}
  },[dragging,items.length,config.carousel.speed]);

  function pointerDown(e:React.PointerEvent<HTMLDivElement>){setDragging(true);dragStartX.current=e.clientX;dragStartRotation.current=rotationRef.current;lastPointerX.current=e.clientX;e.currentTarget.setPointerCapture(e.pointerId)}
  function pointerMove(e:React.PointerEvent<HTMLDivElement>){
    const rect=e.currentTarget.getBoundingClientRect(),influence=((e.clientX-rect.left)/rect.width-.5)*2;
    if(!dragging){
      if(lastPointerX.current!==null)velocityRef.current+=(e.clientX-lastPointerX.current)*.0016;
      velocityRef.current+=influence*.0025;velocityRef.current=Math.max(-.28,Math.min(.28,velocityRef.current));lastPointerX.current=e.clientX;return;
    }
    const delta=e.clientX-dragStartX.current;rotationRef.current=dragStartRotation.current+delta*.15;setRotation(rotationRef.current);lastPointerX.current=e.clientX;
  }

  if(!items.length)return null;
  return (
    <section className="depth-gallery compact-depth-gallery section-pad">
      <div className="depth-gallery-head"><div><span className="eyebrow">{config.depthGallery.eyebrow}</span><h2 className="display-lg">{config.depthGallery.title}</h2></div></div>
      <div className={`continuous-depth-stage compact-carousel-stage ${dragging?"dragging":""}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerLeave={()=>{lastPointerX.current=null}} onPointerUp={()=>{setDragging(false);lastPointerX.current=null}}>
        <div className="carousel-floor"/><div className="carousel-center-light"/>
        {items.map((product,index)=>{
          const angle=index*step+rotation,rad=angle*Math.PI/180,x=Math.sin(rad)*config.carousel.radius,z=Math.cos(rad),depth=(z+1)/2,scale=.72+depth*.26;
          return (
            <article className="continuous-depth-card compact-depth-card" key={product.id} style={{
              width:`min(26vw, ${config.carousel.cardWidth}px)`,
              transform:`translate3d(calc(-50% + ${x}px), ${Math.abs(Math.sin(rad))*14}px, 0) scale(${scale}) rotateY(${-Math.sin(rad)*8}deg)`,
              opacity:.32+depth*.68,zIndex:Math.round((z+1)*50)
            }}>
              <div className="continuous-depth-visual"><img src={product.images?.[0]||"/images/product-placeholder-1.svg"} alt={product.name} draggable={false}/><div className="continuous-depth-shade"/><span>{String(index+1).padStart(2,"0")}</span></div>
              <div className="continuous-depth-copy"><div><strong>{product.name}</strong><small>{product.category}</small></div><b>${product.price}</b></div>
            </article>
          )
        })}
      </div>
    </section>
  );
}
