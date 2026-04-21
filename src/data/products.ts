export type ProductCategory = "Blend" | "Single Origin" | "Decaf";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  origin: string;
  roast: string;
  grams: string;
  note: string;
  description: string;
  price: number;
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "bean-01",
    name: "Kohana Blend",
    category: "Blend",
    origin: "Brazil / Colombia",
    roast: "Medium Dark",
    grams: "200g",
    note: "チョコ・ローストナッツ",
    description:
      "コクと甘みのバランスが良い定番ブレンド。ミルクとの相性がよく、カフェオレにもおすすめ。",
    price: 1680,
    image: "/images/beans/kohana.svg",
  },
  {
    id: "bean-02",
    name: "Morning Light",
    category: "Single Origin",
    origin: "Ethiopia",
    roast: "Light",
    grams: "180g",
    note: "シトラス・ジャスミン",
    description:
      "華やかな香りと軽やかな口当たりが特徴のシングルオリジン。朝の一杯に最適。",
    price: 1520,
    image: "/images/beans/morning-light.svg",
  },
  {
    id: "bean-03",
    name: "Old Port Roast",
    category: "Single Origin",
    origin: "Guatemala",
    roast: "Dark",
    grams: "220g",
    note: "カカオ・黒糖",
    description:
      "深煎りならではの重厚なボディとほろ苦さ。ビター系スイーツとよく合います。",
    price: 1840,
    image: "/images/beans/old-port.svg",
  },
  {
    id: "bean-04",
    name: "Cloud Valley Decaf",
    category: "Decaf",
    origin: "Mexico",
    roast: "Medium",
    grams: "200g",
    note: "キャラメル・アーモンド",
    description:
      "カフェインレスでも香り豊か。夜のリラックスタイム向けに仕上げたやさしい味わい。",
    price: 1760,
    image: "/images/beans/cloud-valley.svg",
  },
  {
    id: "bean-05",
    name: "Sunset House Blend",
    category: "Blend",
    origin: "Peru / Honduras",
    roast: "Medium",
    grams: "200g",
    note: "ヘーゼルナッツ・ブラウンシュガー",
    description:
      "夕方の時間帯に合わせた丸みある味わい。ストレートでもミルクでも飲みやすいブレンド。",
    price: 1620,
    image: "/images/beans/kohana.svg",
  },
  {
    id: "bean-06",
    name: "Nile Bloom",
    category: "Single Origin",
    origin: "Kenya",
    roast: "Light",
    grams: "180g",
    note: "ベリー・フローラル",
    description:
      "果実感が際立つ明るい酸質が特徴。ハンドドリップで香りの変化を楽しめます。",
    price: 1980,
    image: "/images/beans/morning-light.svg",
  },
  {
    id: "bean-07",
    name: "Midnight Barrel",
    category: "Single Origin",
    origin: "Sumatra",
    roast: "Dark",
    grams: "220g",
    note: "スモーキー・ダークチョコ",
    description:
      "重厚なコクと余韻が楽しめる深煎り。エスプレッソ抽出にも向いたリッチな豆。",
    price: 1890,
    image: "/images/beans/old-port.svg",
  },
  {
    id: "bean-08",
    name: "Calm Evening Decaf",
    category: "Decaf",
    origin: "Colombia",
    roast: "Medium",
    grams: "200g",
    note: "ハニー・カカオニブ",
    description:
      "夜でも飲みやすいカフェインレス。穏やかな甘みで、就寝前のリラックスタイムに最適。",
    price: 1810,
    image: "/images/beans/cloud-valley.svg",
  },
];
