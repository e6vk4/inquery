<template>
  <div class="text-gray-900" style="min-width: 100rem">
    <div id="scrollTo"></div>
    <!-- Header -->
    <h1 class="mt-10 text-2xl font-bold text-center">InQuery</h1>
    <!-- Content -->
    <div class="w-full px-24 mt-10">
      <!-- Data -->
      <div class="w-full">
        <div
          class="flex self-start justify-center w-full mb-20 bg-gray-100 border"
        >
          <QueryBoxFilters
            :databases="databases"
            :database="database"
            :database-filtered="databaseFiltered"
            :select="select"
            :from="from"
            :order="order"
            :where="where"
            @select="select = $event"
            @from="from = $event"
            @limit="limit = $event"
          />
        </div>
        <div
          class="w-full pb-64 overflow-scroll border border-t-0 border-gray-200"
        >
          <table class="text-sm table-auto">
            <thead>
              <tr>
                <th
                  class="px-4 py-2 text-xs font-medium text-left text-gray-600 whitespace-no-wrap border"
                >
                  S/N
                </th>
                <th
                  v-for="(item, index) in databaseFiltered.headers"
                  :key="index"
                  class="px-4 py-2 font-medium text-left whitespace-no-wrap border"
                >
                  <div class="flex items-center justify-between w-full">
                    <span class="inline-block mr-20">
                      {{ item }}
                    </span>
                    <TableHeaderFilters
                      :item="item"
                      :order="order"
                      :where="where"
                      :curr-where-filter="currWhereFilter"
                      :database="databaseFiltered.items"
                      @order-changed="order = $event"
                      @where-changed="where = $event"
                      @where-filter-opened="currWhereFilter = $event"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item2, index2) in databaseFiltered.items"
                :key="index2"
                class="hover:bg-gray-100"
              >
                <td
                  class="px-4 py-2 font-light text-gray-600 whitespace-no-wrap border"
                >
                  {{ index2 + 1 }}
                </td>
                <td
                  v-for="(item3, index3) in databaseFiltered.headers"
                  :key="index3"
                  class="px-4 py-2 font-light text-black whitespace-no-wrap border"
                >
                  {{ item2[item3] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="databaseFiltered.items.length > 0"
          class="w-full my-10 text-center"
        >
          -- end --
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QueryBoxFilters from '@/components/QueryBoxFilters'
import TableHeaderFilters from '@/components/TableHeaderFilters'

export default {
  components: {
    QueryBoxFilters,
    TableHeaderFilters,
  },
  async asyncData({ $content }) {
    return {
      categories: await $content('categories').fetch(),
      customers: await $content('customers').fetch(),
      employerTerritories: await $content('employee_territories').fetch(),
      employees: await $content('employees').fetch(),
      orderDetails: await $content('order_details').fetch(),
      orders: await $content('orders').fetch(),
      products: await $content('products').fetch(),
      regions: await $content('regions').fetch(),
      shippers: await $content('shippers').fetch(),
      suppliers: await $content('suppliers').fetch(),
      territories: await $content('territories').fetch(),
    }
  },
  data() {
    return {
      databases: [
        'categories',
        'customers',
        'employerTerritories',
        'employees',
        'orderDetails',
        'orders',
        'products',
        'regions',
        'shippers',
        'suppliers',
        'territories',
      ],
      select: ['*'], // ['customerId', 'employeeId']
      from: ['customers'], // ['customers']
      where: [null, '=', null], // ['customerId', '=', 'ebuka']
      currWhereFilter: '', // 'customerId'
      order: [null, null], // ['customerId', 'desc']
      limit: 0, // 9
      count: 0,
    }
  },
  computed: {
    database() {
      // From Filter
      const items = this[this.from[0]].body
      const headers = Object.keys(items[0])
      return {
        items,
        headers,
      }
    },
    databaseLength() {
      return this.database.items.length
    },
    databaseFiltered() {
      const items = this.database.items
      let filtered = []

      // Select Filter
      if (this.select.includes('*')) filtered = items
      else
        items.forEach((i) => {
          const ccc = Object.keys(i)
            .filter((key) => this.select.includes(key))
            .reduce((obj, key) => {
              return {
                ...obj,
                [key]: i[key],
              }
            }, {})

          filtered.push(ccc)
        })

      // Order Filter
      if (this.order[0] && this.order[1]) {
        filtered.sort((a, b) => {
          if (a[this.order[0]] < b[this.order[0]]) return -1
          if (a[this.order[0]] > b[this.order[0]]) return 1
          return 0
        })
        if (this.order[1] === 'descending') filtered.reverse()
      }

      // Where Filter
      const isWhere = this.select.includes('*')
        ? this.where[2]
        : this.select.includes(this.where[0]) && this.where[2]
      if (isWhere) {
        const testNumber = (x, y) => {
          return !isNaN(parseInt(x, 10)) && !isNaN(parseInt(y, 10))
        }
        const testString = (x, y) => {
          return !parseInt(x, 10) && !parseInt(y, 10)
        }

        filtered = filtered.filter((i) => {
          let state = false

          if (Object.getOwnPropertyDescriptor(i, this.where[0])) {
            const x = i[this.where[0]]
            const y = this.where[2]
            const z = this.where[1]

            if (testNumber(x, y)) {
              if (z === '=') state = parseInt(x, 10) === parseInt(y, 10)
              if (z === '>') state = parseInt(x, 10) > parseInt(y, 10)
              if (z === '<') state = parseInt(x, 10) < parseInt(y, 10)
              if (z === '>=') state = parseInt(x, 10) >= parseInt(y, 10)
              if (z === '<=') state = parseInt(x, 10) <= parseInt(y, 10)
              if (z === '!=') state = parseInt(x, 10) !== parseInt(y, 10)
            }
            if (testString(x, y)) {
              if (z === '=') return (state = x === y)
              if (z === '>') state = x > y
              if (z === '<') state = x < y
              if (z === '>=') state = x >= y
              if (z === '<=') state = x <= y
              if (z === '!=') state = x !== y
            }
          }
          return state
        })
      }

      // Limit Filter
      const limit = this.limit ? this.limit : filtered.length
      filtered = filtered.slice(0, limit)

      let headers = []
      if (filtered.length > 0) headers = Object.keys(filtered[0])
      else headers = Object.keys(items[0])
      return { items: filtered, headers }
    },
  },
  watch: {
    from: {
      handler(newValue, oldVal) {
        this.select = ['*']
        this.where = ['', '=', '']
        this.currWhereFilter = ''
        this.order = ['', '']
        this.limit = 0
      },
      deep: true,
    },
    databaseFiltered: {
      handler(newValue, oldVal) {
        this.limit = newValue.items.length
      },
      deep: true,
    },
  },
}
</script>
