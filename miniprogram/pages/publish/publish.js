Page({
  data: {
    rating: 3.0,
    images: [],
    diningTime: '',
    isEdit: false,
    reviewId: '',
    categories: ['美食', '咖啡', '甜点', '酒吧', '面食', '日料', '西餐', '火锅'],
    selectedCategory: '美食',
    regionOptions: [
      ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '重庆', '西安', '长沙', '青岛', '厦门', '苏州', '天津', '郑州', '济南', '大连', '宁波', '福州'],
      ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
    ],
    // 所有城市的区列表
    allDistrictOptions: [
      ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'], // 北京
      ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'], // 上海
      ['越秀区', '海珠区', '荔湾区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'], // 广州
      ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区', '深汕特别合作区'], // 深圳
      ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'], // 杭州
      ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'], // 南京
      ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'], // 武汉
      ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '金堂县', '大邑县', '蒲江县', '新津县', '都江堰市', '彭州市', '邛崃市', '崇州市'], // 成都
      ['渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区', '城口县', '丰都县', '垫江县', '忠县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县', '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县'], // 重庆
      ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区', '鄠邑区', '蓝田县', '周至县'], // 西安
      ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区', '长沙县', '宁乡市', '浏阳市'], // 长沙
      ['市南区', '市北区', '李沧区', '崂山区', '城阳区', '黄岛区', '即墨区', '胶州市', '平度市', '莱西市'], // 青岛
      ['思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区'], // 厦门
      ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区', '苏州工业园区', '常熟市', '张家港市', '昆山市', '太仓市'], // 苏州
      ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区'], // 天津
      ['中原区', '二七区', '管城回族区', '金水区', '上街区', '惠济区', '中牟县', '巩义市', '荥阳市', '新密市', '新郑市', '登封市'], // 郑州
      ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '平阴县', '济阳县', '商河县', '章丘区', '莱芜区', '钢城区'], // 济南
      ['中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区', '金州区', '普兰店区', '瓦房店市', '庄河市', '长海县'], // 大连
      ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市'], // 宁波
      ['鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '长乐区', '闽侯县', '连江县', '罗源县', '闽清县', '永泰县', '平潭县', '福清市'] // 福州
    ],
    regionIndex: [0, 0],
    city: '北京',
    area: '朝阳区',
    today: ''
  },
  
  onLoad: function (options) {
    // 设置今天的日期
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.setData({
      today: `${year}-${month}-${day}`,
      diningTime: `${year}-${month}-${day}`
    });
    
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
          selectedCategory: editData.category || '美食'
        });
        // 清除本地存储中的编辑数据
        wx.removeStorageSync('editReviewData');
      }
    }
  },
  
  // 多级选择器变化事件
  bindRegionChange: function (e) {
    const regionIndex = e.detail.value;
    const city = this.data.regionOptions[0][regionIndex[0]];
    const area = this.data.regionOptions[1][regionIndex[1]];
    this.setData({
      regionIndex: regionIndex,
      city: city,
      area: area
    });
  },
  
  // 多级选择器列变化事件
  bindRegionColumnChange: function (e) {
    const column = e.detail.column;
    const value = e.detail.value;
    
    // 根据选择的城市更新区列表
    if (column === 0) {
      // 根据选择的城市获取对应的区列表
      const districts = this.data.allDistrictOptions[value];
      // 更新regionOptions和regionIndex
      this.setData({
        regionOptions: [
          this.data.regionOptions[0],
          districts
        ],
        regionIndex: [value, 0],
        city: this.data.regionOptions[0][value],
        area: districts[0]
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
                // 根据定位到的城市获取对应的区列表
                const districts = that.data.allDistrictOptions[cityIndex];
                const districtIndex = districts.indexOf(district);
                
                // 更新regionOptions和regionIndex
                that.setData({
                  regionOptions: [
                    that.data.regionOptions[0],
                    districts
                  ],
                  city: city,
                  area: districtIndex >= 0 ? district : districts[0],
                  regionIndex: [cityIndex, districtIndex >= 0 ? districtIndex : 0]
                });
                
                if (districtIndex < 0) {
                  wx.showToast({
                    title: '定位成功，但地区不在选项中，已选择该城市的默认地区',
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
      '美食': '🍽️',
      '咖啡': '☕',
      '甜点': '🍰',
      '酒吧': '🍺',
      '面食': '🍜',
      '日料': '🍱',
      '西餐': '🍔',
      '火锅': '🥘'
    };
    return iconMap[category] || '🍽️';
  },
  
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category
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
  
  formSubmit(e) {
    const formData = e.detail.value;
    formData.images = this.data.images;
    formData.createTime = new Date().toISOString();
    formData.category = this.data.selectedCategory;
    formData.area = this.data.area;
    formData.city = this.data.city;
    formData.diningTime = this.data.diningTime;
    formData.rating = this.data.rating;
    
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
    
    // 请求订阅消息授权
    const templateId = 'mPBTma8iiO0plnhED029wfU2t2uxx151nGel5YoP80A';
    console.log('开始请求订阅消息授权');
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        console.log('订阅消息授权结果:', res);
        
        // 无论用户是否授权，都继续提交点评
        this.submitReview(formData, res[templateId] === 'accept');
      },
      fail: (err) => {
        console.error('订阅消息授权失败:', err);
        // 授权失败也继续提交点评
        this.submitReview(formData, false);
      }
    });
  },
  
  // 提交点评数据
  submitReview(formData, isSubscribed) {
    // 上传图片
    const uploadTasks = this.data.images.map((image, index) => {
      return new Promise((resolve, reject) => {
        // 检查是否是已上传的图片（fileID格式）
        if (image.startsWith('cloud://')) {
          // 已经是云存储的fileID，不需要重新上传
          resolve(image);
        } else {
          // 新选择的本地图片，需要上传
          wx.cloud.uploadFile({
            cloudPath: 'review/images/' + Date.now() + '_' + index + '.png',
            filePath: image,
            success: res => {
              resolve(res.fileID);
            },
            fail: err => {
              reject(err);
            }
          });
        }
      });
    });
    
    wx.showLoading({ title: '提交中...' });
    
    Promise.all(uploadTasks)
      .then(fileIDs => {
        formData.imageFileIDs = fileIDs;
        
        // 保存点评数据
        if (this.data.isEdit) {
          // 编辑模式：更新已有点评
          return wx.cloud.callFunction({
            name: 'updateReview',
            data: {
              reviewId: this.data.reviewId,
              ...formData
            }
          });
        } else {
          // 新增模式：创建新点评
          return wx.cloud.callFunction({
            name: 'addReview',
            data: formData
          });
        }
      })
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: this.data.isEdit ? '更新成功' : '提交成功',
          icon: 'success'
        });
        
        // 如果用户授权了订阅消息，则发送通知
        if (isSubscribed) {
          this.sendSubscribeMessage();
        }
        
        // 跳转回详情页或首页
        setTimeout(() => {
          if (this.data.isEdit) {
            wx.navigateBack();
          } else {
            wx.switchTab({ url: '/pages/index/index' });
          }
        }, 1000);
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
        console.error(err);
      });
  },
  
  // 发送订阅消息
  sendSubscribeMessage() {
    console.log('用户已授权，开始调用sendSubscribeMessage云函数');
    
    // 格式化时间为 YYYY-MM-DD HH:MM:SS 格式
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    wx.cloud.callFunction({
      name: 'sendSubscribeMessage',
      data: {
        phrase1: '点评成功',
        thing2: '您的点评已成功发布',
        thing5: getApp().globalData.userInfo?.nickName || '用户',
        time6: formattedTime,
        thing7: getApp().globalData.userInfo?.nickName || '用户'
      },
      success: function(res) {
        console.log('云函数调用成功:', res);
      },
      fail: function(err) {
        console.error('云函数调用失败:', err);
      }
    });
  },
  
  formReset() {
    this.setData({
      rating: 3.0,
      images: [],
      diningTime: '',
      selectedCategory: '美食'
    });
  }
});