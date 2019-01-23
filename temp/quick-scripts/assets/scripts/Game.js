(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4b305pV3cFAA7GO+XtZnnSX', 'Game', __filename);
// scripts/Game.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Player = require('Player');
var Star = require('Star');
var ScoreFX = require('ScoreFX');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: Player
        },
        controlDisplay: {
            default: null,
            type: cc.Label
        },
        btnNode: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: cc.AudioClip,
        keyboardHint: {
            default: '',
            multiline: true
        },
        touchHint: {
            default: '',
            multiline: true
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;

        this.currentStar = null;
        this.currentStarX = 0;

        this.timer = 0;
        this.starDuration = 0;

        this.enabled = false;

        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX');

        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlDisplay.string = hintText;
    },

    startGame: function startGame() {
        // 开始游戏
        this.resetScore();
        this.enabled = true;
        // 初始化计分
        this.btnNode.x = 3000;
        this.gameOverNode.active = false;
        this.player.startMoveAt(cc.v2(0, this.groundY));

        this.spawnNewStar();
    },

    spawnNewStar: function spawnNewStar() {
        var newStar = null;
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this);
        } else {
            newStar = cc.instantiate(this.starPrefab);
        }

        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').init(this);

        this.startTimer();
        this.currentStar = newStar;
    },

    despawnStar: function despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },


    startTimer: function startTimer() {
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        if (!this.currentStar) {
            this.currentStarX = (Math.random() - 0.5) * 2 * this.node.width / 2;
        }

        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        // Math.random() 随机产生0-1之间的小数
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        if (this.currentStarX >= 0) {
            randX = -Math.random() * maxX;
        } else {
            randX = Math.random() * maxX;
        }
        this.currentStarX = randX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    gainScore: function gainScore(pos) {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score;

        // 播放特效
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();

        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnScoreFX: function spawnScoreFX() {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            console.log("fx is " + fx);
            fx.init(this);
            return fx;
        }
    },

    despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
    },


    // 一帧，1s有60帧，所以update的时间大约是0.01667左右
    update: function update(dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    },


    gameOver: function gameOver() {
        console.log("游戏结束了");
        // this.player.stopAllActions();   // 停止 player 节点的跳跃动作，stopAllActions ,会停止对应节点上的所有action
        // cc.director.loadScene('game');  // 重新加载场景，cc.director 是一个管理游戏逻辑流程的单例对象
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        this.btnNode.x = 0;
    }
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
        //# sourceMappingURL=Game.js.map
        