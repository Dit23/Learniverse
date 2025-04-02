/**
 * Represents a quiz.
 * @constructor
 * @param {string} mainElementID - The ID of the main element
 * @param {Object[]} questions - The questions for the quiz.
 * @param {string} questions[].question - The question text.
 * @param {Object[]} questions[].answers - The possible answers for the question.
 * @param {string} questions[].answers[].text - The answer text.
 * @param {boolean} questions[].answers[].correct - Indicates if the answer is correct.
 */
class Quiz {
  constructor(mainElementID, questions) {
      this.questions = questions;
      this.atQuestion = 0;
      this.correctAnswers = [];
      this.incorrectAnswers = [];

      this.mainElement = document.getElementById(mainElementID);
      this.mainElement.classList.add('quiz');
      this.render();
  }

    /**
     * Gets the number of questions in the quiz.
     * @returns {number} The number of questions.
     */
    get length() {
        return this.questions.length;
    }

    /**
     * Gets the question at the specified index.
     * @param {number} index - The index of the question to get.
     * @returns {Object} The question.
     */
    getQuestion(index) {
      return this.questions[index];
    }

    /**
     * Checks if the answer to the question at the specified index is correct.
     * @param {number} index - The index of the question to check.
     * @param {string} answer - The answer to check.
     * @returns {boolean} Indicates if the answer is correct.
     */
    checkAnswer(index, answer) {
      return this.questions[index].answers.find(a => a.text === answer).correct;
    }

    /**
     * Renders the quiz.
     */
    render() {
        const question = this.getQuestion(this.atQuestion);
        this.mainElement.innerHTML = '';

        const titleElement = document.createElement('h2');
        titleElement.textContent = question.question;
        this.mainElement.appendChild(titleElement);

        const questionElement = document.createElement('div');
        questionElement.classList.add('questions');

        question.answers.forEach(answer => {
            const answerElement = document.createElement('button');
            answerElement.textContent = answer.text;
            answerElement.addEventListener('click', () => {
                this.selectAnswer(answerElement, answer.correct);
            });
            questionElement.appendChild(answerElement);
        });

        this.mainElement.appendChild(questionElement);

        const navElement = document.createElement('div');
        navElement.classList.add('nav');

        this.checkButton = document.createElement('button');
        this.checkButton.textContent = 'Antwort überprüfen';
        this.checkButton.style.display = 'none';
        this.checkButton.addEventListener('click', () => {
            this.checkSelectedAnswer();
            this.checkButton.disabled = true;
            this.mainElement.querySelectorAll('.questions button').forEach(btn => {
                btn.disabled = true;
            });
        });
        navElement.appendChild(this.checkButton);

        this.nextButton = document.createElement('button');
        this.nextButton.textContent = this.atQuestion < this.length - 1 ? 'Nächste Frage' : 'Auswertung';
        this.nextButton.style.display = 'none';
        this.nextButton.addEventListener('click', () => {
            this.atQuestion++;
            if (this.atQuestion < this.length) {
                this.render();
            } else {
                this.showResults();
            }
        });
        navElement.appendChild(this.nextButton);

        this.mainElement.appendChild(navElement);
    }

    selectAnswer(element, isCorrect) {
        this.selectedAnswer = { element, isCorrect };
        document.querySelectorAll('.questions button').forEach(btn => {
            btn.classList.remove('selected');
        });
        element.classList.add('selected');
        this.checkButton.style.display = 'block';
    }

    checkSelectedAnswer() {
        if (this.selectedAnswer) {
            if (this.selectedAnswer.isCorrect) {
                this.selectedAnswer.element.classList.add('correct');
                this.correctAnswers.push(this.getQuestion(this.atQuestion));
            } else {
                this.selectedAnswer.element.classList.add('incorrect');
                this.incorrectAnswers.push(this.getQuestion(this.atQuestion));
            }
            this.nextButton.style.display = 'block';
        } else {
            alert('Bitte wählen Sie zuerst eine Antwort aus.');
        }
    }

    showResults() {
        this.mainElement.innerHTML = '<h2>Auswertung</h2>';
        const resultElement = document.createElement('div');
        resultElement.classList.add('results');

        const correctCount = this.correctAnswers.length;
        const totalCount = this.length;
        const resultText = document.createElement('p');
        resultText.textContent = `Sie haben ${correctCount} von ${totalCount} Fragen richtig beantwortet.`;
        resultElement.appendChild(resultText);

        const correctElement = document.createElement('details');
        correctElement.innerHTML = '<summary>Richtige Antworten:</summary>';
        correctElement.classList.add('correct');
        this.correctAnswers.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `<p>${question.question}</p>`;
            question.answers.forEach(answer => {
                const answerElement = document.createElement('p');
                answerElement.textContent = `${answer.text}`;
                answerElement.classList.add(answer.correct ? 'correct' : 'incorrect');
                questionElement.appendChild(answerElement);
            });
            correctElement.appendChild(questionElement);
        });
        resultElement.appendChild(correctElement);

        const incorrectElement = document.createElement('details');
        incorrectElement.open = true;
        incorrectElement.innerHTML = '<summary>Falsche Antworten:</summary>';
        incorrectElement.classList.add('incorrect');
        this.incorrectAnswers.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `<p>${question.question}</p>`;
            question.answers.forEach(answer => {
                const answerElement = document.createElement('p');
                answerElement.textContent = `${answer.text}`;
                answerElement.classList.add(answer.correct ? 'correct' : 'incorrect');
                questionElement.appendChild(answerElement);
            });
            incorrectElement.appendChild(questionElement);
        });
        resultElement.appendChild(incorrectElement);

        this.mainElement.appendChild(resultElement);
    }
}
