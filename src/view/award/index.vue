<template>
  <div class="award-tab">
    <div class="content">
      <div class="top">
        <el-button type="text" v-if="userInfo.name=='李俊辉'" @click="hanldeManage">管理</el-button>
        <el-button type="text" v-if="userInfo.name=='李俊辉'" @click="hanldeReset">重置</el-button>
        {{userInfo.name}}
        <el-button type="text" @click="handleLoginout">退出登录</el-button>
      </div>
      <div class="middle">
        <div v-show="isBoxShow" class="myBox">
          <ul class="cj1" sytle="position: relative; width: 310px; height: 310px;">
            <li class="btnSlow">绝望吗</li>
          </ul>
          <div class="bt bt1 btnSlow">点我抽奖</div>
        </div>
        <div v-show="!isBoxShow" class="myBox">
          <p>暂未到抽奖时间,请到时再试</p>
        </div>
        <el-button v-show="isBoxShow" @click="handleList">查看获奖名单</el-button>
      </div>
      <div class="bottom">
        <p></p>
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
      isGifted: false,
      juewang: "",
      isBoxShow: false
    };
  },
  created() {
    _this = this;
    if (!storageClass.judgeLogin()) {
      _this.$router.push("/login");
    } else {
      _this.userInfo = JSON.parse(localStorage.getItem("USERINFO"));
      _this.hanldeDate("2019/12/21 21:00:00");
    }
  },
  mounted() {
    if (_this.isBoxShow) {
      _this.handleGetAward();
      setTimeout(() => {
        $(".btnSlow").addClass("active");
        var tar = "";
        switch (_this.juewang) {
          case 1:
            tar = 2;
            break;
          case 2:
            tar = 4;
            break;
          case 3:
            tar = 6;
            break;
          case 4:
            tar = 8;
            break;

          default:
            break;
        }
        $(".cj1").myLuckDraw(
          {
            row: 3, //行
            column: 3, //列
            spacing: 20, //空隙
            click: ".bt1", //点击触发
            time: 3, //匀速运动的时间
            end: function(e) {
              let jiang = _this.level;
              switch (jiang) {
                case 1:
                  $(".bottom p").text("恭喜您获得一等奖");
                  break;
                case 2:
                  $(".bottom p").text("恭喜您获得二等奖");
                  break;
                case 3:
                  $(".bottom p").text("恭喜您获得三等奖");
                  break;
                case 4:
                  $(".bottom p").text("恭喜您获得阳光普照奖");
                  break;

                default:
                  break;
              }
            }
          },
          tar
        );
      }, 1000);
    }
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
    handleGetAward() {
      $(".center-btn").addClass("active");
      axios
        .get("/api/getAword", {
          params: {
            id: _this.userInfo.id
          }
        })
        .then(function(data) {
          if (data.data.code == "000000") {
            _this.level = data.data.data.level;
            _this.juewang = data.data.data.level;
            _this.userInfo.isGifted = true;
            _this.userInfo.award = _this.level;
            localStorage.setItem("USERINFO", JSON.stringify(_this.userInfo));

            $(".center-btn").removeClass("active");
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
    handleList() {
      _this.$router.push("/list");
    },
    hanldeManage(){
           _this.$router.push("/manage");
    },
    hanldeDate(date1, callback) {
      var oDate1 = new Date(date1);
      var oDate2 = new Date();
      if (oDate1.getTime() > oDate2.getTime()) {
        _this.isBoxShow = false;
      } else {
        _this.isBoxShow = true;
      }
    }
  }
};
</script>

<style lang="less">
.award-tab {
  width: 100%;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-position: center;
  background-image: url("../../assets/images/bg.png");
  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100vh;

    .top {
      color: orange;
      height: 50px;
      width: 100%;
      font-size: 16px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        color: orange;
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
      margin-top: 50px;
      padding-top: 25px;
      color: #aaa;
      background-image: url("../../assets/images/ulbg.png");
      background-size: contain;
      background-repeat: no-repeat;
      .bt1 {
        width: 90px;
        height: 90px;
        line-height: 90px;
        font-size: 22px;
        transform: translateY(-200px);
        border-radius: 10px;
        box-shadow: 6px 6px 5px #ccc;
        background-image: url("../../assets/images/btbg.png");
        background-repeat: no-repeat;
        background-position: center;
      }
      .myBox {
        height: 370px;
        p {
          font-size: 24px;
          color: #fff;
          line-height: 350px;
        }
      }
      @keyframes roateOne {
        0% {
          transform: rotateZ(0deg);
        }

        50% {
          transform: rotateZ(180deg);
        }

        100% {
          transform: rotateZ(360deg);
        }
      }

      .center-btn {
        background-image: linear-gradient(90deg, #0ba7ef, #0257c7);
        width: 200px;
        height: 200px;
        border-radius: 100px;
        display: flex;

        justify-content: center;
        align-items: center;
        font-size: 28px;
        color: white;
        font-weight: 900;
        cursor: pointer;
      }
      .center-btn:hover {
        width: 180px;
        height: 180px;
        border-radius: 90px;
      }

      .active {
        visibility: visible;
      }
      .side {
        flex: 1;
        margin-left: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .title {
          color: white;
        }
        .list {
          display: flex;
          flex-direction: row;
          color: white;
          font-size: 30px;
        }
      }
      .el-button {
        width: 150px;
        height: 48px;
        background: orange;
        color: #fff;
        border: none;
        font-size: 18px;
      }
      .btnSlow {
        visibility: hidden;
        &.active {
          visibility: visible;
          transition: all 1s;
        }
      }
    }

    .bottom {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 40px;
      font-weight: 900;
      p {
        color: #fff;
      }
    }
  }
}
</style>