<template>
  <div :class="['chart-header', 'row', customclass]">
    <div :class="['chart-title', 'col-9']">{{ title }}</div>
    <div class="chart-header-buttons col-3">
      <button v-if="info && info !== ''" type="button" data-trigger="click hover" class="btn btn-secondary btn-info" data-container="body" data-toggle="popover" data-html="true" data-placement="bottom" :data-content="info">
        i
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartHeader',
  props: {
    title: String,
    info: String,
    bg: String,
    color: String,
    customclass: String
  }
}
</script>

<style scoped lang="scss">
$color_TI: #7e003f;
$color_TI_darker: darken( $color_TI, 20% );
.chart-header {
  padding: 10px 5px;
  margin: 0;
  background: #fef9f3;
  &.fixed-twoline-height {
    @media only screen and (min-width: 768px) {
      height: 65px;
    }
  }
  .chart-title {
    font-size: 20px;
    font-weight: 800;
    text-align: left;
    line-height: 128%;
    font-family: 'Spectral', serif;
    color: #656563;
    @media only screen and (max-width: 1400px) {
      font-size: 18px;
    }
    @media only screen and (max-width: 1250px) {
      font-size: 16px;
    }
    @media only screen and (max-width: 767px) {
      font-size: 20px;
    }
  }
  .chart-header-buttons {
    text-align: right;
    .btn-info {
      padding: 0px 10px;
      border-radius: 20px;
      font-weight: 600;
      background: #656563;
      border: none;
    }
  }
}
</style>

