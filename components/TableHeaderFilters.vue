<template>
  <div class="relative flex items-center justify-between">
    <div
      v-if="filter"
      class="absolute bottom-0 left-0 text-sm font-normal"
      style="top: 2rem; min-width: 12rem"
    >
      <div
        class="relative z-20 w-full px-4 py-4 text-center bg-gray-100 rounded-md shadow-md"
      >
        <!-- Close -->
        <button
          type="button"
          class="absolute right-0 w-4 h-4 focus:outline-none hover:bg-gray-500"
          style="right: 1rem"
          @click="filter = false"
        >
          <IconClose class="text-gray-700 fill-current" />
        </button>

        <!-- Where -->
        <span class="inline-block w-full px-2 mb-4 font-normal text-gray-600"
          >WHERE</span
        >

        <!-- Current Where Item -->
        <span class="block w-full px-2 py-1 mb-6 text-xs bg-gray-300 rounded">
          {{ item }}</span
        >

        <!-- Operators -->
        <div class="relative inline-block mb-6 cursor-pointer">
          <select
            class="flex px-4 py-1 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
            @change="onWhere($event.target.value, whereFilter[2])"
          >
            <option value="=" selected>&#61;</option>
            <option value=">">&#62;</option>
            <option value="<">&#60;</option>
            <option value=">=">&#62;&#61;</option>
            <option value="<=">&#60;&#61;</option>
            <option value="!=">&#33;&#61;</option>
            <option value="BW" disabled>BW</option>
            <option value="IN" disabled>IN</option>
          </select>
          <div
            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
          >
            <IconDropdown />
          </div>
        </div>
        <!-- Value -->
        <div class="w-full">
          <div v-if="whereFilter[2]" class="w-full text-xs">
            <span class="block w-full px-2 py-1 mb-1 bg-gray-300 rounded">
              {{ whereFilter[2] }}</span
            >
            <button
              class="inline-flex items-center justify-center px-2 py-1 mb-2 mr-2 bg-white border border-gray-300 rounded-md focus:outline-none hover:bg-gray-200"
              @click="onWhere(whereFilter[1], null)"
            >
              change
            </button>
          </div>
          <DropdownInput
            v-else
            :items="whereData"
            type="radio"
            :exists="whereFilter[2] ? whereFilter[2] : ['']"
            :close-able="false"
            @checked="onWhere(whereFilter[1], $event)"
          />
        </div>
      </div>
    </div>
    <!-- Where Filter Icon -->
    <button
      :class="{ 'bg-gray-300': currWhereFilter === item }"
      class="inline-block mr-3 rounded-md focus:outline-none hover:bg-gray-300"
      style="padding: 0.35rem"
      @click="onWhereToggle(whereFilter[1])"
    >
      <IconFilter class="w-3 h-3 text-gray-600 fill-current" />
    </button>

    <!-- Order By Arrow Down Icon -->
    <button
      :class="{
        'bg-gray-300':
          orderFilter[0] === item && orderFilter[1] === 'descending',
      }"
      class="inline-block p-1 mr-1 rounded-md focus:outline-none hover:bg-gray-300"
      @click="onOrder('descending')"
    >
      <IconArrow
        class="w-4 h-4 text-gray-600 transform rotate-90 fill-current"
      />
    </button>

    <!-- Order By Arrow Up Icon -->
    <button
      :class="{
        'bg-gray-300':
          orderFilter[0] === item && orderFilter[1] === 'ascending',
      }"
      class="inline-block p-1 rounded-md focus:outline-none hover:bg-gray-300"
      @click="onOrder('ascending')"
    >
      <IconArrow
        class="w-4 h-4 text-gray-600 transform -rotate-90 fill-current"
      />
    </button>
  </div>
</template>

<script>
import IconFilter from '@/components/icons/IconFilter'
import IconArrow from '@/components/icons/IconArrow'
import IconDropdown from '@/components/icons/IconDropdown'
import IconClose from '@/components/icons/IconClose'
import DropdownInput from '@/components/DropdownInput'

export default {
  components: {
    IconFilter,
    IconArrow,
    IconDropdown,
    IconClose,
    DropdownInput,
  },
  props: {
    item: {
      required: true,
      type: String,
    },
    order: {
      required: true,
      type: Array,
    },
    where: {
      required: true,
      type: Array,
    },
    currWhereFilter: {
      required: true,
      type: String,
    },
    database: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      filter: false,
      orderFilter: this.order, // ['customerName', 'descending]
      whereFilter: this.where, // ['customerName', '=', 'ebuka']
    }
  },
  computed: {
    whereData() {
      const d = this.database.map((i) => i[this.whereFilter[0]])
      if (d) return [...new Set(d)]
      else return []
    },
  },
  watch: {
    order(newValue) {
      this.orderFilter = newValue
    },
    where(newValue) {
      this.whereFilter = newValue
    },
    currWhereFilter(newValue) {
      if (this.filter && newValue !== this.item) this.filter = false
    },
  },
  methods: {
    onOrder(order) {
      const isItem = this.orderFilter[0] === this.item
      const isOrder = this.orderFilter[1] === order
      if (isItem && isOrder) this.orderFilter = ['', '']
      else this.orderFilter = [this.item, order]
      this.$emit('order-changed', this.orderFilter)
    },
    onWhere(x, y) {
      this.whereFilter = [this.item, x, y]
      if (!y) return
      this.$emit('where-changed', this.whereFilter)
      this.filter = !this.filter
    },
    onWhereToggle(x) {
      this.filter = !this.filter
      this.$emit('where-filter-opened', this.item)
      this.whereFilter = [this.item, x, null]
      this.$emit('where-changed', this.whereFilter)
    },
  },
}
</script>
