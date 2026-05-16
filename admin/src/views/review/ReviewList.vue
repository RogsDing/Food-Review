<template>
  <div class="review-list">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filters" @submit.prevent="handleSearch">
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="店铺名/内容" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="全部分类" clearable style="width: 140px">
            <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="filters.city" placeholder="城市名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="table-header">
        <span class="table-title">点评列表</span>
        <el-button type="danger" plain :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除 ({{ selectedIds.length }})
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="shopName" label="店铺名" min-width="140" show-overflow-tooltip />
        <el-table-column prop="author.nickName" label="作者" width="100" show-overflow-tooltip />
        <el-table-column label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled :colors="['#FF6B00','#FF6B00','#FF6B00']" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="90" />
        <el-table-column prop="city" label="城市" width="90" show-overflow-tooltip />
        <el-table-column prop="expense" label="消费" width="80">
          <template #default="{ row }">{{ row.expense ? `¥${row.expense}` : '-' }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">查看</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" title="点评详情" size="500px">
      <div v-if="currentReview" class="review-detail">
        <div class="detail-row"><span class="label">店铺名</span><span>{{ currentReview.shopName }}</span></div>
        <div class="detail-row"><span class="label">作者</span><span>{{ currentReview.author?.nickName || '-' }}</span></div>
        <div class="detail-row"><span class="label">评分</span><el-rate v-model="currentReview.rating" disabled :colors="['#FF6B00','#FF6B00','#FF6B00']" /></div>
        <div class="detail-row"><span class="label">分类</span><span>{{ currentReview.category || '-' }}</span></div>
        <div class="detail-row"><span class="label">地区</span><span>{{ currentReview.area || '-' }}</span></div>
        <div class="detail-row"><span class="label">城市</span><span>{{ currentReview.city || '-' }}</span></div>
        <div class="detail-row"><span class="label">消费</span><span>{{ currentReview.expense ? `¥${currentReview.expense}` : '-' }}</span></div>
        <div class="detail-row"><span class="label">人数</span><span>{{ currentReview.people || '-' }}</span></div>
        <div class="detail-row"><span class="label">用餐时间</span><span>{{ currentReview.diningTime || '-' }}</span></div>
        <div class="detail-row"><span class="label">探店次数</span><span>{{ currentReview.visitCount || 1 }}</span></div>
        <div class="detail-section">
          <span class="label">评价内容</span>
          <p class="content-text">{{ currentReview.content || '-' }}</p>
        </div>
        <div class="detail-section" v-if="currentReview.imageFileIDs && currentReview.imageFileIDs.length > 0">
          <span class="label">图片</span>
          <div class="image-list">
            <el-image
              v-for="(img, i) in currentReview.imageFileIDs"
              :key="i"
              :src="img"
              :preview-src-list="currentReview.imageFileIDs"
              fit="cover"
              class="review-image"
            />
          </div>
        </div>
        <div class="detail-row"><span class="label">创建时间</span><span>{{ formatTime(currentReview.createTime) }}</span></div>
        <div class="detail-row"><span class="label">更新时间</span><span>{{ formatTime(currentReview.updateTime) }}</span></div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { adminGetReviews, adminDeleteReview, adminBatchDeleteReviews } from '@/api/review'
import { formatTime } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const categories = ['川菜', '湘菜', '江西菜', '自助', '韩料', '日料', '西餐', '火锅', '烧烤', '其他']

const loading = ref(false)
const tableData = ref([])
const selectedIds = ref([])
const detailVisible = ref(false)
const currentReview = ref(null)

const filters = reactive({ keyword: '', category: '', city: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const res = await adminGetReviews({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword,
      category: filters.category,
      city: filters.city
    })
    if (res.success) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (err) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function resetFilters() {
  filters.keyword = ''
  filters.category = ''
  filters.city = ''
  handleSearch()
}

function handleSelectionChange(rows) {
  selectedIds.value = rows.map(r => r._id)
}

function showDetail(row) {
  currentReview.value = row
  detailVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除点评「${row.shopName}」？此操作不可恢复`, '删除确认', {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    const res = await adminDeleteReview(row._id)
    if (res.success) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(res.message)
    }
  } catch {}
}

async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`确定批量删除 ${selectedIds.value.length} 条点评？此操作不可恢复`, '批量删除确认', {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    const res = await adminBatchDeleteReviews(selectedIds.value)
    if (res.success) {
      ElMessage.success(res.message)
      selectedIds.value = []
      loadData()
    } else {
      ElMessage.error(res.message)
    }
  } catch {}
}
</script>

<style scoped>
.filter-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.review-detail {
  padding: 0 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.detail-row .label {
  width: 80px;
  flex-shrink: 0;
  color: #909399;
  font-size: 14px;
}

.detail-section {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section .label {
  display: block;
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.content-text {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.review-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
}
</style>
