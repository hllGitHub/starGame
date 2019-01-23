require = function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function(r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
}()({
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4b305pV3cFAA7GO+XtZnnSX", "Game");
    "use strict";
    var Player = require("Player");
    var Star = require("Star");
    var ScoreFX = require("ScoreFX");
    var Game = cc.Class({
      extends: cc.Component,
      properties: {
        starPrefab: {
          default: null,
          type: cc.Prefab
        },
        scoreFXPrefab: {
          default: null,
          type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDuration: 0,
        ground: {
          default: null,
          type: cc.Node
        },
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
        scoreDisplay: {
          default: null,
          type: cc.Label
        },
        scoreAudio: cc.AudioClip,
        keyboardHint: {
          default: "",
          multiline: true
        },
        touchHint: {
          default: "",
          multiline: true
        }
      },
      onLoad: function onLoad() {
        this.groundY = this.ground.y + this.ground.height / 2;
        this.currentStar = null;
        this.currentStarX = 0;
        this.timer = 0;
        this.starDuration = 0;
        this.enabled = false;
        this.starPool = new cc.NodePool("Star");
        this.scorePool = new cc.NodePool("ScoreFX");
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlDisplay.string = hintText;
      },
      startGame: function startGame() {
        this.resetScore();
        this.enabled = true;
        this.btnNode.x = 3e3;
        this.gameOverNode.active = false;
        this.player.startMoveAt(cc.v2(0, this.groundY));
        this.spawnNewStar();
      },
      spawnNewStar: function spawnNewStar() {
        var newStar = null;
        newStar = this.starPool.size() > 0 ? this.starPool.get(this) : cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent("Star").init(this);
        this.startTimer();
        this.currentStar = newStar;
      },
      despawnStar: function despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
      },
      startTimer: function startTimer() {
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
      },
      getNewStarPosition: function getNewStarPosition() {
        this.currentStar || (this.currentStarX = 2 * (Math.random() - .5) * this.node.width / 2);
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
        var maxX = this.node.width / 2;
        randX = this.currentStarX >= 0 ? -Math.random() * maxX : Math.random() * maxX;
        this.currentStarX = randX;
        return cc.v2(randX, randY);
      },
      gainScore: function gainScore(pos) {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score;
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();
        cc.audioEngine.playEffect(this.scoreAudio, false);
      },
      resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = "Score: " + this.score.toString();
      },
      spawnScoreFX: function spawnScoreFX() {
        var fx;
        if (this.scorePool.size() > 0) {
          fx = this.scorePool.get();
          return fx.getComponent("ScoreFX");
        }
        fx = cc.instantiate(this.scoreFXPrefab).getComponent("ScoreFX");
        console.log("fx is " + fx);
        fx.init(this);
        return fx;
      },
      despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
      },
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
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        this.btnNode.x = 0;
      }
    });
    cc._RF.pop();
  }, {
    Player: "Player",
    ScoreFX: "ScoreFX",
    Star: "Star"
  } ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14a27W1I1dMUZXSs1au1lNI", "Player");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        jumpAudio: cc.AudioClip
      },
      setJumpAction: function setJumpAction() {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionOut());
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
      },
      playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
      },
      getCenterPos: function getCenterPos() {
        var centerPos = cc.v2(this.node.x, this.node.y + this.node.height / 2);
        return centerPos;
      },
      startMoveAt: function startMoveAt(pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.setJumpAction());
      },
      stopMove: function stopMove() {
        this.node.stopAllActions();
      },
      onLoad: function onLoad() {
        this.enabled = false;
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on("touchstart", this.onTouchStart, this);
        touchReceiver.on("touchend", this.onTouchEnd, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.KEY.a:
          this.accLeft = true;
          break;

         case cc.KEY.d:
          this.accRight = true;
        }
      },
      onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
         case cc.KEY.a:
          this.accLeft = false;
          break;

         case cc.KEY.d:
          this.accRight = false;
        }
      },
      onTouchStart: function onTouchStart(event) {
        console.log("触摸了屏幕");
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width / 2) {
          this.accLeft = false;
          this.accRight = true;
        } else {
          this.accLeft = true;
          this.accRight = false;
        }
      },
      onTouchEnd: function onTouchEnd(event) {
        console.log("停止触摸屏幕");
        this.accLeft = false;
        this.accRight = false;
      },
      update: function update(dt) {
        this.accLeft ? this.xSpeed -= this.accel * dt : this.accRight && (this.xSpeed += this.accel * dt);
        Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
        this.node.x += this.xSpeed * dt;
        this.node.x > this.node.parent.width / 2 ? this.node.x = -this.node.parent.width / 2 : this.node.x < -this.node.parent.width / 2 && (this.node.x = this.node.parent.width / 2);
      },
      onDescroy: function onDescroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.systemEvent.EventType.KEY_UP, this.onKeyUp, this);
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off("touchstart", this.onTouchStart, this);
        touchReceiver.off("touchend", this.onTouchEnd, this);
      }
    });
    cc._RF.pop();
  }, {} ],
  ScoreAnim: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "90117m7iuNEYKi4tv1Q2IRd", "ScoreAnim");
    "use strict";
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
  }, {} ],
  ScoreFX: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0da43lHKRFFxpIb5JyKoYj+", "ScoreFX");
    "use strict";
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
        this.anim.getComponent("ScoreAnim").init(this);
        console.log("this anim is " + this.anim.getComponent("ScoreAnim"));
      },
      despawn: function despawn() {
        this.game.despawnScoreFX(this.node);
      },
      play: function play() {
        this.anim.play("score_pop");
      }
    });
    cc._RF.pop();
  }, {} ],
  Star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c463xWBjVELbv0sX85VJyQ", "Star");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        pickRadius: 0
      },
      getPlayerDistance: function getPlayerDistance() {
        var playerPos = this.game.player.getCenterPos();
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
      },
      init: function init(game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
      },
      reuse: function reuse(game) {
        this.init(game);
      },
      onPicker: function onPicker() {
        var pos = this.node.getPosition();
        this.game.gainScore(pos);
        this.game.despawnStar(this.node);
      },
      update: function update() {
        if (this.getPlayerDistance() < this.pickRadius) {
          this.onPicker();
          return;
        }
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Game", "Player", "ScoreAnim", "ScoreFX", "Star" ]);