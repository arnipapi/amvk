// ===== КАТАЛОГ «Арм - вкус» — редактируйте здесь =====
// price — цена в рублях; inStock: false — товар «нет в наличии»; images — фото (первое — главное)
// weight — оставьте пустым "", если не нужно показывать (сейчас не указан)
window.PRODUCTS = [
  { id: 'shokochella', name: 'Шокочелла', price: 350, inStock: true, weight: '',
    short: 'Конфеты в шоколаде с кокосовой стружкой, миндальными лепестками и ореховой крошкой',
    description: 'Шоколадные конфеты ручной работы в нескольких вариантах оформления: в кокосовой стружке, с миндальными лепестками и с ореховой крошкой.',
    images: ['images/shokochella-1.jpg', 'images/shokochella-2.jpg', 'images/shokochella-3.jpg'] },
  { id: 'churchkhela', name: 'Чурчхелла', price: 350, inStock: true, weight: '',
    short: 'Традиционная восточная сладость с грецким орехом во фруктовой оболочке',
    description: 'Классическая чурчхелла: нить грецких орехов в плотной фруктовой оболочке. Выпускается в разных цветах и вкусах.',
    images: ['images/churchkhela-1.jpg', 'images/churchkhela-2.jpg', 'images/churchkhela-3.jpg'] },
  { id: 'fruit-roll', name: 'Фруктовый рулет с грецким орехом', price: 450, inStock: true, weight: '',
    short: 'Фруктовый рулет с грецким орехом и сухофруктами',
    description: 'Рулет в тонкой фруктовой пастиле с начинкой из грецкого ореха и сухофруктов.',
    images: ['images/roll-1.jpg', 'images/roll-2.jpg', 'images/roll-3.jpg'] },
  { id: 'pakhlava', name: 'Пахлава', price: 300, inStock: true, weight: '',
    short: 'Слоёное тесто, грецкий орех и сироп',
    description: 'Пахлава ромбиками: слоёное тесто с ореховой начинкой, сверху — половинка грецкого ореха.',
    images: ['images/pakhlava-1.jpg', 'images/pakhlava-2.jpg', 'images/pakhlava-3.jpg'] },
  { id: 'fruchella', name: 'Фручелла', price: 400, inStock: true, weight: '',
    short: 'Курага и грецкий орех в ягодной глазури',
    description: 'Фручелла: курага и грецкий орех в яркой ягодной глазури.',
    images: ['images/fruchella-1.jpg', 'images/fruchella-2.jpg', 'images/fruchella-3.jpg'] }
];
// Настройки сайта
window.SITE = { whatsapp: '79040760000', // номер владельца для заказов (формат 7XXXXXXXXXX)
   instagram: 'https://www.instagram.com/armvkus_company_55/', popular: ['churchkhela', 'pakhlava', 'fruchella'] };

