import type { Category, Product } from "@/types/dog";

export const products: Product[] = [
  {
    id: "1",
    name: "ボーダーTシャツ",
    category: "Tシャツ",
    price: 2480,
    description:
      "定番のボーダー柄で、おしゃれに決まるTシャツ。伸縮性のあるコットン素材で、着せやすく脱がせやすい設計。通気性が良く、春夏のお散歩に最適です。",
    images: ["/products/placeholder-1.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["レッド×ホワイト", "ネイビー×ホワイト"],
    targetBreeds: ["トイプードル", "チワワ", "ミニチュアダックス"],
    featured: true,
    inStock: true,
  },
  {
    id: "2",
    name: "フリースパーカー",
    category: "パーカー",
    price: 3980,
    description:
      "ふわふわフリース素材で暖かいパーカー。フード付きで耳が出るデザインが可愛い。秋冬のお散歩や室内での防寒に。洗濯機で丸洗いOK。",
    images: ["/products/placeholder-2.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["グレー", "ピンク", "ブラウン"],
    targetBreeds: ["柴犬", "フレンチブルドッグ", "コーギー"],
    featured: true,
    inStock: true,
  },
  {
    id: "3",
    name: "透明レインコート",
    category: "レインコート",
    price: 2980,
    description:
      "雨の日のお散歩も快適に。透明素材で愛犬の可愛い姿が見える、おしゃれなレインコート。マジックテープで着脱簡単。反射テープ付きで夜間も安心。",
    images: ["/products/placeholder-3.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["クリア", "クリアピンク", "クリアブルー"],
    targetBreeds: ["全犬種対応"],
    featured: true,
    inStock: true,
  },
  {
    id: "4",
    name: "フリルワンピース",
    category: "ワンピース",
    price: 3280,
    description:
      "レースとフリルが可愛い女の子向けワンピース。記念撮影やお出かけにぴったり。綿100%で肌に優しく、デリケートな愛犬にも安心です。",
    images: ["/products/placeholder-4.jpg"],
    sizes: ["XS", "S", "M"],
    colors: ["ピンク", "ラベンダー", "ミント"],
    targetBreeds: ["トイプードル", "チワワ", "ポメラニアン"],
    featured: true,
    inStock: true,
  },
  {
    id: "5",
    name: "サメコスプレ",
    category: "コスプレ",
    price: 1980,
    description:
      "SNS映え間違いなし！サメに変身できるコスプレ衣装。ハロウィンやイベントに大活躍。柔らかい素材で着心地も良く、愛犬も嫌がりません。",
    images: ["/products/placeholder-5.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["ブルー", "グレー"],
    targetBreeds: ["小型犬全般", "中型犬"],
    featured: false,
    inStock: true,
  },
  {
    id: "6",
    name: "ダウンベスト",
    category: "防寒着",
    price: 4580,
    description:
      "真冬でも暖かいダウンベスト。軽量で動きやすく、愛犬のストレスを最小限に。撥水加工で雪や小雨にも対応。お腹までしっかり覆う設計。",
    images: ["/products/placeholder-6.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["レッド", "ネイビー", "カーキ"],
    targetBreeds: ["柴犬", "コーギー", "フレンチブルドッグ"],
    featured: false,
    inStock: true,
  },
  {
    id: "7",
    name: "メッシュタンクトップ",
    category: "Tシャツ",
    price: 1680,
    description:
      "通気性抜群のメッシュ素材タンクトップ。真夏のお散歩でも蒸れにくく快適。UV カット加工で紫外線から愛犬の肌を守ります。",
    images: ["/products/placeholder-7.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["ホワイト", "イエロー", "ライトブルー"],
    targetBreeds: ["全犬種対応"],
    featured: false,
    inStock: true,
  },
  {
    id: "8",
    name: "袴（はかま）コスプレ",
    category: "コスプレ",
    price: 2780,
    description:
      "お正月や七五三にぴったりの和装コスプレ。愛犬が凛々しい袴姿に変身。着物部分は伸縮素材で着せやすく、写真映えも抜群です。",
    images: ["/products/placeholder-8.jpg"],
    sizes: ["XS", "S", "M"],
    colors: ["紺×金", "赤×白"],
    targetBreeds: ["柴犬", "トイプードル", "チワワ"],
    featured: false,
    inStock: true,
  },
];

export const categories: Category[] = [
  ...new Set(products.map((p) => p.category)),
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function filterProducts(params: {
  category?: string;
  size?: string;
  maxPrice?: number;
}): Product[] {
  return products.filter((product) => {
    if (params.category && product.category !== params.category) return false;
    if (params.size && !product.sizes.includes(params.size as never))
      return false;
    if (params.maxPrice && product.price > params.maxPrice) return false;
    return true;
  });
}
