Page({
  data: {
    rating: 3.0,
    images: [],
    diningTime: '',
    isEdit: false,
    reviewId: '',
    categories: ['川菜', '湘菜', '江西菜', '自助', '韩料', '日料', '西餐', '火锅', '烧烤'],
    selectedCategory: '川菜',
    expense: '',
    people: '',
    regionOptions: [
      ['北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省', '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区'],
      ['北京市']
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
    // 所有城市的区列表
    allDistrictOptions: {
      '北京市': ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
      '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
      '广州市': ['越秀区', '海珠区', '荔湾区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
      '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区', '深汕特别合作区'],
      '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
      '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
      '武汉市': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'],
      '成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '金堂县', '大邑县', '蒲江县', '新津县', '都江堰市', '彭州市', '邛崃市', '崇州市'],
      '重庆市': ['渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区', '城口县', '丰都县', '垫江县', '忠县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县', '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县'],
      '西安市': ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区', '鄠邑区', '蓝田县', '周至县'],
      '长沙市': ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区', '长沙县', '宁乡市', '浏阳市'],
      '青岛市': ['市南区', '市北区', '李沧区', '崂山区', '城阳区', '黄岛区', '即墨区', '胶州市', '平度市', '莱西市'],
      '厦门市': ['思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区'],
      '苏州市': ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区', '苏州工业园区', '常熟市', '张家港市', '昆山市', '太仓市'],
      '济南市': ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '平阴县', '济阳县', '商河县', '章丘区', '莱芜区', '钢城区'],
      '大连市': ['中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区', '金州区', '普兰店区', '瓦房店市', '庄河市', '长海县'],
      '宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市'],
      '福州市': ['鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '长乐区', '闽侯县', '连江县', '罗源县', '闽清县', '永泰县', '平潭县', '福清市']
    },
    regionIndex: [-1, -1],
    province: '',
    city: '',
    area: '',
    today: ''
  },
  
  onLoad: function (options) {
    // 设置今天的日期
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    // 检查是否是编辑模式
    if (options.edit) {
      // 从本地存储中读取编辑数据
      const editData = wx.getStorageSync('editReviewData');
      if (editData) {
        // 计算城市和地区索引
        let cityIndex = 0;
        let districtIndex = 0;
        let city = '北京';
        
        // 尝试找到地区所在的城市
        const cities = this.data.regionOptions[0];
        for (let i = 0; i < cities.length; i++) {
          // 这里简化处理，实际应该根据城市获取对应的区列表
          // 为了演示，我们假设所有城市都有相同的区列表
          const districtIndexInCity = this.data.regionOptions[1].indexOf(editData.area);
          if (districtIndexInCity >= 0) {
            cityIndex = i;
            districtIndex = districtIndexInCity;
            city = cities[i];
            break;
          }
        }
        
        this.setData({
          isEdit: true,
          reviewId: editData._id,
          rating: editData.rating,
          images: editData.imageFileIDs || [],
          diningTime: editData.diningTime,
          shopName: editData.shopName,
          city: city,
          area: editData.area,
          regionIndex: [cityIndex, districtIndex],
          content: editData.content,
          selectedCategory: editData.category || '美食',
          today: todayDate
        });
        // 清除本地存储中的编辑数据
        wx.removeStorageSync('editReviewData');
      }
    } else {
      // 非编辑模式，清空表单数据
      this.formReset();
      this.setData({
        today: todayDate,
        diningTime: todayDate
      });
    }
  },
  
  onShow: function () {
    // 检查用户是否登录
    if (!getApp().globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布点评',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页面或触发登录流程
            wx.switchTab({ url: '/pages/profile/profile' });
          } else {
            // 用户取消登录，返回上一页
            wx.navigateBack();
          }
        }
      });
    }
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
      area: city
    });
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
      const firstCity = cities[0];
      
      // 更新regionOptions和regionIndex
      this.setData({
        regionOptions: [
          this.data.regionOptions[0],
          cities
        ],
        regionIndex: [value, 0],
        province: selectedProvince,
        city: firstCity,
        area: firstCity
      });
    } else if (column === 1) {
      // 根据选择的城市更新
      const cities = this.data.regionOptions[1];
      const selectedCity = cities[value];
      
      // 更新regionIndex和area
      this.setData({
        regionIndex: [this.data.regionIndex[0], value],
        city: selectedCity,
        area: selectedCity
      });
    }
  },
  
  // 定位功能
  getLocation: function () {
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        
        // 逆地理编码获取地区信息
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`,
          success: function (res) {
            if (res.data.status === 0) {
              const addressComponent = res.data.result.address_component;
              const city = addressComponent.city.replace('市', ''); // 去除"市"字
              const district = addressComponent.district;
              
              // 检查城市是否在选项中
              const cities = that.data.regionOptions[0];
              const cityIndex = cities.indexOf(city);
              if (cityIndex >= 0) {
                // 根据定位到的城市获取对应的城市列表
                const cityList = that.data.provinceCityMap[cities[cityIndex]];
                const cityListIndex = cityList.indexOf(city);
                
                // 更新regionOptions和regionIndex
                that.setData({
                  regionOptions: [
                    that.data.regionOptions[0],
                    cityList
                  ],
                  city: city,
                  area: city,
                  regionIndex: [cityIndex, cityListIndex >= 0 ? cityListIndex : 0]
                });
                
                if (cityListIndex < 0) {
                  wx.showToast({
                    title: '定位成功，但城市不在选项中，已选择该省份的默认城市',
                    icon: 'none'
                  });
                }
              } else {
                wx.showToast({
                  title: '定位成功，但城市不在选项中',
                  icon: 'none'
                });
              }
            } else {
              wx.showToast({
                title: '定位失败',
                icon: 'none'
              });
            }
          },
          fail: function () {
            wx.showToast({
              title: '定位失败',
              icon: 'none'
            });
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: '请授权定位权限',
          icon: 'none'
        });
      }
    });
  },
  
  handleSliderChange(e) {
    const value = parseFloat(e.detail.value);
    const roundedValue = parseFloat(value.toFixed(1));
    this.setData({
      rating: roundedValue
    });
  },
  
  handleSliderChanging(e) {
    const value = parseFloat(e.detail.value);
    const roundedValue = parseFloat(value.toFixed(1));
    this.setData({
      rating: roundedValue
    });
  },
  
  getCategoryIcon(category) {
    const iconMap = {
      '川菜': '🌶️',
      '湘菜': '🥘',
      '江西菜': '🍲',
      '自助': '🍴',
      '韩料': '🥓',
      '日料': '🍱',
      '西餐': '🍔',
      '火锅': '🥘',
      '烧烤': '🍖'
    };
    return iconMap[category] || '🍽️';
  },
  
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category
    });
  },

  // 消费金额输入事件
  onExpenseInput(e) {
    this.setData({
      expense: e.detail.value
    });
  },

  // 消费人数输入事件
  onPeopleInput(e) {
    this.setData({
      people: e.detail.value
    });
  },
  
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 9 - that.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          images: that.data.images.concat(tempFilePaths)
        });
      }
    });
  },
  
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },
  
  bindDateChange(e) {
    this.setData({
      diningTime: e.detail.value
    });
  },
  
  // 检查登录状态并提交表单
  checkLoginAndSubmit(e) {
    // 检查用户是否登录
    if (!getApp().globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布点评',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页面或触发登录流程
            wx.switchTab({ url: '/pages/profile/profile' });
          }
        }
      });
      return;
    }
    
    // 登录状态检查通过，执行表单提交
    this.formSubmit(e);
  },
  
  formSubmit(e) {
    const formData = e.detail.value;
    formData.images = this.data.images;
    formData.createTime = new Date().toISOString();
    formData.category = this.data.selectedCategory;
    formData.area = this.data.area;
    formData.city = this.data.city;
    formData.diningTime = this.data.diningTime;
    formData.rating = this.data.rating;
    formData.expense = this.data.expense;
    formData.people = this.data.people;
    
    // 验证表单
    if (!formData.shopName) {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.area) {
      wx.showToast({
        title: '请输入地区',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.diningTime) {
      wx.showToast({
        title: '请选择用餐时间',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.content) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.expense) {
      wx.showToast({
        title: '请输入消费金额',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.people) {
      wx.showToast({
        title: '请输入消费人数',
        icon: 'none'
      });
      return;
    }
    
    // 检查用户是否已经授权过订阅消息
    const hasSubscribed = wx.getStorageSync('hasSubscribedMessage');
    if (hasSubscribed) {
      // 用户已经授权过，直接提交点评并发送订阅消息
      this.submitReview(formData, true);
    } else {
      // 请求订阅消息权限，通过后提交点评
      const templateId = 'mPBTma8iiO0plnhED029wfU2t2uxx151nGel5YoP80A';
      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success: (res) => {
          const accepted = res[templateId] === 'accept';
          if (accepted) {
            // 存储用户订阅状态
            wx.setStorageSync('hasSubscribedMessage', true);
          }
          this.submitReview(formData, accepted);
        },
        fail: () => {
          // 用户拒绝或请求失败，仍提交点评但不发订阅消息
          this.submitReview(formData, false);
        }
      });
    }
  },
  
  // 提交点评数据
  submitReview(formData, isSubscribed) {
    console.log('开始提交点评:', formData);
    
    // 上传图片
    const uploadTasks = this.data.images.map((image, index) => {
      return new Promise((resolve, reject) => {
        console.log('上传图片:', image);
        // 检查是否是已上传的图片（fileID格式）
        if (image.startsWith('cloud://')) {
          // 已经是云存储的fileID，不需要重新上传
          console.log('图片已经是fileID，直接使用:', image);
          resolve(image);
        } else {
          // 新选择的本地图片，需要上传
          console.log('开始上传本地图片:', image);
          wx.cloud.uploadFile({
            cloudPath: 'review/images/' + Date.now() + '_' + index + '.png',
            filePath: image,
            success: res => {
              console.log('图片上传成功:', res.fileID);
              // 直接resolve，不设置文件权限
              console.log('直接resolve，不设置文件权限');
              resolve(res.fileID);
            },
            fail: err => {
              console.error('图片上传失败:', err);
              reject(err);
            }
          });
        }
      });
    });
    
    wx.showLoading({ title: '提交中...' });
    
    console.log('开始处理图片上传任务');
    
    // 直接处理图片上传，不使用Promise.all
    let fileIDs = [];
    let uploadIndex = 0;
    let simplifiedFormData;
    
    console.log('上传任务数量:', uploadTasks.length);
    
    const uploadNext = () => {
      console.log('进入uploadNext函数，当前索引:', uploadIndex, '任务数量:', uploadTasks.length);
      if (uploadIndex >= uploadTasks.length) {
        // 所有图片上传完成
        console.log('所有图片上传完成:', fileIDs);
        console.log('准备调用handleUploadComplete');
        handleUploadComplete(fileIDs);
        return;
      }
      
      console.log('开始上传第', uploadIndex + 1, '张图片');
      const uploadTask = uploadTasks[uploadIndex];
      uploadTask
        .then(fileID => {
          console.log('进入then回调函数');
          console.log('第', uploadIndex + 1, '张图片上传成功:', fileID);
          fileIDs.push(fileID);
          console.log('fileIDs数组:', fileIDs);
          uploadIndex++;
          console.log('uploadIndex:', uploadIndex);
          console.log('uploadTasks.length:', uploadTasks.length);
          console.log('准备上传下一张图片，当前索引:', uploadIndex);
          uploadNext();
        })
        .catch(err => {
          console.error('上传图片失败:', err);
          wx.hideLoading();
          wx.showToast({
            title: '图片上传失败',
            icon: 'none'
          });
        });
    };
    
    const handleUploadComplete = (uploadedFileIDs) => {
      console.log('处理图片上传完成:', uploadedFileIDs);
      
      // 简化formData，只传递必要的参数
      simplifiedFormData = {
        shopName: formData.shopName,
        area: formData.area,
        city: formData.city,
        diningTime: formData.diningTime,
        rating: formData.rating,
        content: formData.content,
        imageFileIDs: uploadedFileIDs,
        createTime: formData.createTime,
        category: formData.category,
        expense: formData.expense,
        people: formData.people
      };
      
      console.log('简化后的formData:', simplifiedFormData);
      
      // 保存点评数据
      console.log('准备调用云函数');
      
      // 直接调用云函数
      if (this.data.isEdit) {
        // 编辑模式：更新已有点评
        console.log('更新已有点评:', this.data.reviewId);
        console.log('调用updateReview云函数');
        wx.cloud.callFunction({
          name: 'updateReview',
          data: {
            reviewId: this.data.reviewId,
            ...simplifiedFormData
          },
          success: (cloudResult) => {
            console.log('云函数调用完成:', cloudResult);
            handleCloudFunctionResult(cloudResult);
          },
          fail: (err) => {
            console.error('updateReview云函数调用失败:', err);
            wx.hideLoading();
            wx.showToast({
              title: '操作失败: ' + (err.message || '未知错误'),
              icon: 'none',
              duration: 3000
            });
          }
        });
      } else {
        // 新增模式：创建新点评
        console.log('创建新点评');
        console.log('调用addReview云函数');
        wx.cloud.callFunction({
          name: 'addReview',
          data: simplifiedFormData,
          success: (cloudResult) => {
            console.log('云函数调用完成:', cloudResult);
            handleCloudFunctionResult(cloudResult);
          },
          fail: (err) => {
            console.error('addReview云函数调用失败:', err);
            wx.hideLoading();
            wx.showToast({
              title: '操作失败: ' + (err.message || '未知错误'),
              icon: 'none',
              duration: 3000
            });
          }
        });
      }
    };
    
    const handleCloudFunctionResult = (cloudResult) => {
      console.log('处理云函数结果:', cloudResult);
      wx.hideLoading();

      if (cloudResult.result && !cloudResult.result.success) {
        console.error('云函数返回错误:', cloudResult.result.error);
        wx.showToast({
          title: cloudResult.result.error || '操作失败',
          icon: 'none'
        });
        return;
      }

      console.log('点评提交成功');
      wx.showToast({
        title: this.data.isEdit ? '更新成功' : '提交成功',
        icon: 'success'
      });

      // 如果用户授权了订阅消息，发送订阅消息
      if (isSubscribed) {
        console.log('发送订阅消息');
        this.sendSubscribeMessage(simplifiedFormData).then(() => {
          console.log('订阅消息发送完成');
          // 清空表单数据
          console.log('清空表单数据');
          this.formReset();

          // 跳转回详情页或首页
          console.log('准备跳转');
          if (this.data.isEdit) {
            console.log('跳转回详情页');
            wx.navigateBack();
          } else {
            console.log('跳转到首页');
            wx.switchTab({ url: '/pages/index/index' });
          }
        }).catch((err) => {
          console.error('发送订阅消息失败:', err);
          // 即使订阅消息发送失败，也继续执行后续操作
          // 清空表单数据
          console.log('清空表单数据');
          this.formReset();

          // 跳转回详情页或首页
          console.log('准备跳转');
          if (this.data.isEdit) {
            console.log('跳转回详情页');
            wx.navigateBack();
          } else {
            console.log('跳转到首页');
            wx.switchTab({ url: '/pages/index/index' });
          }
        });
      } else {
        // 清空表单数据
        console.log('清空表单数据');
        this.formReset();

        // 跳转回详情页或首页
        console.log('准备跳转');
        if (this.data.isEdit) {
          console.log('跳转回详情页');
          wx.navigateBack();
        } else {
          console.log('跳转到首页');
          wx.switchTab({ url: '/pages/index/index' });
        }
      }
    };
    
    // 开始上传图片
    if (uploadTasks.length > 0) {
      uploadNext();
    } else {
      // 没有图片需要上传
      handleUploadComplete([]);
    }
  },
  
  // 发送订阅消息，返回 Promise
  sendSubscribeMessage(formData) {
    return new Promise((resolve, reject) => {
      // 格式化时间为 YYYY-MM-DD HH:MM:SS 格式
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const nickName = getApp().globalData.userInfo?.nickName || 'User';
      const shopName = formData.shopName || 'Unknown';
      const rating = formData.rating || '';

      // 构建订阅消息数据
      const messageData = {
        phrase1: '1',
        thing2: shopName,
        thing5: nickName,
        time6: formattedTime,
        thing7: rating + ' Star'
      };

      console.log('调用sendSubscribeMessage云函数:', messageData);

      wx.cloud.callFunction({
        name: 'sendSubscribeMessage',
        data: messageData,
        success: function(res) {
          console.log('=== 订阅消息云函数 success 回调 ===');
          console.log('完整返回:', JSON.stringify(res));
          console.log('result:', JSON.stringify(res.result));
          resolve(res);
        },
        fail: function(err) {
          console.log('=== 订阅消息云函数 fail 回调 ===');
          console.error('fail错误:', JSON.stringify(err));
          reject(err);
        },
        complete: function(res) {
          console.log('=== 订阅消息云函数 complete 回调 ===');
          console.log('complete返回:', JSON.stringify(res));
        }
      });
    });
  },
  
  formReset() {
    // 保留当前的日期设置
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    this.setData({
      rating: 3.0,
      images: [],
      diningTime: todayDate,
      selectedCategory: '川菜',
      shopName: '',
      area: '',
      city: '',
      content: '',
      expense: '',
      people: '',
      regionIndex: [-1, -1]
    });
  }
});