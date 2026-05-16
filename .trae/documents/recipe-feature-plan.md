# 菜谱功能实现计划

## 一、需求概述
在当前美食点评小程序中新增**菜谱/点菜功能**，让用户可以浏览各类菜谱、查看菜品详情（类似餐厅点菜单），与现有点评功能形成互补。

## 二、当前项目架构分析

### 现有技术栈
- **前端**: 微信小程序原生开发 (WXML/WXSS/JS)
- **后端**: 微信云函数 + 云数据库
- **UI风格**: 橙色主题 (#FF6B00)，卡片式布局

### 现有页面结构
```
pages/
├── index/          # 首页(点评列表)
├── publish/        # 发布点评
├── detail/         # 点评详情
├── profile/        # 个人中心
├── foodFootprint/  # 美食足迹
├── cityReviews/    # 城市点评
├── search/         # 搜索
└── shopProfile/    # 店铺主页
```

### 现有云函数模式
- 数据库集合: `reviews`, `users` 等
- 云函数规范: 参数验证 → 业务逻辑 → 返回结果

## 三、功能设计

### 3.1 功能模块划分

| 模块 | 说明 |
| :--- | :--- |
| **菜谱列表页** | 分类展示菜品，支持筛选搜索 |
| **菜谱详情页** | 单道菜的完整信息展示 |
| **云函数 - getRecipes** | 获取菜谱列表 |
| **云函数 - addRecipe** | 管理员添加菜谱 |

### 3.2 页面交互流程

```
首页/个人中心 → 点击"菜谱"入口 → 菜谱列表页
                                    ↓
                            选择分类 / 搜索菜品
                                    ↓
                            浏览菜品卡片
                                    ↓
                        点击菜品 → 菜谱详情页
                                    ↓
                        查看: 图片/食材/做法/评分
```

## 四、数据库设计

### 4.1 集合名: `recipes`

```javascript
{
  _id: String,              // 自动生成
  name: String,             // 菜品名称 (必填) 如: "麻婆豆腐"
  category: String,         // 菜品分类 (必填)
  // 分类选项:
  // 川菜 | 粤菜 | 湘菜 | 鲁菜 | 苏菜 | 浙菜 | 闽菜 | 徽菜 
  // 家常菜 | 凉菜 | 热菜 | 汤羹 | 甜品 | 小吃 | 烧烤
  
  cuisine: String,          // 菜系 (可选) 如: "四川"
  
  // 菜品图片
  imageFileIDs: [String],   // 菜品图片ID数组 (最多9张)
  coverImage: String,       // 封面图URL
  
  // 基本信息
  difficulty: Number,       // 难度 1-5星 (1=简单, 5=困难)
  cookTime: Number,         // 制作时间(分钟)
  servings: Number,         // 份量(人份)
  
  // 食材信息
  ingredients: [{           // 食材列表
    name: String,           // 食材名称 如: "豆腐"
    amount: String,         // 用量 如: "300g"
    type: String            // 类型: "主料"|"辅料"|"调料"
  }],
  
  // 做法
  steps: [{
    order: Number,          // 步骤序号
    description: String,    // 步骤描述
    imageFileID: String     // 步骤配图(可选)
  }],
  
  // 口味标签
  tags: [String],           // ["辣", "下饭", "快手"]
  
  // 统计信息
  viewCount: Number,        // 浏览次数
  likeCount: Number,        // 点赞数
  rating: Number,           // 平均评分
  ratingCount: Number,      // 评分人数
  
  // 元数据
  createTime: Date,
  updateTime: Date,
  isPublic: Boolean,        // 是否公开
  authorId: String          // 创建者openId
}
```

## 五、文件清单

### 5.1 新建页面 (4个)

| 文件路径 | 用途 |
| :--- | :--- |
| `miniprogram/pages/recipes/recipes.js` | 菜谱列表页逻辑 |
| `miniprogram/pages/recipes/recipes.json` | 菜谱列表页配置 |
| `miniprogram/pages/recipes/recipes.wxml` | 菜谱列表页模板 |
| `miniprogram/pages/recipes/recipes.wxss` | 菜谱列表页样式 |
| `miniprogram/pages/recipeDetail/recipeDetail.js` | 菜谱详情页逻辑 |
| `miniprogram/pages/recipeDetail/recipeDetail.json` | 菜谱详情页配置 |
| `miniprogram/pages/recipeDetail/recipeDetail.wxml` | 菜谱详情页模板 |
| `miniprogram/pages/recipeDetail/recipeDetail.wxss` | 菜谱详情页样式 |

### 5.2 新建云函数 (2个)

| 文件路径 | 用途 |
| :--- | :--- |
| `cloudfunctions/getRecipes/index.js` | 获取菜谱列表 |
| `cloudfunctions/getRecipes/package.json` | 依赖配置 |
| `cloudfunctions/addRecipe/index.js` | 添加菜谱 |
| `cloudfunctions/addRecipe/package.json` | 依赖配置 |

### 5.3 修改文件 (2个)

| 文件路径 | 修改内容 |
| :--- | :--- |
| `miniprogram/app.json` | 注册新页面 + tabBar添加入口 |
| `miniprogram/images/icons/` | 添加菜谱图标(可选) |

## 六、详细实现步骤

### Step 1: 创建菜谱列表页 (recipes)

#### 6.1 recipes.wxml 结构设计
```xml
<view class="container">
  <!-- 顶部搜索栏 -->
  <view class="search-bar">...</view>
  
  <!-- 分类导航(横向滚动) -->
  <scroll-view class="category-scroll">
    <view class="category-item" wx:for="{{categories}}" ...>
      <!-- 图标+文字 -->
    </view>
  </scroll-view>
  
  <!-- 菜品网格/列表 -->
  <view class="recipe-list">
    <view class="recipe-card" wx:for="{{recipes}}" ...>
      <!-- 菜品封面图 -->
      <!-- 菜品名称 -->
      <!-- 难度/时间标签 -->
      <!-- 点赞数 -->
    </view>
  </view>
</view>
```

#### 6.2 recipes.js 核心方法
```javascript
// data 字段
data: {
  categories: ['全部', '川菜', '粤菜', '湘菜', '家常菜', '凉菜', '汤羹', '甜品', '小吃'],
  currentCategory: '全部',
  recipes: [],
  keyword: '',
  loading: false
}

// 方法
onLoad()        // 初始化加载
loadRecipes()   // 调用云函数获取菜谱
selectCategory() // 切换分类
onSearch()      // 搜索
goToDetail()    // 跳转详情
onPullDownRefresh() // 下拉刷新
```

#### 6.3 recipes.wxss 样式要点
- 双列瀑布流/网格布局
- 卡片圆角阴影风格与首页一致
- 橙色主题色统一

---

### Step 2: 创建菜谱详情页 (recipeDetail)

#### 6.4 recipeDetail.wxml 结构设计
```xml
<view class="container">
  <!-- 头部大图轮播 -->
  <swiper class="cover-swiper">...</swiper>
  
  <!-- 菜品基本信息卡 -->
  <view class="info-card">
    <text class="name">{{recipe.name}}</text>
    <view class="meta-row">
      <text>难度: ★{{recipe.difficulty}}</text>
      <text>时间: {{recipe.cookTime}}分钟</text>
      <text>份量: {{recipe.servings}}人份</text>
    </view>
    <view class="tags">{{recipe.tags}}</view>
  </view>
  
  <!-- 食材清单 -->
  <view class="section">
    <text class="section-title">🥬 食材清单</text>
    <view class="ingredient-group" wx:for="{{ingredientGroups}}">
      <text class="group-name">{{type}}</text>
      <view class="item" wx:for="{{items}}">
        <text>{{name}} {{amount}}</text>
      </view>
    </view>
  </view>
  
  <!-- 做法步骤 -->
  <view class="section">
    <text class="section-title">👨‍🍳 做法步骤</text>
    <view class="step" wx:for="{{steps}}">
      <text class="step-num">{{index+1}}</text>
      <text class="step-desc">{{description}}</text>
      <image wx:if="{{image}}" src="{{image}}" />
    </view>
  </view>
  
  <!-- 小贴士 -->
  <view class="tips" wx:if="{{tips}}">
    <text class="section-title">💡 小贴士</text>
    <text>{{tips}}</text>
  </view>
</view>
```

#### 6.5 recipeDetail.js 核心方法
```javascript
data: {
  recipe: {},
  ingredientGroups: [],  // 按类型分组后的食材
  currentImageIndex: 0
}

onLoad(options) {
  this.loadRecipeDetail(options.id)
}

// 预览图片
previewImage(e) { ... }

// 收藏/点赞
toggleLike() { ... }
```

---

### Step 3: 创建云函数

#### 6.6 getRecipes/index.js
```javascript
exports.main = async (event, context) => {
  const db = cloud.database()
  
  let query = db.collection('recipes').where({ isPublic: true })
  
  // 分类筛选
  if (event.category && event.category !== '全部') {
    query = query.where({ category: event.category })
  }
  
  // 关键词搜索
  if (event.keyword) {
    query = db.command.or([
      { name: db.RegExp({ regexp: event.keyword }) }
    ])
  }
  
  // 排序
  if (event.sortBy === 'hot') {
    query = query.orderBy('likeCount', 'desc')
  } else if (event.sortBy === 'newest') {
    query = query.orderBy('createTime', 'desc')
  } else {
    query = query.orderBy('rating', 'desc')
  }
  
  // 分页
  const result = await query
    .skip(event.page * 20 || 0)
    .limit(20)
    .get()
    
  return { success: true, recipes: result.data }
}
```

#### 6.7 addRecipe/index.js (管理员用)
```javascript
exports.main = async (event, context) => {
  // 权限验证(可选)
  // 数据校验
  // 插入数据库
}
```

---

### Step 4: 注册页面和入口

#### 6.8 app.json 修改
```json
{
  "pages": [
    "...",
    "pages/recipes/recipes",
    "pages/recipeDetail/recipeDetail"
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/publish/publish", "text": "发布" },
      { "pagePath": "pages/recipes/recipes", "text": "菜谱" },
      { "pagePath": "pages/profile/profile", "text": "我的" }
    ]
  }
}
```

## 七、预置菜谱数据

为方便测试，建议在首次部署时通过云控制台或初始化脚本插入示例数据：

| 菜名 | 分类 | 难度 | 时间 |
| :--- | :--- | :--- | :--- |
| 麻婆豆腐 | 川菜 | ⭐⭐ | 20分钟 |
| 西红柿炒鸡蛋 | 家常菜 | ⭐ | 10分钟 |
| 红烧肉 | 家常菜 | ⭐⭐⭐ | 60分钟 |
| 宫保鸡丁 | 川菜 | ⭐⭐ | 25分钟 |
| 糖醋排骨 | 苏菜 | ⭐⭐⭐ | 45分钟 |
| 蒜蓉西兰花 | 凉菜 | ⭐ | 8分钟 |
| 冬瓜排骨汤 | 汤羹 | ⭐⭐ | 90分钟 |
| 蛋挞 | 甜品 | ⭐⭐ | 40分钟 |

## 八、UI 设计参考

### 菜谱列表页布局
```
┌─────────────────────────┐
│ 🔍 搜索菜谱...          │
├─────────────────────────┤
│ 全部 川菜 粤菜 湘菜 >   │ ← 横向滚动
├──────────┬──────────────┤
│ ┌──────┐ │ ┌──────────┐ │
│ │ 🌶️  │ │ │ 🍅      │ │
│ │麻婆豆│ │ │西红柿炒蛋│ │
│ │ 豆   │ │ │          │ │
│ │⭐⭐ 20m│ │ │⭐ 10m   │ │
│ └──────┘ │ └──────────┘ │
│ ┌──────┐ │ ┌──────────┐ │
│ │ 🍖  │ │ │ 🍲      │ │
│ │红烧肉│ │ │宫保鸡丁  │ │
│ └──────┘ │ └──────────┘ │
└──────────┴──────────────┘
```

### 菜谱详情页布局
```
┌─────────────────────────┐
│  ═══ 大图轮播 ═══      │
├─────────────────────────┤
│ 🍜 麻婆豆腐              │
│ ⭐⭐难度 | 20分钟 | 2人份│
│ #辣 #下饭 #经典川菜      │
├─────────────────────────┤
│ 🥬 食材清单              │
│ 主料:                    │
│   · 豆腐 300g            │
│   · 牛肉末 150g          │
│ 辅料:                    │
│   · 蒜苗 2根             │
│ 调料:                    │
│   · 郫县豆瓣酱 1勺       │
├─────────────────────────┤
│ 👨‍🍳 做法步骤            │
│ ① 豆腐切块焯水...        │
│ ② 热油炒牛肉末...        │
│ ③ 加入豆瓣酱...          │
│ ④ 放入豆腐...            │
├─────────────────────────┤
│ 💡 小贴士                │
│ 豆腐选用嫩豆腐口感更佳... │
└─────────────────────────┘
```

## 九、注意事项

1. **图标资源**: 需要准备 tabBar 的菜谱图标 (普通态/选中态各一张)
2. **数据初始化**: 首次运行需要手动或脚本导入菜谱数据
3. **图片存储**: 菜谱图片需上传至微信云存储
4. **性能优化**: 列表页使用虚拟滚动或分页加载
5. **扩展性**: 后续可考虑添加收藏、评论、分享等功能

## 十、实施顺序

| 序号 | 任务 | 优先级 |
| :--- | :--- | :--- |
| 1 | 创建 getRecipes 云函数 | P0 |
| 2 | 创建菜谱列表页 (recipes) | P0 |
| 3 | 创建菜谱详情页 (recipeDetail) | P0 |
| 4 | 修改 app.json 注册页面和 tabBar | P0 |
| 5 | 创建 addRecipe 云函数(管理员) | P1 |
| 6 | 插入预置菜谱测试数据 | P1 |
| 7 | 准备图标资源 | P1 |
