(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Star.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0c463xWBjVELbv0sX85VJyQ', 'Star', __filename);
// scripts/Star.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    getPlayerDistance: function getPlayerDistance() {
        // 根据player节点位置判断距离
        var playerPos = this.game.player.getCenterPos();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    init: function init(game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;

        console.log("初始化了星星的opacity" + this.node.opacity);
    },

    reuse: function reuse(game) {
        this.init(game);
    },


    onPicker: function onPicker() {
        var pos = this.node.getPosition();
        // 调用 Game 脚本的得分方法
        this.game.gainScore(pos);
        // 当星星被收集时，调用 Game 脚本中的接口，销毁当前星星节点，生成一个新的星星
        this.game.despawnStar(this.node);
    },

    update: function update() {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicker();
            return;
        }

        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
        console.log(this.game.timer);
        console.log(this.game.starDuration);
        console.log(opacityRatio);
        console.log("更新星星的opacity" + this.node.opacity);
    },

    start: function start() {}
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Star.js.map
        