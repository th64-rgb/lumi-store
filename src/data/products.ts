export type CategoryId = "mug" | "tumbler" | "bag" | "candle" | "note";

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  salePrice: number | null;
  image: string;
  colors: ProductColor[];
  sizes: string[];
  badge?: "BEST" | "NEW";
  popularity: number;
  createdAt: string;
  summary: string;
  story: string;
  specs: { label: string; value: string }[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
};

type RawProduct = Omit<Product, "rating" | "reviewCount" | "reviews"> & {
  targetRating: number;
};

const AUTHORS = ["김민지", "이서준", "박하은", "정도윤", "최수아", "한지호", "윤예린", "장현우", "오하늘", "배준호"];

const LINES: Record<CategoryId, string[]> = {
  mug: [
    "입구가 얇아서 한 모금이 편해요.",
    "라떼를 담으면 온도가 오래 남습니다.",
    "아침에 싱크대에 세워 두기 좋은 높이예요.",
  ],
  tumbler: [
    "가방에 넣어도 소리가 크지 않아요.",
    "얼음을 넣어도 결로가 거의 없습니다.",
    "출근길에 들고 다니기 부담 없는 무게예요.",
  ],
  bag: [
    "어깨에 메면 끈이 파고들지 않아요.",
    "장본 것과 노트가 같이 들어갑니다.",
    "세탁 후에도 형태가 크게 무너지지 않았어요.",
  ],
  candle: [
    "향이 방 안을 채우기보다 주변에만 머물러요.",
    "심지가 곧게 타서 그을음이 적었습니다.",
    "저녁에 짧게 켜 두기 좋은 크기예요.",
  ],
  note: [
    "잉크가 뒷장에 거의 배지 않아요.",
    "표지가 손에 묻지 않고 매트해요.",
    "한 주를 적고 덮어 두기 좋은 두께입니다.",
  ],
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function ratingsFor(target: number) {
  const scores = [5, 5, 5, 5];
  let sum = 20;
  let cursor = 0;
  while (sum / scores.length > target + 0.05 && cursor < 12) {
    const index = cursor % scores.length;
    if (scores[index]! > 3) {
      scores[index] = scores[index]! - 1;
      sum -= 1;
    }
    cursor += 1;
  }
  return scores;
}

function attachReviews(raw: RawProduct): Product {
  const { targetRating, ...rest } = raw;
  const hash = hashString(raw.id);
  const scores = ratingsFor(targetRating);
  const pool = LINES[raw.category];
  const reviews = scores.map((rating, index) => {
    const author = AUTHORS[(hash + index * 3) % AUTHORS.length]!;
    const line = pool[(hash + index) % pool.length]!;
    const month = 4 + ((hash + index) % 6);
    const day = 1 + ((hash + index * 5) % 27);
    return {
      id: `${raw.id}-r${index}`,
      author,
      rating,
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      body: `${raw.name}, ${line} ${index % 2 === 0 ? "실물이 사진보다 더 차분합니다." : "다음에 같은 결로 하나 더 고르고 싶어요."}`,
    };
  });
  const rating =
    Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
  return { ...rest, reviews, rating, reviewCount: reviews.length };
}

const color = (id: string, name: string, hex: string): ProductColor => ({ id, name, hex });

const RAW: RawProduct[] = [
  {
    id: "mug-cloud",
    name: "모닝 클라우드 머그",
    category: "mug",
    price: 22000,
    salePrice: 18000,
    image: "/products/mug-cloud.jpg",
    colors: [color("cream", "크림", "#F4EFE8"), color("sand", "샌드", "#E4D5C5")],
    sizes: [],
    badge: "BEST",
    popularity: 98,
    createdAt: "2026-03-02",
    targetRating: 4.8,
    summary: "아침 빛을 닮은 무광 세라믹. 350ml.",
    story:
      "가장자리가 조금 두껍고 손잡이는 한 손가락이 여유롭게 들어갑니다. 유약 결이 잔잔해서 창가에 두면 그림자가 거의 나지 않습니다.\n\n따뜻한 음료를 담아도 손잡이까지 금방 뜨거워지지 않도록 벽 두께를 잡았습니다. 식기세척기에 넣어도 광택이 급하게 올라오지 않는 무광입니다.",
    specs: [
      { label: "용량", value: "350ml" },
      { label: "소재", value: "무광 세라믹" },
      { label: "구성", value: "머그 1개" },
    ],
  },
  {
    id: "mug-coral",
    name: "코랄 림 머그",
    category: "mug",
    price: 19000,
    salePrice: null,
    image: "/products/mug-coral.jpg",
    colors: [color("coral", "코랄 림", "#FF6B5A"), color("ink", "잉크 림", "#3F3A36")],
    sizes: [],
    popularity: 76,
    createdAt: "2026-05-14",
    targetRating: 4.6,
    summary: "입구에만 색을 올린 심플 머그. 320ml.",
    story:
      "몸통은 백자처럼 조용하고, 가장자리에만 가는 색 띠가 있습니다. 선반에 여러 개를 두어도 서로 경쟁하지 않습니다.\n\n커피와 차, 물까지 매일 바꿔 담아도 색이 비치지 않는 안쪽 유약입니다.",
    specs: [
      { label: "용량", value: "320ml" },
      { label: "소재", value: "세라믹" },
      { label: "구성", value: "머그 1개" },
    ],
  },
  {
    id: "mug-stone",
    name: "스톤 라떼 머그",
    category: "mug",
    price: 28000,
    salePrice: 24000,
    image: "/products/mug-stone.jpg",
    colors: [color("oat", "오트", "#E7D7C6"), color("stone", "스톤", "#C9BBA9")],
    sizes: [],
    popularity: 91,
    createdAt: "2026-02-18",
    targetRating: 4.7,
    summary: "손맛이 좋은 넓은 스톤웨어. 420ml.",
    story:
      "라떼와 시리얼처럼 여유 있는 음료를 위한 넓은 입구입니다. 작은 점이 박힌 표면이 지문을 숨겨 줍니다.\n\n바닥이 넓어 노트북 옆에 두어도 잘 쓰러지지 않습니다. 전자레인지 사용은 짧은 데우기만 권합니다.",
    specs: [
      { label: "용량", value: "420ml" },
      { label: "소재", value: "스톤웨어" },
      { label: "구성", value: "머그 1개" },
    ],
  },
  {
    id: "mug-espresso",
    name: "에스프레소 페어",
    category: "mug",
    price: 26000,
    salePrice: null,
    image: "/products/mug-espresso.jpg",
    colors: [color("cream", "크림", "#F3EEE6")],
    sizes: [],
    popularity: 64,
    createdAt: "2026-07-02",
    targetRating: 4.5,
    summary: "둘만의 작은 잔. 90ml, 2개 세트.",
    story:
      "에스프레소가 식기 전에 비울 수 있는 작은 볼륨입니다. 두 잔의 높이와 손잡이 방향을 맞춰 구웠습니다.\n\n선반 한 칸에 나란히 들어가도록 입구를 좁게 잡았습니다.",
    specs: [
      { label: "용량", value: "90ml × 2" },
      { label: "소재", value: "세라믹" },
      { label: "구성", value: "잔 2개" },
    ],
  },
  {
    id: "tumbler-day",
    name: "데이라이트 텀블러",
    category: "tumbler",
    price: 39000,
    salePrice: 32000,
    image: "/products/tumbler-day.jpg",
    colors: [color("cream", "크림", "#F3EEE7"), color("sand", "샌드", "#E5D4C3")],
    sizes: ["360ml", "500ml"],
    badge: "BEST",
    popularity: 99,
    createdAt: "2026-04-09",
    targetRating: 4.9,
    summary: "하루를 들고 다니는 무광 텀블러.",
    story:
      "이중 벽이라 따뜻한 차는 오전까지, 아이스 음료는 점심 무렵까지 온도가 버팁니다. 뚜껑 마개는 한 손으로 열 수 있습니다.\n\n겉면은 지문이 덜 남는 파우더 코팅입니다. 식기세척기 대신 미지근한 물에 병솔로 닦는 쪽을 권합니다.",
    specs: [
      { label: "용량", value: "360ml / 500ml" },
      { label: "소재", value: "스테인리스, 무광 코팅" },
      { label: "구성", value: "텀블러, 뚜껑" },
    ],
  },
  {
    id: "tumbler-slim",
    name: "슬림 워터 보틀",
    category: "tumbler",
    price: 29000,
    salePrice: null,
    image: "/products/tumbler-slim.jpg",
    colors: [color("sage", "세이지", "#7E9078"), color("stone", "스톤", "#B7A89A")],
    sizes: ["450ml"],
    popularity: 71,
    createdAt: "2026-06-11",
    targetRating: 4.4,
    summary: "가방 옆면에 쏙 들어가는 450ml.",
    story:
      "지름을 줄여 노트북 가방의 병 주머니에 걸리게 만들었습니다. 캡은 돌려 잠그고, 마시는 구멍은 따로 있습니다.\n\n물병으로만 쓰기 좋게 향이 배지 않는 안쪽 처리입니다.",
    specs: [
      { label: "용량", value: "450ml" },
      { label: "소재", value: "스테인리스" },
      { label: "구성", value: "보틀, 캡" },
    ],
  },
  {
    id: "tumbler-glass",
    name: "아이스 글라스 텀블러",
    category: "tumbler",
    price: 27000,
    salePrice: 23000,
    image: "/products/tumbler-glass.jpg",
    colors: [color("clear", "클리어", "#D5E0E6"), color("smoke", "스모크", "#C5C1BC")],
    sizes: [],
    popularity: 86,
    createdAt: "2026-05-28",
    targetRating: 4.6,
    summary: "얼음이 보이는 유리 텀블러. 400ml.",
    story:
      "집에 두고 쓰는 유리잔과 밖에 들고 나가는 텀블러 사이를 메웁니다. 리드에 빨대 구멍이 있고, 유리 빨대가 함께 있습니다.\n\n붕규산 유리라 갑작스러운 뜨거운 물보다는 아이스 음료에 맞춰 두었습니다.",
    specs: [
      { label: "용량", value: "400ml" },
      { label: "소재", value: "붕규산 유리" },
      { label: "구성", value: "텀블러, 리드, 빨대" },
    ],
  },
  {
    id: "tumbler-travel",
    name: "트래블 캡 머그",
    category: "tumbler",
    price: 34000,
    salePrice: null,
    image: "/products/tumbler-travel.jpg",
    colors: [color("oat", "오트밀", "#E6D9CC"), color("coral", "코랄 캡", "#FF6B5A")],
    sizes: ["360ml"],
    popularity: 68,
    createdAt: "2026-08-19",
    targetRating: 4.5,
    summary: "출퇴근용 뚜껑 머그. 360ml.",
    story:
      "드립 구멍을 닫으면 가방 안에서도 새지 않게 설계한 캡입니다. 손잡이가 있어 텀블러보다 머그에 가깝습니다.\n\n차 거름망은 포함되지 않습니다. 원두를 내린 커피를 옮겨 담는 용도입니다.",
    specs: [
      { label: "용량", value: "360ml" },
      { label: "소재", value: "스테인리스, 플라스틱 캡" },
      { label: "구성", value: "머그, 캡" },
    ],
  },
  {
    id: "bag-daily",
    name: "데일리 캔버스 토트",
    category: "bag",
    price: 24000,
    salePrice: 19000,
    image: "/products/bag-daily.jpg",
    colors: [color("natural", "내추럴", "#E7DCCB"), color("sand", "샌드", "#D9C4AE")],
    sizes: ["M"],
    badge: "BEST",
    popularity: 97,
    createdAt: "2026-03-21",
    targetRating: 4.8,
    summary: "장보기와 노트가 함께 들어가는 에코백.",
    story:
      "인쇄 없이 원단 결만 남겨 어떤 옷에도 얹히게 했습니다. 바닥 심을 얕게 넣어 세워 둘 수 있습니다.\n\n안쪽 포켓이 하나 있어 열쇠와 교통카드를 분리합니다. 손세탁 후 그늘에서 말려 주세요.",
    specs: [
      { label: "사이즈", value: "가로 38 × 세로 40 × 바닥 12cm" },
      { label: "소재", value: "워싱 캔버스" },
      { label: "구성", value: "토트 1개" },
    ],
  },
  {
    id: "bag-mini",
    name: "미니 숄더 토트",
    category: "bag",
    price: 28000,
    salePrice: 22000,
    image: "/products/bag-mini.jpg",
    colors: [color("sand", "샌드", "#E6D3BE"), color("terra", "테라코타", "#C4654A")],
    sizes: ["S"],
    popularity: 79,
    createdAt: "2026-06-30",
    targetRating: 4.6,
    summary: "가벼운 외출용 작은 어깨 가방.",
    story:
      "핸드폰, 카드, 립밤이 들어가는 최소 크기입니다. 끈 길이는 어깨에 걸치는 짧은 숄더입니다.\n\n안감은 같은 색 캔버스라 꺼낼 때 대비가 세지 않습니다.",
    specs: [
      { label: "사이즈", value: "가로 24 × 세로 22 × 바닥 8cm" },
      { label: "소재", value: "캔버스" },
      { label: "구성", value: "백 1개" },
    ],
  },
  {
    id: "bag-mesh",
    name: "마켓 메쉬 백",
    category: "bag",
    price: 16000,
    salePrice: null,
    image: "/products/bag-mesh.jpg",
    colors: [color("ecru", "에크루", "#EFE6D8")],
    sizes: [],
    popularity: 58,
    createdAt: "2026-04-16",
    targetRating: 4.3,
    summary: "채소가 숨 쉬는 그물 장바구니.",
    story:
      "면 그물이라 젖은 채소를 담아도 물이 고이지 않습니다. 쓰지 않을 때는 작게 말아 토트 안에 넣습니다.\n\n손잡이는 이중으로 박아 시장 봉지 무게를 버팁니다.",
    specs: [
      { label: "사이즈", value: "펼침 약 35 × 55cm" },
      { label: "소재", value: "면 메쉬" },
      { label: "구성", value: "백 1개" },
    ],
  },
  {
    id: "bag-weekend",
    name: "위켄드 빅 토트",
    category: "bag",
    price: 42000,
    salePrice: 36000,
    image: "/products/bag-weekend.jpg",
    colors: [color("cream", "크림", "#F1E6D6"), color("char", "차콜", "#4A453F")],
    sizes: ["L"],
    popularity: 88,
    createdAt: "2026-01-27",
    targetRating: 4.7,
    summary: "주말 짐을 한 번에 넣는 넓은 바닥.",
    story:
      "하루 여행의 옷 한 벌과 책이 들어가는 너비입니다. 바닥이 단단해 내려놓아도 내용물이 쓰러지지 않습니다.\n\n어깨끈과 손잡이를 같이 달아 들고 메는 방식을 바꿀 수 있습니다.",
    specs: [
      { label: "사이즈", value: "가로 48 × 세로 36 × 바닥 18cm" },
      { label: "소재", value: "헤비 캔버스" },
      { label: "구성", value: "토트 1개" },
    ],
  },
  {
    id: "candle-citrus",
    name: "시트러스 소이 캔들",
    category: "candle",
    price: 32000,
    salePrice: 26000,
    image: "/products/candle-citrus.jpg",
    colors: [color("yuzu", "유자", "#F3E2A0")],
    sizes: ["180g"],
    badge: "BEST",
    popularity: 94,
    createdAt: "2026-03-11",
    targetRating: 4.8,
    summary: "유자 껍질과 초록 잎. 약 40시간.",
    story:
      "첫 10분은 껍질, 그 다음은 잎이 남습니다. 단 향을 빼서 식탁 옆에서도 음식 냄새와 싸우지 않습니다.\n\n소이 왁스와 코튼 심지입니다. 첫 사용 때 표면이 녹아 가장자리까지 도달한 뒤 꺼 주세요.",
    specs: [
      { label: "무게", value: "180g" },
      { label: "연소", value: "약 40시간" },
      { label: "향", value: "유자, 초록 잎" },
    ],
  },
  {
    id: "candle-wood",
    name: "우디 포레스트 캔들",
    category: "candle",
    price: 34000,
    salePrice: null,
    image: "/products/candle-wood.jpg",
    colors: [color("amber", "앰버", "#C9863A")],
    sizes: ["200g"],
    popularity: 74,
    createdAt: "2026-02-02",
    targetRating: 4.6,
    summary: "젖은 나무와 따뜻한 연기. 200g.",
    story:
      "비 온 뒤의 나무 냄새에 아주 옅은 연기를 얹었습니다. 침실보다는 거실의 낮은 선반에 잘 맞습니다.\n\n용기 유리가 앰버라 불이 꺼져 있어도 따뜻한 점입니다.",
    specs: [
      { label: "무게", value: "200g" },
      { label: "연소", value: "약 45시간" },
      { label: "향", value: "우드, 소프트 스모크" },
    ],
  },
  {
    id: "candle-linen",
    name: "코튼 린넨 캔들",
    category: "candle",
    price: 29000,
    salePrice: 25000,
    image: "/products/candle-linen.jpg",
    colors: [color("white", "화이트", "#F7F4EF")],
    sizes: ["160g"],
    popularity: 69,
    createdAt: "2026-07-18",
    targetRating: 4.4,
    summary: "막 말린 천 같은 깨끗한 향. 160g.",
    story:
      "섬유유연제가 아니라, 햇볕에 널어 말린 리에넨에 가깝게 잡았습니다. 향을 거의 느끼지 못하는 분께도 무난합니다.\n\n도자기 볼에 담아 다 탄 뒤에는 작은 트레이로 남습니다.",
    specs: [
      { label: "무게", value: "160g" },
      { label: "연소", value: "약 35시간" },
      { label: "향", value: "클린 코튼, 린넨" },
    ],
  },
  {
    id: "candle-tea",
    name: "미니 티라이트",
    category: "candle",
    price: 18000,
    salePrice: null,
    image: "/products/candle-tea.jpg",
    colors: [color("ivory", "아이보리", "#F6F1E8")],
    sizes: [],
    badge: "NEW",
    popularity: 63,
    createdAt: "2026-09-28",
    targetRating: 4.5,
    summary: "식탁 위의 작은 불 여덟 개.",
    story:
      "저녁 상 위에 두세 개만 켜도 충분한 밝기입니다. 향은 넣지 않아 음식과 겹치지 않습니다.\n\n알루미늄 컵에 담겨 있고, 세라믹 트레이는 계속 쓸 수 있습니다.",
    specs: [
      { label: "구성", value: "티라이트 8개, 트레이" },
      { label: "연소", value: "개당 약 4시간" },
      { label: "향", value: "무향" },
    ],
  },
  {
    id: "note-soft",
    name: "소프트 데일리 노트",
    category: "note",
    price: 14000,
    salePrice: 12000,
    image: "/products/note-soft.jpg",
    colors: [color("cream", "크림", "#F4EFE6"), color("blush", "블러시", "#F0D5CC")],
    sizes: ["A5", "B6"],
    popularity: 84,
    createdAt: "2026-05-06",
    targetRating: 4.7,
    summary: "160페이지, 미색 무지 노트.",
    story:
      "선이 없어 그림과 글이 같이 들어가는 하루 노트입니다. 종이는 살짝 따뜻한 미색이라 하얀 화면을 보다 돌아와도 눈이 덜 탑니다.\n\n표지는 부드럽게 휘어 가방 옆면에 넣기 좋습니다. 책갈피 끈이 있습니다.",
    specs: [
      { label: "내지", value: "무지 160쪽, 120g" },
      { label: "사이즈", value: "A5 / B6" },
      { label: "제본", value: "무선, 소프트커버" },
    ],
  },
  {
    id: "note-hard",
    name: "하드커버 저널",
    category: "note",
    price: 26000,
    salePrice: 21000,
    image: "/products/note-hard.jpg",
    colors: [color("terra", "테라코타", "#C4654A"), color("sand", "샌드", "#E4D2C0")],
    sizes: ["A5"],
    badge: "BEST",
    popularity: 96,
    createdAt: "2026-01-15",
    targetRating: 4.9,
    summary: "표지가 단단한 기록장. 192페이지.",
    story:
      "천으로 싼 하드커버라 책상 위에서 필기할 때 받침이 됩니다. 제목은 박지 않아 용도를 나중에 정해도 됩니다.\n\n레이드 용지에 가깝게 결을 살려, 만년필 잉크가 번지지 않는 쪽을 테스트했습니다.",
    specs: [
      { label: "내지", value: "라인 192쪽, 100g" },
      { label: "사이즈", value: "A5" },
      { label: "제본", value: "사철, 하드커버" },
    ],
  },
  {
    id: "note-grid",
    name: "그리드 위클리 플래너",
    category: "note",
    price: 18000,
    salePrice: null,
    image: "/products/note-grid.jpg",
    colors: [color("sage", "세이지", "#C9D2C4"), color("cream", "크림", "#F3EEE4")],
    sizes: ["A5"],
    popularity: 73,
    createdAt: "2026-08-03",
    targetRating: 4.5,
    summary: "한 주가 한눈에 보이는 6개월 플래너.",
    story:
      "왼쪽은 주간, 오른쪽은 메모 칸입니다. 시간 눈금을 빼서 교대 근무처럼 일정이 들쭉날쭉해도 적기 편합니다.\n\n표지는 천, 안쪽 첫 장에 6개월 인덱스만 있습니다.",
    specs: [
      { label: "기간", value: "26주" },
      { label: "사이즈", value: "A5" },
      { label: "구성", value: "플래너 1권" },
    ],
  },
  {
    id: "note-pocket",
    name: "포켓 메모 3종",
    category: "note",
    price: 11000,
    salePrice: 9000,
    image: "/products/note-pocket.jpg",
    colors: [color("mix", "믹스", "#E7D9CC")],
    sizes: ["A7"],
    badge: "NEW",
    popularity: 67,
    createdAt: "2026-10-02",
    targetRating: 4.4,
    summary: "가방 앞주머니용 작은 수첩 세트.",
    story:
      "크림, 블러시, 샌드 세 권이 한 세트입니다. 장 볼 목록이나 잠깐의 문장을 적고 한 권씩 써 없앱니다.\n\n스테이플 제본이라 완전히 펼쳐집니다.",
    specs: [
      { label: "사이즈", value: "A7" },
      { label: "구성", value: "32쪽 × 3권" },
      { label: "내지", value: "무지" },
    ],
  },
];

export const PRODUCTS: Product[] = RAW.map(attachReviews);

export function getProduct(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function unitPrice(product: Product) {
  return product.salePrice ?? product.price;
}
