<template>
  <div class="stat-card" :style="{ borderLeft: `4px solid ${color}` }">
    <div class="stat-content">
      <div class="stat-label">{{ title }}</div>
      <div class="stat-value" :style="{ color }">{{ value }}</div>
    </div>
    <div class="stat-icon" :style="{ backgroundColor: color + '15', color }">
      <el-icon :size="28">
        <component :is="icon" />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  icon: { type: String, default: 'DataLine' },
  color: { type: String, default: '#FF6B00' }
})
</script>

<style scoped>
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
