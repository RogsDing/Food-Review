<template>
  <div class="dashboard">
    <div class="stat-cards">
      <StatCard title="总用户数" :value="overview.users" icon="User" color="#409EFF" />
      <StatCard title="总点评数" :value="overview.reviews" icon="EditPen" color="#FF6B00" />
      <StatCard title="总评论数" :value="overview.comments" icon="ChatDotRound" color="#67C23A" />
      <StatCard title="菜谱数量" :value="overview.recipes" icon="Bowl" color="#E6A23C" />
      <StatCard title="留言数量" :value="overview.messages" icon="Memo" color="#909399" />
      <StatCard title="待处理反馈" :value="overview.feedback" icon="Comment" color="#F56C6C" />
    </div>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">近7天点评趋势</span>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">分类分布</span>
          </template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="info-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">今日数据</span>
          </template>
          <div class="today-stats">
            <div class="today-item">
              <span class="today-label">今日新增用户</span>
              <span class="today-value" style="color: #409EFF">{{ overview.todayUsers || 0 }}</span>
            </div>
            <div class="today-item">
              <span class="today-label">今日新增点评</span>
              <span class="today-value" style="color: #FF6B00">{{ overview.todayReviews || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">最近动态</span>
          </template>
          <div class="activity-list">
            <div v-for="(item, index) in activities" :key="index" class="activity-item">
              <el-tag :type="item.type === 'review' ? 'warning' : 'success'" size="small">
                {{ item.type === 'review' ? '点评' : '评论' }}
              </el-tag>
              <span class="activity-content">{{ item.author }} - {{ item.content }}</span>
              <span class="activity-time">{{ formatTime(item.time) }}</span>
            </div>
            <el-empty v-if="activities.length === 0" description="暂无动态" :image-size="60" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import StatCard from '@/components/StatCard.vue'
import { getDashboardData } from '@/api/dashboard'
import { formatTime } from '@/utils/format'

const trendChartRef = ref(null)
const categoryChartRef = ref(null)
let trendChart = null
let categoryChart = null
let chartData = { trend: { dates: [], values: [] }, categories: [] }

const overview = reactive({
  users: 0, reviews: 0, comments: 0, recipes: 0, messages: 0, feedback: 0,
  todayUsers: 0, todayReviews: 0
})
const activities = ref([])

onMounted(async () => {
  await loadData()
  await nextTick()
  initCharts()
  renderTrendChart(chartData.trend)
  renderCategoryChart(chartData.categories)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  categoryChart?.dispose()
})

async function loadData() {
  try {
    const res = await getDashboardData()
    if (res.success) {
      Object.assign(overview, res.data.overview)
      activities.value = res.data.activities || []
      chartData.trend = res.data.trend || { dates: [], values: [] }
      chartData.categories = res.data.categories || []
    }
  } catch (err) {
    console.error('加载仪表盘数据失败:', err)
  }
}

function initCharts() {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
  }
  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value)
  }
}

function renderTrendChart(data) {
  if (!trendChart || !data) return
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.dates.map(d => d.substring(5)),
      axisLine: { lineStyle: { color: '#ddd' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [{
      name: '点评数',
      type: 'line',
      data: data.values,
      smooth: true,
      lineStyle: { color: '#FF6B00', width: 3 },
      itemStyle: { color: '#FF6B00' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(255,107,0,0.3)' },
          { offset: 1, color: 'rgba(255,107,0,0.02)' }
        ])
      }
    }]
  })
}

function renderCategoryChart(data) {
  if (!categoryChart || !data || data.length === 0) return
  const colors = ['#FF6B00', '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#9B59B6', '#1ABC9C', '#E74C3C', '#3498DB']
  categoryChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: data.map((item, i) => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: colors[i % colors.length] }
      }))
    }]
  })
}

function handleResize() {
  trendChart?.resize()
  categoryChart?.resize()
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-container {
  height: 320px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.info-row {
  margin-bottom: 20px;
}

.today-stats {
  padding: 10px 0;
}

.today-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.today-item:last-child {
  border-bottom: none;
}

.today-label {
  font-size: 14px;
  color: #606266;
}

.today-value {
  font-size: 28px;
  font-weight: 700;
}

.activity-list {
  max-height: 280px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  flex: 1;
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-time {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

@media (max-width: 1400px) {
  .stat-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
