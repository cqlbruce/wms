<template>
  <div>
    <div style="margin-bottom:15px;">
      您的角色: {{ roles }}
    </div>
    选择角色:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="操作员" />
      <el-radio-button label="管理员" />
    </el-radio-group>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return '管理员'
      // return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
}
</script>
