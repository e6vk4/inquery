<template>
  <div class="flex items-center px-4 py-2 font-light">
    <div class="mr-2 radio">
      <input
        :id="`radio-${item}-${id}`"
        :value="item"
        name="radio"
        :checked="checked"
        type="radio"
        class="radio__input"
        @change="$emit('checked')"
      />
      <span class="radio__icon"></span>
    </div>
    <label
      :for="`radio-${item}-${id}`"
      class="text-sm leading-tight truncate whitespace-no-wrap cursor-pointer"
    >
      {{ item }}</label
    >
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
.radio {
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  @apply relative box-content inline-block leading-tight  whitespace-no-wrap align-bottom cursor-pointer;

  &__icon {
    transition: background 0.2s, transform 0.2s;
    box-shadow: 0 0 0 0 white inset;
    @apply border cursor-pointer inline-flex w-4 h-4 uppercase border rounded-full absolute right-auto bottom-0 left-0 box-border items-center justify-center bg-transparent pointer-events-none;
  }

  &__input {
    @apply absolute top-0 left-0 w-full h-full p-0 m-0 opacity-0 cursor-pointer box-border;

    &:checked ~ .radio__icon {
      box-shadow: 0 0 0 0 white inset;
      @apply bg-gray-500 border-gray-600;
    }
  }
}
</style>
