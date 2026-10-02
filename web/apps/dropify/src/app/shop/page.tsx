import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
export default function ShopPage() { return <section className="section"><p className="eyebrow">THE KATTASSIE COLLECTION</p><h1 className="page-title">Your next idea starts here.</h1><p className="shop-intro">Two digital kits. Two creative directions. A$29.99 each, paid once.</p><div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product}/>)}</div></section>; }
