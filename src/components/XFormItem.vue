<template>
  <div>
    <template v-if="wrapGroup">
      <group ref="item"><slot></slot></group>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
  import { Group } from 'vux'

  export default {
    name: 'x-form-item',
    componentName: 'XFormItem',
    props: {
      prop: String,
      wrapGroup: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Group
    },
    mounted() {
      if (this.prop) {
        this.bus().$emit('x.form.addField', this)
      }
    },
    beforeDestroy() {
      this.bus().$emit('x.form.removeField', this)
    },
    methods: {
      mm() {
        console.log('m')
      }
    }
  }
</script>

<style>
</style>
