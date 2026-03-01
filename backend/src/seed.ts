import { WineType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Clear existing
  await prisma.winePrice.deleteMany();
  await prisma.foodPairing.deleteMany();
  await prisma.wineListItem.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.like.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wine.deleteMany();
  await prisma.winery.deleteMany();
  await prisma.region.deleteMany();

  const krasnodar = await prisma.region.create({
    data: { name: 'Краснодарский край', country: 'Россия', subregion: 'Кубань' },
  });
  const crimea = await prisma.region.create({
    data: { name: 'Крым', country: 'Россия', subregion: 'Южный берег Крыма' },
  });
  const rostov = await prisma.region.create({
    data: { name: 'Ростовская область', country: 'Россия', subregion: 'Долина Дона' },
  });

  const abrau = await prisma.winery.create({
    data: { name: 'Абрау-Дюрсо', country: 'Россия', region: 'Краснодарский край' },
  });
  const vedernikov = await prisma.winery.create({
    data: { name: 'Винодельня Ведерниковъ', country: 'Россия', region: 'Ростовская область' },
  });
  const massandra = await prisma.winery.create({
    data: { name: 'Массандра', country: 'Россия', region: 'Крым' },
  });
  const gaiKodzor = await prisma.winery.create({
    data: { name: 'Гай-Кодзор', country: 'Россия', region: 'Краснодарский край' },
  });
  const golubitskoe = await prisma.winery.create({
    data: { name: 'Golubitskoe Estate', country: 'Россия', region: 'Краснодарский край' },
  });
  
  const usadba = await prisma.winery.create({
    data: { name: 'Усадьба Дивноморское', country: 'Россия', region: 'Краснодарский край' },
  });

  // Narrow horizontal-fit images for Russian wines
  const wines = await Promise.all([
    prisma.wine.create({
      data: {
        name: 'Victor Dravigny Brut',
        vintage: 2020,
        type: WineType.SPARKLING,
        grapeVarieties: ['Шардоне', 'Пино Блан', 'Рислинг'],
        alcoholPct: 12.0,
        tastingNotes: 'Свежее игристое вино с нотами зеленых яблок, цитрусовых и легким оттенком хлебной корочки.',
        avgRating: 4.5,
        reviewCount: 1540,
        wineryId: abrau.id,
        regionId: krasnodar.id,
        imageUrl: 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Устрицы' }, { food: 'Легкие закуски' }, { food: 'Мягкий сыр' }] },
        prices: { create: [{ retailer: 'SimpleWine', price: 950, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Красностоп Золотовский',
        vintage: 2018,
        type: WineType.RED,
        grapeVarieties: ['Красностоп Золотовский'],
        alcoholPct: 14.5,
        tastingNotes: 'Плотное, насыщенное вино с ароматами чернослива, вишни, специй и шоколада. Гладкие танины.',
        avgRating: 4.8,
        reviewCount: 890,
        wineryId: vedernikov.id,
        regionId: rostov.id,
        imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Стейк Рибай' }, { food: 'Дичь' }, { food: 'Твердые сыры' }] },
        prices: { create: [{ retailer: 'Винотека Конг', price: 2500, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Мускат Белый Красного Камня',
        vintage: 2016,
        type: WineType.DESSERT,
        grapeVarieties: ['Мускат Белый'],
        alcoholPct: 13.0,
        tastingNotes: 'Легендарное ликерное вино с ароматами чайной розы, апельсиновой корочки и меда.',
        avgRating: 4.9,
        reviewCount: 3100,
        wineryId: massandra.id,
        regionId: crimea.id,
        imageUrl: 'https://claw.su/wines/muscat.avif',
        foodPairings: { create: [{ food: 'Фруктовые десерты' }, { food: 'Сыр с голубой плесенью' }] },
        prices: { create: [{ retailer: 'Массандра Фирменный', price: 1200, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Viognier Gai-Kodzor',
        vintage: 2021,
        type: WineType.WHITE,
        grapeVarieties: ['Вионье'],
        alcoholPct: 13.5,
        tastingNotes: 'Яркое белое вино с ароматами персика, абрикоса, белых цветов и легкой минеральностью.',
        avgRating: 4.4,
        reviewCount: 1250,
        wineryId: gaiKodzor.id,
        regionId: krasnodar.id,
        imageUrl: 'https://images.unsplash.com/photo-1563299796-17596ed6b058?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Морепродукты' }, { food: 'Азиатская кухня' }, { food: 'Птица' }] },
        prices: { create: [{ retailer: 'Золотая Балка', price: 1000, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Reserve Merlot',
        vintage: 2019,
        type: WineType.RED,
        grapeVarieties: ['Мерло'],
        alcoholPct: 13.5,
        tastingNotes: 'Округлое, мягкое вино с ароматами спелой вишни, сливы и легкими нотами дуба.',
        avgRating: 4.3,
        reviewCount: 980,
        wineryId: golubitskoe.id,
        regionId: krasnodar.id,
        imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Запеченная утка' }, { food: 'Телятина' }, { food: 'Сыры' }] },
        prices: { create: [{ retailer: 'Красное&Белое', price: 850, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Шардоне Абрау-Дюрсо',
        vintage: 2022,
        type: WineType.WHITE,
        grapeVarieties: ['Шардоне'],
        alcoholPct: 12.5,
        tastingNotes: 'Деликатное белое вино с тонами ромашки, зеленого яблока и свежей выпечки.',
        avgRating: 4.1,
        reviewCount: 300,
        wineryId: abrau.id,
        regionId: krasnodar.id,
        imageUrl: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Белая рыба' }] },
        prices: { create: [{ retailer: 'SimpleWine', price: 750, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Совиньон Блан Гай-Кодзор',
        vintage: 2022,
        type: WineType.WHITE,
        grapeVarieties: ['Совиньон Блан'],
        alcoholPct: 13.0,
        tastingNotes: 'Свежее и минеральное с оттенками крыжовника, листа черной смородины и цитрусовых.',
        avgRating: 4.5,
        reviewCount: 210,
        wineryId: gaiKodzor.id,
        regionId: krasnodar.id,
        imageUrl: 'https://images.unsplash.com/photo-1577744486603-91147a41dcf9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Козий сыр' }, { food: 'Салаты' }] },
        prices: { create: [{ retailer: 'Винотека', price: 950, currency: 'RUB' }] },
      },
    }),
    prisma.wine.create({
      data: {
        name: 'Восточный склон Каберне Совиньон',
        vintage: 2019,
        type: WineType.RED,
        grapeVarieties: ['Каберне Совиньон'],
        alcoholPct: 14.0,
        tastingNotes: 'Плотное и мощное вино с ароматами черной смородины, эвкалипта и кожи. Выдерживается в дубе.',
        avgRating: 4.6,
        reviewCount: 840,
        wineryId: usadba.id,
        regionId: krasnodar.id,
        imageUrl: 'https://images.unsplash.com/photo-1606907568152-3fb03608ccca?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=800',
        foodPairings: { create: [{ food: 'Говядина Веллингтон' }, { food: 'Жареное мясо' }] },
        prices: { create: [{ retailer: 'WineStyle', price: 3500, currency: 'RUB' }] },
      },
    })
  ]);

  console.log(`✅ Created ${wines.length} wines`);
  console.log('🍷 Seed complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
