<template>
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_531_5901)">
      <path
        d="M23.3333 28.3333L15 19.9999L23.3333 11.6666"
        :stroke="color"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_531_5901">
        <rect
          width="40"
          height="40"
          fill="white"
          transform="matrix(-1 0 0 1 40 0)"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: "#FFE33A",
  },
});
</script>
