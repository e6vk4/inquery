<template>
  <div class="relative">
    <div class="inline-flex flex-wrap items-center">
      <TagsItem
        v-for="(tag, index) in tags"
        :key="index"
        :tag="tag"
        :type="type"
        @hide="addTagCheckbox(tag)"
      />
      <button
        v-if="!showInput && type"
        class="inline-flex items-center justify-center px-2 py-1 mb-2 mr-2 bg-white border border-gray-300 rounded-md focus:outline-none hover:bg-gray-200"
        @click="showInput = true"
      >
        <IconPlus
          v-if="type === 'checkbox'"
          class="w-4 h-4 text-gray-600 fill-current"
        />
        <span v-else>change</span>
      </button>
      <button
        v-if="tags.length > 0 && type === 'checkbox' && !tags.includes('*')"
        class="px-2 mb-2 text-xs text-red-600 focus:outline-none hover:underline"
        @click="clearAll"
      >
        clear all
      </button>
    </div>
    <div v-if="type && showInput" class="absolute">
      <DropdownInput
        :items="data"
        :type="type"
        :exists="tags"
        @hide="showInput = false"
        @checked="
          type === 'checkbox' ? addTagCheckbox($event) : addTagRadio($event)
        "
      />
    </div>
  </div>
</template>

<script>
import IconPlus from '@/components/icons/IconPlus'
import DropdownInput from '@/components/DropdownInput'
import TagsItem from '@/components/TagsItem'

export default {
  components: {
    IconPlus,
    DropdownInput,
    TagsItem,
  },
  props: {
    data: {
      required: false,
      type: Array,
      default: () => [],
    },
    type: {
      required: false,
      type: String,
      default: '', // checkbox | radio
    },
    exists: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      showInput: false,
      tags: this.exists,
    }
  },
  watch: {
    exists(newValue) {
      this.tags = newValue
    },
  },

  methods: {
    addTagCheckbox(tag) {
      if (!tag) return
      const isSelectAll = this.tags.includes('*')
      if (isSelectAll) this.tags = []
      const value = tag.trim()
      const index = this.tags.findIndex((i) => i === value)
      if (index === -1) this.tags.push(value)
      else this.tags.splice(index, 1)
      if (!this.tags.length > 0) this.tags = ['*']
      this.$emit('tags', this.tags)
    },
    addTagRadio(tag) {
      if (!tag) return
      const value = tag.trim()
      this.tags = [value]
      this.$emit('tags', this.tags)
    },
    clearAll() {
      this.tags = ['*']
      this.$emit('tags', this.tags)
    },
  },
}
</script>
