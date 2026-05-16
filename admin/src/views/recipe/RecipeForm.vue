<template>
  <div class="recipe-form">
    <el-card shadow="never">
      <template #header>
        <div class="form-header">
          <span class="form-title">{{ isEdit ? '编辑菜谱' : '新增菜谱' }}</span>
          <el-button @click="router.back()">返回列表</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 800px">
        <el-form-item label="菜谱名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜谱名称" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
                <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜系">
              <el-input v-model="form.cuisine" placeholder="如：川菜、粤菜" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="难度" prop="difficulty">
              <el-rate v-model="form.difficulty" :max="5" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="烹饪时间">
              <el-input v-model="form.cookTime" placeholder="如：30分钟" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="份数">
              <el-input-number v-model="form.servings" :min="1" :max="20" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签">
          <el-select v-model="form.tags" multiple filterable allow-create placeholder="添加标签" style="width: 100%">
            <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">食材</el-divider>

        <div v-for="(item, index) in form.ingredients" :key="index" class="ingredient-row">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-select v-model="item.type" placeholder="类型" style="width: 100%">
                <el-option label="主料" value="主料" />
                <el-option label="辅料" value="辅料" />
                <el-option label="调料" value="调料" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input v-model="item.name" placeholder="食材名称" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="item.amount" placeholder="用量" />
            </el-col>
            <el-col :span="4">
              <el-button type="danger" link @click="form.ingredients.splice(index, 1)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" plain @click="addIngredient" style="margin-bottom: 16px">
          <el-icon><Plus /></el-icon> 添加食材
        </el-button>

        <el-divider content-position="left">步骤</el-divider>

        <div v-for="(step, index) in form.steps" :key="index" class="step-row">
          <el-row :gutter="10" align="middle">
            <el-col :span="3">
              <el-tag type="primary" size="large">步骤 {{ index + 1 }}</el-tag>
            </el-col>
            <el-col :span="17">
              <el-input v-model="step.description" type="textarea" :rows="2" placeholder="步骤描述" />
            </el-col>
            <el-col :span="4">
              <el-button type="danger" link @click="form.steps.splice(index, 1)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" plain @click="addStep" style="margin-bottom: 16px">
          <el-icon><Plus /></el-icon> 添加步骤
        </el-button>

        <el-divider />

        <el-form-item label="小贴士">
          <el-input v-model="form.tips" type="textarea" :rows="3" placeholder="烹饪小贴士" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" style="min-width: 120px">
            {{ isEdit ? '保存修改' : '创建菜谱' }}
          </el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { adminGetRecipes, adminAddRecipe, adminUpdateRecipe } from '@/api/recipe'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)
const categories = ['川菜', '粤菜', '湘菜', '家常菜', '凉菜', '热菜', '汤羹', '甜品', '小吃', '烧烤']
const commonTags = ['家常', '快手', '下饭', '清淡', '麻辣', '酸甜', '营养', '养生', '早餐', '午餐', '晚餐', '宵夜']

const form = reactive({
  name: '',
  category: '',
  cuisine: '',
  difficulty: 3,
  cookTime: '',
  servings: 2,
  tags: [],
  ingredients: [{ type: '主料', name: '', amount: '' }],
  steps: [{ order: 1, description: '' }],
  tips: ''
})

const rules = {
  name: [{ required: true, message: '请输入菜谱名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }]
}

onMounted(async () => {
  if (isEdit.value) {
    await loadRecipeData()
  }
})

async function loadRecipeData() {
  try {
    const res = await adminGetRecipes({ page: 1, pageSize: 1000 })
    if (res.success) {
      const recipe = res.data.list.find(r => r._id === route.params.id)
      if (recipe) {
        Object.assign(form, {
          name: recipe.name,
          category: recipe.category,
          cuisine: recipe.cuisine || '',
          difficulty: recipe.difficulty || 3,
          cookTime: recipe.cookTime || '',
          servings: recipe.servings || 2,
          tags: recipe.tags || [],
          ingredients: recipe.ingredients?.length ? recipe.ingredients : [{ type: '主料', name: '', amount: '' }],
          steps: recipe.steps?.length ? recipe.steps : [{ order: 1, description: '' }],
          tips: recipe.tips || ''
        })
      }
    }
  } catch (err) {
    ElMessage.error('加载菜谱数据失败')
  }
}

function addIngredient() {
  form.ingredients.push({ type: '主料', name: '', amount: '' })
}

function addStep() {
  form.steps.push({ order: form.steps.length + 1, description: '' })
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const validIngredients = form.ingredients.filter(i => i.name.trim())
  const validSteps = form.steps.filter(s => s.description.trim()).map((s, i) => ({ ...s, order: i + 1 }))

  if (validIngredients.length === 0) {
    ElMessage.warning('请至少添加一种食材')
    return
  }
  if (validSteps.length === 0) {
    ElMessage.warning('请至少添加一个步骤')
    return
  }

  submitting.value = true
  try {
    const data = {
      name: form.name,
      category: form.category,
      cuisine: form.cuisine,
      difficulty: form.difficulty,
      cookTime: form.cookTime,
      servings: form.servings,
      tags: form.tags,
      ingredients: validIngredients,
      steps: validSteps,
      tips: form.tips
    }

    let res
    if (isEdit.value) {
      res = await adminUpdateRecipe(route.params.id, data)
    } else {
      res = await adminAddRecipe(data)
    }

    if (res.success) {
      ElMessage.success(isEdit.value ? '修改成功' : '创建成功')
      router.push('/recipes')
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error(isEdit.value ? '修改失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.ingredient-row {
  margin-bottom: 10px;
}

.step-row {
  margin-bottom: 12px;
}
</style>
