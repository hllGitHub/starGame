// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const Player = require('Player');
const Star = require('Star');
const ScoreFX = require('ScoreFX');

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;

        this.currentStar = null;
        this.currentStarX = 0;

        this.timer = 0;
        this.starDuration = 0;

        this.enabled = false;

        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX')

        // this.player.stopMove()

        // var player1 = require("Player")
        // var instance = new player1()
        // instance.stopMove()
    },

    startGame: function () {
        // 开始游戏
        this.resetScore()
        this.enabled = true
        // 初始化计分
        this.btnNode.x = 3000;
        this.gameOverNode.active = false
        this.player.startMoveAt(cc.v2(0, this.groundY))

        this.spawnNewStar();
    },

    spawnNewStar: function () {
        var newStar = null;
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this)
        } else {
            newStar = cc.instantiate(this.starPrefab)
        }

        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').init(this)

        this.startTimer()
        this.currentStar = newStar
    },

    despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },

    startTimer: function() {
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        if (!this.currentStar) {
            this.currentStarX = (Math.random() - 0.5) * 2 * this.node.width/2;
        }

        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        // Math.random() 随机产生0-1之间的小数
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        if (this.currentStarX >= 0) {
            randX = -Math.random() * maxX
        } else {
            randX = Math.random() * maxX
        }
        this.currentStarX = randX
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    gainScore: function(pos) {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score;

        // 播放特效
        var fx = this.spawnScoreFX();
        // console.log("fx.node = ", fx.node)
        // console.log("fx.component.node = ", cc.instantiate(this.scoreFXPrefab).getComponent('score'))
        // console.log(this.player.getComponent('Player'))
        this.node.addChild(fx.node)
        fx.node.setPosition(pos)
        fx.play()

        cc.audioEngine.playEffect(this.scoreAudio, false)
    },

    resetScore: function() {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnScoreFX: function() {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            console.log("fx is " + fx)
            fx.init(this)
            return fx
        }
    },

    despawnScoreFX (scoreFX) {
        this.scorePool.put(scoreFX)
    },

    // 一帧，1s有60帧，所以update的时间大约是0.01667左右
    update (dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false
            return;
        }
        this.timer += dt
    },

    gameOver: function() {
        console.log("游戏结束了")
        // this.player.stopAllActions();   // 停止 player 节点的跳跃动作，stopAllActions ,会停止对应节点上的所有action
        // cc.director.loadScene('game');  // 重新加载场景，cc.director 是一个管理游戏逻辑流程的单例对象
        this.gameOverNode.active = true
        this.player.enabled = false
        this.player.stopMove()
        this.currentStar.destroy()
        this.btnNode.x = 0
    },
});


