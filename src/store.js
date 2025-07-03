import { defineStore } from "pinia";

export const useRatesStore = defineStore("rates", {
  state: () => ({
    rates: [],
    changedRates: [],
    lastFetched: null,
  }),
  actions: {
    setRates(rates) {
      this.rates = rates;
    },
    addChangedRate(rate) {
      const idx = this.changedRates.findIndex((r) => r.cc === rate.cc);
      if (idx !== -1) {
        this.changedRates[idx] = rate;
      } else {
        this.changedRates.push(rate);
      }
      localStorage.setItem("changedRates", JSON.stringify(this.changedRates));
    },
    removeChangedRate(cc) {
      this.changedRates = this.changedRates.filter((rate) => rate.cc !== cc);
      localStorage.setItem("changedRates", JSON.stringify(this.changedRates));
    },
    loadChangedRates() {
      const data = localStorage.getItem("changedRates");
      this.changedRates = data ? JSON.parse(data) : [];
    },
  },
});
