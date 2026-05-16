# 功能实现计划：光顾次数标注与中国地图足迹

## 一、需求分析

### 1.1 功能一：光顾次数标注
- **需求描述**：对同一店铺的多次点评，在首页点评列表的店铺名后自动标注光顾次数，如"(二刷)"、"(三刷)"等
- **现有基础**：云函数 `addReview` 已计算并存储 `visitCount` 字段
- **实现位置**：首页 `index.js` 和 `index.wxml`

### 1.2 功能二：中国地图足迹
- **需求描述**：在美食足迹页面添加中国地图，每次有新的城市点评发布时点亮该城市
- **实现位置**：美食足迹页面 `foodFootprint.js` 和 `foodFootprint.wxml`

## 二、文件修改清单

| 文件路径 | 修改类型 | 说明 |
| :--- | :--- | :--- |
| `miniprogram/pages/index/index.js` | 修改 | 添加中文数字转换函数，处理 visitCount 显示 |
| `miniprogram/pages/index/index.wxml` | 修改 | 在店铺名后显示光顾次数标识 |
| `miniprogram/pages/foodFootprint/foodFootprint.js` | 修改 | 添加城市收集逻辑，获取用户点评过的城市列表 |
| `miniprogram/pages/foodFootprint/foodFootprint.wxml` | 修改 | 添加中国地图组件和城市点亮标记 |
| `miniprogram/pages/foodFootprint/foodFootprint.wxss` | 修改 | 添加地图样式 |

## 三、实现方案

### 3.1 光顾次数标注实现

#### 3.1.1 数据层
- 云函数 `addReview` 已计算 `visitCount`，无需修改
- `getReviews` 云函数返回的数据已包含 `visitCount` 字段

#### 3.1.2 前端逻辑（index.js）
```javascript
// 添加中文数字转换函数
getVisitCountLabel: function(count) {
  const chineseNumbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (count <= 1) return '';
  if (count <= 10) return `(${chineseNumbers[count]}刷)`;
  return `(${count}刷)`;
}
```

#### 3.1.3 前端展示（index.wxml）
```xml
<text class="shop-name">{{item.shopName}}{{item.visitCountLabel}}</text>
```

### 3.2 中国地图足迹实现

#### 3.2.1 数据层
- 从用户点评数据中提取所有城市（已在 `foodFootprint.js` 中实现）
- 需要创建城市坐标映射表（经纬度）

#### 3.2.2 前端逻辑（foodFootprint.js）
- 收集所有点评过的城市
- 创建城市坐标映射
- 标记已访问的城市

#### 3.2.3 前端展示（foodFootprint.wxml）
- 使用 SVG 绘制中国地图
- 在对应城市位置添加点亮标记

## 四、城市坐标映射表

使用简化的中国主要城市坐标（相对位置）：

| 城市 | X坐标 | Y坐标 |
| :--- | :--- | :--- |
| 北京 | 116 | 39 |
| 上海 | 121 | 31 |
| 广州 | 113 | 23 |
| 深圳 | 114 | 22 |
| 杭州 | 120 | 30 |
| 成都 | 104 | 30 |
| 武汉 | 114 | 30 |
| 南京 | 118 | 32 |
| 西安 | 109 | 34 |
| 重庆 | 106 | 29 |

## 五、实现步骤

1. **修改 index.js**：添加 `getVisitCountLabel` 函数，在获取点评数据时处理 visitCount
2. **修改 index.wxml**：在店铺名后显示光顾次数标识
3. **修改 foodFootprint.js**：添加城市收集和坐标映射逻辑
4. **修改 foodFootprint.wxml**：添加 SVG 中国地图和城市标记
5. **修改 foodFootprint.wxss**：添加地图样式

## 六、风险评估

| 风险 | 等级 | 应对方案 |
| :--- | :--- | :--- |
| 城市名称不匹配 | 中 | 使用模糊匹配处理城市名称变体 |
| 地图显示适配 | 低 | 使用响应式 SVG 确保不同屏幕适配 |
| 数据加载性能 | 低 | 城市数据量较小，影响可忽略 |

## 七、测试要点

1. 验证第二次点评显示"(二刷)"
2. 验证第三次点评显示"(三刷)"
3. 验证第一次点评不显示任何标识
4. 验证地图正确显示已访问城市
5. 验证新增城市点评后地图自动更新