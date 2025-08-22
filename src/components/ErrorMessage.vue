<template>
  <div class="error-message">
    <p>{{ message }}</p>
    <button v-if="showRetry" @click="$emit('retry')" class="btn btn-primary">
      Tentar novamente
    </button>
  </div>
</template>

<script setup>
defineEmits(['retry']);

defineProps({
  message: {
    type: String,
    required: true
  },
  showRetry: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.error-message {
  text-align: center;
  color: #e74c3c;
  padding: 2rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin: 2rem 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border: 1px solid transparent;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #3a5bd9;
  transform: translateY(-2px);
}
</style>
