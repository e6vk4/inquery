<template>
  <div class="flex items-center px-4 py-2 font-light">
    <div class="mr-3 checkbox">
      <input
        :id="`checkbox-${item}-${id}`"
        :checked="checked"
        type="checkbox"
        class="checkbox__input"
        @input="$emit('checked')"
      />
      <div class="checkbox__icon">
        <svg class="checkbox__icon-svg" viewBox="0 0 24 24">
          <path
            class="checkbox__icon-path"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"
            fill="none"
            stroke="white"
          ></path>
        </svg>
      </div>
    </div>
    <label
      :for="`checkbox-${item}-${id}`"
      class="self-center inline mb-0 text-sm leading-tight truncate whitespace-no-wrap cursor-pointer"
    >
      <span>{{ item }}</span>
    </label>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      required: true,
      type: [Number, String],
    },
    item: {
      required: true,
      type: String,
    },
    checked: {
      required: true,
      type: Boolean,
    },
  },
}
</script>

<style lang="scss" scoped>
.checkbox {
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  @apply relative box-content inline-block leading-tight  whitespace-no-wrap align-bottom cursor-pointer;

  &__icon {
    width: 15px;
    height: 15px;
    border-radius: 2px;
    @apply border absolute right-auto bottom-0 left-0 box-border inline-flex items-center justify-center bg-transparent pointer-events-none;

    &:hover {
      @apply bg-gray-300 rounded-full;
    }

    &-svg {
      @apply absolute top-0 right-0 bottom-0 left-0 hidden align-middle text-white overflow-hidden w-full;
    }

    &-path {
      stroke-width: 3.12px;
      stroke-dasharray: 29.78334;
    }
  }

  &__input {
    @apply absolute top-0 left-0 w-full h-full p-0 m-0 opacity-0 cursor-pointer box-border;

    &:checked ~ .checkbox__icon {
      @apply bg-gray-600 border-gray-600;
    }

    &:checked + .checkbox__icon > .checkbox__icon-svg {
      @apply block;
    }
  }
}
</style>
