import { notFound } from "next/navigation";
import { AuctionDetail } from "@/components/auction-detail";
import { getAuction, auctions } from "@/lib/data";

export function generateStaticParams() {
  return auctions.map((auction) => ({
    id: auction.id,
  }));
}

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auction = getAuction(id);

  if (!auction) {
    notFound();
  }

  return <AuctionDetail auction={auction} />;
}
