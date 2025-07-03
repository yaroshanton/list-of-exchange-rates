<template>
  <div class="changed-rates-page">
    <h1>Змінені курси валют</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        placeholder="Пошук валюти..."
        class="search-input"
      />
    </div>

    <div v-if="filteredRates.length === 0 && !loading" class="empty-message">
      Немає змінених курсів валют
    </div>

    <div v-else class="table-container">
      <table class="rates-table">
        <thead>
          <tr>
            <th>Код</th>
            <th>Назва</th>
            <th>Змінений курс</th>
            <th>Дата</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rate in paginatedRates" :key="rate.cc">
            <td class="currency-code">{{ rate.cc }}</td>
            <td>{{ rate.txt }}</td>
            <td class="currency-rate">{{ rate.rate }}</td>
            <td class="currency-date">{{ rate.exchangedate }}</td>
            <td class="actions">
              <button @click="editRate(rate.cc)" class="btn-edit">
                Редагувати
              </button>
              <button @click="removeRate(rate.cc)" class="btn-delete">
                Видалити
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="pagination-container">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="btn-pagination"
      >
        Попередня
      </button>
      <span class="pagination-info"
        >Сторінка {{ currentPage }} з {{ totalPages }}</span
      >
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="btn-pagination"
      >
        Наступна
      </button>
    </div>

    <div v-if="loading" class="loading-message">Завантаження...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useRatesStore } from "../store";

const router = useRouter();
const store = useRatesStore();

const loading = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredRates = computed(() => {
  if (!searchQuery.value) return store.changedRates;
  return store.changedRates.filter(
    (rate) =>
      rate.txt.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      rate.cc.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredRates.value.length / itemsPerPage)
);

const paginatedRates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRates.value.slice(start, end);
});

const editRate = (cc) => {
  router.push(`/edit/${cc}`);
};

const removeRate = (cc) => {
  if (confirm("Ви впевнені, що хочете видалити цей змінений курс?")) {
    store.removeChangedRate(cc);
  }
};

const resetPagination = () => {
  currentPage.value = 1;
};

watch(searchQuery, resetPagination);

onMounted(() => {
  store.loadChangedRates();
});
</script>

<style scoped>
.changed-rates-page {
  max-width: 1000px;
  margin: 0 auto;
}

.search-container {
  margin-bottom: 2rem;
}

.search-input {
  width: 300px;
  max-width: 100%;
}

.empty-message {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  margin-bottom: 2rem;
}

.rates-table {
  width: 100%;
}

.currency-code {
  font-weight: 600;
  color: #007bff;
  font-family: "Courier New", monospace;
}

.currency-rate {
  font-weight: 600;
  color: #28a745;
  text-align: right;
}

.currency-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-edit {
  background-color: #17a2b8;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.btn-edit:hover {
  background-color: #138496;
}

.btn-delete {
  background-color: #dc3545;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.btn-delete:hover {
  background-color: #c82333;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pagination {
  background-color: #6c757d;
  padding: 8px 16px;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #5a6268;
}

.pagination-info {
  font-weight: 500;
  color: #6c757d;
  min-width: 120px;
  text-align: center;
}

.loading-message {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pagination-info {
    order: -1;
  }

  .actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
  }
}
</style>
