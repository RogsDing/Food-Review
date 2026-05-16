<template>
  <div class="comment-list">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filters" @submit.prevent="handleSearch">
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="评论内容" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="点评ID">
          <el-input v-model="filters.reviewId" placeholder="关联点评ID" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="table-header">
        <span class="table-title">评论列表</span>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="content" label="评论内容" min-width="250" show-overflow-tooltip />
        <el-table-column prop="shopName" label="所属点评" width="140" show-overflow-tooltip>
          <template #default="{ row }">{{ row.shopName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="author.nickName" label="评论者" width="110" show-overflow-tooltip />
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { adminGetComments, adminDeleteComment } from '@/api/comment'
import { formatTime } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const filters = reactive({ keyword: '', reviewId: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const res = await adminGetComments({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword,
      reviewId: filters.reviewId
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
  filters.reviewId = ''
  handleSearch()
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定删除该评论？此操作不可恢复', '删除确认', {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    const res = await adminDeleteComment(row._id)
    if (res.success) {
      ElMessage.success('删除成功')
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
</style>
