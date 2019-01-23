"use strict";
cc._RF.push(module, '90117m7iuNEYKi4tv1Q2IRd', 'ScoreAnim');
// scripts/ScoreAnim.js

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

    init: function init(scoreFX) {
        this.scoreFX = scoreFX;
    },


    hideFix: function hideFix() {
        this.scoreFX.despawn();
    }
});

cc._RF.pop();