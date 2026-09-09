"use client";
import { useState } from "react";
import type { SiteConfig } from "@/lib/site-config";

const finishes = [
  {name:"Graphite",tone:"graphite"},
  {name:"Silver",tone:"silver"},
  {name:"Midnight",tone:"midnight"}
];
const materials = ["Aluminum","Black Oak","Natural Oak"];

export function ConfiguratorPreview({ config }: { config: SiteConfig }) {
  const [finish,setFinish] = useState(finishes[0]);
  const [material,setMaterial] = useState(materials[0]);

  return (
    <section className="configurator-section">
      <div className="configurator-stage">
        <div className={`configurator-figure ${finish.tone}`}><div className="config-monitor"/><div className="config-riser"/><div className="config-tray"/><div className="config-mat"/></div>
        <div className="config-stage-label"><span>LIVE PREVIEW</span><strong>{finish.name} / {material}</strong></div>
      </div>
      <div className="configurator-copy">
        <span className="eyebrow">{config.configurator.eyebrow}</span>
        <h2 className="display-lg">{config.configurator.title}</h2>
        <p className="lede">{config.configurator.description}</p>
        <div className="config-group"><label>Finish</label><div className="config-options">
          {finishes.map(item=><button key={item.name} onClick={()=>setFinish(item)} className={finish.name===item.name?"active":""}><i className={`finish-dot ${item.tone}`}/>{item.name}</button>)}
        </div></div>
        <div className="config-group"><label>Material</label><div className="config-options">
          {materials.map(item=><button key={item} onClick={()=>setMaterial(item)} className={material===item?"active":""}>{item}</button>)}
        </div></div>
        <button className="btn-primary config-cta">{config.configurator.button}</button>
      </div>
    </section>
  );
}
