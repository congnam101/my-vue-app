<template>
  <div class="dashboard">
    <h2>Chào mừng bạn đến với hệ thống quản lý Công ty ENA</h2>
    <p class="intro">Quản lý sản phẩm, nhân sự, đơn hàng và báo cáo hiệu quả, nhanh chóng.</p>

    <!-- Cards grid -->
    <div class="cards-grid">
      <div class="card card-blue">
        <div class="card-icon">📦</div>
        <div class="card-content">
          <h3>Tổng sản phẩm</h3>
          <p class="value">125</p>
        </div>
      </div>
      <div class="card card-purple">
        <div class="card-icon">🛒</div>
        <div class="card-content">
          <h3>Đơn hàng hôm nay</h3>
          <p class="value">32</p>
        </div>
      </div>
      <div class="card card-pink">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <h3>Doanh thu</h3>
          <p class="value">₫120,000,000</p>
        </div>
      </div>
      <div class="card card-green">
        <div class="card-icon">👥</div>
        <div class="card-content">
          <h3>Nhân sự</h3>
          <p class="value">28</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dữ liệu động có thể fetch từ API sau này
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard h2 {
  font-size: 24px;
  font-weight: 600;
}

.intro {
  color: #555;
  margin-bottom: 1.5rem;
}

/* Grid cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

/* Card */
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.15);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.card-content h3 {
  font-size: 16px;
  margin: 0 0 6px;
  font-weight: 600;
}

.card-content .value {
  font-size: 24px;
  font-weight: bold;
}

/* Card colors */
.card-blue { border-top: 4px solid #4a90e2; }
.card-purple { border-top: 4px solid #7b61ff; }
.card-pink { border-top: 4px solid #ff6f91; }
.card-green { border-top: 4px solid #27ae60; }
</style>
