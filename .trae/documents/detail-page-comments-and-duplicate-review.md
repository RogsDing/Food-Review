# 点评详情页评论区功能 & 二次点评处理方案（创新版）

## 一、需求分析

### 1.1 评论区功能
在点评详情页（`detail`）底部添加评论区，允许用户对点评发表评论，形成互动。

### 1.2 二次点评问题
当前系统允许同一用户对同一店铺发布多条点评，需要确定处理策略。

---

## 二、行业调研结论

| 平台 | 策略 | 特点 |
|------|------|------|
| **Google Maps** | 严格限制：同一账号同一商户仅1条活跃评论 | 可编辑更新，不可新增 |
| **大众点评/美团** | 允许多次真实体验后的评价 | 经AI+人工审核确认后展示，机审会先标记为"重复" |
| **Yelp** | 同Google，单条原则 | 强调真实性 |

**关键洞察**：大平台的核心矛盾是"防刷评" vs "允许真实复访评价"。我们作为个人美食记录工具，**不需要防刷评**，反而应该**鼓励用户记录每次探店体验**——这正是我们的产品定位优势。

---

## 三、二次点评创新方案：「美食足迹」体系

### 3.1 核心理念
**将"二次点评"从"重复操作"重新定义为有价值的"探店记录行为"。**

不是阻止用户重复点评，而是让每次重复点评都变得**有意义、有仪式感、有成长感**。

### 3.2 四大创新机制

#### 🔄 机制一：探店时间线（Visit Timeline）

同一店铺的多次点评以**时间线形式串联**，每次自动标注光顾次数：

```
🍜 老王牛肉面 — 你的美食足迹
━━━━━━━━━━━━━━━━━━━━━
  🥇 第1次 · 2025-03-15    ⭐4.0  "味道不错，推荐..."
  🥈 第2次 · 2025-06-20    ⭐4.5  "比上次更好吃了！"
  🥉 第3次 · 2026-01-08    ⭐5.0  "成为我的食堂了😂"
  ➕ 发布第4次点评 →
```

- 在**店铺维度**聚合用户的多次点评（而非散落在列表中）
- 每条点评自动标注 `visitCount`（第N次光顾）
- 展示评分变化趋势（如 4.0→4.5→5.0，说明越吃越好）

#### 🏅 机制二：回头客等级徽章（Loyalty Badge）

根据对**同一店铺**的点评次数，授予不同等级称号：

| 点评次数 | 徽章等级 | 称号 | 图标 |
|----------|---------|------|------|
| 1次 | Lv.1 初识 | 新客初探 | 🌱 |
| 2次 | Lv.2 常客 | 回头客 | 🔥 |
| 3-5次 | Lv.3 老饕 | 铁杆粉丝 | ⭐ |
| 6-10次 | Lv.4 行家 | 品鉴达人 | 👑 |
| 10次+ | Lv.5 骨灰 | 店铺代言人 | 💎 |

- 徽章显示在**每条点评卡片上**和**个人中心的美食足迹页面**
- 达成新等级时触发**成就解锁动画**
- 个人中心新增「美食足迹」入口，按店铺分组展示所有探店记录

#### 📊 机制三：智能对比视图（Smart Compare）

当用户对已点评过的店铺再次发布时，进入**对比模式**：

```
┌─────────────────────────────────────┐
│  🍜 你已经来过老王牛肉面 2 次了！     │
│                                     │
│  上次点评摘要:                       │
│  ⭐ 4.5分 · 2025-06-20              │
│  "比上次更好吃了！"                  │
│                                     │
│  ─────────────                      │
│  这次的体验如何？                     │
│  [比上次好] [差不多] [不如上次]       │
│                                     │
│  （选择后自动填充评分参考值）          │
└─────────────────────────────────────┘
```

- 发布页输入店铺名后，实时检测是否为二次点评
- 弹出**上次点评摘要卡片**（评分、内容片段、时间）
- 提供**快速对比选项**，帮助用户快速表达本次感受
- 选择后智能建议评分区间

#### 🏪 机制四：店铺档案卡（Shop Profile Card）

为每个被点评过的店铺自动生成一张**档案卡**：

```
┌──────────────────────────────────┐
│  🍜 老王牛肉面                   │
│  ───────────────────────────     │
│  你的综合评分: ⭐ 4.5 (3次)      │
│  评分趋势:   4.0 → 4.5 → 5.0 📈 │
│  首次探访:   2025-03-15          │
│  最近一次:   2026-01-08          │
│  回头客等级:  🥉 老饕 (Lv.3)     │
│  总消费:     ¥127 (3次)          │
│  推荐菜品:   牛肉面 ×3           │
│  ───────────────────────────     │
│  [查看完整时间线] [继续写点评]     │
└──────────────────────────────────┘
```

- 点击首页任意点评卡片的**店铺名称**可进入该店的档案卡
- 自动汇总：综合评分趋势、总探访次数、总消费金额、最常点的内容关键词
- 档案卡页可作为独立页面，也可内嵌在发布流程中

### 3.3 完整交互流程

```
发布页输入店铺名
    ↓
实时调用 checkShopHistory 云函数
    ↓
├── 首次点评 → 正常发布流程
│
└── 已有点评记录 → 触发「美食足迹」模式
        ↓
    显示上次点评摘要 + 回头客等级提示
        ↓
    用户选择对比选项 / 直接填写
        ↓
    提交时自动标记 visitCount = N
        ↓
    成功后触发等级升级检测（如有）
        ↓
    Toast："第3次光顾老王牛肉面！🔥 常客徽章已点亮"
```

---

## 四、评论区功能设计（保持不变）

### 4.1 数据库设计

新增 `comments` 集合：

| 字段           | 类型     | 说明                        |
| ------------ | ------ | ------------------------- |
| `_id`        | String | 自动生成                      |
| `reviewId`   | String | 关联的点评ID                   |
| `content`    | String | 评论内容（必填，最多200字）           |
| `openId`     | String | 评论者openId（云函数自动注入）        |
| `author`     | Object | `{ nickName, avatarUrl }` |
| `createTime` | String | 创建时间 ISO格式                |

### 4.2 UI 设计

在详情页 `detail-content` 下方新增评论区，包含：
1. **评论统计栏**：显示"评论 (X条)"
2. **评论输入区**：底部固定输入框 + 发送按钮（需登录）
3. **评论列表**：每条评论展示头像、昵称、内容、时间
4. **空状态**：无评论时显示"暂无评论，快来抢沙发~"
5. **删除功能**：仅评论作者可删除自己的评论

---

## 五、实现步骤

### 第一阶段：评论区基础功能（核心）

| 步骤 | 内容 | 文件 |
|------|------|------|
| 1 | 创建 `addComment` 云函数 | `cloudfunctions/addComment/index.js` + `package.json` |
| 2 | 创建 `getComments` 云函数 | `cloudfunctions/getComments/index.js` + `package.json` |
| 3 | 创建 `deleteComment` 云函数 | `cloudfunctions/deleteComment/index.js` + `package.json` |
| 4 | 详情页 WXML 添加评论区 UI | `miniprogram/pages/detail/detail.wxml` |
| 5 | 详情页 JS 添加评论逻辑 | `miniprogram/pages/detail/detail.js` |
| 6 | 详情页 WXSS 添加样式 | `miniprogram/pages/detail/detail.wxss` |

### 第二阶段：美食足迹体系（创新亮点）

| 步骤 | 内容 | 文件 |
|------|------|------|
| 7 | 创建 `checkShopHistory` 云函数 | `cloudfunctions/checkShopHistory/index.js` + `package.json` |
| 8 | 修改 reviews 数据模型添加 visitCount 字段 | `cloudfunctions/addReview/index.js` |
| 9 | 发布页集成美食足迹检测与对比弹窗 | `miniprogram/pages/publish/publish.wxml` + `.js` + `.wxss` |
| 10 | 新增店铺档案卡页面 | `miniprogram/pages/shopProfile/shopProfile.*` (4个文件) |
| 11 | 个人中心添加「美食足迹」入口 | `miniprogram/pages/profile/profile.wxml` + `.js` |
| 12 | 成就解锁动画组件 | `miniprogram/components/badgeUnlock/*` |

---

## 六、文件修改清单

### 评论区（第一阶段）

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 新建 | `cloudfunctions/addComment/index.js` | 添加评论云函数 |
| 新建 | `cloudfunctions/addComment/package.json` | 依赖配置 |
| 新建 | `cloudfunctions/getComments/index.js` | 获取评论列表云函数 |
| 新建 | `cloudfunctions/getComments/package.json` | 依赖配置 |
| 新建 | `cloudfunctions/deleteComment/index.js` | 删除评论云函数 |
| 新建 | `cloudfunctions/deleteComment/package.json` | 依赖配置 |
| 修改 | `miniprogram/pages/detail/detail.wxml` | 添加评论区 UI |
| 修改 | `miniprogram/pages/detail/detail.js` | 添加评论交互逻辑 |
| 修改 | `miniprogram/pages/detail/detail.wxss` | 添加评论区样式 |

### 美食足迹体系（第二阶段）

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 新建 | `cloudfunctions/checkShopHistory/index.js` | 检查店铺历史云函数 |
| 新建 | `cloudfunctions/checkShopHistory/package.json` | 依赖配置 |
| 修改 | `cloudfunctions/addReview/index.js` | 添加 visitCount 字段逻辑 |
| 修改 | `miniprogram/pages/publish/publish.wxml` | 对比弹窗UI |
| 修改 | `miniprogram/pages/publish/publish.js` | 美食足迹检测逻辑 |
| 修改 | `miniprogram/pages/publish/publish.wxss` | 对比弹窗样式 |
| 新建 | `miniprogram/pages/shopProfile/shopProfile.wxml` | 店铺档案卡页面 |
| 新建 | `miniprogram/pages/shopProfile/shopProfile.js` | 档案卡逻辑 |
| 新建 | `miniprogram/pages/shopProfile/shopProfile.wxss` | 档案卡样式 |
| 新建 | `miniprogram/pages/shopProfile/shopProfile.json` | 页面配置 |
| 修改 | `miniprogram/app.json` | 注册新页面 |
| 修改 | `miniprogram/pages/profile/profile.wxml` | 添加美食足迹入口 |
| 修改 | `miniprogram/pages/profile/profile.js` | 美食足迹跳转逻辑 |

---

## 七、注意事项

1. **云函数部署**：新建的云函数需要在微信开发者工具中手动部署或上传
2. **数据库权限**：`comments` 集合需设置权限（所有用户可读，仅创建者可写）
3. **性能考虑**：评论列表暂不分页；`checkShopHistory` 使用 shopName + openId 复合索引
4. **安全性**：所有写操作通过云函数完成，openId 由云函数自动获取
5. **visitCount 计算**：由云函数根据 `shopName` + `openId` 查询已有记录数 + 1 得出
6. **底部操作栏适配**：评论区在操作栏上方，底部输入栏固定在操作栏之上，注意 z-index
7. **渐进式实现**：先完成第一阶段评论区，再迭代第二阶段美食足迹体系
