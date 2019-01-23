"use strict";
cc._RF.push(module, '0da43lHKRFFxpIb5JyKoYj+', 'ScoreFX');
// scripts/ScoreFX.js

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
        anim: {
            default: null,
            type: cc.Animation
        }
    },

    init: function init(game) {
        console.log("进行FX初始化了");
        this.game = game;
        console.log(this.anim);
        console.log(this.game);
        this.anim.getComponent('ScoreAnim').init(this);
        console.log("this anim is " + this.anim.getComponent('ScoreAnim'));
    },
    despawn: function despawn() {
        this.game.despawnScoreFX(this.node);
    },


    play: function play() {
        this.anim.play('score_pop');
    }
});

cc._RF.pop();