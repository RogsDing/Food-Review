<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <img src="/favicon.svg" alt="logo" class="logo-img" />
        <span v-show="!isCollapse" class="logo-text">美食点评管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#001529"
        text-color="#ffffffb3"
        active-text-color="#FF6B00"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-menu-item index="/reviews">
          <el-icon><EditPen /></el-icon>
          <template #title>点评管理</template>
        </el-menu-item>
        <el-menu-item index="/comments">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>评论管理</template>
        </el-menu-item>
        <el-menu-item index="/messages">
          <el-icon><Memo /></el-icon>
          <template #title>留言管理</template>
        </el-menu-item>
        <el-menu-item index="/recipes">
          <el-icon><Bowl /></el-icon>
          <template #title>菜谱管理</template>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/feedback">
          <el-icon><Comment /></el-icon>
          <template #title>反馈管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta?.title && currentRoute.path !== '/dashboard'">
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" style="background-color: #FF6B00">
                {{ userStore.username.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="username">{{ userStore.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => {
  return route.path
})

const currentRoute = computed(() => route)

function handleCommand(command) {
  if (command === 'logout') {
    userStore.logout()
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.sidebar {
  background-color: #001529;
  transition: width 0.3s;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #ffffff1a;
  gap: 10px;
}

.logo-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.el-menu {
  border-right: none !important;
}

.el-menu-item.is-active {
  background-color: #FF6B001a !important;
  border-right: 3px solid #FF6B00;
}

.main-container {
  background-color: #f5f7fa;
}

.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #FF6B00;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
}

.username {
  font-size: 14px;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
}
</style>
