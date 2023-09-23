
let questions = [];
let answered = [];
let points = {
    e1: 0,
    e2: 0
};
let turn = undefined;
let mistakes = 0;
let turnFlag = false;
let question = undefined;

const initGame = () => {
    resetMistakes();
    getQuiestions();
};

const resetMistakes = () => {
    mistakes = 0;
    document.getElementById('m1').classList.remove('bi-x-diamond-fill', 'text-danger');
    document.getElementById('m1').classList.add('bi-x-diamond', 'text-white');
    document.getElementById('m2').classList.remove('bi-x-diamond-fill', 'text-danger');
    document.getElementById('m2').classList.add('bi-x-diamond', 'text-white');
};

const getQuiestions = () => {
    fetch('../assets/data/data.json').then(res => res.json()).then(data => {
        questions = data;
        questions.forEach((item, index) => {
            item.id = index + 1;
            item.points = Math.floor(Math.random() * (50 - 10) + 11);
        });

        setNewQuestion();
    }).catch(console.log);
};

const setNewQuestion = () => {
    question = questions[Math.floor(Math.random() * (questions.length - 0))];

    if(!answered.find(i => i.id === question.id) || answered.length === 0) {
        
        if(answered.length % 10 === 0 && answered.length !== 0) {
            document.getElementById('game').classList.add('hidden');
            document.getElementById('message').classList.remove('hidden');
            document.getElementById('message').classList.add('d-flex', 'flex-column', 'justify-content-center');
            document.getElementById('team').innerHTML = points.e1 > points.e2 ? 1 : 2;
        }

        console.clear();
        document.getElementById('question').innerHTML = question.q;
        document.getElementById('points').innerHTML = question.points + ' pnts.';
        let content = '';
        question.a.forEach((item, index) => {
            content += `<div>${index + 1}) ${item}</div>`;
        });
        document.getElementById('answer').innerHTML = content;
        answered.push(question);
        console.log(questions.length);
        console.log(questions.length - answered.length + " pregntas restantes");
        console.log(question.r);
    } else {
        setNewQuestion();
    }
}

initGame();

const setTurn = e => {
    if(!turnFlag) {
        turn = e === 1;
        document.getElementById('turn').innerHTML = turn ? '1' : '2';
        turnFlag = !turnFlag;
    }
}

const addMistake = () => {
    if(turn !== undefined && mistakes < 3) {
        let id = '';

        switch(mistakes) {
            case 0:
                id = 'm1';
                break;
            case 1:
                id = 'm2';
                document.getElementById('next').classList.remove('hidden');
                document.getElementById('addAns').disabled = true;
                document.getElementById('addMis').disabled = true;
                break;
            default:
                console.log('MISTAKES_ERROR');
        }

        document.getElementById(id).classList.add('bi-x-diamond-fill', 'text-danger');
        document.getElementById(id).classList.remove('bi-x-diamond', 'text-white');
        turn = !turn;
        document.getElementById('turn').innerHTML = id === 'm2' ? 'X' : turn ? '1' : '2';

        mistakes++;
    }
}

const nextQuestion = () => {
    document.getElementById('addAns').disabled = false;
    document.getElementById('addMis').disabled = false;
    turn = undefined;
    turnFlag = false;
    document.getElementById('next').classList.add('hidden');
    resetMistakes();
    setNewQuestion();
}

const addAnswer = () => {
    if(question !== undefined && turn !== undefined) {
        turn ? points.e1 += question.points : points.e2 += question.points;
        if(turn) {
            document.getElementById('e1p').innerHTML = points.e1;
        } else {
            document.getElementById('e2p').innerHTML = points.e2;
        }
        document.getElementById('turn').innerHTML = 'X';
        nextQuestion();
    }
}

const nextRound = () => {
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('message').classList.add('hidden');
    document.getElementById('message').classList.remove('d-flex', 'flex-column', 'justify-content-center');
    document.getElementById('team').innerHTML = 'X';
    points = {e1: 0, e2: 0};
    document.getElementById('e1p').innerHTML = points.e1;
    document.getElementById('e2p').innerHTML = points.e2;
}