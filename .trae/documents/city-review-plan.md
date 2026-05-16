# 实现计划：点击城市卡片显示该城市所有点评

## 一、需求描述
在美食足迹页面，点击城市卡片后能够展开/弹出显示该城市的所有点评记录。

## 二、当前代码分析

### 现有数据结构
- `visitedCities`: 已访问的城市名称数组
- `shopGroups`: 按店铺分组的点评列表
- `reviews` (未持久化): 原始点评数据，包含 city 字段

### 现有功能
- 城市卡片横向滚动展示
- 点击店铺跳转到店铺详情页

## 三、实现方案

### 方案选择：内嵌式展开（非弹窗）
在统计信息栏下方内嵌展示选中城市的点评列表，用户体验更流畅。

## 四、修改文件清单

| 文件 | 修改内容 |
| :--- | :--- |
| `foodFootprint.js` | 添加状态字段和交互方法 |
| `foodFootprint.wxml` | 添加城市详情展示区域 |
| `foodFootprint.wxss` | 添加新样式 |

## 五、详细实现步骤

### Step 1: 修改 foodFootprint.js

**1.1 新增 data 字段**
```javascript
data: {
  // ... 现有字段
  selectedCity: '',        // 当前选中的城市
  cityReviews: [],         // 该城市的点评列表
  showCityDetail: false,   // 是否显示城市详情
  allReviews: []           // 保存原始点评数据
}
```

**1.2 修改 loadFootprint 方法**
- 将 reviews 数据保存到 `allReviews`
- 在 setData 时初始化 `allReviews`

**1.3 新增 selectCity 方法**
```javascript
selectCity: function(e) {
  var city = e.currentTarget.dataset.city;
  
  if (this.data.selectedCity === city) {
    // 再次点击同一城市，关闭详情
    this.setData({
      selectedCity: '',
      cityReviews: [],
      showCityDetail: false
    });
    return;
  }
  
  // 筛选该城市的所有点评
  var cityReviews = this.data.allReviews.filter(function(r) {
    return r.city === city;
  });
  
  // 按时间倒序排列
  cityReviews.sort(function(a, b) {
    return new Date(b.createTime) - new Date(a.createTime);
  });
  
  this.setData({
    selectedCity: city,
    cityReviews: cityReviews,
    showCityDetail: true
  });
}
```

**1.4 新增 closeCityDetail 方法**
```javascript
closeCityDetail: function() {
  this.setData({
    selectedCity: '',
    cityReviews: [],
    showCityDetail: false
  });
}
```

**1.5 新增 goToDetail 方法（查看城市点评详情）**
```javascript
goToCityReviewDetail: function(e) {
  var reviewId = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '/pages/detail/detail?id=' + reviewId
  });
}
```

### Step 2: 修改 foodFootprint.wxml

**2.1 城市卡片添加点击事件**
```xml
<view class="city-card {{item === selectedCity ? 'city-card-active' : ''}}" 
      wx:for="{{visitedCities}}" 
      wx:key="index"
      bindtap="selectCity"
      data-city="{{item}}">
```

**2.2 统计信息栏后添加城市详情区域**
```xml
<!-- 城市详情展示 -->
<view class="city-detail" wx:if="{{showCityDetail}}">
  <view class="city-detail-header">
    <view class="city-detail-title-wrap">
      <text class="city-detail-title">📍 {{selectedCity}} 的美食足迹</text>
      <text class="city-detail-count">共 {{cityReviews.length}} 条点评</text>
    </view>
    <view class="city-detail-close" bindtap="closeCityDetail">
      <text>✕</text>
    </view>
  </view>
  
  <view class="city-review-list">
    <view class="city-review-item" 
          wx:for="{{cityReviews}}" 
          wx:key="_id"
          bindtap="goToCityReviewDetail"
          data-id="{{item._id}}">
      <view class="city-review-top">
        <text class="city-review-shop">{{item.shopName}}</text>
        <text class="city-review-rating">{{item.rating}}★</text>
      </view>
      <view class="city-review-content">{{item.content}}</view>
      <view class="city-review-bottom">
        <text class="city-review-category">{{item.category}}</text>
        <text class="city-review-time">{{item.createTime.substring(0, 10)}}</text>
      </view>
    </view>
  </view>
  
  <view class="city-detail-empty" wx:if="{{cityReviews.length === 0}}">
    <text>该城市暂无点评记录</text>
  </view>
</view>
```

### Step 3: 修改 foodFootprint.wxss

**3.1 城市卡片激活样式**
```css
.city-card-active {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border-color: #ff6b00;
}

.city-card-active .city-card-name {
  color: #fff;
}

.city-card-active .city-card-icon {
  background-color: rgba(255, 255, 255, 0.3);
}
```

**3.2 城城详情区域样式**
```css
.city-detail {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(255, 107, 0, 0.12);
}

.city-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.city-detail-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.city-detail-count {
  font-size: 22rpx;
  color: #999;
  margin-left: 12rpx;
}

.city-detail-close {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 城市点评列表样式 */
.city-review-list {
  max-height: 600rpx;
  overflow-y: auto;
}

.city-review-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.city-review-item:last-child {
  border-bottom: none;
}

.city-review-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.city-review-shop {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.city-review-rating {
  font-size: 26rpx;
  color: #ff6b00;
  font-weight: 500;
}

.city-review-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8rpx;
}

.city-review-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.city-review-category {
  font-size: 22rpx;
  color: #ff6b00;
  background-color: #fff8f3;
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
}

.city-review-time {
  font-size: 22rpx;
  color: #999;
}
```

## 六、交互流程

```
用户点击城市卡片 → selectCity() 被调用
  ↓
判断是否已选中该城市
  ├─ 是 → 关闭详情（收起）
  └─ 否 → 从 allReviews 筛选该城市点评
           ↓
         更新 selectedCity, cityReviews, showCityDetail
           ↓
         页面渲染城市详情区域
           ↓
         用户可点击某条点评 → goToCityReviewDetail()
           ↓
         跳转到详情页
         
用户点击 ✕ 关闭按钮 → closeCityDetail()
  ↓
清空选中状态，隐藏详情区域
```

## 七、注意事项

1. **性能考虑**: `allReviews` 数据量不大（个人点评），前端筛选即可
2. **数据复用**: 复用现有的 `reviews` 数据，无需额外请求
3. **样式一致性**: 与现有店铺列表保持统一的设计风格
4. **交互友好**: 支持再次点击同一城市关闭详情
