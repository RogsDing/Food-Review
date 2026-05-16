<template>
  <div class="user-list">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filters" @submit.prevent="handleSearch">
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="昵称/OpenID" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="table-header">
        <span class="table-title">用户列表</span>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="头像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatarUrl" style="background-color: #FF6B00">
              {{ (row.nickName || '?').charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ row.nickName || '未设置' }}</template>
        </el-table-column>
        <el-table-column prop="openId" label="OpenID" min-width="180" show-overflow-tooltip />
        <el-table-column prop="signature" label="签名" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.signature || '-' }}</template>
        </el-table-column>
        <el-table-column prop="reviewCount" label="点评数" width="90" />
        <el-table-column label="注册时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
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

    <el-drawer v-model="detailVisible" title="用户详情" size="450px">
      <div v-if="currentUser" class="user-detail">
        <div class="user-avatar-section">
          <el-avatar :size="64" :src="currentUser.avatarUrl" style="background-color: #FF6B00">
            {{ (currentUser.nickName || '?').charAt(0) }}
          </el-avatar>
          <h3>{{ currentUser.nickName || '未设置昵称' }}</h3>
        </div>
        <div class="detail-row"><span class="label">OpenID</span><span class="value mono">{{ currentUser.openId }}</span></div>
        <div class="detail-row"><span class="label">签名</span><span>{{ currentUser.signature || '-' }}</span></div>
        <div class="detail-row"><span class="label">点评数</span><span>{{ currentUser.reviewCount || 0 }}</span></div>
        <div class="detail-row"><span class="label">注册时间</span><span>{{ formatTime(currentUser.createTime) }}</span></div>
        <div class="detail-row"><span class="label">更新时间</span><span>{{ formatTime(currentUser.updateTime) }}</span></div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { adminGetUsers } from '@/api/user'
import { formatTime } from '@/utils/format'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const currentUser = ref(null)
const filters = reactive({ keyword: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const res = await adminGetUsers({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword
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
  handleSearch()
}

function showDetail(row) {
  currentUser.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.filter-card {
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

.user-detail {
  padding: 0 10px;
}

.user-avatar-section {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.user-avatar-section h3 {
  margin-top: 12px;
  font-size: 18px;
  color: #303133;
}

.detail-row {
  display: flex;
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

.mono {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  word-break: break-all;
}
</style>
