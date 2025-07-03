<template>
  <div class="home-page">
    <h1>Курси валют НБУ на поточний день</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        placeholder="Пошук валюти..."
        class="search-input"
      />
    </div>

    <div class="table-container">
      <table class="rates-table">
        <thead>
          <tr>
            <th>Код</th>
            <th>Назва</th>
            <th>Курс</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rate in paginatedRates" :key="rate.cc">
            <td class="currency-code">{{ rate.cc }}</td>
            <td>{{ rate.txt }}</td>
            <td class="currency-rate">{{ rate.rate }}</td>
            <td>
              <button @click="editRate(rate.cc)" class="btn-edit">
                Редагувати
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container">
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

    <div v-if="loading" class="loading-message">
      Завантаження курсів валют...
    </div>
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

const fetchRates = async () => {
  loading.value = true;
  try {
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const response = await fetch(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${today}&json`
    );
    const rates = await response.json();
    store.setRates(rates);
  } catch (error) {
    console.error("Помилка отримання курсів валют:", error);
  } finally {
    loading.value = false;
  }
};

const filteredRates = computed(() => {
  if (!searchQuery.value) return store.rates;
  return store.rates.filter(
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

const resetPagination = () => {
  currentPage.value = 1;
};

watch(searchQuery, resetPagination);

onMounted(() => {
  store.loadChangedRates();
  fetchRates();
});
</script>

<style scoped>
.home-page {
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

.btn-edit {
  background-color: #17a2b8;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.btn-edit:hover {
  background-color: #138496;
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
}
</style>
