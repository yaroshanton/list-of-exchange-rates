<template>
  <div>
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <span class="logo-icon">💱</span>
          <h1 class="logo-text">Курси валют НБУ</h1>
        </div>
        <nav class="nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <span class="nav-icon">🏠</span>
                Головна
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/changed" class="nav-link">
                <span class="nav-icon">📊</span>
                Змінені курси
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/search" class="nav-link">
                <span class="nav-icon">🔍</span>
                Пошук курсу
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-list {
  display: flex;
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(10px);
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  font-size: 1.1rem;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .nav-list {
    width: 100%;
    justify-content: center;
  }

  .nav-link {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .nav-icon {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-list {
    flex-direction: column;
    gap: 4px;
  }

  .nav-link {
    justify-content: center;
  }
}
</style>
