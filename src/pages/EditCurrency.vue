<template>
  <div class="edit-currency-page">
    <h1>Редагування валюти: {{ currency?.cc }}</h1>

    <div v-if="loading" class="loading-message">Завантаження...</div>

    <div v-else-if="currency" class="edit-form-container">
      <form @submit.prevent="saveRate" class="edit-form">
        <div class="form-group">
          <label class="form-label"> Код валюти: </label>
          <input v-model="currency.cc" disabled class="form-input disabled" />
        </div>

        <div class="form-group">
          <label class="form-label"> Назва валюти: </label>
          <input v-model="currency.txt" disabled class="form-input disabled" />
        </div>

        <div class="form-group">
          <label class="form-label"> Курс: </label>
          <input
            v-model.number="currency.rate"
            type="number"
            step="0.01"
            min="0"
            required
            class="form-input"
            placeholder="Введіть новий курс"
          />
        </div>

        <div class="form-group">
          <label class="form-label"> Дата: </label>
          <input
            v-model="currency.exchangedate"
            disabled
            class="form-input disabled"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">Зберегти</button>
          <button type="button" @click="goBack" class="btn-cancel">
            Скасувати
          </button>
        </div>
      </form>
    </div>

    <div v-else class="error-message">Валюта не знайдена</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRatesStore } from "../store";

const props = defineProps({
  cc: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const store = useRatesStore();

const loading = ref(true);
const currency = ref(null);

const findCurrency = () => {
  const changedRate = store.changedRates.find((rate) => rate.cc === props.cc);
  if (changedRate) {
    currency.value = { ...changedRate };
    loading.value = false;
    return;
  }

  const currentRate = store.rates.find((rate) => rate.cc === props.cc);
  if (currentRate) {
    currency.value = { ...currentRate };
    loading.value = false;
    return;
  }

  fetchCurrencyFromAPI();
};

const fetchCurrencyFromAPI = async () => {
  try {
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const response = await fetch(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${today}&json`
    );
    const rates = await response.json();
    const foundRate = rates.find((rate) => rate.cc === props.cc);

    if (foundRate) {
      currency.value = { ...foundRate };
    }
  } catch (error) {
    console.error("Помилка отримання валюти:", error);
  } finally {
    loading.value = false;
  }
};

const saveRate = () => {
  if (currency.value) {
    store.addChangedRate(currency.value);
    alert("Курс валюти збережено!");
    goBack();
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  findCurrency();
});
</script>

<style scoped>
.edit-currency-page {
  max-width: 600px;
  margin: 0 auto;
}

.loading-message {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  margin: 2rem 0;
}

.edit-form-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-input.disabled:focus {
  border-color: #ddd;
  box-shadow: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.btn-save {
  background-color: #28a745;
  flex: 1;
  padding: 0.75rem 1.5rem;
}

.btn-save:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #dc3545;
  flex: 1;
  padding: 0.75rem 1.5rem;
}

.btn-cancel:hover {
  background-color: #c82333;
}

.error-message {
  text-align: center;
  color: #dc3545;
  font-weight: 500;
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #dc3545;
}

@media (max-width: 768px) {
  .edit-form-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
