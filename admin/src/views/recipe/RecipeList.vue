<template>
  <div class="recipe-list">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filters" @submit.prevent="handleSearch">
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="菜谱名/标签" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="全部分类" clearable style="width: 140px">
            <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
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
        <span class="table-title">菜谱列表</span>
        <el-button type="primary" @click="router.push('/recipes/add')">
          <el-icon><Plus /></el-icon> 新增菜谱
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="菜谱名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="cuisine" label="菜系" width="90" />
        <el-table-column label="难度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.difficulty" disabled :max="5" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="cookTime" label="烹饪时间" width="100" />
        <el-table-column prop="viewCount" label="浏览量" width="80" />
        <el-table-column prop="likeCount" label="点赞数" width="80" />
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="router.push(`/recipes/edit/${row._id}`)">编辑</el-button>
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
import { useRouter } from 'vue-router'
import { Search, Plus } from '@element-plus/icons-vue'
import { adminGetRecipes, adminDeleteRecipe } from '@/api/recipe'
import { formatTime } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const categories = ['川菜', '粤菜', '湘菜', '家常菜', '凉菜', '热菜', '汤羹', '甜品', '小吃', '烧烤']

const loading = ref(false)
const tableData = ref([])
const filters = reactive({ keyword: '', category: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const res = await adminGetRecipes({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword,
      category: filters.category
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
  handleSearch()
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除菜谱「${row.name}」？此操作不可恢复`, '删除确认', {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    const res = await adminDeleteRecipe(row._id)
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
