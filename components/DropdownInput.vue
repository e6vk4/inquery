<template>
  <div class="relative w-full">
    <input
      id="filterInput"
      v-model="filterValue"
      autocomplete="off"
      class="block w-full px-4 py-1 leading-tight text-gray-700 border rounded appearance-none focus:outline-none input focus:border-gray-500"
    />

    <div
      class="absolute z-30 w-full overflow-scroll text-sm bg-white border rounded-b shadow-md"
      style="max-height: 15rem; top: 2rem"
    >
      <div v-if="filteredItems.length > 0">
        <div v-for="(item, index) in filteredItems" :key="index">
          <Checkbox
            v-if="type === 'checkbox'"
            :id="index"
            :checked="exists.includes(item)"
            :item="item"
            class="border-b hover:bg-gray-100"
            @checked="$emit('checked', item)"
          />
          <Radio
            v-if="type === 'radio'"
            :id="index"
            :checked="exists.includes(item)"
            :item="item"
            class="border-b hover:bg-gray-100"
            @checked="radioChecked(item)"
          />
        </div>
      </div>
      <div v-else class="py-5 text-center text-gray-400">none found</div>

      <button
        v-if="closeAble"
        type="button"
        class="sticky bottom-0 w-full px-4 py-1 text-center text-white bg-gray-600 focus:outline-none hover:bg-gray-700"
        @click="$emit('hide')"
      >
        DONE
      </button>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/Checkbox'
import Radio from '@/components/Radio'

export default {
  components: {
    Checkbox,
    Radio,
  },
  props: {
    items: {
      required: true,
      type: Array,
    },
    exists: {
      required: true,
      type: Array,
    },
    type: {
      required: true,
      type: String, // checkbox | radio
    },
    closeAble: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      filterValue: '',
    }
  },
  computed: {
    filteredItems() {
      const items = this.items
      return items.filter((item) => {
        const i = item.toLowerCase()
        const fv = this.filterValue.toLowerCase()
        if (this.filterValue) return i.includes(fv)
        else return item
      })
    },
  },
  mounted() {
    document.getElementById('filterInput').focus()
  },
  methods: {
    radioChecked(item) {
      this.$emit('checked', item)
      this.$emit('hide')
    },
  },
}
</script>
