
function twobinary(number) {
    number = number.toString()
    if (number.length < 2) {
        return "0" + number.toString()
    } else {
        return number.toString()
    }
}

function relog(node) {
    let rsecond
    let rminutes
    let rhours
    let actuallynoder
    

    if (node.textContent === '') {
        node.textContent = "00:00:00"
    }
    const split = node.textContent.split(":")
    const hour = parseInt(split[0])
    const minutes = parseInt(split[1])
    const second = parseInt(split[2])

    if (second === 59) {
        rsecond = '00'
        if (minutes === 59) {
            rminutes = '00'
            rhours = twobinary(hour + 1)
        } else {
            rminutes = twobinary(minutes + 1)
            rhours = twobinary(hour)
        }
    }
    else {
        rsecond = twobinary(second + 1)
        rminutes = twobinary(minutes)
        rhours = twobinary(hour)
    }

    actuallynoder = rhours + ":" + rminutes + ":" + rsecond
    node.textContent = actuallynoder
    


}

const timer = document.querySelector('#time')
if (timer){
    let nodeIntervar = setInterval(()=>{
        relog(timer)
    },1000)
}

