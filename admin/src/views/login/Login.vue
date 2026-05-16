<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <img src="/favicon.svg" alt="logo" />
        </div>
        <h1>美食点评管理后台</h1>
        <p>Food Review Admin Panel</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入管理员账号" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (err) {
    const msg = err.message || JSON.stringify(err)
    console.error('登录错误详情:', err)
    ElMessage.error(msg.length > 100 ? msg.substring(0, 100) : (msg || '登录失败'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C33 50%, #FFa960 100%);
}

.login-container {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #FF6B00, #FF8C33);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-logo img {
  width: 44px;
  height: 44px;
}

.login-header h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 4px;
}

.login-header p {
  font-size: 13px;
  color: #909399;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #FF6B00, #FF8C33);
  border: none;
  font-size: 16px;
  height: 44px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #E55E00, #FF6B00);
}
</style>
