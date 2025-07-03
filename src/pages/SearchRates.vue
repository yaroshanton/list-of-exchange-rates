<template>
  <div class="search-rates-page">
    <h1>Пошук курсу валют</h1>

    <div class="date-filter">
      <label class="date-label"> Оберіть дату: </label>
      <div class="date-inputs">
        <input
          v-model="selectedDate"
          type="date"
          @change="fetchRatesByDate"
          class="date-input"
        />
        <button
          @click="fetchRatesByDate"
          :disabled="!selectedDate"
          class="btn-load"
        >
          Завантажити курси
        </button>
      </div>
    </div>

    <div class="search-container">
      <input
        v-model="searchQuery"
        placeholder="Пошук валюти..."
        class="search-input"
      />
    </div>

    <div
      v-if="filteredRates.length === 0 && !loading && selectedDate"
      class="empty-message"
    >
      Курси валют на обрану дату не знайдено
    </div>

    <div v-if="filteredRates.length > 0" class="table-container">
      <table class="rates-table">
        <thead>
          <tr>
            <th>Код</th>
            <th>Назва</th>
            <th>Курс</th>
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
            <td>
              <button @click="editRate(rate.cc)" class="btn-edit">
                Редагувати
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
const selectedDate = ref("");
const ratesByDate = ref([]);

onMounted(() => {
  const today = new Date().toISOString().split("T")[0];
  selectedDate.value = today;
});

const fetchRatesByDate = async () => {
  if (!selectedDate.value) return;

  loading.value = true;
  try {
    const dateParam = selectedDate.value.replace(/-/g, "");
    const response = await fetch(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateParam}&json`
    );
    const rates = await response.json();
    ratesByDate.value = rates;
  } catch (error) {
    console.error("Помилка отримання курсів валют:", error);
    ratesByDate.value = [];
  } finally {
    loading.value = false;
  }
};

const filteredRates = computed(() => {
  if (!searchQuery.value) return ratesByDate.value;
  return ratesByDate.value.filter(
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
watch(selectedDate, () => {
  resetPagination();
  ratesByDate.value = [];
});
</script>

<style scoped>
.search-rates-page {
  max-width: 1000px;
  margin: 0 auto;
}

.date-filter {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.date-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.date-inputs {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.date-input {
  min-width: 200px;
}

.btn-load {
  background-color: #28a745;
  white-space: nowrap;
}

.btn-load:hover:not(:disabled) {
  background-color: #218838;
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
  .date-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .date-input {
    min-width: auto;
  }

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
