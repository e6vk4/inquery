<template>
  <div>
    <div
      class="flex items-center justify-center inline-block px-2 py-1 mb-2 mr-2 bg-gray-300 rounded"
      style="max-width: 7rem"
    >
      <span v-if="tag === '*'" class="text-xs">
        <IconAsterisk class="w-4 h-4 text-gray-700 fill-current" />
      </span>
      <span
        v-else
        :class="{ 'mr-2': showCloseButton }"
        class="text-xs truncate whitespace-no-wrap"
      >
        {{ tag }}
      </span>
      <button
        v-if="showCloseButton"
        type="button"
        class="w-4 h-4 focus:outline-none hover:bg-gray-500"
        @click="$emit('hide')"
      >
        <IconClose class="text-gray-700 fill-current" />
      </button>
    </div>
  </div>
</template>

<script>
import IconClose from '@/components/icons/IconClose'
import IconAsterisk from '@/components/icons/IconAsterisk'

export default {
  components: {
    IconClose,
    IconAsterisk,
  },
  props: {
    tag: {
      required: false,
      type: String,
      default: '',
    },
    type: {
      required: false,
      type: String,
      default: 'checkbox', // checkbox | radio
    },
  },
  computed: {
    showCloseButton() {
      return this.type === 'checkbox' && this.tag !== '*'
    },
  },
}
</script>
