<template>
  <div class="award-list">
    <div class="content">
      <div class="top">
        <span @click="handleCallBack">返回</span>
        <el-button type="text" v-if="userInfo.name=='李俊辉'" @click="hanldeReset">重置</el-button>
        {{userInfo.name}}
        <el-button type="text" @click="handleLoginout">退出登录</el-button>
      </div>
      <div class="middle">
        <h2>中奖名单</h2>
        <div class="side">
          <div class="list">
            <ul>
              <li
                v-for="(item,index) in list.highlist"
                :key="index"
              >恭喜{{item.name}}获得{{item.award}}等奖</li>
            </ul>
          </div>
        </div>
        <h2>感谢名单</h2>
        <div class="side">
          <div class="list">
            <ul>
              <li v-for="(item,index) in list.normalList" :key="index">恭喜{{item.name}}获得阳光普照奖</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom">
        <h2>总参加人数</h2>
        <p>{{num}}</p>
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
    _this.getAwardList();
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
    hanldeReset: function() {
      axios
        .get("/api/reset", {
          params: {
            id: _this.userInfo.id
          }
        })
        .then(function(data) {
          if (data.data.code == "000000") {
            alert("重置成功");
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
    getAwardList() {
      axios
        .get("/api/getAwordList", {
          params: {
            id: _this.userInfo.id
          }
        })
        .then(function(data) {
          if (data.data.code == "000000") {
            _this.list = data.data.data;
            _this.isGifted = data.data.isGifted;
            _this.num =
              _this.list.highlist.length + _this.list.normalList.length;
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
    handleCallBack() {
      _this.$router.push("/award");
    }
  }
};
</script>

<style lang="less">
.award-list {
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
      font-size: 16px;
      .el-button {
        color: #aaa;
        margin: 0px 10px;
      }
      span {
        cursor: pointer;
        font-size: 14px;
        color: #fff;
        margin-right: 10px;
      }
    }

    .middle {
      flex: 2;
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
          height: 300px;
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