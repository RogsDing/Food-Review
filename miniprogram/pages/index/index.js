Page({
  data: {
    reviews: [],
    sortText: '评分排序',
    areaText: '地区筛选',
    showSort: false,
    showArea: false,
    showCategory: false,
    categories: ['全部分类', '川菜', '湘菜', '江西菜', '自助', '韩料', '日料', '西餐', '火锅', '烧烤'],
    sortBy: 'rating',
    sortOrder: 'desc',
    area: '',
    searchKeyword: '',
    category: '',
    categoryText: '全部分类',
    // 地区选择器相关数据
    regionOptions: [
      ['北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省', '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区'],
      ['北京市', '上海市', '天津市', '重庆市', '石家庄市', '太原市', '沈阳市', '长春市', '哈尔滨市', '南京市', '杭州市', '合肥市', '福州市', '南昌市', '济南市', '郑州市', '武汉市', '长沙市', '广州市', '海口市', '成都市', '贵阳市', '昆明市', '西安市', '兰州市', '西宁市', '台北市', '呼和浩特市', '南宁市', '拉萨市', '银川市', '乌鲁木齐市', '香港', '澳门']
    ],
    // 省份对应的城市列表
    provinceCityMap: {
      '北京市': ['北京市'],
      '上海市': ['上海市'],
      '天津市': ['天津市'],
      '重庆市': ['重庆市'],
      '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
      '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
      '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
      '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
      '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
      '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
      '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
      '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
      '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
      '江西省': ['南昌市', '九江市', '景德镇市', '萍乡市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
      '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
      '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '济源市'],
      '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州', '仙桃市', '潜江市', '天门市', '神农架林区'],
      '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
      '广东省': ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
      '海南省': ['海口市', '三亚市', '三沙市', '儋州市', '五指山市', '琼海市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
      '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
      '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
      '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
      '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
      '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
      '青海省': ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
      '台湾省': ['台北市', '新北市', '桃园市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉义市', '新竹县', '苗栗县', '彰化县', '南投县', '云林县', '嘉义县', '屏东县', '宜兰县', '花莲县', '台东县', '澎湖县', '金门县', '连江县'],
      '内蒙古自治区': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
      '广西壮族自治区': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
      '西藏自治区': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
      '宁夏回族自治区': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
      '新疆维吾尔自治区': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市', '北屯市', '铁门关市', '双河市', '可克达拉市', '昆玉市', '胡杨河市', '新星市'],
      '香港特别行政区': ['香港'],
      '澳门特别行政区': ['澳门']
    },
    regionIndex: [0, 0],
    province: '北京市',
    city: '北京市'
  },
  
  onLoad: function (options) {
    this.getReviews();
  },
  
  onShow: function () {
    this.getReviews();
  },
  
  getReviews: function () {
    wx.showLoading({ title: '加载中...' });
    wx.cloud.callFunction({
      name: 'getReviews',
      data: {
        sortBy: this.data.sortBy,
        sortOrder: this.data.sortOrder,
        area: this.data.area,
        keyword: this.data.searchKeyword,
        category: this.data.category
      }
    })  
    .then(res => {
      wx.hideLoading();
      if (res.result) {
        // 为每个点评添加一些默认数据，使其更符合大众点评的展示格式
        const reviews = res.result.map(item => ({
          ...item,
          averagePrice: item.expense && item.people ? Math.floor(Number(item.expense) / Number(item.people)) : Math.floor(Math.random() * 100) + 50, // 根据消费金额和人数计算人均价格
          monthlySales: item.monthlySales || Math.floor(Math.random() * 1000) + 100, // 随机生成月售数量
          category: item.category || ['川菜', '湘菜', '江西菜', '自助', '韩料', '日料', '西餐', '火锅', '烧烤'][Math.floor(Math.random() * 9)], // 随机生成分类
          distance: item.distance || (Math.random() * 3 + 0.5).toFixed(1) + 'km', // 随机生成距离
          address: item.address || item.area + '街道'
        }));
        this.setData({
          reviews: reviews
        });
      }
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error(err);
    });
  },
  
  showSortOptions: function () {
    this.setData({
      showSort: true,
      showArea: false
    });
  },
  
  hideSortOptions: function () {
    this.setData({
      showSort: false
    });
  },
  
  showAreaOptions: function () {
    this.setData({
      showArea: true,
      showSort: false
    });
  },
  
  hideAreaOptions: function () {
    this.setData({
      showArea: false
    });
  },
  
  sortByRatingDesc: function () {
    this.setData({
      sortBy: 'rating',
      sortOrder: 'desc',
      sortText: '评分从高到低',
      showSort: false
    });
    this.getReviews();
  },
  
  sortByRatingAsc: function () {
    this.setData({
      sortBy: 'rating',
      sortOrder: 'asc',
      sortText: '评分从低到高',
      showSort: false
    });
    this.getReviews();
  },
  
  sortByTimeDesc: function () {
    this.setData({
      sortBy: 'createTime',
      sortOrder: 'desc',
      sortText: '时间从新到旧',
      showSort: false
    });
    this.getReviews();
  },
  
  sortByTimeAsc: function () {
    this.setData({
      sortBy: 'createTime',
      sortOrder: 'asc',
      sortText: '时间从旧到新',
      showSort: false
    });
    this.getReviews();
  },
  
  // 多级选择器变化事件
  bindRegionChange: function (e) {
    const regionIndex = e.detail.value;
    const province = this.data.regionOptions[0][regionIndex[0]];
    const city = this.data.regionOptions[1][regionIndex[1]];
    this.setData({
      regionIndex: regionIndex,
      province: province,
      city: city,
      area: city,
      areaText: city,
      showArea: false
    });
    this.getReviews();
  },

  // 多级选择器列变化事件
  bindRegionColumnChange: function (e) {
    const column = e.detail.column;
    const value = e.detail.value;

    // 根据选择的省份更新城市列表
    if (column === 0) {
      const provinces = this.data.regionOptions[0];
      const selectedProvince = provinces[value];
      const cities = this.data.provinceCityMap[selectedProvince];
      
      // 更新regionOptions和regionIndex
      this.setData({
        regionOptions: [
          this.data.regionOptions[0],
          cities
        ],
        regionIndex: [value, 0],
        province: selectedProvince,
        city: cities[0]
      });
    } else if (column === 1) {
      // 根据选择的城市更新regionIndex
      const cities = this.data.regionOptions[1];
      const selectedCity = cities[value];
      
      // 更新regionIndex和city
      this.setData({
        regionIndex: [this.data.regionIndex[0], value],
        city: selectedCity
      });
    }
  },


  
  onSearchInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },
  
  search: function () {
    this.getReviews();
  },

  clearSearch: function () {
    this.setData({
      searchKeyword: ''
    });
    this.getReviews();
  },
  
  goToDetail: function (e) {
    const reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + reviewId
    });
  },
  
  goToPublish: function () {
    wx.switchTab({
      url: '/pages/publish/publish'
    });
  },

  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  showSearch: function () {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  selectCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      category: category,
      categoryText: category
    });
    this.getReviews();
  },

  showFilterOptions: function () {
    wx.showToast({
      title: '筛选功能开发中',
      icon: 'none'
    });
  },

  // 显示分类选项
  showCategoryOptions: function () {
    this.setData({
      showCategory: true,
      showSort: false,
      showArea: false
    });
  },

  // 隐藏分类选项
  hideCategoryOptions: function () {
    this.setData({
      showCategory: false
    });
  },

  // 选择分类
  selectCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    if (category === '全部分类') {
      this.setData({
        category: '',
        categoryText: '全部分类'
      });
    } else {
      this.setData({
        category: category,
        categoryText: category
      });
    }
    this.setData({
      showCategory: false
    });
    this.getReviews();
  },

  catchTap: function (e) {
    e.stopPropagation();
  }
});