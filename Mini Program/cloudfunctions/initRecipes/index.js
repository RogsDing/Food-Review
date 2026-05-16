const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

var sampleRecipes = [
  {
    name: '麻婆豆腐',
    category: '川菜',
    cuisine: '四川',
    difficulty: 2,
    cookTime: 20,
    servings: 2,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '嫩豆腐', amount: '400g', type: '主料' },
      { name: '牛肉末', amount: '150g', type: '主料' },
      { name: '蒜苗', amount: '3根', type: '辅料' },
      { name: '郫县豆瓣酱', amount: '2大勺', type: '调料' },
      { name: '花椒粉', amount: '1小勺', type: '调料' },
      { name: '辣椒粉', amount: '1小勺', type: '调料' },
      { name: '生抽', amount: '1勺', type: '调料' },
      { name: '淀粉水', amount: '适量', type: '调料' }
    ],
    steps: [
      { order: 1, description: '豆腐切成2cm见方的小块，放入加盐的沸水中焯烫2分钟捞出沥干备用' },
      { order: 2, description: '热锅冷油，放入牛肉末煸炒至变色出油' },
      { order: 3, description: '加入郫县豆瓣酱炒出红油，再放入蒜末姜末炒香' },
      { order: 4, description: '加入适量水（没过豆腐即可），放入豆腐块小火煮5分钟' },
      { order: 5, description: '分次淋入淀粉水勾芡，大火收汁' },
      { order: 6, description: '出锅前撒上花椒粉、辣椒粉和蒜苗段即可' }
    ],
    tags: ['辣', '下饭', '经典川菜'],
    tips: '豆腐选用嫩豆腐（南豆腐）口感更佳；花椒粉要最后撒才能保持香味。',
    viewCount: 1280,
    likeCount: 356,
    rating: 4.7,
    ratingCount: 89
  },
  {
    name: '西红柿炒鸡蛋',
    category: '家常菜',
    cuisine: '',
    difficulty: 1,
    cookTime: 10,
    servings: 2,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '鸡蛋', amount: '4个', type: '主料' },
      { name: '西红柿', amount: '2个（约300g）', type: '主料' },
      { name: '葱花', amount: '适量', type: '辅料' },
      { name: '盐', amount: '适量', type: '调料' },
      { name: '白糖', amount: '半勺', type: '调料' },
      { name: '食用油', amount: '适量', type: '调料' }
    ],
    steps: [
      { order: 1, description: '鸡蛋打散加少许盐搅匀，西红柿切成小块' },
      { order: 2, description: '热锅倒油，油热后倒入蛋液，快速划散炒至凝固盛出' },
      { order: 3, description: '锅中再加少许油，放入西红柿中火翻炒至出汁' },
      { order: 4, description: '加入少许白糖提鲜，继续翻炒' },
      { order: 5, description: '倒入炒好的鸡蛋翻炒均匀，撒上葱花即可出锅' }
    ],
    tags: ['快手菜', '家常', '下饭'],
    tips: '先炒蛋再炒西红柿是关键顺序；加少许糖可以中和西红柿的酸味。',
    viewCount: 2560,
    likeCount: 892,
    rating: 4.8,
    ratingCount: 234
  },
  {
    name: '红烧肉',
    category: '家常菜',
    cuisine: '',
    difficulty: 3,
    cookTime: 60,
    servings: 4,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '五花肉', amount: '500g', type: '主料' },
      { name: '冰糖', amount: '30g', type: '辅料' },
      { name: '葱段', amount: '3段', type: '辅料' },
      { name: '姜片', amount: '5片', type: '辅料' },
      { name: '八角', amount: '2个', type: '调料' },
      { name: '桂皮', amount: '1小段', type: '调料' },
      { name: '香叶', amount: '2片', type: '调料' },
      { name: '老抽', amount: '2勺', type: '调料' },
      { name: '生抽', amount: '3勺', type: '调料' },
      { name: '料酒', amount: '2勺', type: '调料' }
    ],
    steps: [
      { order: 1, description: '五花肉切成3cm见方的方块，冷水下锅焯水去血沫，捞出洗净' },
      { order: 2, description: '锅中放少许油，小火放入冰糖炒糖色至焦糖色冒泡' },
      { order: 3, description: '放入五花肉翻炒上色，加入葱姜八角桂皮香叶爆香' },
      { order: 4, description: '烹入料酒，加生抽老抽调色调味' },
      { order: 5, description: '加入开水没过肉块，大火烧开后转小火炖45分钟' },
      { order: 6, description: '最后大火收汁至浓稠即可出锅' }
    ],
    tags: ['硬菜', '宴客', '经典'],
    tips: '炒糖色是红烧肉的关键步骤，火候要小避免炒糊；一定要用开水炖肉。',
    viewCount: 1890,
    likeCount: 567,
    rating: 4.6,
    ratingCount: 156
  },
  {
    name: '宫保鸡丁',
    category: '川菜',
    cuisine: '四川',
    difficulty: 2,
    cookTime: 25,
    servings: 2,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '鸡胸肉', amount: '300g', type: '主料' },
      { name: '花生米', amount: '80g', type: '辅料' },
      { name: '干辣椒', amount: '15个', type: '辅料' },
      { name: '花椒', amount: '1小把', type: '辅料' },
      { name: '葱白', amount: '2段', type: '辅料' },
      { name: '蒜末', amount: '适量', type: '辅料' },
      { name: '醋', amount: '2勺', type: '调料' },
      { name: '白糖', amount: '1.5勺', type: '调料' },
      { name: '生抽', amount: '1勺', type: '调料' },
      { name: '淀粉', amount: '适量', type: '调料' }
    ],
    steps: [
      { order: 1, description: '鸡胸肉切丁，用少许料酒、盐、淀粉抓匀腌制15分钟' },
      { order: 2, description: '花生米提前炸酥脆或烤熟去皮备用' },
      { order: 3, description: '调制宫保汁：醋+白糖+生抽+淀粉+少许水混合均匀' },
      { order: 4, description: '热锅凉油滑炒鸡丁至变色盛出' },
      { order: 5, description: '底油小火炒香干辣椒和花椒（不要炒糊）' },
      { order: 6, description: '放入葱蒜爆香，倒入鸡丁翻炒，沿锅边淋入宫保汁快速翻匀' },
      { order: 7, description: '关火后撒入花生米翻拌均匀即可' }
    ],
    tags: ['麻辣', '下饭', '经典川菜'],
    tips: '干辣椒和花椒一定要用小火慢炒才香不苦；宫保汁要在最后一步快速翻匀。',
    viewCount: 980,
    likeCount: 298,
    rating: 4.5,
    ratingCount: 78
  },
  {
    name: '糖醋排骨',
    category: '家常菜',
    cuisine: '',
    difficulty: 3,
    cookTime: 45,
    servings: 3,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '猪肋排', amount: '500g', type: '主料' },
      { name: '冰糖', amount: '40g', type: '辅料' },
      { name: '白芝麻', amount: '适量', type: '辅料' },
      { name: '姜片', amount: '3片', type: '辅料' },
      { name: '料酒', amount: '2勺', type: '调料' },
      { name: '醋', amount: '3勺', type: '调料' },
      { name: '生抽', amount: '2勺', type: '调料' },
      { name: '老抽', amount: '半勺', type: '调料' }
    ],
    steps: [
      { order: 1, description: '排骨斩成小段，冷水下锅加料酒姜片焯水，撇去浮沫后捞出洗净' },
      { order: 2, description: '锅中放少许油，放入冰糖小火熬至琥珀色' },
      { order: 3, description: '放入排骨翻炒上色至每块都裹上糖色' },
      { order: 4, description: '加入没过排骨的开水，放入姜片，大火烧开转小火炖30分钟' },
      { order: 5, description: '加入生抽、老抽调色，转大火收汁' },
      { order: 6, description: '汁水收浓时沿锅边烹入醋快速翻炒，出锅撒白芝麻' }
    ],
    tags: ['酸甜', '下饭', '老少皆宜'],
    tips: '醋要最后放才能保持酸味；收汁时要用大火让汤汁浓稠挂在排骨上。',
    viewCount: 1450,
    likeCount: 432,
    rating: 4.6,
    ratingCount: 112
  },
  {
    name: '蒜蓉西兰花',
    category: '凉菜',
    cuisine: '',
    difficulty: 1,
    cookTime: 8,
    servings: 2,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '西兰花', amount: '1颗', type: '主料' },
      { name: '大蒜', amount: '5瓣', type: '辅料' },
      { name: '盐', amount: '适量', type: '调料' },
      { name: '蚝油', amount: '1勺', type: '调料' },
      { name: '食用油', amount: '适量', type: '调料' }
    ],
    steps: [
      { order: 1, description: '西兰花掰成小朵，淡盐水浸泡10分钟后冲洗干净' },
      { order: 2, description: '烧一锅开水，加少许盐和几滴油，放入西兰花焯水1-2分钟捞出过凉水' },
      { order: 3, description: '大蒜拍碎切成蒜末' },
      { order: 4, description: '热锅凉油，小火放入蒜末煸炒出香味' },
      { order: 5, description: '放入西兰花大火快速翻炒' },
      { order: 6, description: '加少许盐和蚝油调味即可出锅' }
    ],
    tags: ['清淡', '快手', '健康'],
    tips: '焯水时加油可以让西兰花颜色更翠绿；全程大火快炒保持脆嫩口感。',
    viewCount: 890,
    likeCount: 267,
    rating: 4.4,
    ratingCount: 67
  },
  {
    name: '冬瓜排骨汤',
    category: '汤羹',
    cuisine: '',
    difficulty: 2,
    cookTime: 90,
    servings: 4,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '排骨', amount: '400g', type: '主料' },
      { name: '冬瓜', amount: '500g', type: '主料' },
      { name: '姜片', amount: '5片', type: '辅料' },
      { name: '葱花', amount: '适量', type: '辅料' },
      { name: '料酒', amount: '2勺', type: '调料' },
      { name: '盐', amount: '适量', type: '调料' },
      { name: '胡椒粉', amount: '少许', type: '调料' }
    ],
    steps: [
      { order: 1, description: '排骨冷水下锅焯水，加料酒去腥，煮沸后撇去浮沫捞出洗净' },
      { order: 2, description: '砂锅中放入足量清水，加入排骨和姜片，大火煮开转小火炖40分钟' },
      { order: 3, description: '冬瓜去皮去瓤切成大块' },
      { order: 4, description: '将冬瓜块放入汤中继续炖20分钟至冬瓜透明软烂' },
      { order: 5, description: '加盐和少许胡椒粉调味，撒上葱花即可' }
    ],
    tags: ['滋补', '清淡', '养生'],
    tips: '排骨要先焯水再炖汤才能清澈；冬瓜不要切太小否则容易烂在汤里。',
    viewCount: 670,
    likeCount: 198,
    rating: 4.5,
    ratingCount: 54
  },
  {
    name: '蛋挞',
    category: '甜品',
    cuisine: '',
    difficulty: 2,
    cookTime: 40,
    servings: 12,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '蛋挞皮', amount: '12个', type: '主料' },
      { name: '鸡蛋', amount: '2个', type: '主料' },
      { name: '牛奶', amount: '100ml', type: '辅料' },
      { name: '淡奶油', amount: '100ml', type: '辅料' },
      { name: '细砂糖', amount: '30g', type: '调料' },
      { name: '低筋面粉', amount: '8g', type: '调料' }
    ],
    steps: [
      { order: 1, description: '蛋挞皮提前从冰箱取出解冻' },
      { order: 2, description: '鸡蛋打散，加入牛奶、淡奶油、砂糖搅拌均匀' },
      { order: 3, description: '筛入低筋面粉搅拌至无颗粒，过筛一遍更细腻' },
      { order: 4, description: '将蛋挞液倒入蛋挞皮中，七八分满即可' },
      { order: 5, description: '烤箱预热200度，中层烘烤20-25分钟至上色' },
      { order: 6, description: '表面出现漂亮的焦斑即可出炉' }
    ],
    tags: ['烘焙', '下午茶', '甜点'],
    tips: '蛋挞液过筛后口感更细腻；烤箱温度和时间根据自家烤箱调整。',
    viewCount: 1230,
    likeCount: 445,
    rating: 4.8,
    ratingCount: 134
  },
  {
    name: '可乐鸡翅',
    category: '家常菜',
    cuisine: '',
    difficulty: 1,
    cookTime: 30,
    servings: 3,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '鸡翅中', amount: '8只', type: '主料' },
      { name: '可乐', amount: '1罐(330ml)', type: '辅料' },
      { name: '姜片', amount: '3片', type: '辅料' },
      { name: '料酒', amount: '1勺', type: '调料' },
      { name: '生抽', amount: '1勺', type: '调料' },
      { name: '老抽', amount: '半勺', type: '调料' }
    ],
    steps: [
      { order: 1, description: '鸡翅两面各划两刀便于入味，冷水下锅焯水去血沫' },
      { order: 2, description: '热锅少油，放入鸡翅煎至两面金黄' },
      { order: 3, description: '加入姜片、料酒、生抽、老抽翻炒均匀上色' },
      { order: 4, description: '倒入可乐没过鸡翅，大火烧开转小火焖15分钟' },
      { order: 5, description: '大火收汁至浓稠，不断翻动使每只鸡翅都裹满酱汁' }
    ],
    tags: ['零失败', '下饭', '孩子最爱'],
    tips: '煎鸡翅前擦干水分不容易溅油；可乐选择普通款效果最好。',
    viewCount: 2100,
    likeCount: 756,
    rating: 4.7,
    ratingCount: 198
  },
  {
    name: '凉拌黄瓜',
    category: '凉菜',
    cuisine: '',
    difficulty: 1,
    cookTime: 10,
    servings: 2,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '黄瓜', amount: '2根', type: '主料' },
      { name: '大蒜', amount: '4瓣', type: '辅料' },
      { name: '小米椒', amount: '2个', type: '辅料' },
      { name: '香菜', amount: '1根', type: '辅料' },
      { name: '盐', amount: '适量', type: '调料' },
      { name: '白糖', amount: '半勺', type: '调料' },
      { name: '陈醋', amount: '2勺', type: '调料' },
      { name: '香油', amount: '1勺', type: '调料' },
      { name: '辣椒油', amount: '1勺', type: '调料' }
    ],
    steps: [
      { order: 1, description: '黄瓜洗净，用刀背拍松后切成段' },
      { order: 2, description: '大蒜切末，小米椒切圈，香菜切段' },
      { order: 3, description: '黄瓜段放入碗中，加入盐拌匀腌制10分钟出水后挤干' },
      { order: 4, description: '加入蒜末、小米椒、香菜' },
      { order: 5, description: '调入白糖、陈醋、香油、辣椒油拌匀即可' }
    ],
    tags: ['清爽', '开胃', '快手'],
    tips: '用刀背拍松比切的更容易入味；腌制后挤掉多余水分口感更好。',
    viewCount: 760,
    likeCount: 223,
    rating: 4.3,
    ratingCount: 58
  },
  {
    name: '酸菜鱼',
    category: '川菜',
    cuisine: '四川',
    difficulty: 4,
    cookTime: 50,
    servings: 4,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '草鱼/黑鱼', amount: '1条(约1000g)', type: '主料' },
      { name: '酸菜', amount: '300g', type: '辅料' },
      { name: '豆芽', amount: '200g', type: '辅料' },
      { name: '粉丝', amount: '1把', type: '辅料' },
      { name: '蛋清', amount: '1个', type: '调料' },
      { name: '淀粉', amount: '适量', type: '调料' },
      { name: '干辣椒', amount: '15个', type: '调料' },
      { name: '花椒', amount: '1大把', type: '调料' },
      { name: '姜片', amount: '5片', type: '调料' },
      { name: '蒜片', amount: '适量', type: '调料' }
    ],
    steps: [
      { order: 1, description: '鱼片处理：鱼骨剁块，鱼肉斜刀片成薄片，用清水反复冲洗至水清' },
      { order: 2, description: '鱼片加少许盐、料酒、蛋清、淀粉抓匀腌制15分钟' },
      { order: 3, description: '锅中热油爆炒姜片蒜片，放入鱼骨煎至微黄' },
      { order: 4, description: '加入酸菜翻炒出香味，倒入开水大火煮开转小火炖15分钟' },
      { order: 5, description: '放入豆芽和粉丝烫熟后铺在大碗底部' },
      { order: 6, description: '将鱼骨和汤倒入碗中，逐片下入鱼片烫至变色即捞出铺在上面' },
      { order: 7, description: '鱼片上放干辣椒段和花椒粒，浇上一勺热油激香即可' }
    ],
    tags: ['麻辣', '硬菜', '宴客'],
    tips: '鱼片越薄越好但要注意安全；鱼片烫的时间不能久否则会散；最后浇热油是灵魂步骤。',
    viewCount: 1100,
    likeCount: 389,
    rating: 4.6,
    ratingCount: 98
  },
  {
    name: '蒸蛋羹',
    category: '家常菜',
    cuisine: '',
    difficulty: 1,
    cookTime: 20,
    servings: 1,
    imageFileIDs: [],
    coverImage: '',
    ingredients: [
      { name: '鸡蛋', amount: '2个', type: '主料' },
      { name: '温水', amount: '200ml', type: '辅料' },
      { name: '盐', amount: '少许', type: '调料' },
      { name: '香油', amount: '几滴', type: '调料' },
      { name: '生抽', amount: '少许', type: '调料' },
      { name: '葱花', amount: '少许', type: '辅料' }
    ],
    steps: [
      { order: 1, description: '鸡蛋打散，加入少许盐搅拌均匀' },
      { order: 2, description: '慢慢加入温水（蛋水比例约1:1.5），边加边搅拌' },
      { order: 3, description: '用筛网过滤蛋液去除气泡，这是嫩滑的关键' },
      { order: 4, description: '碗口盖上保鲜膜扎几个小孔' },
      { order: 5, description: '水开后上蒸锅，中小火蒸10-12分钟' },
      { order: 6, description: '出锅淋上少许生抽和香油，撒上葱花即可' }
    ],
    tags: ['宝宝辅食', '营养', '简单'],
    tips: '一定要用温水不能用冷水；过滤蛋液是嫩滑的关键；蒸制时间不宜过长。',
    viewCount: 1680,
    likeCount: 512,
    rating: 4.6,
    ratingCount: 143
  }
]

exports.main = async (event, context) => {
  try {
    await db.createCollection('recipes')

    var results = []

    for (var i = 0; i < sampleRecipes.length; i++) {
      var recipe = {
        ...sampleRecipes[i],
        isPublic: true,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        authorId: 'system'
      }

      var result = await db.collection('recipes').add({ data: recipe })
      results.push(result._id)
    }

    return { success: true, message: '成功插入 ' + results.length + ' 条菜谱数据', ids: results }
  } catch (err) {
    if (err.message && err.message.indexOf('already exists') > -1) {
      var results = []
      for (var i = 0; i < sampleRecipes.length; i++) {
        var recipe = {
          ...sampleRecipes[i],
          isPublic: true,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          authorId: 'system'
        }
        var result = await db.collection('recipes').add({ data: recipe })
        results.push(result._id)
      }
      return { success: true, message: '成功插入 ' + results.length + ' 条菜谱数据', ids: results }
    }
    console.error('[initRecipes] 错误:', err)
    return { success: false, error: err.message }
  }
}
