Page({
  data: {
    shopGroups: [],
    totalShops: 0,
    totalReviews: 0,
    visitedCities: [],
    mapCities: []
  },

  // 中国主要城市坐标映射（简化的相对坐标）
  cityCoordinates: {
    '北京': { x: 38, y: 22 },
    '上海': { x: 55, y: 35 },
    '广州': { x: 48, y: 68 },
    '深圳': { x: 49, y: 71 },
    '杭州': { x: 52, y: 37 },
    '成都': { x: 22, y: 52 },
    '武汉': { x: 42, y: 48 },
    '南京': { x: 50, y: 38 },
    '西安': { x: 28, y: 38 },
    '重庆': { x: 25, y: 58 },
    '天津': { x: 39, y: 24 },
    '苏州': { x: 51, y: 36 },
    '郑州': { x: 39, y: 42 },
    '长沙': { x: 44, y: 56 },
    '青岛': { x: 48, y: 28 },
    '宁波': { x: 54, y: 38 },
    '济南': { x: 45, y: 31 },
    '哈尔滨': { x: 42, y: 12 },
    '沈阳': { x: 45, y: 18 },
    '大连': { x: 48, y: 18 },
    '无锡': { x: 51, y: 35 },
    '佛山': { x: 48, y: 66 },
    '东莞': { x: 49, y: 69 },
    '合肥': { x: 46, y: 40 },
    '厦门': { x: 53, y: 62 },
    '福州': { x: 52, y: 60 },
    '石家庄': { x: 37, y: 28 },
    '长春': { x: 43, y: 14 },
    '南宁': { x: 45, y: 74 },
    '昆明': { x: 32, y: 70 },
    '太原': { x: 35, y: 32 },
    '贵阳': { x: 31, y: 64 },
    '南昌': { x: 47, y: 49 },
    '温州': { x: 55, y: 41 },
    '绍兴': { x: 53, y: 38 },
    '常州': { x: 50, y: 35 },
    '嘉兴': { x: 52, y: 35 },
    '金华': { x: 54, y: 40 },
    '惠州': { x: 50, y: 69 },
    '中山': { x: 49, y: 67 },
    '珠海': { x: 50, y: 72 },
    '烟台': { x: 47, y: 27 },
    '潍坊': { x: 45, y: 29 },
    '徐州': { x: 47, y: 34 },
    '南通': { x: 51, y: 34 },
    '扬州': { x: 49, y: 36 },
    '镇江': { x: 50, y: 37 },
    '泰州': { x: 50, y: 36 },
    '盐城': { x: 49, y: 33 },
    '淮安': { x: 48, y: 34 },
    '连云港': { x: 47, y: 32 },
    '宿迁': { x: 47, y: 35 },
    '临沂': { x: 44, y: 31 },
    '济宁': { x: 43, y: 33 },
    '菏泽': { x: 42, y: 36 },
    '邯郸': { x: 36, y: 32 },
    '保定': { x: 37, y: 26 },
    '唐山': { x: 40, y: 23 },
    '秦皇岛': { x: 41, y: 22 },
    '廊坊': { x: 39, y: 24 },
    '沧州': { x: 38, y: 28 },
    '邢台': { x: 36, y: 34 },
    '衡水': { x: 37, y: 31 },
    '张家口': { x: 35, y: 22 },
    '承德': { x: 39, y: 21 },
    '大同': { x: 34, y: 26 },
    '长治': { x: 35, y: 34 },
    '晋城': { x: 36, y: 35 },
    '晋中': { x: 35, y: 32 },
    '运城': { x: 35, y: 38 },
    '忻州': { x: 34, y: 29 },
    '临汾': { x: 35, y: 36 },
    '吕梁': { x: 34, y: 34 },
    '呼和浩特': { x: 34, y: 20 },
    '包头': { x: 32, y: 20 },
    '鄂尔多斯': { x: 30, y: 24 },
    '沈阳': { x: 45, y: 18 },
    '大连': { x: 48, y: 18 },
    '鞍山': { x: 46, y: 19 },
    '抚顺': { x: 46, y: 18 },
    '本溪': { x: 47, y: 18 },
    '丹东': { x: 49, y: 18 },
    '锦州': { x: 47, y: 20 },
    '营口': { x: 47, y: 21 },
    '阜新': { x: 45, y: 20 },
    '辽阳': { x: 46, y: 19 },
    '盘锦': { x: 47, y: 21 },
    '铁岭': { x: 45, y: 17 },
    '朝阳': { x: 47, y: 19 },
    '葫芦岛': { x: 48, y: 21 },
    '长春': { x: 43, y: 14 },
    '吉林': { x: 43, y: 15 },
    '四平': { x: 43, y: 17 },
    '辽源': { x: 44, y: 16 },
    '通化': { x: 45, y: 16 },
    '白山': { x: 45, y: 17 },
    '松原': { x: 42, y: 15 },
    '白城': { x: 41, y: 16 },
    '哈尔滨': { x: 42, y: 12 },
    '齐齐哈尔': { x: 39, y: 11 },
    '鸡西': { x: 45, y: 11 },
    '鹤岗': { x: 46, y: 11 },
    '双鸭山': { x: 46, y: 12 },
    '大庆': { x: 40, y: 12 },
    '伊春': { x: 45, y: 10 },
    '佳木斯': { x: 47, y: 12 },
    '七台河': { x: 46, y: 12 },
    '牡丹江': { x: 47, y: 14 },
    '黑河': { x: 43, y: 9 },
    '绥化': { x: 44, y: 12 },
    '南京': { x: 50, y: 38 },
    '苏州': { x: 51, y: 36 },
    '无锡': { x: 51, y: 35 },
    '常州': { x: 50, y: 35 },
    '徐州': { x: 47, y: 34 },
    '南通': { x: 51, y: 34 },
    '连云港': { x: 47, y: 32 },
    '淮安': { x: 48, y: 34 },
    '盐城': { x: 49, y: 33 },
    '扬州': { x: 49, y: 36 },
    '镇江': { x: 50, y: 37 },
    '泰州': { x: 50, y: 36 },
    '宿迁': { x: 47, y: 35 },
    '杭州': { x: 52, y: 37 },
    '宁波': { x: 54, y: 38 },
    '温州': { x: 55, y: 41 },
    '嘉兴': { x: 52, y: 35 },
    '湖州': { x: 51, y: 36 },
    '绍兴': { x: 53, y: 38 },
    '金华': { x: 54, y: 40 },
    '衢州': { x: 53, y: 43 },
    '舟山': { x: 55, y: 37 },
    '台州': { x: 55, y: 43 },
    '丽水': { x: 53, y: 45 },
    '合肥': { x: 46, y: 40 },
    '芜湖': { x: 47, y: 39 },
    '蚌埠': { x: 45, y: 40 },
    '淮南': { x: 45, y: 40 },
    '马鞍山': { x: 47, y: 39 },
    '淮北': { x: 44, y: 39 },
    '铜陵': { x: 47, y: 41 },
    '安庆': { x: 47, y: 44 },
    '黄山': { x: 47, y: 46 },
    '滁州': { x: 46, y: 39 },
    '阜阳': { x: 44, y: 42 },
    '宿州': { x: 44, y: 38 },
    '六安': { x: 45, y: 43 },
    '亳州': { x: 43, y: 40 },
    '池州': { x: 47, y: 44 },
    '宣城': { x: 48, y: 41 },
    '福州': { x: 52, y: 60 },
    '厦门': { x: 53, y: 62 },
    '莆田': { x: 52, y: 60 },
    '三明': { x: 51, y: 58 },
    '泉州': { x: 52, y: 61 },
    '漳州': { x: 52, y: 63 },
    '南平': { x: 51, y: 57 },
    '龙岩': { x: 51, y: 63 },
    '宁德': { x: 52, y: 58 },
    '南昌': { x: 47, y: 49 },
    '九江': { x: 46, y: 47 },
    '景德镇': { x: 46, y: 46 },
    '萍乡': { x: 45, y: 51 },
    '新余': { x: 45, y: 51 },
    '鹰潭': { x: 47, y: 50 },
    '赣州': { x: 47, y: 57 },
    '吉安': { x: 46, y: 53 },
    '宜春': { x: 45, y: 50 },
    '抚州': { x: 47, y: 51 },
    '上饶': { x: 48, y: 48 },
    '济南': { x: 45, y: 31 },
    '青岛': { x: 48, y: 28 },
    '淄博': { x: 45, y: 30 },
    '枣庄': { x: 44, y: 33 },
    '东营': { x: 46, y: 28 },
    '烟台': { x: 47, y: 27 },
    '潍坊': { x: 45, y: 29 },
    '济宁': { x: 43, y: 33 },
    '泰安': { x: 44, y: 32 },
    '威海': { x: 49, y: 27 },
    '日照': { x: 47, y: 31 },
    '临沂': { x: 44, y: 31 },
    '德州': { x: 43, y: 30 },
    '聊城': { x: 43, y: 32 },
    '滨州': { x: 45, y: 29 },
    '菏泽': { x: 42, y: 36 },
    '郑州': { x: 39, y: 42 },
    '开封': { x: 39, y: 43 },
    '洛阳': { x: 37, y: 43 },
    '平顶山': { x: 38, y: 45 },
    '安阳': { x: 40, y: 39 },
    '鹤壁': { x: 40, y: 40 },
    '新乡': { x: 39, y: 41 },
    '焦作': { x: 38, y: 41 },
    '濮阳': { x: 41, y: 41 },
    '许昌': { x: 39, y: 44 },
    '漯河': { x: 39, y: 45 },
    '三门峡': { x: 36, y: 43 },
    '南阳': { x: 38, y: 48 },
    '商丘': { x: 41, y: 43 },
    '信阳': { x: 41, y: 48 },
    '周口': { x: 40, y: 45 },
    '驻马店': { x: 39, y: 47 },
    '武汉': { x: 42, y: 48 },
    '黄石': { x: 44, y: 47 },
    '十堰': { x: 38, y: 47 },
    '宜昌': { x: 38, y: 52 },
    '襄阳': { x: 39, y: 47 },
    '鄂州': { x: 43, y: 48 },
    '荆门': { x: 39, y: 50 },
    '孝感': { x: 41, y: 47 },
    '荆州': { x: 40, y: 52 },
    '黄冈': { x: 43, y: 49 },
    '咸宁': { x: 43, y: 51 },
    '随州': { x: 41, y: 46 },
    '长沙': { x: 44, y: 56 },
    '株洲': { x: 44, y: 57 },
    '湘潭': { x: 44, y: 56 },
    '衡阳': { x: 44, y: 59 },
    '邵阳': { x: 43, y: 57 },
    '岳阳': { x: 45, y: 54 },
    '常德': { x: 42, y: 54 },
    '张家界': { x: 41, y: 55 },
    '益阳': { x: 43, y: 55 },
    '郴州': { x: 45, y: 60 },
    '永州': { x: 44, y: 61 },
    '怀化': { x: 43, y: 60 },
    '娄底': { x: 43, y: 57 },
    '广州': { x: 48, y: 68 },
    '韶关': { x: 45, y: 63 },
    '深圳': { x: 49, y: 71 },
    '珠海': { x: 50, y: 72 },
    '汕头': { x: 53, y: 68 },
    '佛山': { x: 48, y: 66 },
    '江门': { x: 49, y: 69 },
    '湛江': { x: 47, y: 76 },
    '茂名': { x: 47, y: 74 },
    '肇庆': { x: 47, y: 66 },
    '惠州': { x: 50, y: 69 },
    '梅州': { x: 51, y: 65 },
    '汕尾': { x: 53, y: 67 },
    '河源': { x: 49, y: 65 },
    '阳江': { x: 49, y: 72 },
    '清远': { x: 46, y: 64 },
    '东莞': { x: 49, y: 69 },
    '中山': { x: 49, y: 67 },
    '潮州': { x: 53, y: 67 },
    '揭阳': { x: 53, y: 67 },
    '云浮': { x: 47, y: 67 },
    '南宁': { x: 45, y: 74 },
    '柳州': { x: 42, y: 72 },
    '桂林': { x: 43, y: 69 },
    '梧州': { x: 46, y: 71 },
    '北海': { x: 47, y: 76 },
    '防城港': { x: 47, y: 76 },
    '钦州': { x: 46, y: 75 },
    '贵港': { x: 46, y: 73 },
    '玉林': { x: 47, y: 72 },
    '百色': { x: 40, y: 75 },
    '贺州': { x: 44, y: 70 },
    '河池': { x: 42, y: 73 },
    '来宾': { x: 44, y: 73 },
    '崇左': { x: 44, y: 76 },
    '海口': { x: 48, y: 88 },
    '三亚': { x: 47, y: 95 },
    '成都': { x: 22, y: 52 },
    '自贡': { x: 23, y: 57 },
    '攀枝花': { x: 21, y: 65 },
    '泸州': { x: 22, y: 58 },
    '德阳': { x: 23, y: 50 },
    '绵阳': { x: 24, y: 48 },
    '广元': { x: 24, y: 47 },
    '遂宁': { x: 24, y: 53 },
    '内江': { x: 23, y: 55 },
    '乐山': { x: 22, y: 55 },
    '南充': { x: 24, y: 54 },
    '眉山': { x: 22, y: 53 },
    '宜宾': { x: 22, y: 58 },
    '广安': { x: 26, y: 54 },
    '达州': { x: 27, y: 52 },
    '雅安': { x: 22, y: 51 },
    '巴中': { x: 25, y: 52 },
    '资阳': { x: 23, y: 54 },
    '贵阳': { x: 31, y: 64 },
    '六盘水': { x: 29, y: 65 },
    '遵义': { x: 32, y: 60 },
    '安顺': { x: 30, y: 64 },
    '毕节': { x: 29, y: 62 },
    '铜仁': { x: 34, y: 60 },
    '昆明': { x: 32, y: 70 },
    '曲靖': { x: 34, y: 67 },
    '玉溪': { x: 33, y: 71 },
    '保山': { x: 30, y: 73 },
    '昭通': { x: 33, y: 66 },
    '丽江': { x: 30, y: 68 },
    '普洱': { x: 32, y: 75 },
    '临沧': { x: 30, y: 75 },
    '西安': { x: 28, y: 38 },
    '铜川': { x: 29, y: 38 },
    '宝鸡': { x: 26, y: 38 },
    '咸阳': { x: 28, y: 38 },
    '渭南': { x: 29, y: 40 },
    '延安': { x: 30, y: 34 },
    '汉中': { x: 27, y: 43 },
    '榆林': { x: 30, y: 30 },
    '安康': { x: 28, y: 44 },
    '商洛': { x: 30, y: 42 },
    '兰州': { x: 22, y: 38 },
    '嘉峪关': { x: 16, y: 34 },
    '金昌': { x: 19, y: 36 },
    '白银': { x: 21, y: 37 },
    '天水': { x: 24, y: 40 },
    '武威': { x: 19, y: 37 },
    '张掖': { x: 17, y: 36 },
    '平凉': { x: 23, y: 39 },
    '酒泉': { x: 16, y: 34 },
    '庆阳': { x: 24, y: 37 },
    '定西': { x: 22, y: 40 },
    '陇南': { x: 24, y: 43 },
    '西宁': { x: 19, y: 42 },
    '海东': { x: 20, y: 41 },
    '银川': { x: 25, y: 33 },
    '石嘴山': { x: 25, y: 31 },
    '吴忠': { x: 24, y: 33 },
    '固原': { x: 24, y: 36 },
    '中卫': { x: 24, y: 34 },
    '乌鲁木齐': { x: 8, y: 28 },
    '克拉玛依': { x: 10, y: 26 },
    '吐鲁番': { x: 12, y: 31 },
    '哈密': { x: 15, y: 29 },
    '拉萨': { x: 18, y: 52 },
    '日喀则': { x: 18, y: 58 },
    '昌都': { x: 22, y: 51 },
    '林芝': { x: 22, y: 55 },
    '山南': { x: 19, y: 54 },
    '那曲': { x: 18, y: 46 },
    '阿里': { x: 12, y: 46 },
    '香港': { x: 51, y: 72 },
    '澳门': { x: 50, y: 73 },
    '台北': { x: 58, y: 42 },
    '新北': { x: 58, y: 41 },
    '桃园': { x: 57, y: 41 },
    '台中': { x: 56, y: 44 },
    '台南': { x: 56, y: 47 },
    '高雄': { x: 55, y: 49 }
  },

  onLoad: function () {
    this.loadFootprint();
  },

  onShow: function () {
    this.loadFootprint();
  },

  loadFootprint: function () {
    var self = this;
    wx.showLoading({ title: '加载中...' });

    wx.cloud.callFunction({
      name: 'getReviews',
      data: { type: 'my' }
    }).then(res => {
      wx.hideLoading();
      var reviews = [];
      if (Array.isArray(res.result)) {
        reviews = res.result;
      } else if (res.result && res.result.success) {
        reviews = res.result.reviews || [];
      }
      if (reviews.length > 0) {
        var shopMap = {};
        var citySet = new Set();

        reviews.forEach(function (r) {
          var name = r.shopName;
          var city = r.city || '';
          if (city) {
            citySet.add(city);
          }
          if (!shopMap[name]) {
            shopMap[name] = {
              shopName: name,
              category: r.category || '',
              count: 0,
              totalRating: 0,
              reviews: [],
              lastVisit: ''
            };
          }
          shopMap[name].count++;
          shopMap[name].totalRating += r.rating;
          shopMap[name].reviews.push(r);
          if (!shopMap[name].lastVisit || r.createTime > shopMap[name].lastVisit) {
            shopMap[name].lastVisit = r.createTime ? r.createTime.substring(0, 10) : '';
          }
        });

        var badges = [
          { min: 1, max: 1, icon: '🌱', name: '初识' },
          { min: 2, max: 2, icon: '🔥', name: '常客' },
          { min: 3, max: 5, icon: '⭐', name: '老饕' },
          { min: 6, max: 10, icon: '👑', name: '行家' },
          { min: 11, max: 999, icon: '💎', name: '骨灰' }
        ];

        function getBadge(count) {
          for (var i = badges.length - 1; i >= 0; i--) {
            if (count >= badges[i].min && count <= badges[i].max) return badges[i];
          }
          return badges[0];
        }

        var groups = Object.keys(shopMap).map(function (key) {
          var item = shopMap[key];
          item.avgRating = (item.totalRating / item.count).toFixed(1);
          item.badge = getBadge(item.count);

          item.ratingHistory = item.reviews.slice().reverse().slice(-5).map(function (r) {
            return {
              height: Math.round(r.rating * 12),
              color: r.rating >= 4 ? '#ff6b00' : (r.rating >= 3 ? '#ffaa00' : '#ccc')
            };
          });

          return item;
        });

        groups.sort(function (a, b) {
          return b.count - a.count;
        });

        var visitedCities = Array.from(citySet);
        var mapCities = visitedCities.map(function (city) {
          var coords = self.cityCoordinates[city];
          if (coords) {
            return {
              name: city,
              x: coords.x,
              y: coords.y,
              visited: true
            };
          }
          return null;
        }).filter(function (item) { return item !== null; });

        self.setData({
          shopGroups: groups,
          totalShops: groups.length,
          totalReviews: reviews.length,
          visitedCities: visitedCities,
          mapCities: mapCities
        });
      } else {
        self.setData({
          shopGroups: [],
          totalShops: 0,
          totalReviews: 0,
          visitedCities: [],
          mapCities: []
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('加载足迹失败:', err);
    });
  },

  goToShopProfile: function (e) {
    var shopName = e.currentTarget.dataset.shop;
    wx.navigateTo({
      url: '/pages/shopProfile/shopProfile?shopName=' + encodeURIComponent(shopName)
    });
  },

  selectCity: function (e) {
    var city = e.currentTarget.dataset.city;
    wx.navigateTo({
      url: '/pages/cityReviews/cityReviews?city=' + encodeURIComponent(city)
    });
  }
});
