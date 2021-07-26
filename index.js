
const prompt = require('prompt-sync')()
const chalk=require('chalk');


const userScoreMap = {}
let count = 0;
let N = -1;
let M = -1;

const UserPrompt = (playerNumber) => {
    const answer = prompt(`Player ${playerNumber} its your turn (press 'r' and then ENTER , to roll the dice ): `)
    if (answer.trim() != 'r') {
        return UserPrompt(playerNumber);
    } else {
        return answer;
    }
}
const printGame=()=>{
    const printable={}
    Object.keys(userScoreMap).forEach(key=>{
        printable[key]={
            score:userScoreMap[key].score,
            rank:userScoreMap[key].rank,
        }

    })
    console.table(userScoreMap)
}


const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const generateRandom = () => {
    return Math.floor(Math.random() * 6) + 1
}
const updateScore = (playerNumber, score) => {
    userScoreMap[playerNumber].score = userScoreMap[playerNumber].score + score;
    if (userScoreMap[playerNumber].score >= M && userScoreMap[playerNumber].rank<=0) {
        count++;
        userScoreMap[playerNumber].rank=count;
        console.log(chalk.green(`Player ${playerNumber} your game is completed -> Your rank is ${count}`))
    }
    if (userScoreMap[playerNumber].previousScore == -1 && userScoreMap[playerNumber].currentScore != -1) {
        userScoreMap[playerNumber].previousScore = userScoreMap[playerNumber].currentScore;
    }

    userScoreMap[playerNumber].currentScore = score;


}

const arg = process.argv.slice(2);
if (arg.length >= 2) {
    N = Number(arg[0]);
    M = Number(arg[1]);
    const playerArray = []

    for (let i = 1; i <= N; i++) {
        playerArray[i - 1] = i
    }
    shuffleArray(playerArray)
    console.log("\norder of players to play")

    let total = '';
    playerArray.map((p, i) => {
        if (i == 0) {
            total = `player ${p}`
            return;

        }
        total = total + ` -> player ${p}`;
    })

    console.log(total + '\n')

    console.log("Game Begin")

    let i = 0;

    while (true && count<N && i<N) {
        const playerNumber = playerArray[i]
        if (!userScoreMap[playerNumber]) {
            userScoreMap[playerNumber] = {
                previousScore: -1,
                currentScore: -1,
                skipped: false,
                score: 0,
                rank: -1


            }

        }

        if(userScoreMap[playerNumber].rank>=1){
            i++;
            if (i >= N) {
                i = 0;
            }
            continue;
           // console.log("hhhhh")
        }
       // console.log("hhhhh1")
        const game = (reiterate=false) => {


            //  console.log(`Player ${playerNumber} its your turn (press 'r' to roll the dice)`)
            const answer = UserPrompt(playerNumber)

            if (answer == 'r') {
                const random = generateRandom()
                console.log(`Player ${playerNumber} your point is ${random}`)
                updateScore(playerNumber, random)

                if (random == 6) {
                    console.log(`Player ${playerNumber} you got number 6 , get to play one more time`)
                    console.table(userScoreMap)
                    game(true);
                }


            }

            if(!reiterate){
                i++;
            }
            

         


        }
        if (userScoreMap[playerNumber].previousScore == userScoreMap[playerNumber].currentScore && userScoreMap[playerNumber].previousScore == 1 && !userScoreMap[playerNumber].skipped) {
            console.log(` player ${playerNumber} your chance is skipped`)
            userScoreMap[playerNumber].skipped = true;
            i++;

        } else {
            userScoreMap[playerNumber].skipped = false;
            game();
            printGame()
             

         
        }

        if (i >= N) {
            i = 0;
        }


    }

    console.log("game Over")



} else {
    console.log(`\n Please enter valid input with two arguments
                 Example -> node index.js 3 5`)
}


