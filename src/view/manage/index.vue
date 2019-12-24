<template>
  <div class="manage-list">
    <div class="content">
      <div class="top">
        <span @click="handleCallBack">返回</span>
        {{userInfo.name}}
        <el-button type="text" @click="handleLoginout">退出登录</el-button>
      </div>
      <div class="middle">
        <h2>用户列表</h2>
        <div class="side">
          <div class="list">
                 <div class="list-item" v-for='item in list'>
                      {{item.name}}<el-button @click="userUpdate(item.id)" v-if='!item.isGifted' type='text'>灭灯</el-button>
                 </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import $ from "jquery";
import storageClass from "../../tool/storage.js";
let _this = null;
export default {
  data() {
    return {
      userInfo: {},
      level: "",
      list: [],
      num: ""
    };
  },
  created() {
    _this = this;
    if (!storageClass.judgeLogin()) {
      _this.$router.push("/login");
    } else {
      _this.userInfo = JSON.parse(localStorage.getItem("USERINFO"));
    }
  },
  mounted() {
    _this.getUserList();
  },
  methods: {
    handleLoginout() {
      axios
        .get("/api/loginOut", {
          params: {
            id: _this.userInfo.id
          }
        })
        .then(function(data) {
          if (data.data.code == "000000") {
            _this.$router.push("/login");
            localStorage.removeItem("USERINFO");
            _this.$notify.warning({
              title: "果藤抽奖系统",
              message: "已退出登录"
            });
          } else {
            if (data.data.code == "999999") {
              _this.$notify.error({
                title: "系统异常",
                message: ""
              });
            }
          }
        });
    },
    getUserList() {
      axios
        .get("/api/getUserList", {
          params: {}
        })
        .then(function(data) {
          if (data.data.code == "000000") {
            _this.list = data.data.data;
          } else {
            if (data.data.code == "102121") {
              _this.$notify.warning({
                title: "提示",
                message: "用户未登录"
              });
              _this.handleLoginout();
            }
          }
        });
    },
    userUpdate(updateId){
       axios
        .get("/api/userUpdate", {
          params: {updateId:updateId,id:_this.userInfo.id}
        })
        .then(function(data) {
          if (data.data.code == "000000") {
            _this.getUserList();
          } else {
            
          }
        });
    },
    handleCallBack() {
      _this.$router.push("/award");
    }
  }
};
</script>

<style lang="less">
.manage-list {
  width: 100%;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: url("../../assets/images/bg.png");
  background-position: center;
  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100vh;

    .top {
      color: orange;
      height: 30px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        color: #aaa;
        margin: 0px 10px;
      }
      span {
        cursor: pointer;
        font-size: 0.2em;
        color: #fff;
        margin-right: 10px;
      }
    }

    .middle {
      flex: 4;
      width: 100%;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      h2 {
        color: #fff;
        margin-top: 10px;
      }
      .side {
        margin: 0 auto;
        text-align: left;
        text-indent: 50px;
        font-size: 16px;
        border: 1px solid #fff;
        width: 300px;
        border-radius: 10px;
        background-color: #fff;
        color: #000;
        padding: 10px;
        &:first-child {
          height: 100px;
        }
        &:last-child {
          height: 500px;
          overflow: auto;
        }
        ul {
          li {
            margin: 5px 0;
          }
        }
      }
    }
    .bottom {
      height: 100px;
      h2 {
        color: #fff;
        margin-top: 10px;
      }
      p {
        font-size: 40px;
        color: #fff;
      }
    }
  }
}
</style>