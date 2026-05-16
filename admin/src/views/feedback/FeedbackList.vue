<template>
  <div class="feedback-list">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filters" @submit.prevent="handleSearch">
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="table-header">
        <span class="table-title">反馈列表</span>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="content" label="反馈内容" min-width="250" show-overflow-tooltip />
        <el-table-column label="提交者" width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ row.userInfo?.nickName || '匿名' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="feedbackStatusType(row.status)" size="small">
              {{ feedbackStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已读" width="70">
          <template #default="{ row }">
            <el-tag :type="row.read ? 'success' : 'info'" size="small">
              {{ row.read ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">查看</el-button>
            <el-button
              v-if="row.status !== 'resolved'"
              type="success"
              link
              size="small"
              @click="handleUpdateStatus(row, 'resolved')"
            >
              标记已解决
            </el-button>
            <el-button
              v-if="!row.read"
              type="warning"
              link
              size="small"
              @click="handleMarkRead(row)"
            >
              标记已读
            </el-button>
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

    <el-drawer v-model="detailVisible" title="反馈详情" size="450px">
      <div v-if="currentFeedback" class="feedback-detail">
        <div class="detail-row"><span class="label">提交者</span><span>{{ currentFeedback.userInfo?.nickName || '匿名' }}</span></div>
        <div class="detail-row">
          <span class="label">状态</span>
          <el-tag :type="feedbackStatusType(currentFeedback.status)" size="small">
            {{ feedbackStatusText(currentFeedback.status) }}
          </el-tag>
        </div>
        <div class="detail-row"><span class="label">已读</span><span>{{ currentFeedback.read ? '是' : '否' }}</span></div>
        <div class="detail-section">
          <span class="label">反馈内容</span>
          <p class="content-text">{{ currentFeedback.content }}</p>
        </div>
        <div class="detail-row"><span class="label">提交时间</span><span>{{ formatTime(currentFeedback.createTime) }}</span></div>

        <el-divider />

        <div class="status-actions">
          <span class="label">更改状态：</span>
          <el-button-group>
            <el-button size="small" :type="currentFeedback.status === 'pending' ? 'warning' : ''" @click="handleUpdateStatus(currentFeedback, 'pending')">待处理</el-button>
            <el-button size="small" :type="currentFeedback.status === 'processing' ? 'primary' : ''" @click="handleUpdateStatus(currentFeedback, 'processing')">处理中</el-button>
            <el-button size="small" :type="currentFeedback.status === 'resolved' ? 'success' : ''" @click="handleUpdateStatus(currentFeedback, 'resolved')">已解决</el-button>
            <el-button size="small" :type="currentFeedback.status === 'closed' ? 'info' : ''" @click="handleUpdateStatus(currentFeedback, 'closed')">已关闭</el-button>
          </el-button-group>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { adminGetFeedback, adminUpdateFeedback } from '@/api/feedback'
import { formatTime, feedbackStatusText, feedbackStatusType } from '@/utils/format'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const currentFeedback = ref(null)
const filters = reactive({ status: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const res = await adminGetFeedback({
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: filters.status
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
  filters.status = ''
  handleSearch()
}

function showDetail(row) {
  currentFeedback.value = row
  detailVisible.value = true
}

async function handleUpdateStatus(row, status) {
  try {
    const res = await adminUpdateFeedback(row._id, { status })
    if (res.success) {
      ElMessage.success('状态更新成功')
      row.status = status
      if (currentFeedback.value?._id === row._id) {
        currentFeedback.value.status = status
      }
      loadData()
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('更新失败')
  }
}

async function handleMarkRead(row) {
  try {
    const res = await adminUpdateFeedback(row._id, { read: true })
    if (res.success) {
      ElMessage.success('已标记为已读')
      row.read = true
      if (currentFeedback.value?._id === row._id) {
        currentFeedback.value.read = true
      }
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('操作失败')
  }
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

.feedback-detail {
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

.status-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-actions .label {
  color: #909399;
  font-size: 14px;
}
</style>
