<template>
  <div class="flex items-center">
    <button
      :class="{ disabled: currNum === min }"
      class="px-4 py-1 font-medium border border-r-0 border-gray-300 focus:outline-none hover:bg-gray-300"
      @click="control('-')"
    >
      -
    </button>
    <input
      v-model="currNum"
      type="number"
      :min="min"
      :max="max"
      class="w-20 px-4 py-1 text-center border border-gray-300 number__input focus:outline-none"
      @keyup="validate($event.target.value)"
    />
    <button
      :class="{ disabled: currNum === max }"
      class="px-4 py-1 font-medium border border-l-0 border-gray-300 focus:outline-none hover:bg-gray-300"
      @click="control('+')"
    >
      +
    </button>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      required: true,
      type: Number,
    },
    min: {
      required: true,
      type: Number,
    },
    num: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      currNum: this.num,
      currValidatedNum: null,
    }
  },
  watch: {
    num(newValue) {
      this.currNum = newValue
    },
    currValidatedNum(newValue) {
      if (newValue !== null) this.currNum = Number(newValue)
    },
  },
  methods: {
    control(x) {
      if (this.currNum + 1 <= this.max && x === '+') this.currNum++
      if (this.currNum - 1 >= this.min && x === '-') this.currNum--
      this.$emit('changed', this.currNum)
    },
    validate(x) {
      this.currValidatedNum = null
      if (x > this.max) this.currValidatedNum = this.max
      if (x < this.min) this.currValidatedNum = ''
      if (!this.currValidatedNum) {
        this.currNum = x
        this.$emit('changed', Number(x))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
.number__input::-webkit-outer-spin-button,
.number__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  @apply m-0;
}

/* Firefox */
.number__input[type='number'] {
  -moz-appearance: textfield;
}

button.disabled {
  @apply cursor-not-allowed opacity-50;
}
</style>
