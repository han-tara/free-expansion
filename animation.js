//time
const dt = 1/60

//finding location particle
//no need to change here
function loc(position,divide, length) {
    const areaSize = length / divide

    //tracker
    let gridPos = 0
    for (let i = 0; i < divide; i++) {
        if (position > areaSize*i && position <= areaSize*(i+1)) {
            break
        }
        gridPos++
    }
    return gridPos
}

//particle motion
//no need to change here
function motion() {
    particles.forEach(el=>{
        el.x += el.vx*dt
        el.y += el.vy*dt

        //elastic collision
        if (el.x < 0 || el.x > canvas.width) {
            el.vx *= -1 //rotate direction
        }
        if (el.y < 0 || el.y > canvas.height) {
            el.vy *= -1
        }

        //no clipping
        if (el.x <= 0) {el.x = 0}
        if (el.x >= canvas.width) { el.x = canvas.width}
        if (el.y <= 0) { el.y = 0 }
        if (el.y >= canvas.height) { el.y = canvas.height}

        //finding grid position
        const rowPos = loc(el.y,numR,canvas.height)
        const colPos = loc(el.x,numC,canvas.width)
        try {
            system[rowPos][colPos] += 1 //assign there is particle here
        } catch(err) {
            // console.log(err)
            // console.log(`row pos: ${rowPos}`)
            // console.log(`colPos: ${colPos}`)
        }
        
    })
}

//color base on percent by jacob https://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage
//change by un-comment or add your custom color
const percentColors = [

    //for black-white
    // { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0x00 } },
    // { pct: 0.5, color: { r: 0x7f, g: 0x7f, b: 0x7f } },
    // { pct: 1.0, color: { r: 0xff, g: 0xff, b: 0xff } }

    //for black-yellow
    { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0x00 } },
    { pct: 0.5, color: { r: 0x00, g: 0x7f, b: 0x00 } },
    { pct: 1.0, color: { r: 0xff, g: 0xff, b: 0x00 } }

    // //for green-red
    // { pct: 0.0, color: { r: 0x00, g: 0xff, b: 0x00 } },
    // { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0x00 } },
    // { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0x00 } }

    // //for blue-green-red
    // { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
    // { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0x00 } },
    // { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0x00 } }

    // //for black-green-red
    // { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0x00 } },
    // { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0x00 } },
    // { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0x00 } }

]

//no need to change here
const getColorForPercentage = function (pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
};

//stats - no need to change here
const p1 = document.getElementById('p1')
const p2 = document.getElementById('p2')
const dp = document.getElementById('dp')
let p1_numParticles = 0
let p2_numParticles = 0

//visualize grid and stats 
let maxParticles = numParticle * numC/2 * 0.0000005 //by lowering the value --> more contrast (you may change this to adjust the color)
function visualize() {
    for (let r = 0; r < numR; r++) {
        const rectY = Math.round(r * canvas.height/numR)
        const rectH = Math.round(canvas.height/numR)
        for (let c = 0; c < numC; c++) {
            const rectX = Math.round(c * canvas.width/(numC))
            const rectW = Math.round(canvas.width/(numC))

            //draw on canvas
            const ratio = system[r][c] / maxParticles
            ctx.fillStyle = ratio > 1 ? getColorForPercentage(1) : getColorForPercentage(ratio)   
            ctx.fillRect(rectX,rectY,rectW,rectH)

            //save total particle for p1 
            if (c < numC/2) { 
                p1_numParticles += system[r][c]
            } else {
                p2_numParticles += system[r][c]
            }

        }
    }

    //visualize value to text
    p1.innerText = `Container 1: ${p1_numParticles}`
    p2.innerText = `Container 2: ${p2_numParticles}`
    dp.innerText = `N1/N2: ${(p1_numParticles / p2_numParticles).toFixed(2)}`
}


//looping function
const delay = 3000 //ms
let timeout = false
function loop() {
    //clear output
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let i = 0; i < numR; i++) {
        for (let j = 0; j < numC; j++) {
            system[i][j] = 0
        }
    }
    p1_numParticles = 0
    p2_numParticles = 0

    //begin
    motion()
    visualize()
    console.log('looping')
    
    if (!timeout) {
        setTimeout(() => {
            timeout = true
            requestAnimationFrame(loop)      
        }, delay);
    } else {
        requestAnimationFrame(loop)
    }

}
loop()
