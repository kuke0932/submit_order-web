<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'x-form',
    componentName: 'XForm',
    data() {
      return {
        fields: []
      }
    },
    created() {
      this.bus().$on('x.form.addField', (field) => {
        if (field) {
          this.fields.push(field)
        }
      })
      /* istanbul ignore next */
      this.bus().$on('x.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1)
        }
      })
    },
    methods: {
      valid() {
        const promise = new Promise((resolve, reject) => {
          for (let i = 0; i < this.fields.length; i++) {
            const e = this.fields[i]
            const ret = this._valid(e)
            if (!ret[0]) {
              ret[1].$el && ret[1].$el.scrollIntoView && ret[1].$el.scrollIntoView()
              reject(new Error())
              break
            }
          }
          resolve()
        })
        return promise
      },
      _valid(component, valid = false, child = {}) {
        if (component.$options._componentTag === 'x-input') {
          component.validate()
          this.$nextTick(() => {
            component.onClickErrorIcon()
          })
//          this.$vux.toast.show({
//            text: component.firstError,
//            type: 'text'
//          })
          valid = component.valid
          child = component
          if (!valid) {
            component.onClickErrorIcon()
          }
        } else if (component.$options._componentTag === 'popup-picker') {
          console.log(component)
          if (component.$attrs.required === 'true' && component.value.length === 0) {
            this.$vux.toast.show({
              text: component.title + '必填哦',
              type: 'text'
            })
            return [false, component]
          } else {
            return [true, component]
          }
        } else {
          const children = component && component.$children
          children && children.forEach(e => {
            const _valid = this._valid(e, valid, child)
            valid = _valid[0]
            child = _valid[1]
          })
        }
        return [valid, child]
      }
    }
  }
</script>

<style>
</style>
