"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/site-config";
import { placementMeta } from "@/lib/product-placement";

type Tab = "global"|"homepage"|"store"|"announcement"|"footer"|"design"|"carousel"|"sections"|"map";

export function SiteSettingsAdmin() {
  const [config,setConfig]=useState<SiteConfig|null>(null);
  const [tab,setTab]=useState<Tab>("global");
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);

  useEffect(()=>{fetch("/api/site-config",{cache:"no-store"}).then(r=>r.json()).then(setConfig)},[]);

  async function save(){
    if(!config)return;
    setSaving(true);setMessage("");
    const response=await fetch("/api/site-config",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(config)});
    setMessage(response.ok?"All website settings saved.":"Could not save settings.");
    setSaving(false);
  }

  function updateSection(section:keyof SiteConfig,key:string,value:any){
    if(!config)return;
    setConfig({...config,[section]:{...(config[section] as any),[key]:value}});
  }

  function field(section:keyof SiteConfig,key:string,label:string,multiline=false){
    const value=String((config![section] as any)[key]??"");
    return <label>{label}{multiline?<textarea rows={3} value={value} onChange={e=>updateSection(section,key,e.target.value)}/>:<input value={value} onChange={e=>updateSection(section,key,e.target.value)}/>}</label>
  }

  if(!config)return <p className="admin-message">Loading full store controls...</p>;

  return (
    <div className="site-settings-admin">
      <div className="admin-tabs full-admin-tabs">
        {(["global","homepage","store","announcement","footer","design","carousel","sections","map"] as Tab[]).map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}>{item==="map"?"Website Map":item}</button>)}
      </div>

      {tab==="global"&&<div className="settings-stack">
        <section className="settings-card"><h2>Brand + Navbar</h2>
          <div className="admin-fields three">{field("brand","name","Brand name")}{field("brand","tagline","Brand tagline")}{field("brand","coordinate","Navbar mini label")}</div>
          <div className="admin-fields four">{field("nav","home","Home")}{field("nav","shop","Shop")}{field("nav","workspace","Workspace")}{field("nav","approach","Approach")}</div>
          <div className="admin-fields three">{field("nav","search","Search")}{field("nav","account","Account")}{field("nav","cart","Cart")}</div>
        </section>
      </div>}

      {tab==="homepage"&&<div className="settings-stack">
        <section className="settings-card"><h2>Hero</h2><div className="admin-fields two">{field("hero","eyebrow","Eyebrow")}{field("hero","line1","Heading line 1")}{field("hero","line2","Heading line 2")}{field("hero","primaryButton","Primary button")}{field("hero","secondaryButton","Secondary button")}</div>{field("hero","description","Description",true)}</section>
        <section className="settings-card"><h2>Statement</h2><div className="admin-fields three">{field("statement","eyebrow","Eyebrow")}{field("statement","title1","Title line 1")}{field("statement","title2","Title line 2")}</div>{field("statement","description","Description",true)}</section>
        <section className="settings-card"><h2>Cinematic section</h2><div className="admin-fields four">{field("cinematic","eyebrow","Eyebrow")}{field("cinematic","line1","Line 1")}{field("cinematic","line2","Line 2")}{field("cinematic","line3","Line 3")}</div>{field("cinematic","caption","Caption",true)}</section>
        <section className="settings-card"><h2>Scroll story</h2><div className="admin-fields two">{field("scrollStory","eyebrow","Eyebrow")}{field("scrollStory","title","Title")}{field("scrollStory","stageLabel","Stage label")}</div>{field("scrollStory","description","Description",true)}</section>
        <section className="settings-card"><h2>Horizontal story</h2><div className="admin-fields two">{field("horizontalStory","eyebrow","Eyebrow")}{field("horizontalStory","title","Title")}{field("horizontalStory","cue","Scroll cue")}{field("horizontalStory","outroTitle","Outro title")}{field("horizontalStory","outroButton","Outro button")}</div>{field("horizontalStory","description","Description",true)}</section>
        <section className="settings-card"><h2>Homepage section headings</h2><div className="admin-fields two">{field("featured","title","Featured title")}{field("depthGallery","title","3D carousel title")}{field("categories","title","Categories title")}{field("transformation","title","Transformation title")}{field("configurator","title","Configurator title")}{field("bestsellers","title","Best sellers title")}{field("principle","title","Principle title")}{field("newsletter","title","Newsletter title")}</div></section>
      </div>}

      {tab==="store"&&<div className="settings-stack">
        <section className="settings-card"><h2>Shop Page</h2><div className="admin-fields two">{field("shopPage","eyebrow","Eyebrow")}{field("shopPage","title","Title")}</div>{field("shopPage","description","Description",true)}</section>
        <section className="settings-card"><h2>Account Page</h2><div className="admin-fields two">{field("accountPage","eyebrow","Eyebrow")}{field("accountPage","title","Title")}</div>{field("accountPage","description","Description",true)}</section>
        <section className="settings-card"><h2>Customer Reviews</h2>
          <div className="reviews-admin-list">{config.reviews.map((review,index)=><div className="review-admin-card" key={index}>
            <input value={review.name} onChange={e=>{const reviews=[...config.reviews];reviews[index]={...reviews[index],name:e.target.value};setConfig({...config,reviews})}} placeholder="Name"/>
            <input value={review.role} onChange={e=>{const reviews=[...config.reviews];reviews[index]={...reviews[index],role:e.target.value};setConfig({...config,reviews})}} placeholder="Role"/>
            <input value={review.score} onChange={e=>{const reviews=[...config.reviews];reviews[index]={...reviews[index],score:e.target.value};setConfig({...config,reviews})}} placeholder="Score"/>
            <textarea rows={3} value={review.quote} onChange={e=>{const reviews=[...config.reviews];reviews[index]={...reviews[index],quote:e.target.value};setConfig({...config,reviews})}}/>
          </div>)}</div>
        </section>
      </div>}

      {tab==="announcement"&&<div className="settings-stack">
        <section className="settings-card"><h2>Advertisement / New Product Bar</h2>
          <label className="admin-master-toggle"><span>Enable advertisement bar</span><input type="checkbox" checked={config.announcement.enabled} onChange={e=>updateSection("announcement","enabled",e.target.checked)}/></label>
          <p className="admin-help">When OFF, the bar is not rendered and takes zero space. When ON, it appears directly below the navbar.</p>
          <div className="admin-fields three">
            <label>Speed (seconds)<input type="number" min="6" value={config.announcement.speedSeconds} onChange={e=>updateSection("announcement","speedSeconds",Number(e.target.value))}/></label>
            <label>Background<input type="color" value={config.announcement.background} onChange={e=>updateSection("announcement","background",e.target.value)}/></label>
            <label>Text color<input type="color" value={config.announcement.textColor} onChange={e=>updateSection("announcement","textColor",e.target.value)}/></label>
          </div>
          <div className="announcement-admin-list">{config.announcement.items.map((item,index)=><div className="announcement-admin-row" key={index}>
            <input value={item.text} onChange={e=>{const items=[...config.announcement.items];items[index]={...items[index],text:e.target.value};setConfig({...config,announcement:{...config.announcement,items}})}} placeholder="Advertisement text"/>
            <input value={item.link} onChange={e=>{const items=[...config.announcement.items];items[index]={...items[index],link:e.target.value};setConfig({...config,announcement:{...config.announcement,items}})}} placeholder="/product/..."/>
            <button type="button" onClick={()=>{const items=config.announcement.items.filter((_,i)=>i!==index);setConfig({...config,announcement:{...config.announcement,items}})}}>Remove</button>
          </div>)}</div>
          <button type="button" className="admin-secondary-button" onClick={()=>setConfig({...config,announcement:{...config.announcement,items:[...config.announcement.items,{text:"New announcement",link:"/shop"}]}})}>+ Add announcement</button>
        </section>
      </div>}

      {tab==="footer"&&<div className="settings-stack">
        <section className="settings-card"><h2>Footer Style + Newsletter</h2>
          <div className="admin-fields three">
            <label>Footer background<input type="color" value={config.footer.background} onChange={e=>updateSection("footer","background",e.target.value)}/></label>
            <label>Footer text<input type="color" value={config.footer.textColor} onChange={e=>updateSection("footer","textColor",e.target.value)}/></label>
            {field("footer","newsletterTitle","Newsletter title")}
          </div>
          <div className="admin-fields two">{field("footer","newsletterPlaceholder","Email placeholder")}{field("footer","copyright","Copyright")}</div>
        </section>

        {config.footer.columns.map((column,columnIndex)=><section className="settings-card" key={columnIndex}>
          <div className="footer-admin-head"><h2>Footer Column {columnIndex+1}</h2><button type="button" onClick={()=>{const columns=config.footer.columns.filter((_,i)=>i!==columnIndex);setConfig({...config,footer:{...config.footer,columns}})}}>Delete column</button></div>
          <label>Column title<input value={column.title} onChange={e=>{const columns=[...config.footer.columns];columns[columnIndex]={...columns[columnIndex],title:e.target.value};setConfig({...config,footer:{...config.footer,columns}})}}/></label>
          <div className="footer-link-editor">{column.links.map((link,linkIndex)=><div className="footer-link-row" key={linkIndex}>
            <input value={link.label} onChange={e=>{const columns=[...config.footer.columns];const links=[...columns[columnIndex].links];links[linkIndex]={...links[linkIndex],label:e.target.value};columns[columnIndex]={...columns[columnIndex],links};setConfig({...config,footer:{...config.footer,columns}})}} placeholder="Label"/>
            <input value={link.href} onChange={e=>{const columns=[...config.footer.columns];const links=[...columns[columnIndex].links];links[linkIndex]={...links[linkIndex],href:e.target.value};columns[columnIndex]={...columns[columnIndex],links};setConfig({...config,footer:{...config.footer,columns}})}} placeholder="URL"/>
            <button type="button" onClick={()=>{const columns=[...config.footer.columns];const links=columns[columnIndex].links.filter((_,i)=>i!==linkIndex);columns[columnIndex]={...columns[columnIndex],links};setConfig({...config,footer:{...config.footer,columns}})}}>×</button>
          </div>)}</div>
          <button type="button" className="admin-secondary-button" onClick={()=>{const columns=[...config.footer.columns];columns[columnIndex]={...columns[columnIndex],links:[...columns[columnIndex].links,{label:"New link",href:"#"}]};setConfig({...config,footer:{...config.footer,columns}})}}>+ Add link</button>
        </section>)}

        <button type="button" className="admin-secondary-button" onClick={()=>setConfig({...config,footer:{...config.footer,columns:[...config.footer.columns,{title:"New Column",links:[]}]}})}>+ Add footer column</button>
      </div>}

      {tab==="design"&&<section className="settings-card"><h2>Global Theme Colors</h2><div className="color-settings-grid">{Object.entries(config.theme).map(([key,value])=><label key={key}>{key}<div className="color-input-wrap"><input type="color" value={value} onChange={e=>updateSection("theme",key,e.target.value)}/><input value={value} onChange={e=>updateSection("theme",key,e.target.value)}/></div></label>)}</div></section>}

      {tab==="carousel"&&<section className="settings-card"><h2>3D Carousel</h2>
        <div className="range-field"><label>Auto rotation speed <strong>{config.carousel.speed.toFixed(4)}</strong></label><input type="range" min=".004" max=".05" step=".001" value={config.carousel.speed} onChange={e=>updateSection("carousel","speed",Number(e.target.value))}/></div>
        <div className="range-field"><label>Radius <strong>{config.carousel.radius}px</strong></label><input type="range" min="220" max="520" step="10" value={config.carousel.radius} onChange={e=>updateSection("carousel","radius",Number(e.target.value))}/></div>
        <div className="range-field"><label>Card width <strong>{config.carousel.cardWidth}px</strong></label><input type="range" min="220" max="440" step="10" value={config.carousel.cardWidth} onChange={e=>updateSection("carousel","cardWidth",Number(e.target.value))}/></div>
        <div className="range-field"><label>Maximum products <strong>{config.carousel.maxProducts}</strong></label><input type="range" min="3" max="12" step="1" value={config.carousel.maxProducts} onChange={e=>updateSection("carousel","maxProducts",Number(e.target.value))}/></div>
      </section>}

      {tab==="sections"&&<section className="settings-card"><h2>Homepage Section Visibility</h2><div className="section-toggle-grid">{Object.entries(config.sections).map(([key,enabled])=><label className="section-switch" key={key}><span>{key}</span><input type="checkbox" checked={enabled} onChange={e=>setConfig({...config,sections:{...config.sections,[key]:e.target.checked}})}/></label>)}</div></section>}

      {tab==="map"&&<div className="settings-stack">
        <section className="settings-card"><span className="eyebrow">FULL WEBSITE MAP</span><h2>Admin control → storefront location</h2><div className="website-map-grid">
          <div><strong>Global</strong><span>Every page</span><p>Brand, navbar, Home/Shop/Workspace/Approach labels.</p></div>
          <div><strong>Advertisement</strong><span>Directly below navbar</span><p>Zero space when disabled.</p></div>
          <div><strong>Homepage</strong><span>/</span><p>Hero, statement, cinematic, scroll story, horizontal story, categories, configurator and more.</p></div>
          <div><strong>Store</strong><span>/shop + /account</span><p>Page headings and customer-facing copy.</p></div>
          <div><strong>Footer</strong><span>Bottom of Home, Shop and Account</span><p>Columns, links, newsletter, colors and social icons.</p></div>
          <div><strong>Products</strong><span>/admin/products</span><p>Per-product placement, publishing, media, inventory and SEO.</p></div>
        </div></section>
        <section className="settings-card"><h2>Product placement map</h2><div className="website-map-grid">{Object.values(placementMeta).map(meta=><div key={meta.label}><strong>{meta.label}</strong><span>{meta.location}</span><p>{meta.description}</p></div>)}</div></section>
      </div>}

      <div className="admin-save-bar"><span>{message||"Full-store settings save to data/site-config.json"}</span><button onClick={save} disabled={saving}>{saving?"Saving...":"Save All Website Changes"}</button></div>
    </div>
  );
}
