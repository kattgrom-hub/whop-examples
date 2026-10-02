import type { Product } from "@/data/products";
import { ArrowUpRight, Play, Waves } from "lucide-react";
export default function ProductArtwork({ product }: { product: Product }) {
  return <div className={`product-art ${product.tone}`} aria-label={`${product.name} cover illustration`} role="img">
    <span className="art-label">KATTASSIE / CREATOR COLLECTION</span>
    <div className="cover-book"><span className="cover-small">THE CREATOR EDIT</span>
      {product.tone === "coastal" ? <Waves size={40} strokeWidth={1} /> : <Play size={40} strokeWidth={1} />}
      <strong>{product.tone === "coastal" ? <>Coastal<br/>Creator<br/><em>Toolkit.</em></> : <>Viral<br/>Gold<br/><em>Video Kit.</em></>}</strong>
      <span className="cover-bottom">CREATE WITH INTENTION <ArrowUpRight size={15}/></span>
    </div><span className="art-caption">DIGITAL CREATOR KIT · AUD 29.99</span>
  </div>;
}
