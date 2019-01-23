require = function o(c, r, a) {
function h(e, t) {
if (!r[e]) {
if (!c[e]) {
var i = "function" == typeof require && require;
if (!t && i) return i(e, !0);
if (u) return u(e, !0);
var n = new Error("Cannot find module '" + e + "'");
throw n.code = "MODULE_NOT_FOUND", n;
}
var s = r[e] = {
exports: {}
};
c[e][0].call(s.exports, function(t) {
return h(c[e][1][t] || t);
}, s, s.exports, o, c, r, a);
}
return r[e].exports;
}
for (var u = "function" == typeof require && require, t = 0; t < a.length; t++) h(a[t]);
return h;
}({
Game: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "4b305pV3cFAA7GO+XtZnnSX", "Game");
var n = t("Player");
t("Star"), t("ScoreFX"), cc.Class({
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
type: n
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
multiline: !0
},
touchHint: {
default: "",
multiline: !0
}
},
onLoad: function() {
this.groundY = this.ground.y + this.ground.height / 2;
this.currentStar = null;
this.currentStarX = 0;
this.timer = 0;
this.starDuration = 0;
this.enabled = !1;
this.starPool = new cc.NodePool("Star");
this.scorePool = new cc.NodePool("ScoreFX");
var t = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
this.controlDisplay.string = t;
},
startGame: function() {
this.resetScore();
this.enabled = !0;
this.btnNode.x = 3e3;
this.gameOverNode.active = !1;
this.player.startMoveAt(cc.v2(0, this.groundY));
this.spawnNewStar();
},
spawnNewStar: function() {
var t = null;
t = 0 < this.starPool.size() ? this.starPool.get(this) : cc.instantiate(this.starPrefab);
this.node.addChild(t);
t.setPosition(this.getNewStarPosition());
t.getComponent("Star").init(this);
this.startTimer();
this.currentStar = t;
},
despawnStar: function(t) {
this.starPool.put(t);
this.spawnNewStar();
},
startTimer: function() {
this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
this.timer = 0;
},
getNewStarPosition: function() {
this.currentStar || (this.currentStarX = 2 * (Math.random() - .5) * this.node.width / 2);
var t = 0, e = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50, i = this.node.width / 2;
t = 0 <= this.currentStarX ? -Math.random() * i : Math.random() * i;
this.currentStarX = t;
return cc.v2(t, e);
},
gainScore: function(t) {
this.score += 1;
this.scoreDisplay.string = "Score: " + this.score;
var e = this.spawnScoreFX();
this.node.addChild(e.node);
e.node.setPosition(t);
e.play();
cc.audioEngine.playEffect(this.scoreAudio, !1);
},
resetScore: function() {
this.score = 0;
this.scoreDisplay.string = "Score: " + this.score.toString();
},
spawnScoreFX: function() {
var t;
if (0 < this.scorePool.size()) return (t = this.scorePool.get()).getComponent("ScoreFX");
t = cc.instantiate(this.scoreFXPrefab).getComponent("ScoreFX");
console.log("fx is " + t);
t.init(this);
return t;
},
despawnScoreFX: function(t) {
this.scorePool.put(t);
},
update: function(t) {
if (this.timer > this.starDuration) {
this.gameOver();
this.enabled = !1;
} else this.timer += t;
},
gameOver: function() {
console.log("游戏结束了");
this.gameOverNode.active = !0;
this.player.enabled = !1;
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
Player: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "14a27W1I1dMUZXSs1au1lNI", "Player");
cc.Class({
extends: cc.Component,
properties: {
jumpHeight: 0,
jumpDuration: 0,
maxMoveSpeed: 0,
accel: 0,
jumpAudio: cc.AudioClip
},
setJumpAction: function() {
var t = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut()), e = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionOut()), i = cc.callFunc(this.playJumpSound, this);
return cc.repeatForever(cc.sequence(t, e, i));
},
playJumpSound: function() {
cc.audioEngine.playEffect(this.jumpAudio, !1);
},
getCenterPos: function() {
return cc.v2(this.node.x, this.node.y + this.node.height / 2);
},
startMoveAt: function(t) {
this.enabled = !0;
this.xSpeed = 0;
this.node.setPosition(t);
this.node.runAction(this.setJumpAction());
},
stopMove: function() {
this.node.stopAllActions();
},
onLoad: function() {
this.enabled = !1;
this.accLeft = !1;
this.accRight = !1;
this.xSpeed = 0;
this.minPosX = -this.node.parent.width / 2;
this.maxPosX = this.node.parent.width / 2;
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
},
onKeyDown: function(t) {
switch (t.keyCode) {
case cc.KEY.a:
this.accLeft = !0;
break;

case cc.KEY.d:
this.accRight = !0;
}
},
onKeyUp: function(t) {
switch (t.keyCode) {
case cc.KEY.a:
this.accLeft = !1;
break;

case cc.KEY.d:
this.accRight = !1;
}
},
update: function(t) {
this.accLeft ? this.xSpeed -= this.accel * t : this.accRight && (this.xSpeed += this.accel * t);
Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
this.node.x += this.xSpeed * t;
this.node.x > this.node.parent.width / 2 ? this.node.x = -this.node.parent.width / 2 : this.node.x < -this.node.parent.width / 2 && (this.node.x = this.node.parent.width / 2);
},
onDescroy: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.off(cc.systemEvent.EventType.KEY_UP, this.onKeyUp, this);
}
});
cc._RF.pop();
}, {} ],
ScoreAnim: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "90117m7iuNEYKi4tv1Q2IRd", "ScoreAnim");
cc.Class({
extends: cc.Component,
init: function(t) {
this.scoreFX = t;
},
hideFix: function() {
this.scoreFX.despawn();
}
});
cc._RF.pop();
}, {} ],
ScoreFX: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "0da43lHKRFFxpIb5JyKoYj+", "ScoreFX");
cc.Class({
extends: cc.Component,
properties: {
anim: {
default: null,
type: cc.Animation
}
},
init: function(t) {
console.log("进行FX初始化了");
this.game = t;
console.log(this.anim);
console.log(this.game);
this.anim.getComponent("ScoreAnim").init(this);
console.log("this anim is " + this.anim.getComponent("ScoreAnim"));
},
despawn: function() {
this.game.despawnScoreFX(this.node);
},
play: function() {
this.anim.play("score_pop");
}
});
cc._RF.pop();
}, {} ],
Star: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "0c463xWBjVELbv0sX85VJyQ", "Star");
cc.Class({
extends: cc.Component,
properties: {
pickRadius: 0
},
getPlayerDistance: function() {
var t = this.game.player.getCenterPos();
return this.node.position.sub(t).mag();
},
init: function(t) {
this.game = t;
this.enabled = !0;
this.node.opacity = 255;
},
reuse: function(t) {
this.init(t);
},
onPicker: function() {
var t = this.node.getPosition();
this.game.gainScore(t);
this.game.despawnStar(this.node);
},
update: function() {
if (this.getPlayerDistance() < this.pickRadius) this.onPicker(); else {
var t = 1 - this.game.timer / this.game.starDuration;
this.node.opacity = 50 + Math.floor(205 * t);
}
},
start: function() {}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Game", "Player", "ScoreAnim", "ScoreFX", "Star" ]);