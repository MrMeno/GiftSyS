<template>
  <div class="login-tab">
    <div class="content">
      <div class="h">
        <h4>果藤开发专用抽奖系统</h4>
      </div>
      <div class="inputs">
        <el-form :rules="rules" :model="ruleForm" ref="ruleForm" v-if="isLogin">
          <el-form-item prop="account">
            <el-input placeholder="账号" v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item prop="psw">
            <el-input placeholder="密码" type="password" v-model="ruleForm.psw"></el-input>
          </el-form-item>
        </el-form>
        <el-form :rules="rules" :model="ruleFormMod" ref="ruleFormMod" v-if="!isLogin">
          <el-form-item prop="psw">
            <el-input placeholder="原始密码" type="password" v-model="ruleFormMod.psw"></el-input>
          </el-form-item>
          <el-form-item prop="pswNew">
            <el-input placeholder="最新密码" type="password" v-model="ruleFormMod.pswNew"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="sumits">
        <el-button @click="handleLogin" v-if="isLogin">登录</el-button>
        <el-button @click="handlePswMod" v-if="!isLogin">确认修改</el-button>
      </div>
      <div class="elss">
        <el-button type="text" @click="handleMod" v-if="isLogin">修改密码</el-button>
        <el-button type="text" @click="handleMod" v-if="!isLogin">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import storageClass from "../../tool/storage.js";
let _this = null;
export default {
  created() {
    _this = this;
    if (storageClass.judgeLogin()) {
      _this.$router.push("/award");
    }
  },
  mounted() {},
  data() {
    let checkPsw = (rule, value, callback) => {
      if (value != _this.ruleFormMod.psw) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      isLogin: true,
      ruleForm: {
        account: "",
        psw: ""
      },
      ruleFormMod: {
        psw: "",
        pswNew: ""
      },
      rules: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        psw: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur"
          }
        ],
        pswNew: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      _this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios
            .get("/api/login", {
              params: {
                userName: _this.ruleForm.account,
                psw: _this.ruleForm.psw
              }
            })
            .then(function(data) {
              if (data.data.code == "000000") {
                _this.$router.push("/award");
                localStorage.setItem(
                  "USERINFO",
                  JSON.stringify(data.data.data)
                );
                _this.$notify.success({
                  title: "果藤抽奖系统",
                  message: "登录成功"
                });
              } else {
                _this.$notify.error({
                  title: "系统错误",
                  message: data.data.msg
                });
              }
            });
        }
      });
    },
    handleMod() {
      _this.isLogin = !_this.isLogin;
    },
    handlePswMod() {
      _this.$refs["ruleFormMod"].validate(valid => {
        if (valid) {
          axios
            .get("/api/mdPsw", {
              params: {
                pswNew: _this.ruleFormMod.pswNew,
                psw: _this.ruleFormMod.psw,
                userName: _this.ruleForm.account
              }
            })
            .then(function(data) {
              if (data.data.code == "000000") {
                _this.handleMod();
                _this.$notify.success({
                  title: "果藤抽奖系统",
                  message: "修改成功"
                });
                 _this.$router.push("/login");
              } else {
                _this.$notify.error({
                  title: "修改失败",
                  message: data.data.msg
                });
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="less">
.login-tab {
  width: 100%;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: linear-gradient(to right, #0257c7, #0ba7ef);

  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 50%;
    height: 40%;
    border-radius: 10px;
    background: white;

    .h {
      flex: 0.1;
    }

    .inputs {
      height: auto;
      flex: 1;
      width: 100%;

      .el-form {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;

        .el-form-item {
          width: 100%;
          .el-form-item__content {
            .el-input {
              width: 80%;
            }
          }
          .el-form-item__error {
            margin-left: 10%;
          }
        }
      }
    }
    .sumits {
      flex: 0.3;
    }
    .elss {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      .el-button {
        font-size: 10px;
        margin-right: 5%;
      }
    }
  }
}
</style>
