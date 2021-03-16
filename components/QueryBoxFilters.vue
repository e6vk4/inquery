<template>
  <div class="w-full">
    <div class="flex items-start h-full text-xs">
      <!-- SELECT -->
      <div class="relative w-full h-full px-3 py-6 border-r">
        <div
          class="absolute px-2 mb-4 font-semibold text-white uppercase bg-gray-700 rounded-md"
          style="top: -1em"
        >
          Select
        </div>
        <div>
          <Tags
            :data="database.headers"
            type="checkbox"
            :exists="selectFilter"
            @tags="onSelect($event)"
          />
          <span class="inline-block mt-2 mr-3 text-gray-600">
            Showing all
            {{
              selectFilter.includes('*')
                ? databaseFiltered.headers.length
                : 'selected'
            }}
            columns</span
          >
        </div>
      </div>
      <!-- FROM -->
      <div class="relative w-full h-full px-3 py-6 border-r">
        <div
          class="absolute px-2 mb-4 font-semibold text-white uppercase bg-gray-700 rounded-md"
          style="top: -1em"
        >
          From
        </div>
        <div>
          <Tags
            :data="databases"
            :exists="fromFilter"
            type="radio"
            @tags="onFrom($event)"
          />
          <span
            v-if="fromFilter[0]"
            class="inline-block mt-2 mr-3 text-gray-600"
          >
            Showing {{ fromFilter[0] }} database -
            {{ database.items.length }} rows</span
          >
        </div>
      </div>
      <!-- WHERE -->
      <div class="relative w-full h-full py-6 pl-3 border-r">
        <div
          class="absolute px-2 mb-4 font-semibold text-white uppercase bg-gray-700 rounded-md"
          style="top: -1em"
        >
          Where
        </div>
        <div>
          <Tags :data="where" :exists="where" />
        </div>
        <div class="absolute text-gray-600" style="bottom: 1.4rem">
          <div v-if="where[2]">
            <span class="inline-block mt-2 mr-3 text-gray-600">
              Showing {{ databaseFiltered.items.length }}
              {{ databaseFiltered.items.length > 1 ? 'items' : 'item' }} out of
              {{ database.items.length }} rows</span
            >
          </div>
          <div v-else class="flex items-center">
            <span class="inline-block mr-3"> Use the filter</span>
            <IconFilter class="w-3 h-3 mr-3 fill-current" />
            in the table
          </div>
        </div>
      </div>
      <!-- ORDER BY -->
      <div class="relative w-full h-full px-3 py-6 border-r">
        <div
          class="absolute px-2 mb-4 font-semibold text-white uppercase bg-gray-700 rounded-md"
          style="top: -1em"
        >
          Order By
        </div>
        <div>
          <Tags :data="order" :exists="order" />
        </div>

        <div
          class="absolute flex items-center text-gray-600"
          style="bottom: 1.4rem"
        >
          <span class="inline-block mr-3"> Use the arrows</span>
          <IconArrow class="w-4 h-4 transform rotate-90 fill-current" />desc
          <IconArrow class="w-4 h-4 transform -rotate-90 fill-current" />asc
          <span class="inline-block ml-3">in the table</span>
        </div>
      </div>
      <!-- LIMIT -->
      <div class="relative w-full h-full px-3 py-6">
        <div
          class="absolute px-2 mb-4 font-semibold text-white uppercase bg-gray-700 rounded-md"
          style="top: -1em"
        >
          Limit
        </div>
        <div>
          <NumberInput
            :max="getInitialCount"
            :min="1"
            :num="limitFilter"
            @changed="onLimit($event)"
          />
          <span class="inline-block mt-4 mr-3 text-gray-600">
            Showing {{ limitFilter }}
            {{ limitFilter > 1 ? 'items' : 'item' }} out of
            {{ getInitialCount }} rows</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconFilter from '@/components/icons/IconFilter'
import IconArrow from '@/components/icons/IconArrow'
import Tags from '@/components/Tags'
import NumberInput from '@/components/NumberInput'

export default {
  components: {
    IconFilter,
    IconArrow,
    Tags,
    NumberInput,
  },
  props: {
    databases: {
      required: true,
      type: Array,
    },
    database: {
      required: true,
      type: Object,
    },
    databaseFiltered: {
      required: true,
      type: Object,
    },
    select: {
      required: true,
      type: Array,
    },
    from: {
      required: true,
      type: Array,
    },
    order: {
      required: true,
      type: Array,
    },
    where: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      selectFilter: this.select,
      fromFilter: this.from,
      limitFilter: this.databaseFiltered.items.length,
    }
  },
  computed: {
    getInitialCount() {
      return this.$store.getters['counter/initialCount']
    },
  },
  watch: {
    from: {
      handler(newValue, oldVal) {
        this.mutateLimitFilter('default')
        this.mutateInitialCount('default')
      },
      deep: true,
    },
    where: {
      handler(newValue, oldVal) {
        if (newValue[2]) {
          this.mutateLimitFilter('filtered')
          this.mutateInitialCount('filtered')
        } else {
          this.mutateLimitFilter('default')
          this.mutateInitialCount('default')
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.mutateInitialCount('default')
  },
  methods: {
    mutateLimitFilter(mode) {
      if (mode === 'filtered') {
        this.limitFilter = this.databaseFiltered.items.length
        this.$emit('limit', this.limitFilter)
      }
      if (mode === 'default') {
        this.limitFilter = this.database.items.length
        this.$emit('limit', this.limitFilter)
      }
    },
    mutateInitialCount(mode) {
      if (mode === 'filtered')
        this.$store.commit(
          'counter/initialCount',
          this.databaseFiltered.items.length
        )
      if (mode === 'default')
        this.$store.commit('counter/initialCount', this.database.items.length)
    },
    onSelect(e) {
      this.selectFilter = e
      this.$emit('select', this.selectFilter)
    },
    onFrom(e) {
      if (!e) this.fromFilter = ['customers']
      else this.fromFilter = e
      this.$emit('from', this.fromFilter)
    },
    onLimit(e) {
      this.limitFilter = e
      this.$emit('limit', this.limitFilter)
    },
  },
}
</script>
