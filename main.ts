function signalUpDetected (mgForce: number) {
    running = false
    if (mgForce > 0) {
        radio.sendValue("mgForceR", mgForce)
    }
    // 3300ms
    for (let index = 0; index < 3; index++) {
        basic.showAnimation(`
        . . # . . . # # # . # . # . # . . # . . . . # . . . . . . . . . . . .
        . # # # . # . # . # . . # . . . . # . . . . . . . . . . . . . . # . .
        # . # . # . . # . . . . # . . . . . . . . . . . . . . # . . . # # # .
        . . # . . . . # . . . . . . . . . . . . . . # . . . # # # . # . # . #
        . . # . . . . . . . . . . . . . . # . . . # # # . # . # . # . . # . .
        `, 150)
    }
    basic.showAnimation(`
        . . # . . . # # # . # . # . # . . # . . . . # . .
        . # # # . # . # . # . . # . . . . # . . . . . . .
        # . # . # . . # . . . . # . . . . . . . . . . . .
        . . # . . . . # . . . . . . . . . . . . . . . . .
        . . # . . . . . . . . . . . . . . . . . . . . . .
        `, 150)
    running = true
    basic.clearScreen()
}
function signalDownDetected () {
    running = false
    for (let index = 0; index < 3; index++) {
        basic.showAnimation(`
        . . # . . . . . . . . . . . . . . # . . . # # # . # . # . # . . # . .
        . . # . . . . # . . . . . . . . . . . . . . # . . . # # # . # . # . #
        # . # . # . . # . . . . # . . . . . . . . . . . . . . # . . . # # # .
        . # # # . # . # . # . . # . . . . # . . . . . . . . . . . . . . # . .
        . . # . . . # # # . # . # . # . . # . . . . # . . . . . . . . . . . .
        `, 140)
    }
    basic.showAnimation(`
        . . # . . . . . . . . . . . . . . . . . . . . . .
        . . # . . . . # . . . . . . . . . . . . . . . . .
        # . # . # . . # . . . . # . . . . . . . . . . . .
        . # # # . # . # . # . . # . . . . # . . . . . . .
        . . # . . . # # # . # . # . # . . # . . . . # . .
        `, 140)
    running = true
    basic.clearScreen()
}
function mgCalibrate () {
    running = false
    mgForceNormal = 0
    for (let index2 = 0; index2 <= 19; index2++) {
        mgForceNormal += input.magneticForce(Dimension.Strength)
        led.plotBarGraph(
        index2 + 1,
        20
        )
        basic.pause(50)
    }
    mgForceNormal = Math.idiv(mgForceNormal, 20)
    basic.pause(100)
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    running = true
    basic.clearScreen()
}

radio.onReceivedValue(function (name, value) {
    // console.logValue(name, value)
    // console.logValue(name, value)
    if (name == "downArr") {
        signalDownDetected()
    }
    if (name == "upArr") {
        signalUpDetected(0)
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    mgCalibrate()
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.showNumber(mgForceNormal)
})

let mgForce = 0
let running = false
let mgForceNormal = 0
radio.setGroup(136)
radio.setTransmitPower(4)
basic.showIcon(IconNames.Happy)
mgForceNormal = 999
let mgHysteresis = 25
basic.forever(function () {
    if (running) {
        mgForce = input.magneticForce(Dimension.Strength)
        if (mgForce > mgForceNormal + mgHysteresis) {
            signalUpDetected(mgForce)
        }
    }
    basic.pause(100)
})
