"use strict";
cc._RF.push(module, '14a27W1I1dMUZXSs1au1lNI', 'Player');
// scripts/Player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 跳跃音效资源
        jumpAudio: cc.AudioClip
    },

    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function playJumpSound() {
        // 调用声音引擎播放声音
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

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //  this.startGame()
        this.enabled = false;
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;

        // // 初始化键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function onKeyDown(event) {
        console.log("keyCode = " + event.keyCode);
        console.log("a = " + cc.KEY.a);
        console.log("d = " + cc.KEY.d);
        switch (event.keyCode) {
            case cc.KEY.a:
                this.accLeft = true;
                break;
            case cc.KEY.d:
                this.accRight = true;
                break;
        }
    },


    // Demo里使用的是cc.macro.Key.a，这是低版本的用法，现在统一使用cc.Key.a
    onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.a:
                this.accLeft = false;
                break;
            case cc.KEY.d:
                this.accRight = false;
                break;
        }
    },


    update: function update(dt) {
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
            console.log(this.node.x);
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
            console.log(this.node.x);
        }

        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        // limit player position inside screen
        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2;
            this.xSpeed = 0;
        }
    },

    onDescroy: function onDescroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.systemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
});

cc._RF.pop();