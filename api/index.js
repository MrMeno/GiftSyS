var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var userList = require('./user.json');
var toolClass = require('./tools');

router.get('/login', function(req, res, next) {
        const userName = req.query.userName;
        const psw = req.query.psw;
        var isLogin = false;
        var userInfo = {};
        for (let i = 0; i < userList.data.userInfo.length; i++) {
            let item = userList.data.userInfo[i];
            if (userName == item.userName) {
                if (psw == item.psw) {
                    toolClass.changeJsonUser(item.id, { login: true });
                    userInfo = item;
                    isLogin = true;
                }
            }
        }
        if (isLogin) {
            res.send({
                code: '000000',
                msg: '登陆成功',
                data: {
                    id: userInfo.id,
                    award: userInfo.award,
                    userName: userInfo.userName,
                    name: userInfo.name,
                    isGifted: userInfo.isGifted

                }
            })
            res.end();
        } else {
            res.send({ code: '999999', msg: '用户名密码错误' })
            res.end();
        }

    }).get('/loginOut', function(req, res, next) {
        const id = req.query.id;
        var isLogin = toolClass.checkLogin(id);
        if (!isLogin) {
            res.send({ code: '000000', msg: '退出登录成功' })
            res.end();
        } else {
            toolClass.changeJsonUser(id, { login: false });
            res.send({ code: '000000', msg: '退出登录成功' })
            res.end();
        }
    }).get('/mdPsw', function(req, res, next) {
        const userName = req.query.userName;
        const psw = req.query.psw;
        const pswNew = req.query.pswNew;
        var psw_online = '';
        var result = false;
        var id = '';
        var userList = toolClass.readJsonSync("./api/user.json").userInfo;
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].userName == userName) {
                psw_online = userList[i].psw;
                id = userList[i].id
            }
        }
        if (psw != psw_online) {
            res.send({ code: '900020', msg: '输入密码有误' })
            res.end();
        } else {
            toolClass.changeJsonUser(id, { psw: pswNew });
            res.send({ code: '000000', msg: '修改成功' })
            res.end();
        }
    }).get('/getAword', function(req, res, next) {
        const id = req.query.id;
        const result = toolClass.checkLogin(id); //判断登录状态
        var awardIndex = 4;
        let dataGift = toolClass.readJsonSync('./api/gift.json');
        var giftList = dataGift.giftList; //礼品表
        var percentList = dataGift.percentList; //概率表
        var userInfo = toolClass.getUserInfo(id);
        let arrPoint = giftList.map(item => { //奖项分布轴线
            return item.point
        })
        var random = toolClass.getRandom(0, Number(arrPoint[arrPoint.length - 1])); //获取此次抽奖的随机数（0-数组长度）
        console.log(arrPoint)
        looper: //过滤器：判断该随机数获得奖项是否有库存，如没有，重复随机直至完成
            for (let i = 0; i < arrPoint.length; i++) {
                let m = i == 0 ? 0 : arrPoint[i - 1];
                let n = arrPoint[i];
                if (random > m && random < n) { //随机数满足的分布区间
                    awardIndex = giftList[i].level; //根据区间判断获奖等级
                    let count = Number(percentList[awardIndex - 1].count);
                    if (count > 0) { //该区间还有剩余奖品
                        percentList[awardIndex - 1].count = count - 1; //奖品数减一
                        percentList[awardIndex - 1].percent = ((percentList[i].percent / count) * (count - 1)).toFixed(4); //重新计算剩余获奖概率
                    } else { //该区间没有剩余奖品，再次获取随机数并加入过滤器，直至满足要求
                        random = toolClass.getRandom(0, Number(arrPoint[arrPoint.length - 1]));
                        continue looper;
                    }
                }
            }
        for (let i = 0; i < percentList.length; i++) { //根据获奖结果，重写奖项分布数组，并更新奖品池
            let counter = 0;
            for (let j = i; j >= 0; j--) {
                counter += Number(percentList[j].percent);
            }
            giftList[i].point = counter.toFixed(4);
        }
        /** 数据写入*/
        if (result) {
            if (!userInfo.isGifted) {
                for (let i = 0; i < giftList.length; i++) { //除权赋值
                    if (i == awardIndex - 1) {
                        giftList[i].list.push({ id: userInfo.id, userName: userInfo.userName });
                    }
                }
                let obj = { data: { giftList: [] } };
                obj.data.giftList = giftList;
                obj.data.percentList = percentList;
                toolClass.changeJson('./api/gift.json', JSON.stringify(obj));
                toolClass.changeJsonUser(id, { award: awardIndex, isGifted: true });
                res.send({
                    code: '000000',
                    msg: '成功',
                    data: {
                        msg: '恭喜您获得' + awardIndex + "等奖",
                        isGifted: false,
                        random: random.toFixed(4),
                        length: giftList[3].point,
                        level: awardIndex,
                        name: userInfo.name
                    }
                })
                res.end();
            } else {
                res.send({
                    code: '000000',
                    msg: '成功',
                    data: {
                        msg: '已完成抽奖',
                        isGifted: true,
                        name: userInfo.name,
                        level: userInfo.award
                    }
                })
                res.end();
            }
        } else {
            res.send({ code: '102121', msg: '远程调用失败' })
            res.end();
        }
    }).get('/getAwordList', function(req, res, next) {
        var id = req.query.id;
        var result = toolClass.checkLogin(id);
        var userList = toolClass.readJsonSync("./api/user.json").userInfo;
        let toplist = [];
        let bottomlist = [];
        var userInfo = toolClass.getUserInfo(id);
        for (let i = 0; i < userList.length; i++) {
            let item = userList[i];
            if (item.isGifted) {
                if (Number(item.award) < 4) {
                    toplist.push({
                        userName: item.userName,
                        isGifted: item.isGifted,
                        name: item.name,
                        award: item.award
                    })
                } else {
                    bottomlist.push({
                        userName: item.userName,
                        isGifted: item.isGifted,
                        name: item.name,
                        award: item.award
                    })
                }

            }
        }
        let highlist = toplist.sort((a, b) => a.award - b.award);
        if (result) {
            res.send({ code: '000000', msg: '成功', isGifted: userInfo.isGifted, data: { highlist: highlist, normalList: toolClass.yateFisher(bottomlist) } })
            res.end();
        } else {
            res.send({ code: '102121', msg: '用户未登录' })
            res.end();
        }
    })
    .get('/getUserList', function(req, res, next) {
        var userList = toolClass.readJsonSync("./api/user.json").userInfo;
        res.send({ code: '000000', msg: '成功', data: userList })
        res.end();
    }).get('/userUpdate', function(req, res, next) {
        var id = req.query.id;
        var updateId = req.query.updateId;
        var userInfo = toolClass.getUserInfo(id);
        var result = toolClass.checkLogin(id);
        toolClass.changeJsonUser(updateId, { award: 4, isGifted: true });
        let dataGift = toolClass.readJsonSync('./api/gift.json');
        var giftList = dataGift.giftList; //礼品表
        var percentList = dataGift.percentList; //概率表
        let count = Number(percentList[3].count);
        percentList[3].percent = ((percentList[3].percent / count) * (count - 1)).toFixed(4);
        percentList[3].count = count - 1;
        let obj = { data: { giftList: [], percentList: [] } };
        obj.data.giftList = giftList;
        obj.data.percentList = percentList;
        toolClass.changeJson('./api/gift.json', JSON.stringify(obj));
        if (result) {
            if (userInfo.userName == 'lijunhui') {
                res.send({ code: '000000', msg: '成功' })
                res.end();
            } else {
                res.send({ code: '900010', msg: '无访问权限' })
                res.end();
            }
        } else {
            res.send({ code: '102121', msg: '用户未登录' })
            res.end();
        }
    }).get('/reset', function(req, res, next) {
        var id = req.query.id;
        var gift = toolClass.readJsonSync("./api/gift.json.bak");
        var result = toolClass.checkLogin(id);
        toolClass.readJson("./api/user.json.bak", function(data) {
            var id = req.query.id;
            var userInfo = toolClass.getUserInfo(id);
            if (userInfo.userName == 'lijunhui') {
                toolClass.changeJson("./api/user.json", JSON.stringify(data));
                toolClass.changeJson("./api/gift.json", JSON.stringify({ data: gift }));
                if (result) {
                    res.send({ code: '000000', msg: '成功' })
                    res.end();
                } else {
                    res.send({ code: '900010', msg: '未登录' })
                    res.end();
                }
            } else {
                res.send({ code: '900010', msg: '无访问权限' })
                res.end();
            }
        });

    });
module.exports = router;